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
    'SVC': SVC(verbose=True),
    'SVCLinear': SVC(kernel='linear', verbose=True),
    'SVCPoly': SVC(kernel='poly', verbose=True),
    'SVCSigmoid': SVC(kernel='sigmoid', verbose=True),
    'NuSVC': NuSVC(nu=0.1),
    'GradientBoosting': GradientBoostingClassifier(n_estimators=100, learning_rate=1.0,max_depth=5, random_state=0, verbose=True),
    'GradientBoostingSE': GradientBoostingClassifier(n_estimators=100, learning_rate=1.0,max_depth=5, random_state=0, criterion='squared_error', verbose=True),
    'GaussianNB': GaussianNB(),
    'GaussianNBVarSmoothing': GaussianNB(var_smoothing=1e-09),
    'DecisionTree': DecisionTreeClassifier(),
    'DecisionTreeEntropy': DecisionTreeClassifier(criterion='entropy'),
    'DecisionTreeGini': DecisionTreeClassifier(criterion='gini'),
    'KNeighbors': KNeighborsClassifier(n_neighbors=5, n_jobs=-1),
    'KNeighborsDistance': KNeighborsClassifier(n_neighbors=5, weights='distance', n_jobs=-1),
    'AdaBoost': AdaBoostClassifier(),
    'AdaBoostSAMME': AdaBoostClassifier(algorithm='SAMME'),
    'RandomForest': RandomForestClassifier(max_depth=5, n_estimators=10, max_features=1, random_state=42, n_jobs=-1, verbose=True),
    'RandomForestEntropy': RandomForestClassifier(max_depth=5, n_estimators=10, max_features=1, random_state=42, n_jobs=-1, criterion='entropy', verbose=True),
    'RandomForestGini': RandomForestClassifier(max_depth=5, n_estimators=10, max_features=1, random_state=42, n_jobs=-1, criterion='gini', verbose=True),
    'MLP': MLPClassifier(verbose=True),
    'MLPIdentity': MLPClassifier(activation='identity', verbose=True),
    'MLPLogistic': MLPClassifier(activation='logistic', verbose=True),
    'MLPTanh': MLPClassifier(activation='tanh', verbose=True),
    'MLPReLU': MLPClassifier(activation='relu', verbose=True),
    'QDA': QuadraticDiscriminantAnalysis(),
    'QDAPriors': QuadraticDiscriminantAnalysis(priors=[0.5, 0.5]),
    'CatBoost': CatBoostClassifier(verbose=True, thread_count=-1),
    'CatBoostAccuracy': CatBoostClassifier(verbose=True, eval_metric='Accuracy', thread_count=-1),
    'CatBoostAUC': CatBoostClassifier(verbose=True, eval_metric='AUC', thread_count=-1),
    'CatBoostCrossEntropy': CatBoostClassifier(verbose=True, eval_metric='CrossEntropy', thread_count=-1),
    'CatBoostF1': CatBoostClassifier(verbose=True, eval_metric='F1', thread_count=-1),
    'CatBoostLogloss': CatBoostClassifier(verbose=True, eval_metric='Logloss', thread_count=-1),
    'CatBoostMCC': CatBoostClassifier(verbose=True, eval_metric='MCC', thread_count=-1),
    'CatBoostPrecision': CatBoostClassifier(verbose=True, eval_metric='Precision', thread_count=-1),
    'CatBoostRecall': CatBoostClassifier(verbose=True, eval_metric='Recall', thread_count=-1),
    'ExtraTrees': ExtraTreesClassifier(n_jobs=-1, verbose=True),
    'ExtraTreesEntropy': ExtraTreesClassifier(n_jobs=-1, criterion='entropy', verbose=True),
    'ExtraTreesGini': ExtraTreesClassifier(n_jobs=-1, criterion='gini', verbose=True),
    'Bagging': BaggingClassifier(n_jobs=-1, verbose=True),
    'BaggingKNN': BaggingClassifier(KNeighborsClassifier(n_jobs=-1), verbose=True),
    'BaggingDecisionTree': BaggingClassifier(DecisionTreeClassifier(), verbose=True),
    'BaggingExtraTrees': BaggingClassifier(ExtraTreesClassifier(n_jobs=-1), verbose=True),
    'BaggingRandomForest': BaggingClassifier(RandomForestClassifier(n_jobs=-1), verbose=True),
    'BaggingGradientBoosting': BaggingClassifier(GradientBoostingClassifier(n_estimators=100, learning_rate=1.0,max_depth=5, random_state=0), verbose=True),
    'BaggingMLP': BaggingClassifier(MLPClassifier(), verbose=True),
    'BaggingQDA': BaggingClassifier(QuadraticDiscriminantAnalysis(), verbose=True),
    'BaggingLDA': BaggingClassifier(LinearDiscriminantAnalysis(), verbose=True),
    'BaggingSVC': BaggingClassifier(SVC(), verbose=True),
    'BaggingNuSVC': BaggingClassifier(NuSVC(), verbose=True),
    'BaggingGaussianNB': BaggingClassifier(GaussianNB(), verbose=True),
    'BaggingRidge': BaggingClassifier(RidgeClassifier(), verbose=True),
    'BaggingPA': BaggingClassifier(PassiveAggressiveClassifier(n_jobs=-1), verbose=True),
    'BaggingSGD': BaggingClassifier(SGDClassifier(n_jobs=-1), verbose=True),
    'BaggingDummy': BaggingClassifier(DummyClassifier(strategy="uniform"), verbose=True),
    'BaggingHGB': BaggingClassifier(HistGradientBoostingClassifier(), verbose=True),
    'BaggingIsolationForest': BaggingClassifier(IsolationForest(n_jobs=-1), verbose=True),
    'Ridge': RidgeClassifier(),
    'PA': PassiveAggressiveClassifier(n_jobs=-1, verbose=True),
    'SGDOneClass': SGDOneClassSVM(verbose=True),
    'SGD': SGDClassifier(n_jobs=-1, verbose=True),
    'Dummy': DummyClassifier(strategy="uniform"),
    'HGB': HistGradientBoostingClassifier(verbose=True),
    'LGBM': LGBMClassifier(verbose=-1, n_jobs=-1),
    'XGB': XGBClassifier(),
    'LDA': LinearDiscriminantAnalysis(),
    'IsolationForest': IsolationForest(n_jobs=-1, verbose=True),
    'ExtraTree': ExtraTreeClassifier(),
    'ExtraTreeEntropy': ExtraTreeClassifier(criterion='entropy'),
    'ExtraTreeGini': ExtraTreeClassifier(criterion='gini'),
}
