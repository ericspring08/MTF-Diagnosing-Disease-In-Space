from sklearn.model_selection import train_test_split
import pandas as pd
from src.utils import *
import time
from models import *

def main_loop(inputs, outputs, models, metrics_selection, trials):
    outputs = pd.DataFrame(outputs)
    for trial in range(trials):
        # Random Train Test Split
        x_train, x_test, y_train, y_test = train_test_split(inputs, outputs, test_size=0.2)

        # Iterate through models
        for model_name, model in models.items():
            # Iterate through outputs
            for output in outputs:
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