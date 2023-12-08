# Prep
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, MinMaxScaler, OneHotEncoder 
from sklearn.compose import ColumnTransformer

# Utility
import numpy as np
from sklearn.gaussian_process.kernels import RBF
import warnings
import configparser
import os
import shutil
import time 
from art import text2art
from csv import writer

# Arg Parse
from argparse import ArgumentParser

# Visualization
import matplotlib.pyplot as plt

# Progress Bar
from rich.progress import Progress, BarColumn, TimeElapsedColumn, TextColumn, SpinnerColumn

# Models
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
from sklearn.metrics import accuracy_score, precision_score, balanced_accuracy_score

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
    'MLP': MLPClassifier(alpha=2, max_iter=1000, random_state=42),
    'QDA': QuadraticDiscriminantAnalysis(),
    'CatBoost': CatBoostClassifier(iterations=2,
                          learning_rate=1,
                          depth=2, verbose=False),
    'ExtraTrees': ExtraTreesClassifier(),
    'Bagging': BaggingClassifier(),
    'Ridge': RidgeClassifier(),
    'PassiveAggressive': PassiveAggressiveClassifier(),
    'SGDOneClassSVM': SGDOneClassSVM(),
    'Dummy': DummyClassifier(),
    'HistGradientBoosting': HistGradientBoostingClassifier(),
    'LGBM': LGBMClassifier(),
    'XGB': XGBClassifier()
}

predictions_ops = ['cath', 'lad', 'lcx', 'rca', 'vhd', 'rwma']
metrics = ['accuracy', 'balanced accuracy', 'precision', 'time to fit']

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
    total += 10 * args.trials * len(models) * len(predictions_ops) + args.trials
else:
    # no graph
    total += 10 * args.trials * len(models) * len(predictions_ops)

def addlabels(x,y):
    for i in range(len(x)):
        plt.text(0.01 + y[i],i,y[i])

