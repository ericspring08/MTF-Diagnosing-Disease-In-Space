import json
import os
import time

import numpy as np
import pandas as pd

from models import model_options, model_params
from src.save import ModelResults
from src.utils import get_metric, hasmethod

from sklearn.compose import ColumnTransformer
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from skopt import BayesSearchCV

import threading

class MTF(object):
    def __init__(self, config_path):
        self.models_results = None
        self.outputs = None
        self.models_to_use = None
        self.x_dataset = None
        self.main_task = None
        self.progress = None
        self.dataset = None
        self.dataset_path = None
        self.results_path = None
        self.outputs_selection = None
        self.metrics_selection = None
        self.models_selection = None
        self.categorical_features = None
        self.numerical_features = None
        self.trials = None
        self.config_path = None
        self.config = None
        self.tuning_iterations = None
        self.config_path = config_path

    def set_progress(self, progress):
        self.progress = progress

    def set_main_task(self, main_task):
        self.main_task = main_task

    def read_config(self):
        try:
            config = json.load(open(self.config_path))
            # Locations
            self.dataset_path = config["location"]["dataset"]
            self.results_path = config["location"]["results"]
            # Selections
            self.outputs_selection = config["experiment"]["outputs"]
            self.metrics_selection = config["experiment"]["metrics"]
            self.models_selection = config["experiment"]["models"]
            # Features
            self.categorical_features = config["experiment"]["categorical"]
            self.numerical_features = config["experiment"]["numerical"]
            # Options
            self.trials = config["experiment"]["trials"]
            self.tuning_iterations = config["experiment"]["tuning_iterations"]

            self.config = config

            # Create Results Folder if it doesn't exist
            if not os.path.exists(self.results_path):
                os.makedirs(self.results_path)

            # Model Selection
            self.models_to_use = {}
            if self.models_selection == "all" or self.models_selection == "All":
                models_selection = list(model_options.keys())
            for value in models_selection:
                if value not in model_options:
                    print(f"Model {value} not found. Please check your spelling and try again.")
                    exit()
                self.models_to_use[value] = model_options[value]
        except:
            raise FileExistsError("Error loading config file. Please check your spelling and try again.")

    def load_data(self):
        self.dataset = pd.read_csv(self.dataset_path)


    def preprocess(self):
        print("Extract Outputs")

        # Get Outputs extracted and remove after
        outputs = {}
        for value in self.outputs_selection:
            outputs[value] = self.dataset[value]

        dataset = self.dataset.drop(self.outputs_selection, axis=1)

        # Loop through categorical features and fill null values with most frequent
        for feature in self.categorical_features:
            dataset[feature] = dataset[feature].fillna(dataset[feature].value_counts().index[0])

        # Loop through numerical features and fill null values with mean
        for feature in self.numerical_features:
            dataset[feature] = dataset[feature].fillna(dataset[feature].mean())

        self.progress.update(self.main_task, advance=1)
        print("Preprocessing Data")

        # Normalize Inputs
        preprocessor = ColumnTransformer(
            transformers =
            [('ohe',
              OneHotEncoder(handle_unknown='infrequent_if_exist', sparse_output=False),
              self.categorical_features),
             ('scaler',
              StandardScaler(),
              self.numerical_features)],
            remainder='passthrough',
            verbose_feature_names_out=False).set_output(transform = 'pandas')
        self.x_dataset = preprocessor.fit_transform(dataset)

        # Map the outputs to dictionary
        for key, value in self.config['outputs'].items():
            outputs[key] = outputs[key].map(value)

        self.outputs = pd.DataFrame(outputs)

    def main_loop(self):
        self.models_results = ModelResults(self.models_to_use, self.outputs, self.metrics_selection, self.x_dataset, self.outputs, self.progress, self.main_task)
        threads = []
        for trial in range(self.trials):

            # Random Train Test Split
            # Sample 20% of the dataset for testing
            sampled_dataset = pd.concat([self.x_dataset, self.outputs], axis=1).sample(frac=0.2)
            x_sampled_dataset = sampled_dataset.drop(self.outputs_selection, axis=1)
            y_sampled_dataset = sampled_dataset[self.outputs_selection]
            x_train, x_test, y_train, y_test = train_test_split(x_sampled_dataset, y_sampled_dataset, test_size=0.2)
            # Multi-threading
            t = threading.Thread(target=self.run_trials, args=(trial, x_train, y_train, x_test, y_test,))
            threads.append(t)
            t.start()

        for thread in threads:
            thread.join()

    def run_trials(self, trial, x_train, y_train, x_test, y_test):
        # Iterate through models
        for model_name, model in self.models_to_use.items():
            # Iterate through outputs
            for output in self.outputs:
                print(f"Trial {trial + 1}, Training {model_name}, Output {output}")
                print(f"Size of Training Set: {len(x_train)}")
                # Special cases for some models that require multiclass specification
                if model_name == "LGBM" and self.outputs[output].nunique() > 2:
                    model.set_params(objective="multiclass")
                elif model_name == "XGB" and self.outputs[output].nunique() > 2:
                    model.set_params(objective="multi:softmax", num_class=self.outputs[output].nunique())

                # Set model probability to true if it exists
                if dir(model).__contains__('probability'):
                    model.set_params(probability=True)

                # Train Model
                # Tune Hyperparameters with Bayesian Optimization
                np.int = int
                opt = BayesSearchCV(
                    model,
                    model_params[model_name],
                    n_iter=self.tuning_iterations,
                    cv=3,
                    verbose=0,
                )

                # Fit
                time_before_fit = time.perf_counter_ns()
                opt.fit(x_train, y_train[output])
                time_after_fit = time.perf_counter_ns()

                # Calculate Training Time
                train_time = (time_after_fit - time_before_fit)

                # Predict
                before_predict = time.perf_counter_ns()
                y_pred = opt.predict(x_test)
                after_predict = time.perf_counter_ns()
                predict_time = (after_predict - before_predict)

                y_prob = None
                # Get Model Probability
                if hasmethod(opt, 'predict_proba'):
                    y_prob = opt.predict_proba(x_test)

                # Calculate Metrics
                performance = get_metric(y_pred, y_prob, y_test[output], self.metrics_selection, train_time, predict_time)

                # Save Results
                for metric, value in performance.items():
                    print(f"{model_name}: {metric}: {value}")
                    self.models_results.add_result(model_name, output, metric, value)
                self.progress.update(self.main_task, advance=1)
    def save_results(self):
        print("Saving Results")
        self.models_results.save_models(self.results_path + "/models")
        self.models_results.save_results_raw_csv(self.results_path + "/results_raw.csv")
        self.models_results.save_results_averages_csv(self.results_path + "/results_average.csv")
        self.progress.update(self.main_task, advance=1)

    def run(self):
        self.read_config()
        self.load_data()
        self.preprocess()
        self.main_loop()
        self.save_results()
