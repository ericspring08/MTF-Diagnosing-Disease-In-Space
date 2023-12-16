from sklearn.model_selection import train_test_split
import pandas as pd
from src.utils import *
import time
from models import *
from src.save import ModelResults
from datetime import datetime

from rich.progress import Progress, BarColumn, TimeElapsedColumn, TextColumn, SpinnerColumn

def main_loop(inputs, outputs, models, metrics_selection, trials, results_path, config_path):
    total_progress_amount = trials * len(outputs) * len(models)
    with Progress() as progress:
        main_task = progress.add_task(f"[red]{config_path}", total=total_progress_amount)

        outputs = pd.DataFrame(outputs)
        models_results = ModelResults(models, outputs, metrics_selection)
        for trial in range(trials):
            # Random Train Test Split
            x_train, x_test, y_train, y_test = train_test_split(inputs, outputs, test_size=0.2)

            # Iterate through models
            for model_name, model in models.items():
                # Iterate through outputs
                for output in outputs:
                    curr_time = datetime.now().strftime("%H:%M:%S")
                    progress.console.print(f"[{curr_time}] Trial {trial + 1}, Training {model_name}, Output {output}")
                    # Special cases for some models that require multiclass specification
                    if model_name == "LGBM" and outputs[output].nunique() > 2:
                        model = LGBMClassifier(objective="multiclass", verbose = -1)
                    elif model_name == "XGB" and outputs[output].nunique() > 2:
                        model = XGBClassifier(objective="multi:softmax", num_class=outputs[output].nunique())

                    # Train Model
                    time_before_fit = time.perf_counter_ns()
                    model.fit(x_train, y_train[output])
                    time_after_fit = time.perf_counter_ns()

                    # Calculate Training Time
                    train_time = (time_after_fit - time_before_fit)

                    # Predict
                    y_pred = model.predict(x_test)

                    # Calculate Metrics
                    performance = get_metric(y_pred, y_test[output], metrics_selection, train_time)

                    # Save Results
                    for metric, value in performance.items():
                        models_results.add_result(model_name, output, metric, value)
                    progress.update(main_task, advance=1)
        models_results.save_results_averages_csv(results_path + "/results.csv")