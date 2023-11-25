# Prep
import pandas as pd
from sklearn.model_selection import train_test_split

# Utility
import numpy as np
from sklearn.gaussian_process.kernels import RBF
import warnings
import configparser
from pathlib import Path

# Arg Parse
from argparse import ArgumentParser

# Visualization
import matplotlib.pyplot as plt
import seaborn as sns

# Models
from sklearn.svm import SVC
from sklearn.ensemble import GradientBoostingClassifier, AdaBoostClassifier, RandomForestClassifier
from sklearn.naive_bayes import GaussianNB
from sklearn.tree import DecisionTreeClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.neural_network import MLPClassifier
from sklearn.gaussian_process import GaussianProcessClassifier
from sklearn.discriminant_analysis import QuadraticDiscriminantAnalysis

# Metrics
from sklearn.metrics import classification_report
from sklearn.metrics import confusion_matrix
from sklearn.metrics import balanced_accuracy_score
from sklearn.metrics import accuracy_score

warnings.filterwarnings('ignore')

parser = ArgumentParser()
parser.add_argument("-c", '--config')
parser.add_argument("-a", '--all', action='store_true')
parser.add_argument('-m','--models', nargs='+')  
parser.add_argument('-t', '--trials', type=int)

args = parser.parse_args()

# read config file
config_path = args.config
config = configparser.ConfigParser()
config.read(config_path)

# get data file location
data_path = config.get('Data', 'CAD')
df = pd.read_csv(data_path)

# get testing models
model_options = {
    'SVC': SVC(),
    'GradientBoosting': GradientBoostingClassifier(n_estimators=100, learning_rate=1.0,max_depth=5, random_state=0),
    'GaussianNB': GaussianNB(),
    'DecisionTree': DecisionTreeClassifier(),
    'KNeighbors': KNeighborsClassifier(n_neighbors=5),
    'AdaBoost': AdaBoostClassifier(),
    'RandomForest': RandomForestClassifier(max_depth=5, n_estimators=10, max_features=1, random_state=42),
    'MLPClassifier': MLPClassifier(alpha=1, max_iter=1000, random_state=42),
    'GaussianProcess': GaussianProcessClassifier(1.0 * RBF(1.0), random_state=42),
    'QuadraticDiscriminantAnalysis': QuadraticDiscriminantAnalysis()
}
model_option_names = model_options.keys()

models = {}
if args.all:
    # all models
    models = model_options
else:
    # only use choosen models
    for value in args.models:
        models.update({
            value: model_options.get(value)
        })

# preprocess
# mappings
# Sex
sex_map = {
    'Male': 0,
    'Fmale': 1,
}
# Yes and No Map
yn_map = {
    'N': 0, 
    'Y': 1,
}
# VHD Map
vhd_map = {
    'N': 0,
    'mild': 1,
    'Moderate': 2,
    'Severe': 3,
}
# Cath Map
cath_map = {
    'Normal': 0,
    'Cad': 1,
}

yn_features = ['Obesity', 'CRF', 'CVA', 'Airway disease', 'Thyroid Disease', 'CHF', 'DLP', 'Weak Peripheral Pulse', 'Lung rales', 'Systolic Murmur', 'Diastolic Murmur', 'Dyspnea', 'Atypical', 'Nonanginal', 'Exertional CP', 'LowTH Ang', 'LVH', 'Poor R Progression']
for feature in yn_features:
    df[feature] = df[feature].map(yn_map)
df['Sex'] = df['Sex'].map(sex_map)
df['VHD'] = df['VHD'].map(vhd_map)
df['Cath'] = df['Cath'].map(cath_map)

## Data set size
print(f'The data set has {df.shape[0]} rows and {df.shape[1]} columns')

for trial in range(0, args.trials):
    print('='*60)
    print(f'TRIAL {trial}')
    # Generate test and train suites
    x_train, x_test, y_VHD_train, y_VHD_test = train_test_split(df.iloc[:, 0:11], df.VHD, test_size=0.2)
    _, _, y_cath_train, y_cath_test = train_test_split(df.iloc[:, 0:11], df.Cath, test_size=0.2)

    # predictions and models

    results_VHD = []
    results_Cath = []

    for model_name, model_object in models.items():
        # fit model 
        model_VHD = model_object.fit(x_train, y_VHD_train)
        model_Cath = model_object.fit(x_train, y_cath_train)

        predictions_VHD = model_VHD.predict(x_test)
        predictions_Cath = model_Cath.predict(x_test)

        print('-'*60)
        print(f'{model_name} - VHD')
        print(f'accuracy: {accuracy_score(predictions_VHD, y_VHD_test)}')
        print(f'balanced accuracy: {balanced_accuracy_score(predictions_VHD, y_VHD_test)}')
        print('-'*60)
        print(f'{model_name} - Cath')
        print(f'accuracy: {accuracy_score(predictions_Cath, y_cath_test)}')
        print(f'balanced accuracy: {balanced_accuracy_score(predictions_Cath, y_cath_test)}')
        print('-'*60)

        results_VHD.append(balanced_accuracy_score(predictions_VHD, y_VHD_test))
        results_Cath.append(balanced_accuracy_score(predictions_Cath, y_cath_test))