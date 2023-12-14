# Imports
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

# Progress Bar
from rich.progress import Progress, BarColumn, TimeElapsedColumn, TextColumn, SpinnerColumn

# Metrics
from sklearn.metrics import accuracy_score, precision_score, balanced_accuracy_score

# Import Utilities
from src.utils import *

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
parser.add_argument("-m", "--models", nargs="+", help="Specify a model to use", metavar="MODEL")

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

# Create Results Folder if it doesn't exist
if not os.path.exists(results_path):
    os.makedirs(results_path)

models = model_options

# Model Selection
if args.models:
    model_picked = args.models
    for value in model_picked:
        if value not in model_options:
            print(f"Model {value} not found. Please check your spelling and try again.")
            exit()
        models[value] = model_options[value]
else:
    models = model_options

# Make Calculations about the progress bar
total = 0

# Load Data
dataset = pd.read_csv(dataset_path)

# Get Outputs extracted and remove after
outputs = {}
for value in outputs_selection:
    outputs[value] = dataset[value]

dataset = dataset.drop(outputs_selection, axis=1)

# Normalize Inputs
scaler = StandardScaler()
onehot = OneHotEncoder(handle_unknown = 'ignore',
                       sparse_output = False)

preprocessor = ColumnTransformer(
    transformers=[
        ("scaler", scaler, numerical_features),
        ("ohe", onehot, categorical_features)
    ],
    remainder="passthrough",
    verbose_feature_names_out=False
).set_output(transform="pandas")

dataset = preprocessor.fit_transform(dataset)

# Map the outputs
for key, value in config['outputs'].items():
    outputs[key] = outputs[key].map(config["outputs"][key])

# Main Loop
data_results = main_loop(dataset, outputs, models, metrics_selection, trials)