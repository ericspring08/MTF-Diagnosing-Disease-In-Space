import time
from datetime import datetime
import json
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
import numpy as np
import os

from models import *
from src.utils import *
from src.save import *
from models import *
from skopt import BayesSearchCV

from rich.progress import Progress, TimeElapsedColumn, SpinnerColumn

def main_loop(config_path):
    with Progress(SpinnerColumn(), *Progress.get_default_columns(), TimeElapsedColumn()) as progress:
        start_time = time.perf_counter()
        try:
            config = json.load(open(config_path))
        except:
            raise FileExistsError("Error loading config file. Please check your spelling and try again.")

        # Config
        dataset_path = config["location"]["dataset"]
        results_path = config["location"]["results"]
        outputs_selection = config["experiment"]["outputs"]
        metrics_selection = config["experiment"]["metrics"]
        categorical_features = config["experiment"]["categorical"]
        numerical_features = config["experiment"]["numerical"]
        trials = config["experiment"]["trials"]
        models_selection = config["experiment"]["models"]
        # Create Results Folder if it doesn't exist
        if not os.path.exists(results_path):
            os.makedirs(results_path)

        # Model Selection
        models_to_use = {}
        if models_selection == "all" or models_selection == "All":
            models_selection = list(model_options.keys())
        for value in models_selection:
            if value not in model_options:
                print(f"Model {value} not found. Please check your spelling and try again.")
                exit()
            models_to_use[value] = model_options[value]

        total_progress_amount = (trials + 1) * len(outputs_selection) * len(models_to_use) + 3
        main_task = progress.add_task(f"[red]{config_path}", total=total_progress_amount)

        print("Starting Experiment")
        print("Loading Data")
        # Load Data
        dataset = pd.read_csv(dataset_path)

        progress.update(main_task, advance=1)
        print("Extract Outputs")

        # Get Outputs extracted and remove after
        outputs = {}
        for value in outputs_selection:
            outputs[value] = dataset[value]

        dataset = dataset.drop(outputs_selection, axis=1)

        # Loop through categorical features and fill null values with most frequent
        for feature in categorical_features:
            dataset[feature] = dataset[feature].fillna(dataset[feature].value_counts().index[0])

        # Loop through numerical features and fill null values with mean
        for feature in numerical_features:
            dataset[feature] = dataset[feature].fillna(dataset[feature].mean())

        progress.update(main_task, advance=1)
        print("Preprocessing Data")

        # Normalize Inputs
        preprocessor = ColumnTransformer(
            transformers =
            [('ohe',
              OneHotEncoder(handle_unknown='infrequent_if_exist', sparse_output=False),
              categorical_features),
             ('scaler',
              StandardScaler(),
              numerical_features)],
            remainder='passthrough',
            verbose_feature_names_out=False).set_output(transform = 'pandas')
        x_dataset = preprocessor.fit_transform(dataset)

        # Map the outputs to dictionary
        for key, value in config['outputs'].items():
            outputs[key] = outputs[key].map(value)

        outputs = pd.DataFrame(outputs)

        progress.update(main_task, advance=1)
        print("Starting Trials")
        models_results = ModelResults(models_to_use, outputs, metrics_selection, x_dataset, outputs, progress, main_task)
        for trial in range(trials):
            # Random Train Test Split
            x_train, x_test, y_train, y_test = train_test_split(x_dataset, outputs, test_size=0.2)

            # Iterate through models
            for model_name, model in models_to_use.items():
                # Iterate through outputs
                for output in outputs:
                    curr_time = datetime.now().strftime("%H:%M:%S")
                    print(f"Trial {trial + 1}, Training {model_name}, Output {output}")
                    # Special cases for some models that require multiclass specification
                    if model_name == "LGBM" and outputs[output].nunique() > 2:
                        model.set_params(objective="multiclass")
                    elif model_name == "XGB" and outputs[output].nunique() > 2:
                        model.set_params(objective="multi:softmax", num_class=outputs[output].nunique())

                    # Train Model
                    # Tune Hyperparameters with Bayesian Optimization
                    # if model has parameter probability, set to True
                    if dir(model).__contains__("probability"):
                        model.probability = True
                    np.int = int
                    opt = BayesSearchCV(
                        model,
                        model_params[model_name],
                        n_iter=32,
                        cv=3,
                        verbose=1,
                    )
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
                    y_prob = opt.predict_proba(x_test)

                    # Calculate Metrics
                    performance = get_metric(y_pred, y_prob, y_test[output], metrics_selection, train_time, predict_time)

                    # Save Results
                    for metric, value in performance.items():
                        models_results.add_result(model_name, output, metric, value)
                    progress.update(main_task, advance=1)

        print("Saving Models")
        models_results.save_models(results_path + "/models")
        print("Saving Results")
        models_results.save_results_raw_csv(results_path + "/results_raw.csv")
        models_results.save_results_averages_csv(results_path + "/results_average.csv")
        progress.update(main_task, advance=1)

        # Print Ending Message
        print(f"Finished in {time.perf_counter() - start_time} seconds.")
        print(f"Ran {trials} trials on {len(outputs.columns)} outputs and {len(models_to_use)} models.")
        print(f"Results saved to {results_path}")
        print('-'*100)