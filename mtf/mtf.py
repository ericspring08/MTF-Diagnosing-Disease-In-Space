# Imports
# Prep

# Utility
import warnings
from art import text2art
import time

# Arg Parse
from argparse import ArgumentParser

# Import SubModules
from src.quickanalysis import *
from src.graph import *
from src.loop import MTF
import builtins
from datetime import datetime

from rich.progress import Progress, TimeElapsedColumn, SpinnerColumn, BarColumn, TextColumn, TaskProgressColumn
from rich import print

title = text2art("MTF", font="3d_diagonal")
print(title)
print("Model Training Platform")
print("By Eric Zhang, 2023")
print('-' * 100)
warnings.filterwarnings('ignore')
start_time = time.perf_counter()

# All prints have a timestamp
_print = print
def time_print(*args, **kwargs):
    curr_time = datetime.now().strftime("%H:%M:%S")
    _print(f"[{curr_time}]", *args, **kwargs)

builtins.print = time_print


# Experiment
def experiment(args):
    for config in args.config:
        print(f"Running experiment {config}")
        with Progress(SpinnerColumn(), TextColumn(text_format="[progress.description]{task.description}"), BarColumn(), TaskProgressColumn(), TimeElapsedColumn()) as progress:
            mtf = MTF(config)
            mtf.set_progress(progress)
            mtf.run()
        print('-' * 100)


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
parser_graph.add_argument("-r", "--ranking", help="Generate ranking graphs", action="store_true")
parser_graph.add_argument("-d", "--distribution", help="Generate distribution graphs", action="store_true")
parser_graph.set_defaults(func=graph)

parser_quickanalysis = subparsers.add_parser("quickanalysis", help="Quick statistics of a results file")
parser_quickanalysis.add_argument("file", help="Specify a results file to analyze")
parser_quickanalysis.add_argument("-o", "--output", help="Specify an output file to save to")

parser_quickanalysis.set_defaults(func=quickanalysis)

args = parser.parse_args()

args.func(args)