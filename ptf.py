# Imports
from pprint import pprint
# Prep
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
import json

# Arg Parse
from argparse import ArgumentParser

# Visualization
import matplotlib.pyplot as plt

# Metrics
from sklearn.metrics import accuracy_score, precision_score, balanced_accuracy_score

# Import Utilities
from src.utils import *
from models import *

# Import Main Loop
from src.loop import *

title = text2art("PTF", font="3d_diagonal")
print(title)
print("Prototype Training Platform")
print("By Eric Zhang, 2023")
print('-'*100)
warnings.filterwarnings('ignore')
start_time = time.perf_counter()

# Parser
parser = ArgumentParser()

parser.add_argument("-c", "--config", dest="config", help="Specify a config file to use", metavar="FILE")

args = parser.parse_args()

config = json.load(open(args.config))

# Config
dataset_path = config["location"]["dataset"]
results_path = config["location"]["results"]
outputs_selection = config["experiment"]["outputs"]
metrics_selection = config["experiment"]["metrics"]
categorical_features = config["experiment"]["categorical"]
numerical_features = config["experiment"]["numerical"]
trials = config["experiment"]["trials"]
models_selection = config["experiment"]["models"]

# Create Results Folder if it doesn't exist
if not os.path.exists(results_path):
    os.makedirs(results_path)

# Model Selection
models_to_use = {}
if models_selection == "all" or models_selection == "All":
    models_selection = list(model_options.keys())
for value in models_selection:
    if value not in model_options:
        print(f"Model {value} not found. Please check your spelling and try again.")
        exit()
    models_to_use[value] = model_options[value]

# Make Calculations about the progress bar
total = trials

# Load Data
dataset = pd.read_csv(dataset_path)

# Get Outputs extracted and remove after
outputs = {}
for value in outputs_selection:
    outputs[value] = dataset[value]

dataset = dataset.drop(outputs_selection, axis=1)

# Normalize Inputs
preprocessor = ColumnTransformer(transformers = [('ohe',
                                                OneHotEncoder(handle_unknown='ignore',
                                                                sparse_output=False),
                                                categorical_features),
                                                ('scaler',
                                                StandardScaler(),
                                                numerical_features)],
                                remainder='passthrough',
                                verbose_feature_names_out=False).set_output(transform = 'pandas')
x_dataset = preprocessor.fit_transform(dataset)

# Map the outputs to dictionary
for key, value in config['outputs'].items():
    outputs[key] = outputs[key].map(value)

# Main Loop
data_results = main_loop(x_dataset, outputs, models_to_use, metrics_selection, trials, results_path)

# Print Ending Message
print('-'*100)
print(f"Finished in {time.perf_counter() - start_time} seconds.")
print("Results saved to results.csv")
print('-'*100)