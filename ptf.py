# Imports
from pprint import pprint
# Prep
from sklearn.preprocessing import StandardScaler, MinMaxScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer

# Utility
import warnings
import os
import shutil
import time
from art import text2art
import json

# Arg Parse
from argparse import ArgumentParser

# Import SubModules
from src.loop import *
from src.quickanalysis import *
from src.graph import *

title = text2art("PTF", font="3d_diagonal")
print(title)
print("Prototype Training Platform")
print("By Eric Zhang, 2023")
print('-'*100)
warnings.filterwarnings('ignore')
start_time = time.perf_counter()

# Experiment
def experiment(args):
    for config in args.config:
        print(f"Running experiment {config}")
        run_experiment(config)
        print('-'*100)
def run_experiment(config_path):
    # Load Config
    try:
        config = json.load(open(config_path))
    except:
        raise FileExistsError("Error loading config file. Please check your spelling and try again.")

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
    preprocessor = ColumnTransformer(
        transformers =
            [('ohe',
                OneHotEncoder(handle_unknown='infrequent_if_exist', sparse_output=False),
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
    data_results = main_loop(x_dataset, outputs, models_to_use, metrics_selection, trials, results_path, config_path)

    # Print Ending Message
    print(f"Finished in {time.perf_counter() - start_time} seconds.")
    print(f"Results saved to {os.path.join(results_path, 'results.csv')}")
    print('-'*100)

# Parser
parser = ArgumentParser(description="Prototype Training Platform")
subparsers = parser.add_subparsers(dest="command")

# Subcommand for analysis
parser_experiment = subparsers.add_parser("experiment", help="Run an experiment")
parser_experiment.add_argument("config", help="Specify an experiment config file (.json) to run", nargs="+")
parser_experiment.set_defaults(func=experiment)

parser_graph = subparsers.add_parser("graph", help="Analyze a results file")
parser_graph.add_argument("file", help="Specify a results file to analyze")
parser_graph.add_argument("-o", "--output", help="Specify an output folder to save to")
parser_graph.set_defaults(func=graph)

parser_quickanalysis = subparsers.add_parser("quickanalysis", help="Quick statistics of a results file")
parser_quickanalysis.add_argument("file", help="Specify a results file to analyze")
parser_quickanalysis.add_argument("-o", "--output", help="Specify an output file to save to")
parser_quickanalysis.set_defaults(func=quickanalysis)

args = parser.parse_args()

args.func(args)