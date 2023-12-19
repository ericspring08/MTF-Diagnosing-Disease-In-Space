import time
from datetime import datetime
import json
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
import os

from models import *
from src.utils import *
from src.save import *

from rich.progress import Progress, TimeElapsedColumn, SpinnerColumn


def main_loop(config_path):
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

    # Make Calculations about the progress bar
    total = trials

    # Load Data
    dataset = pd.read_csv(dataset_path)

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


    total_progress_amount = trials * len(outputs) * len(models_to_use)
    with Progress(SpinnerColumn(), *Progress.get_default_columns(), TimeElapsedColumn()) as progress:

        main_task = progress.add_task(f"[red]{config_path}", total=total_progress_amount)

        outputs = pd.DataFrame(outputs)
        models_results = ModelResults(models_to_use, outputs, metrics_selection)
        for trial in range(trials):
            # Random Train Test Split
            x_train, x_test, y_train, y_test = train_test_split(x_dataset, outputs, test_size=0.2)

            # Iterate through models
            for model_name, model in models_to_use.items():
                # Iterate through outputs
                for output in outputs:
                    curr_time = datetime.now().strftime("%H:%M:%S")
                    progress.console.print(f"[{curr_time}] Trial {trial + 1}, Training {model_name}, Output {output}")
                    try:
                        # Special cases for some models that require multiclass specification
                        if model_name == "LGBM" and outputs[output].nunique() > 2:
                            model.set_params(objective="multiclass")
                        elif model_name == "XGB" and outputs[output].nunique() > 2:
                            model.set_params(objective="multi:softmax")
                            model.set_params(num_classes=outputs[output].nunique())

                        # Train Model
                        time_before_fit = time.perf_counter_ns()
                        model.fit(x_train, y_train[output])
                        time_after_fit = time.perf_counter_ns()

                        # Calculate Training Time
                        train_time = (time_after_fit - time_before_fit)

                        # Predict
                        before_predict = time.perf_counter_ns()
                        y_pred = model.predict(x_test)
                        after_predict = time.perf_counter_ns()
                        predict_time = (after_predict - before_predict)

                        # Calculate Metrics
                        performance = get_metric(y_pred, y_test[output], metrics_selection, train_time, predict_time)

                        # Save Results
                        for metric, value in performance.items():
                            models_results.add_result(model_name, output, metric, value)
                    except Exception as e:
                        print(f"[{datetime.now().strftime('%H:%M:%S')}] Error with {model_name} on {output}, {e}")
                    progress.update(main_task, advance=1)
        models_results.save_results_raw_csv(results_path + "/results_raw.csv")
        models_results.save_results_averages_csv(results_path + "/results_average.csv")
    # Print Ending Message
    print(f"Finished in {time.perf_counter() - start_time} seconds.")
    print(f"Ran {total} trials on {len(outputs.columns)} outputs and {len(models_to_use)} models.")
    print(f"Results saved to {results_path}")
    print('-'*100)