with Progress(SpinnerColumn(), BarColumn(), TimeElapsedColumn(), TextColumn('[green]{task.description}')) as progress:
    progresstotal = progress.add_task('[green]Progress', total=total)

    numerical_columns = ["Age", "Weight", "Length", "BMI", "BP", "PR", "FBS", "CR", "TG", "LDL", "HDL",	"BUN", "ESR", "HB",	"K", "Na", "WBC", "Lymph", "Neut", "PLT", "EF-TTE"]
    categorical_columns = ["Sex", "DM", "HTN", "Current Smoker", "EX-Smoker", "FH", "Obesity", "CRF", "CVA", "Airway disease", "Thyroid Disease", "CHF", "DLP", "Edema", "Weak Peripheral Pulse", "Lung rales", "Systolic Murmur", "Diastolic Murmur", "Typical Chest Pain", "Dyspnea", "Function Class", "Atypical", "Nonanginal", "Exertional CP", "LowTH Ang", "Q Wave", "St Elevation", "St Depression", "Tinversion", "LVH", "Poor R Progression", "VHD", "Cath", "BBB", "LAD", "LCX", "RCA"] 

    preprocessor = ColumnTransformer(transformers = [('ohe',
                                                  OneHotEncoder(handle_unknown = 'ignore',
                                                                       sparse_output = False),
                                                  categorical_columns),
                                                 ('scaler',
                                                  StandardScaler(),
                                                  numerical_columns)],
                                 remainder = 'passthrough',
                                 verbose_feature_names_out = False).set_output(transform = 'pandas')

    y_cath = df['Cath']
    y_lad = df['LAD']
    y_lcx = df['LCX']
    y_rca = df['RCA']
    y_vhd = df['VHD']
    y_rwma = df['Region RWMA']
    df.drop('Cath', axis=1)
    df.drop('LAD', axis=1)
    df.drop('LCX', axis=1)
    df.drop('RCA', axis=1)
    df.drop('VHD', axis=1)
    df.drop('Region RWMA', axis=1)
    x_df = preprocessor.fit_transform(df)
    # Maper
    map_label_cad = {'CAD':1,
                'Normal':0}
    map_label_sub = {
        'Normal': 0, 
        'Stenotic': 1
    }
    map_label_vhd = {
        'N': 0,
        'mild': 1, 
        'Moderate': 2,
        'Severe': 3
    }
    # We map the target variable
    y_cath = y_cath.map(map_label_cad)
    y_lad = y_lad.map(map_label_sub)
    y_lcx = y_lcx.map(map_label_sub)
    y_rca = y_rca.map(map_label_sub)
    y_vhd = y_vhd.map(map_label_vhd)


    ## Data set size
    progress.advance(progresstotal, advance=10)

    full_results = []
    averages = np.zeros((len(predictions_ops), len(metrics), len(models)))

    title_row = ['Trial #']
    for model_name in models.keys():
        for prediction_op in predictions_ops:
            for metric in metrics:
                title_row.append(f'{prediction_op} - {model_name} - {metric}')

    full_results.append(title_row) 

    for trial in range(0, args.trials):
        # Generate test and train suites
        progress.update(progresstotal, description="STAGE: Split Data")
        pred_ops_df = pd.DataFrame({'cath': y_cath, 'lad': y_lad, 'lcx': y_lcx, 'rca': y_rca, 'vhd': y_vhd, 'rwma': y_rwma})
        x_train, x_test, y_train, y_test = train_test_split(x_df, pred_ops_df, test_size=0.2)

        # predictions and models

        trial_stats = [trial]

        for index, (model_name, model_object) in enumerate(models.items()):

            for index2, prediction_op in enumerate(predictions_ops):
                # fit model 
                time_before_fit = time.perf_counter_ns()
                
                model = None
                if model_name == 'LGBM':
                    if prediction_op == 'vhd' or prediction_op == 'rwma':
                        model = LGBMClassifier(objective="multiclass", verbose=-1)
                    else:
                        model = LGBMClassifier(objective="binary", verbose=-1)
                elif model_name == 'XGB':
                    if prediction_op == 'vhd' or prediction_op == 'rwma':
                        model = XGBClassifier(objective="multi:softmax", num_class=4)
                    else:
                        model = XGBClassifier()
                else:
                    model = model_object

                model.fit(x_train, y_train[prediction_op])

                time_after_fit = time.perf_counter_ns()
                time_to_fit = time_after_fit - time_before_fit

                progress.update(progresstotal, description=f'STAGE: TRIAL {trial}, {model_name}, {prediction_op}')

                predictions = model.predict(x_test)
                progress.advance(progresstotal, 5)

                trial_stats.append(accuracy_score(predictions, y_test[prediction_op]))
                trial_stats.append(balanced_accuracy_score(predictions, y_test[prediction_op]))
                trial_stats.append(precision_score(predictions, y_test[prediction_op], average="weighted"))
                trial_stats.append(time_to_fit)

                progress.advance(progresstotal, advance=5)
                averages[index2][0][index] += accuracy_score(predictions, y_test[prediction_op])
                averages[index2][1][index] += balanced_accuracy_score(predictions, y_test[prediction_op])
                averages[index2][2][index] += precision_score(predictions, y_test[prediction_op], average="weighted")
                averages[index2][3][index] += time_to_fit

        full_results.append(trial_stats)
        
    for i in range(len(averages)):
        for j in range(len(averages[0])):
            for k in range(len(averages[0][0])):
                averages[i][j][k] /= args.trials 

    # Generate graphs?
    if args.graphs:
        metric_names_graphs= ['Accuracy', 'Balanced Accuracy', 'Precision', 'Time To Fit (NS)']
        progress.update(progresstotal, description=f'STAGE: TRIAL {trial}, Generate Graphs')

        for index, metric_names_graph in enumerate(metric_names_graphs):
            for index2, prediction_op in enumerate(predictions_ops):
                x_axis = list(models.keys())
                y_axis = averages[index2][index]

                data = pd.DataFrame(
                    dict(
                        models=x_axis,
                        balanced_accuracy=y_axis
                    )
                )

                data = data.sort_values('balanced_accuracy')
                
                plt.figure(figsize=(30, 20))
                plt.barh(list(data['models']), list(data['balanced_accuracy']), height=0.8)

                addlabels(list(data['models']), list(data['balanced_accuracy']))

                plt.title(f'Average {metric_names_graph}')
                plt.ylabel("Model")
                plt.xlabel(metric_names_graph)
                plt.margins(x=0.1)

                # Add some text for labels, title and custom x-axis tick labels, etc.
                plt.savefig(f'Results/{metric_names_graph}_{prediction_op}.png')

# save stats into csv
with open(f'Results/stats.csv',"w+") as my_csv:
    csvWriter = writer(my_csv,delimiter=',')
    csvWriter.writerows(full_results)
    my_csv.close()

end_time = time.perf_counter()
elapsed_time = end_time - start_time
print('-'*100)
print("Elapsed time: ", elapsed_time)
print(f'Experiment Ended\nResults located in: {os.getcwd()}/Results')