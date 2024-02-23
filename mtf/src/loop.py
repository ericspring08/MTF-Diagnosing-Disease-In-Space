import json
import os
import time

import numpy as np
import pandas as pd

from models import model_options, model_params
from save import ModelResults
from utils import get_metric, print_tags, shscorewrapper

from sklearn.compose import ColumnTransformer
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder, StandardScaler, MinMaxScaler, RobustScaler

from skopt import BayesSearchCV
import pickle


class MTF(object):
    def __init__(self, config_path, dataset):
        self.models_results = None
        self.outputs = None
        self.models_to_use = None
        self.x_dataset = None
        self.dataset = None
        self.results_path = None
        self.outputs_selection = None
        self.metrics_selection = None
        self.models_selection = None
        self.categorical_features = None
        self.numerical_features = None
        self.config_path = None
        self.config = None
        self.tuning_iterations = None
        self.current_model = None
        self.config_path = config_path
        self.dataset_path = dataset
        self.sample_size = 1000
        self.optimization_metric = None
        self.scaler = None

    def read_config(self):
        try:
            config = json.load(open(self.config_path))
            # Locations
            self.results_path = config["location"]["results"]
            # Selections
            self.outputs_selection = config["experiment"]["outputs"]
            self.metrics_selection = config["experiment"]["metrics"]
            self.models_selection = config["experiment"]["models"]
            # Features
            self.categorical_features = config["experiment"]["categorical"]
            self.numerical_features = config["experiment"]["numerical"]
            # Options
            self.tuning_iterations = config["experiment"]["tuning_iterations"]
            self.sample_size = config["experiment"]["sample_size"]
            self.optimization_metric = config["experiment"]["optimization_metric"]
            self.scaler = config["experiment"]["scaler"]

            self.config = config

            # Create Results Folder if it doesn't exist
            if not os.path.exists(self.results_path):
                os.makedirs(self.results_path)

            # Model Selection
            self.models_to_use = {}
            if self.models_selection == "all" or self.models_selection == "All":
                self.models_selection = list(model_options.keys())
            for value in self.models_selection:
                if value not in model_options:
                    print(
                        f"Model {value} not found. Please check your spelling and try again.")
                    exit()
                self.models_to_use[value] = model_options[value]

            print("Outputs Selected: ", self.outputs_selection)
            print("Metrics Selected: ", self.metrics_selection)
            print("Models Selected: ", self.models_selection)
            print("Categorical Features: ", self.categorical_features)
            print("Numerical Features: ", self.numerical_features)
            print("Tuning Iterations: ", self.tuning_iterations)
            print("Sample Size: ", self.sample_size)
            print("Optimization Metric: ", self.optimization_metric)
            print("Results Path: ", self.results_path)
            print("Config Path: ", self.config_path)
            print("Dataset Path: ", self.dataset_path)
            print("Config Loaded Successfully")

        except FileExistsError:
            raise FileExistsError(
                "Error loading config file. Please check your spelling and try again.")

    def load_data(self):
        self.dataset = pd.read_csv(self.dataset_path)

    def set_optimization_metric(self, metric):
        if metric == "shscore":
            self.optimization_metric = shscorewrapper
        else:
            self.optimization_metric = metric

    def preprocess(self):
        print("Extract Outputs")

        # Get Outputs extracted and remove after
        outputs = {}
        for value in self.outputs_selection:
            outputs[value] = self.dataset[value]

        dataset = self.dataset.drop(self.outputs_selection, axis=1)

        # Loop through categorical features and fill null values with most frequent

        for feature in self.categorical_features:
            dataset[feature] = dataset[feature].fillna(
                dataset[feature].value_counts().index[0])

        # Loop through numerical features and fill null values with mean
        for feature in self.numerical_features:
            dataset[feature] = dataset[feature].fillna(dataset[feature].mean())

        print("Preprocessing Data")

        if self.scaler == "StandardScaler":
            scaler = StandardScaler()
        elif self.scaler == "MinMaxScaler":
            scaler = MinMaxScaler()
        elif self.scaler == "RobustScaler":
            scaler = RobustScaler()

        # Normalize Inputs
        preprocessor = ColumnTransformer(
            transformers=[('ohe',
                           OneHotEncoder(handle_unknown='ignore',
                                         sparse_output=False),
                           self.categorical_features),
                          ('scaler',
                           scaler,
                           self.numerical_features)],
            remainder='passthrough',
            verbose_feature_names_out=False).set_output(transform='pandas')

        preprocessor = preprocessor.fit(dataset)
        self.x_dataset = preprocessor.transform(dataset)

        # Save Preprocessor
        # create results folder if it doesn't exist
        if not os.path.exists(os.path.join('results')):
            os.makedirs(os.path.join('results'))
        pickle.dump(preprocessor, open(
            os.path.join('results', 'preprocessor.pkl'), "wb"))

        # Map the outputs to dictionary
        for key, value in self.config['outputs'].items():
            outputs[key] = outputs[key].map(value)

        self.outputs = pd.DataFrame(outputs)

    def main_loop(self):
        self.models_results = ModelResults(
            self.models_to_use, self.outputs, self.metrics_selection, self.x_dataset, self.outputs)

        # Random Train Test Split
        # Sample 500 rows of the dataset for testing
        combined_dataset = pd.concat(
            [self.x_dataset, self.outputs], axis=1)
        if len(self.dataset) < self.sample_size:
            sampled_dataset = combined_dataset
        else:
            sampled_dataset = combined_dataset.sample(n=self.sample_size)
        x_sampled_dataset = sampled_dataset.drop(
            self.outputs_selection, axis=1)
        y_sampled_dataset = sampled_dataset[self.outputs_selection]
        x_train, x_test, y_train, y_test = train_test_split(
            x_sampled_dataset, y_sampled_dataset, test_size=0.2)

        # Run Trial
        self.x_train = x_train
        self.y_train = y_train
        self.x_test = x_test
        self.y_test = y_test

        self.run_trial()

    def run_trial(self):
        # Iterate through models
        for model_name, model in self.models_to_use.items():
            # Iterate through outputs
            for output in self.outputs:
                self.perf_curve = []
                try:
                    # Special cases for some models that require multiclass specification
                    if "LGBM" in model_name and self.outputs[output].nunique() > 2:
                        model.set_params(objective="multiclass")
                    elif "LGBM" in model_name and self.outputs[output].nunique() == 2:
                        model.set_params(objective="binary")

                    if "XGB" in model_name and self.outputs[output].nunique() > 2:
                        model.set_params(objective="multi:softmax",
                                         num_class=self.outputs[output].nunique())
                    elif "XGB" in model_name and self.outputs[output].nunique() == 2:
                        model.set_params(
                            objective="binary:logistic", num_class=1)

                    # Set model probability to true if it exists
                    if dir(model).__contains__('probability'):
                        model.set_params(probability=True)

                    # Train Model
                    # Tune Hyperparameters with Bayesian Optimization
                    np.int = int
                    opt = BayesSearchCV(
                        model,
                        model_params[model_name],
                        scoring=shscorewrapper,
                        # train test split iterator
                        cv=3,
                        n_iter=self.tuning_iterations,
                        return_train_score=True,
                        error_score=0,
                    )

                    # Fit
                    print(f"Fitting {model_name} {output}")
                    time_before_fit = time.perf_counter_ns()
                    opt.fit(self.x_train, self.y_train[output], callback=lambda res: self.logging_callback_fit(
                        res, model_name, output,))
                    time_after_fit = time.perf_counter_ns()

                    # Calculate Training Time
                    train_time = (time_after_fit - time_before_fit)

                    print(f"Predicting {model_name} {output}")
                    # Predict
                    before_predict = time.perf_counter_ns()
                    y_pred = opt.predict(self.x_test)
                    after_predict = time.perf_counter_ns()
                    predict_time = (after_predict - before_predict)

                    # Get Model Probability
                    y_prob = opt.predict_proba(self.x_test)

                    print(f"Calculating Metrics for {model_name} {output}")
                    # Calculate Metrics
                    performance = get_metric(
                        y_pred, y_prob, self.y_test[output], self.metrics_selection, train_time, predict_time)

                    # Save Model pickle
                    self.models_results.save_model(
                        opt.best_estimator_, os.path.join('results', "models", f"{output}", f"{model_name}_{output}.pkl"))

                    # Save cv_results_
                    # convert to dataframe
                    cv_results = pd.DataFrame(opt.cv_results_)
                    # save to csv
                    # create cv_results folder if it doesn't exist
                    if not os.path.exists(os.path.join('results', "cv_results")):
                        os.makedirs(os.path.join('results', "cv_results"))

                    if not os.path.exists(os.path.join('results', "cv_results", f"{output}")):
                        os.makedirs(os.path.join(
                            'results', "cv_results", f"{output}"))
                    cv_results.to_csv(
                        os.path.join('results', "cv_results", f"{output}", f"{model_name}_{output}_cv_results.csv"))

                    # print performance
                    for metric, value in performance.items():
                        print_tags(
                            (f"{model_name}", f"{output}"), f"{metric}: {value}")
                        self.models_results.add_result(
                            model_name, output, metric, value)
                except Exception as e:
                    print(e)
                    print(f"Error with {model_name} {output}")

    def save_results(self):
        print("Saving Results")
        self.models_results.save_results_raw_csv(
            '/results' + "/results_raw.csv")

    def logging_callback_fit(self, res, model_name, output):
        # append latest results to self.perf_curve
        self.perf_curve.append(res.func_vals[-1])
        print_tags((f"Iteration {len(res.func_vals)}",
                    f"{model_name}", f"{output}"), f"{res.x_iters[-1]} -> {res.func_vals}")

    def run(self):
        self.read_config()
        self.load_data()
        self.preprocess()
        self.main_loop()
        self.save_results()
