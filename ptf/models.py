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

model_options = {
    # SVC is SVCRBF
    'SVC': SVC(),
    'SVCLinear': SVC(kernel='linear'),
    'SVCPoly': SVC(kernel='poly'),
    'SVCSigmoid': SVC(kernel='sigmoid'),
    'NuSVC': NuSVC(nu=0.1),
    'GradientBoosting': GradientBoostingClassifier(n_estimators=100, learning_rate=1.0,max_depth=5, random_state=0),
    'GradientBoostingSE': GradientBoostingClassifier(n_estimators=100, learning_rate=1.0,max_depth=5, random_state=0, criterion='squared_error'),
    'GaussianNB': GaussianNB(),
    'GaussianNBVarSmoothing': GaussianNB(var_smoothing=1e-09),
    'DecisionTree': DecisionTreeClassifier(),
    'DecisionTreeEntropy': DecisionTreeClassifier(criterion='entropy'),
    'DecisionTreeGini': DecisionTreeClassifier(criterion='gini'),
    'KNeighbors': KNeighborsClassifier(n_neighbors=5, n_jobs=-1),
    'KNeighborsDistance': KNeighborsClassifier(n_neighbors=5, weights='distance', n_jobs=-1),
    'AdaBoost': AdaBoostClassifier(),
    'AdaBoostSAMME': AdaBoostClassifier(algorithm='SAMME'),
    'RandomForest': RandomForestClassifier(max_depth=5, n_estimators=10, max_features=1, random_state=42, n_jobs=-1),
    'RandomForestEntropy': RandomForestClassifier(max_depth=5, n_estimators=10, max_features=1, random_state=42, n_jobs=-1, criterion='entropy'),
    'RandomForestGini': RandomForestClassifier(max_depth=5, n_estimators=10, max_features=1, random_state=42, n_jobs=-1, criterion='gini'),
    'MLP': MLPClassifier(),
    'MLPIdentity': MLPClassifier(activation='identity'),
    'MLPLogistic': MLPClassifier(activation='logistic'),
    'MLPTanh': MLPClassifier(activation='tanh'),
    'MLPReLU': MLPClassifier(activation='relu'),
    'QDA': QuadraticDiscriminantAnalysis(),
    'QDAPriors': QuadraticDiscriminantAnalysis(priors=[0.5, 0.5]),
    'CatBoost': CatBoostClassifier(verbose=False, thread_count=-1),
    'CatBoostAccuracy': CatBoostClassifier(verbose=False, eval_metric='Accuracy', thread_count=-1),
    'CatBoostAUC': CatBoostClassifier(verbose=False, eval_metric='AUC', thread_count=-1),
    'CatBoostCrossEntropy': CatBoostClassifier(verbose=False, eval_metric='CrossEntropy', thread_count=-1),
    'CatBoostF1': CatBoostClassifier(verbose=False, eval_metric='F1', thread_count=-1),
    'CatBoostLogloss': CatBoostClassifier(verbose=False, eval_metric='Logloss', thread_count=-1),
    'CatBoostMCC': CatBoostClassifier(verbose=False, eval_metric='MCC', thread_count=-1),
    'CatBoostPrecision': CatBoostClassifier(verbose=False, eval_metric='Precision', thread_count=-1),
    'CatBoostRecall': CatBoostClassifier(verbose=False, eval_metric='Recall', thread_count=-1),
    'ExtraTrees': ExtraTreesClassifier(n_jobs=-1),
    'ExtraTreesEntropy': ExtraTreesClassifier(n_jobs=-1, criterion='entropy'),
    'ExtraTreesGini': ExtraTreesClassifier(n_jobs=-1, criterion='gini'),
    'Ridge': RidgeClassifier(),
    'PA': PassiveAggressiveClassifier(n_jobs=-1),
    'SGDOneClass': SGDOneClassSVM(verbose=False),
    'SGD': SGDClassifier(n_jobs=-1),
    'Dummy': DummyClassifier(strategy="uniform"),
    'HGB': HistGradientBoostingClassifier(verbose=False),
    'LGBM': LGBMClassifier(verbose=-1, n_jobs=-1),
    'LGBMGBDT': LGBMClassifier(verbose=-1, n_jobs=-1, boosting_type='gbdt'),
    'LGBMDart': LGBMClassifier(verbose=-1, n_jobs=-1, boosting_type='dart'),
    'LGBMGoss': LGBMClassifier(verbose=-1, n_jobs=-1, boosting_type='goss'),
    'XGB': XGBClassifier(verbose=1),
    'XGBLogistic': XGBClassifier(verbose=1, objective='binary:logistic'),
    'XGBMultiSoftmax': XGBClassifier(verbose=1, objective='multi:softmax'),
    'XGBMultiSoftprob': XGBClassifier(verbose=1, objective='multi:softprob'),
    'XGBRankPairwise': XGBClassifier(verbose=1, objective='rank:pairwise'),
    'LDA': LinearDiscriminantAnalysis(),
    'IsolationForest': IsolationForest(n_jobs=-1),
    'ExtraTree': ExtraTreeClassifier(),
    'ExtraTreeEntropy': ExtraTreeClassifier(criterion='entropy'),
    'ExtraTreeGini': ExtraTreeClassifier(criterion='gini'),
}
