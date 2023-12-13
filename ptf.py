# Imports
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

# Metrics
from sklearn.metrics import accuracy_score, precision_score, balanced_accuracy_score

# Import Utilities
from src.utils import *

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

if args.config:
    config = configparser.ConfigParser()
    config.read(args.config)

data_set_path = config.get("Locations", "Dataset")
results_path = config.get("Locations", "Results")
outputs = list(config.get("Dataset", "Outputs").split(","))[0]

# Create Results Folder if it doesn't exist
if not os.path.exists(results_path):
    os.makedirs(results_path)

models = {}

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
dataset = pd.read_csv(data_set_path)
print(dataset.head())