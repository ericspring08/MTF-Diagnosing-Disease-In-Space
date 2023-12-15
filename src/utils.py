# Models
# Mathematical
import math
import statistics as st

# Metrics
from sklearn.metrics import accuracy_score, precision_score, balanced_accuracy_score, f1_score, recall_score

# Functions
def add_text_label(ax, labels):
    for i, txt in enumerate(labels):
        ax.annotate(txt, (i, 0.5))

def ammp(accuracy, precision, time_to_fit):
    accuracy_reciprocal_sum = sum(accuracy.rdiv(1))
    precision_reciprocal_sum = sum(precision.rdiv(1))
    trials_num = len(accuracy)
    accuracy_sum = sum(accuracy)
    # Divide by 1000000 to convert nanoseconds to milliseconds
    time_to_fit_ms = st.mean(time_to_fit/1000000)

    return 0.14 * (trials_num / precision_reciprocal_sum) + 0.85 * (accuracy_sum / trials_num) - (0.01 * math.log(time_to_fit_ms, 12))

def get_metric(y_pred, y_test, metrics, train_time):
    global metric_params
    global metric_options

    all_metrics = {}

    for metric in metrics:
        # Non Standard Metric
        if metric == "train_time":
            # Train Time Metric
            all_metrics[metric] = train_time
        elif metric == "ammp":
            # AMMP Metric
            all_metrics[metric] = ammp(accuracy_score(y_pred, y_test), precision_score(y_pred, y_test), train_time)
        # Standard Metrics
        elif metric in metric_options:
            # Traditional metrics
            metric_func = metric_options[metric]
            parameters = metric_params[metric]
            metric_value = metric_func(y_pred, y_test, **parameters)
            all_metrics[metric] = metric_value
        else:
            print(f"Metric {metric} not found. Please check your spelling and try again.")
            exit()

    return all_metrics

# Variables
metric_options = {
    'accuracy': accuracy_score,
    'precision': precision_score,
    'balanced_accuracy': balanced_accuracy_score,
    'f1': f1_score,
    'ammp': None,
    'train_time': None,
    'recall': recall_score
}

metric_params = {
    'accuracy': {},
    'precision': {'average': 'weighted'},
    'balanced_accuracy': {},
    'f1': {'average': 'weighted'},
    'recall': {'average': 'weighted'},
    'ammp': {},
    'train_time': {}
}