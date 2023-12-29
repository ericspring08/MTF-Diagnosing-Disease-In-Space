from sklearn.svm import SVC, NuSVC
from sklearn.ensemble import GradientBoostingClassifier, AdaBoostClassifier, RandomForestClassifier, ExtraTreesClassifier, BaggingClassifier, HistGradientBoostingClassifier, IsolationForest
from sklearn.naive_bayes import GaussianNB
from sklearn.tree import DecisionTreeClassifier, ExtraTreeClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.neural_network import MLPClassifier
from sklearn.discriminant_analysis import QuadraticDiscriminantAnalysis, LinearDiscriminantAnalysis
from catboost import CatBoostClassifier
from sklearn.linear_model import RidgeClassifier, PassiveAggressiveClassifier, SGDOneClassSVM, SGDClassifier
from sklearn.dummy import DummyClassifier
from xgboost import XGBClassifier
from lightgbm import LGBMClassifier

model_params = {
    'SVC': {
        'kernel': ['rbf', 'linear', 'sigmoid'],
        'C': [0.1, 1, 10],
        'gamma': ['scale', 'auto']
    },
    'GradientBoosting': {
        'learning_rate': [0.1, 0.5, 1.0],
        'max_depth': [3, 5, 7, 9],
        'n_estimators': [50, 100, 200]
    },
    'GaussianNB': {
        'var_smoothing': [1e-09],
    },
    'DecisionTree': {
        'criterion': ['gini', 'entropy'],
        'max_depth': [3, 5, 7, 9],
        'min_samples_split': [2, 3, 4, 5],
        'min_samples_leaf': [1, 2, 3, 4, 5]
    },
    'KNeighbors': {
        'n_neighbors': [3, 5, 7, 9],
        'weights': ['uniform', 'distance'],
        'algorithm': ['auto', 'ball_tree', 'kd_tree', 'brute']
    },
    'AdaBoost': {
        'n_estimators': [50, 100, 200],
        'learning_rate': [0.1, 0.5, 1.0]
    },
    'RandomForest': {
        'n_estimators': [50, 100, 200],
        'max_depth': [3, 5, 7, 9],
        'min_samples_split': [2, 3, 4, 5],
        'min_samples_leaf': [1, 2, 3, 4, 5]
    },
    'MLP': {
        'activation': ['tanh', 'relu'],
        'solver': ['sgd', 'adam'],
        'alpha': [0.0001, 0.05],
        'learning_rate': ['constant', 'adaptive'],
    },
    'QDA': {
        'reg_param': [0.0, 0.1, 0.5, 1.0],
        'tol': [0.0001, 0.001, 0.01, 0.1],
    },
    'CatBoost': {
        'iterations': [50, 100, 200],
        'learning_rate': [0.1, 0.5, 1.0],
        'depth': [3, 5, 7, 9],
        'l2_leaf_reg': [1, 3, 5, 7, 9],
        'border_count': [32, 64, 128],
        'thread_count': [-1]
    },
    'ExtraTrees': {
        'n_estimators': [50, 100, 200],
        'max_depth': [3, 5, 7, 9],
        'min_samples_split': [2, 3, 4, 5],
        'min_samples_leaf': [1, 2, 3, 4, 5]
    },
    'Ridge': {
        'alpha': [0.1, 1, 10, 100],
        'solver': ['auto', 'svd', 'cholesky', 'lsqr', 'sparse_cg', 'sag', 'saga'],
        'tol': [1e-03, 1e-04, 1e-05],
    },
    'PA': {
        'C': [0.1, 1, 10, 100],
        'max_iter': [1000, 2000, 3000],
        'tol': [1e-03, 1e-04, 1e-05],
    },
    'SGD': {
        'alpha': [0.1, 1, 10, 100],
        'loss': ['log_loss', 'squared_error', 'huber', 'squared_epsilon_insensitive', 'squared_hinge', 'modified_huber', 'hinge', 'perceptron', 'epsilon_insensitive'],
        'penalty': ['l2', 'l1', 'elasticnet'],
    },
    'Dummy': {
        'strategy': ['uniform', 'stratified', 'most_frequent'],
    },
    'HGB': {
        'learning_rate': [0.1, 0.5, 1.0],
        'max_depth': [3, 5, 7, 9],
        'min_samples_leaf': [1, 2, 3, 4, 5],
        'max_bins': [32, 64, 128],
        'l2_regularization': [0.0, 0.1, 0.5, 1.0],
        'max_iter': [50, 100, 200],
        'tol': [1e-07, 1e-06, 1e-05],
        'scoring': ['loss', 'accuracy', 'balanced_accuracy', 'f1', 'precision', 'recall', 'roc_auc'],
        'validation_fraction': [0.1, 0.2, 0.3],
        'n_iter_no_change': [10, 20, 30],
        'early_stopping': [True, False]
    },
    'LGBMGBDT': {
        'learning_rate': [0.1, 0.5, 1.0],
        'max_depth': [3, 5, 7, 9],
        'min_samples_leaf': [1, 2, 3, 4, 5],
        'max_bins': [32, 64, 128],
        'tol': [1e-07, 1e-06, 1e-05],
        'n_estimators': [50, 100, 200],
        'num_leaves': [31, 127, 255],
        'scoring': ['loss', 'accuracy', 'balanced_accuracy', 'f1', 'precision', 'recall', 'roc_auc'],
    },
    'LGBMDart': {
        'learning_rate': [0.1, 0.5, 1.0],
        'max_depth': [3, 5, 7, 9],
        'min_samples_leaf': [1, 2, 3, 4, 5],
        'max_bins': [32, 64, 128],
        'tol': [1e-07, 1e-06, 1e-05],
        'n_estimators': [50, 100, 200],
        'num_leaves': [31, 127, 255],
        'scoring': ['loss', 'accuracy', 'balanced_accuracy', 'f1', 'precision', 'recall', 'roc_auc'],
    },
    'LGBMrf': {
        'learning_rate': [0.1, 0.5, 1.0],
        'max_depth': [3, 5, 7, 9],
        'min_samples_leaf': [1, 2, 3, 4, 5],
        'max_bins': [32, 64, 128],
        'tol': [1e-07, 1e-06, 1e-05],
        'n_estimators': [50, 100, 200],
        'num_leaves': [31, 127, 255],
        'scoring': ['loss', 'accuracy', 'balanced_accuracy', 'f1', 'precision', 'recall', 'roc_auc'],
    },
    'XGBDart': {
        'learning_rate': [0.1, 0.5, 1.0],
        'max_depth': [3, 5, 7, 9],
        'min_samples_leaf': [1, 2, 3, 4, 5],
        'max_bins': [32, 64, 128],
        'l2_regularization': [0.0, 0.1, 0.5, 1.0],
        'max_iter': [50, 100, 200],
        'tol': [1e-07, 1e-06, 1e-05],
        'scoring': ['loss', 'accuracy', 'balanced_accuracy', 'f1', 'precision', 'recall', 'roc_auc'],
        'validation_fraction': [0.1, 0.2, 0.3],
        'n_iter_no_change': [10, 20, 30],
        'early_stopping': [True, False],
    },
    'XGBTree': {
        'learning_rate': [0.1, 0.5, 1.0],
        'max_depth': [3, 5, 7, 9],
        'min_samples_leaf': [1, 2, 3, 4, 5],
        'max_bins': [32, 64, 128],
        'l2_regularization': [0.0, 0.1, 0.5, 1.0],
        'max_iter': [50, 100, 200],
        'tol': [1e-07, 1e-06, 1e-05],
        'scoring': ['loss', 'accuracy', 'balanced_accuracy', 'f1', 'precision', 'recall', 'roc_auc'],
        'validation_fraction': [0.1, 0.2, 0.3],
        'n_iter_no_change': [10, 20, 30],
        'early_stopping': [True, False],
    },
    'XGBLinear': {
        'learning_rate': [0.1, 0.5, 1.0],
        'max_depth': [3, 5, 7, 9],
        'min_samples_leaf': [1, 2, 3, 4, 5],
        'max_bins': [32, 64, 128],
        'l2_regularization': [0.0, 0.1, 0.5, 1.0],
        'max_iter': [50, 100, 200],
        'tol': [1e-07, 1e-06, 1e-05],
        'scoring': ['loss', 'accuracy', 'balanced_accuracy', 'f1', 'precision', 'recall', 'roc_auc'],
        'validation_fraction': [0.1, 0.2, 0.3],
        'n_iter_no_change': [10, 20, 30],
        'early_stopping': [True, False],
    },
    'ExtraTree': {
        'criterion': ['gini', 'entropy'],
        'max_depth': [3, 5, 7, 9],
        'min_samples_split': [2, 3, 4, 5],
        'min_samples_leaf': [1, 2, 3, 4, 5]
    }
}

