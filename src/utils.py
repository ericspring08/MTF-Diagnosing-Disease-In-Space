# Models
# Mathematical
import math
import statistics as st

# Machine Learning Models
from sklearn.svm import SVC
from sklearn.ensemble import GradientBoostingClassifier, AdaBoostClassifier, RandomForestClassifier, ExtraTreesClassifier, BaggingClassifier, HistGradientBoostingClassifier
from sklearn.naive_bayes import GaussianNB, CategoricalNB, ComplementNB
from sklearn.tree import DecisionTreeClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.neural_network import MLPClassifier
from sklearn.discriminant_analysis import QuadraticDiscriminantAnalysis
from catboost import CatBoostClassifier
from sklearn.linear_model import RidgeClassifier, PassiveAggressiveClassifier, SGDOneClassSVM
from sklearn.dummy import DummyClassifier
from xgboost import XGBClassifier
from lightgbm import LGBMClassifier

# Metrics
from sklearn.metrics import accuracy_score, precision_score, balanced_accuracy_score, f1_score

# Functions
def add_text_label(ax, labels):
    for i, txt in enumerate(labels):
        ax.annotate(txt, (i, 0.5))

def get_model(model_name):
    return model_options[model_name]

def get_metric(metric_name):
    return metric_options[metric_name]

def calculate_metric(predictions, actual, metric_name):
    return get_metric(metric_name)(predictions, actual)
def ammp(accuracy, precision, time_to_fit):
    accuracy_reciprocal_sum = sum(accuracy.rdiv(1))
    precision_reciprocal_sum = sum(precision.rdiv(1))
    trials_num = len(accuracy)
    accuracy_sum = sum(accuracy)
    # Divide by 1000000 to convert nanoseconds to milliseconds
    time_to_fit_ms = st.mean(time_to_fit/1000000)

    return 0.14 * (trials_num / precision_reciprocal_sum) + 0.85 * (accuracy_sum / trials_num) - (0.01 * math.log(time_to_fit_ms, 12))

# Variables
model_options = {
    'SVC': SVC(),
    'GradientBoosting': GradientBoostingClassifier(n_estimators=100, learning_rate=1.0,max_depth=5, random_state=0),
    'GaussianNB': GaussianNB(),
    'DecisionTree': DecisionTreeClassifier(),
    'KNeighbors': KNeighborsClassifier(n_neighbors=5),
    'AdaBoost': AdaBoostClassifier(),
    'RandomForest': RandomForestClassifier(max_depth=5, n_estimators=10, max_features=1, random_state=42),
    'MLP': MLPClassifier(alpha=2, max_iter=1000, random_state=42),
    'QDA': QuadraticDiscriminantAnalysis(),
    'CatBoost': CatBoostClassifier(iterations=2,
                                   learning_rate=1,
                                   depth=2, verbose=False),
    'ExtraTrees': ExtraTreesClassifier(),
    'Bagging': BaggingClassifier(),
    'Ridge': RidgeClassifier(),
    'PA': PassiveAggressiveClassifier(),
    'SGDOneClass': SGDOneClassSVM(),
    'Dummy': DummyClassifier(),
    'HGB': HistGradientBoostingClassifier(),
    'LGBM': LGBMClassifier(verbose=-1),
    'XGB': XGBClassifier()
}

metric_options = {
    'accuracy': accuracy_score,
    'precision': precision_score,
    'balanced_accuracy': balanced_accuracy_score,
    'f1': f1_score,
    'ammp': ammp
}
