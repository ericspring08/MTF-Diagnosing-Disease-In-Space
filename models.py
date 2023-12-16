from sklearn.svm import SVC
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

model_options = {
    'SVC': SVC(),
    'GradientBoosting': GradientBoostingClassifier(n_estimators=100, learning_rate=1.0,max_depth=5, random_state=0),
    'GaussianNB': GaussianNB(),
    'DecisionTree': DecisionTreeClassifier(),
    'KNeighbors': KNeighborsClassifier(n_neighbors=5),
    'AdaBoost': AdaBoostClassifier(),
    'RandomForest': RandomForestClassifier(max_depth=5, n_estimators=10, max_features=1, random_state=42),
    'MLP': MLPClassifier(),
    'QDA': QuadraticDiscriminantAnalysis(),
    'CatBoost': CatBoostClassifier(verbose=False),
    'ExtraTrees': ExtraTreesClassifier(),
    'Bagging': BaggingClassifier(),
    'Ridge': RidgeClassifier(),
    'PA': PassiveAggressiveClassifier(),
    'SGDOneClass': SGDOneClassSVM(),
    'SGD': SGDClassifier(),
    'Dummy': DummyClassifier(strategy="uniform"),
    'HGB': HistGradientBoostingClassifier(),
    'LGBM': LGBMClassifier(verbose=-1),
    'XGB': XGBClassifier(),
    'LDA': LinearDiscriminantAnalysis(),
    'IsolationForest': IsolationForest(),
    'ExtraTree': ExtraTreeClassifier(),
}
