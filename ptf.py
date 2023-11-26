# Prep
import pandas as pd
from sklearn.model_selection import train_test_split

# Utility
import numpy as np
from sklearn.gaussian_process.kernels import RBF
import warnings
import configparser
from pathlib import Path
import os
import shutil
import time
from art import text2art

# Arg Parse
from argparse import ArgumentParser

# Visualization
import matplotlib.pyplot as plt
import seaborn as sns

# Progress Bar
from rich.progress import Progress

# Models
from sklearn.svm import SVC
from sklearn.ensemble import GradientBoostingClassifier, AdaBoostClassifier, RandomForestClassifier
from sklearn.naive_bayes import GaussianNB
from sklearn.tree import DecisionTreeClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.neural_network import MLPClassifier
from sklearn.gaussian_process import GaussianProcessClassifier
from sklearn.discriminant_analysis import QuadraticDiscriminantAnalysis
from catboost import CatBoostClassifier

# Metrics
from sklearn.metrics import accuracy_score, jaccard_score, f1_score, balanced_accuracy_score

title = text2art("PTF", font="3d_diagonal")
print(title)
print("Prototype Training Platform")
print("By Eric Zhang, 2023")
print('-'*100)
warnings.filterwarnings('ignore')
start_time = time.perf_counter()

model_options = {
    'SVC': SVC(),
    'GradientBoosting': GradientBoostingClassifier(n_estimators=100, learning_rate=1.0,max_depth=5, random_state=0),
    'GaussianNB': GaussianNB(),
    'DecisionTree': DecisionTreeClassifier(),
    'KNeighbors': KNeighborsClassifier(n_neighbors=5),
    'AdaBoost': AdaBoostClassifier(),
    'RandomForest': RandomForestClassifier(max_depth=5, n_estimators=10, max_features=1, random_state=42),
    'MLPClassifier': MLPClassifier(alpha=1, max_iter=1000, random_state=42),
    'QuadraticDiscriminantAnalysis': QuadraticDiscriminantAnalysis(),
    'CatBoostClassifier': CatBoostClassifier(verbose=False)
}

model_list_str = ''
for index, i in enumerate(list(model_options.keys())):
    model_list_str += i
    if index != len(model_options)-1:
        model_list_str += ', '

parser = ArgumentParser()
parser.add_argument("-c", '--config', help="Path of Configuration File (.ini)")
parser.add_argument("-a", '--all', action='store_true', help="Select all models")
parser.add_argument('-m','--models', nargs='+', help=f'Model options are: {model_list_str}')
parser.add_argument('-t', '--trials', type=int, help="Number of trials")
parser.add_argument('-g', '--graphs', action="store_true", help="Generate graphs")

args = parser.parse_args()

# read config file
config_path = args.config
config = configparser.ConfigParser()
config.read(config_path)

# get data file location
data_path = config.get('Data', 'CAD')
df = pd.read_csv(data_path)

# generate results directory
script_dir = os.path.dirname(__file__)
results_dir = os.path.join(script_dir, 'Results/')

if not os.path.isdir(results_dir):
    os.makedirs(results_dir)
else:
    shutil.rmtree(results_dir)
    os.makedirs(results_dir)

# get testing models

model_option_names = model_options.keys()

models = {}
if args.all:
    # all models
    models = model_options
else:
    # only use choosen models
    for value in args.models:
        if value not in model_option_names:
            raise Exception(f'Selected model not a available option: {value}')
        models.update({
            value: model_options.get(value)
        })

total = 10
if args.graphs:
    # graph
    total += 10 * args.trials * len(models) + args.trials
else:
    # no graph
    total += 10 * args.trials * len(models)

