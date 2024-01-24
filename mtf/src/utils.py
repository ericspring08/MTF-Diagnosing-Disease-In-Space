# Models
# Mathematical
import math
import statistics as st

from datetime import datetime
from art import text2art
import warnings
import builtins

# Metrics
from sklearn.metrics import accuracy_score, precision_score, balanced_accuracy_score, f1_score, recall_score, log_loss

# Functions


def ammp(accuracy, precision, time_to_fit):
    precision_reciprocal_sum = sum(precision.rdiv(1))
    trials_num = len(accuracy)
    accuracy_sum = sum(accuracy)
    # Divide by 1000000 to convert nanoseconds to milliseconds
    time_to_fit_ms = st.mean(time_to_fit/1000000)

    return 0.14 * (trials_num / precision_reciprocal_sum) + 0.85 * (accuracy_sum / trials_num) - (0.01 * math.log(time_to_fit_ms, 12))


def get_metric(y_pred, y_prob, y_test, metrics, train_time, predict_time):
    global metric_params
    global metric_options

    all_metrics = {}

    for metric in metrics:
        # Non Standard Metric
        if metric == "train_time":
            # Train Time Metric
            all_metrics[metric] = train_time
        elif metric == "predict_time":
            # Predict Time Metric
            all_metrics[metric] = predict_time
        elif metric == "logloss":
            # Log Loss Metric
            if y_prob is None:
                all_metrics[metric] = 0
            else:
                all_metrics[metric] = log_loss(
                    y_test, y_prob, labels=y_test.unique())
        elif metric == "ammp":
            # AMMP Metric
            all_metrics[metric] = ammp(accuracy_score(
                y_pred, y_test), precision_score(y_pred, y_test), train_time)
        # Standard Metrics
        elif metric in metric_options:
            # Traditional metrics
            metric_func = metric_options[metric]
            parameters = metric_params[metric]
            metric_value = metric_func(y_pred, y_test, **parameters)
            all_metrics[metric] = metric_value
        else:
            print(
                f"Metric {metric} not found. Please check your spelling and try again.")
            exit()

    return all_metrics


def print_tags(tags, message):
    tag = ""
    for value in tags:
        tag += f"[{value}] "
    print(f"{tag} {message}")


def hasmethod(obj, method_name):
    return hasattr(obj, method_name) and callable(getattr(obj, method_name))


def print_header():
    title = text2art("MTF", font="3d_diagonal")
    print(title)
    print("Model Training Platform")
    print("By Eric Zhang, 2023")
    print('-' * 100)
    warnings.filterwarnings('ignore')


def enable_tagged_print():
    # All prints have a timestamp
    _print = print

    def time_print(*args, **kwargs):
        curr_time = datetime.now().strftime("%H:%M:%S")
        _print(f"[{curr_time}]", *args, **kwargs)

    builtins.print = time_print


def fprime(y_true, y_pred):
    precision = precision_score(y_true, y_pred, average='macro')
    specificity = recall_score(
        y_true, y_pred, pos_label=0, average='macro')

    return 2 * (precision * specificity) / (precision + specificity)


def scoring_function(estimator, X, Y):

    y_pred = estimator.predict(X)

    score = fprime(Y, y_pred)

    return score


# Variables
metric_options = {
    'accuracy': accuracy_score,
    'precision': precision_score,
    'balanced_accuracy': balanced_accuracy_score,
    'f1': f1_score,
    'ammp': None,
    'train_time': None,
    'predict_time': None,
    'recall': recall_score
}

metric_params = {
    'accuracy': {},
    'precision': {'average': 'weighted'},
    'balanced_accuracy': {},
    'f1': {'average': 'weighted'},
    'recall': {'average': 'weighted'},
    'ammp': {},
    'train_time': {},
    'predict_time': {}
}
