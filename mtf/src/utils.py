# Models
# Mathematical
from datetime import datetime
from art import text2art
import warnings
import builtins

from sklearn.metrics import log_loss, precision_score, recall_score


def get_metric(y_pred, y_prob, y_test, metrics, train_time, predict_time):

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
            all_metrics[metric] = log_loss(
                y_test, y_prob, labels=y_test.unique())
        elif metric == "shscore":
            # SHScore Metric
            all_metrics[metric] = shscore(y_pred, y_prob, y_test)
        # Standard Metrics
        else:
            # import from sklearn
            try:
                metric_func = __import__(
                    "sklearn.metrics", globals(), locals(), [metric], 0)
            except ImportError:
                print(
                    f"Metric {metric} not found. Please check your spelling and try again.")
                exit()

            # Get metric function
            # check if metric_func has averge option
            # check if metric_func.metric_func has average option
            # set metric_func to metric_func.metric_func
            # set params to average=macro

            if hasattr(metric_func, metric+"_score"):
                metric_func = metric_func.__getattribute__(metric+"_score")

            params = {}
            if hasattr(metric_func, "average"):
                params["average"] = "macro"

            # Get metric score
            all_metrics[metric] = metric_func(y_test, y_pred, **params)

    return all_metrics


def print_tags(tags, message):
    tag = ""
    for value in tags:
        tag += f"[{value}] "
    print(f"{tag} {message}")


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


def aoc(y_pred, y_prob, y_test):
    return log_loss(y_test, y_prob, labels=y_test.unique())


def shscore(y_pred, y_prob, y_test):
    return fprime(y_test, y_pred) - aoc(y_pred, y_prob, y_test)


def shscorewrapper(estimator, X, Y):

    y_pred = estimator.predict(X)
    y_prob = estimator.predict_proba(X)

    score = fprime(Y, y_pred) - aoc(y_pred, y_prob, Y)

    return score