with Progress() as progress:
    progresstotal = progress.add_task('[green]Progress', total=total)

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
    progress.advance(progresstotal, advance=10)

    full_results = []
    title_row = ['Trial #']
    metrics = ['accuracy', 'balanced accuracy', 'f1 score', 'jaccard score']
    for model_name in models.keys():
        for metric in metrics:
            title_row.append(f'{model_name} - VHD - {metric}')
            title_row.append(f'{model_name} - Cath - {metric}')

    full_results.append(title_row)

    for trial in range(0, args.trials):
        # Generate test and train suites
        progress.update(progresstotal, description="STAGE: Split Data")
        x_train, x_test, y_VHD_train, y_VHD_test = train_test_split(df.iloc[:, 0:11], df.VHD, test_size=0.2)
        _, _, y_cath_train, y_cath_test = train_test_split(df.iloc[:, 0:11], df.Cath, test_size=0.2)

        # predictions and models

        results_VHD = []
        results_Cath = []

        # trial #, accuracy VHD, accuracy Cath, balanced accuracy VHD, balanced accuracy Cath, f1 VHD, f1 Cath, jaccard VHD, jaccard Cath
        trial_stats = [trial] 

        for model_name, model_object in models.items():
            # fit model 
            progress.update(progresstotal, description=f'STAGE: TRIAL {trial}, {model_name}, VHD')
            model_VHD = model_object.fit(x_train, y_VHD_train)
            predictions_VHD = model_VHD.predict(x_test)
            progress.advance(progresstotal, advance=5)

            progress.update(progresstotal, description=f'STAGE: TRIAL {trial}, {model_name}, Cath')
            model_Cath = model_object.fit(x_train, y_cath_train)
            predictions_Cath = model_Cath.predict(x_test)

            trial_stats.append(accuracy_score(predictions_VHD, y_VHD_test))
            trial_stats.append(accuracy_score(predictions_Cath, y_cath_test))
            trial_stats.append(balanced_accuracy_score(predictions_VHD, y_VHD_test))
            trial_stats.append(balanced_accuracy_score(predictions_Cath, y_cath_test))
            trial_stats.append(f1_score(predictions_VHD, y_VHD_test, average="weighted"))
            trial_stats.append(f1_score(predictions_Cath, y_cath_test, average="weighted"))
            trial_stats.append(jaccard_score(predictions_VHD, y_VHD_test, average="weighted"))
            trial_stats.append(jaccard_score(predictions_Cath, y_cath_test, average="weighted"))

            progress.advance(progresstotal, advance=5)
            results_VHD.append(balanced_accuracy_score(predictions_VHD, y_VHD_test))
            results_Cath.append(balanced_accuracy_score(predictions_Cath, y_cath_test))

        full_results.append(trial_stats)

        # Generate graphs?
        if args.graphs:
            progress.update(progresstotal, description=f'STAGE: TRIAL {trial}, Generate Graphs')
            x_axis = list(models.keys())
            y_axis = {
                'VHD': results_VHD,
                'Cath': results_Cath
            }

            x = np.arange(len(x_axis))  # the label locations
            width = 0.3  # the width of the bars
            multiplier = 0


            fig, ax = plt.subplots()
            fig.set_figheight(12)
            fig.set_figwidth(20)

            for attribute, measurement in y_axis.items():
                offset = width * multiplier
                rects = ax.bar(x + offset, measurement, width, label=attribute)
                ax.bar_label(rects, padding=0)

                multiplier += 1
            progress.advance(progresstotal, advance=1)

            # Add some text for labels, title and custom x-axis tick labels, etc.
            ax.set_ylabel('Balanced Accuracy')
            ax.set_xlabel('Model')
            ax.set_title('Balanced Accuracy Scores')
            ax.set_xticks(x + width/2, x_axis)
            ax.legend(loc='best', ncols=2)
            plt.savefig(f'Results/Chart{trial}.png')
            plt.close(fig)

# save stats into csv
metrics_df = pd.DataFrame(full_results)
metrics_df.to_csv('Results/stats.csv', header=False, index=False)

end_time = time.perf_counter()
elapsed_time = end_time - start_time
print('-'*100)
print("Elapsed time: ", elapsed_time)
print(f'Experiment Ended\nResults located in: {os.getcwd()}/Results')