model_options = {
    # SVC is SVCRBF
    'SVC': SVC(),
    'GradientBoosting': GradientBoostingClassifier(n_estimators=100, learning_rate=1.0,max_depth=5, random_state=0),
    'GaussianNB': GaussianNB(),
    'DecisionTree': DecisionTreeClassifier(),
    'KNeighbors': KNeighborsClassifier(n_neighbors=5, n_jobs=-1),
    'AdaBoost': AdaBoostClassifier(),
    'RandomForest': RandomForestClassifier(max_depth=5, n_estimators=10, max_features=1, random_state=42, n_jobs=-1),
    'MLP': MLPClassifier(),
    'QDA': QuadraticDiscriminantAnalysis(),
    'CatBoost': CatBoostClassifier(verbose=False, thread_count=-1),
    'ExtraTrees': ExtraTreesClassifier(n_jobs=-1),
    'Ridge': RidgeClassifier(),
    'PA': PassiveAggressiveClassifier(n_jobs=-1),
    'SGD': SGDClassifier(n_jobs=-1),
    'Dummy': DummyClassifier(strategy="uniform"),
    'HGB': HistGradientBoostingClassifier(verbose=False),
    'LGBMGBDT': LGBMClassifier(verbose=-1, n_jobs=-1, boosting_type='gbdt'),
    'LGBMDart': LGBMClassifier(verbose=-1, n_jobs=-1, boosting_type='dart'),
    'LGBMrf': LGBMClassifier(verbose=-1, n_jobs=-1, boosting_type='rf'),
    'XGBTree': XGBClassifier(verbosity=0, booster='gbtree'),
    'XGBDart': XGBClassifier(verbosity=0, booster='dart'),
    'XGBLinear': XGBClassifier(verbosity=0, booster='gblinear'),
    'ExtraTree': ExtraTreeClassifier(),
}