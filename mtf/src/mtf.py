# Imports
# Prep

# Utility
import warnings

# Arg Parse
from argparse import ArgumentParser

# Import SubModules
from loop import MTF
from utils import print_header, enable_tagged_print

print_header()
# Enable Tagged Print
enable_tagged_print()


# Experiment
def experiment(args):
    print(f"Running experiment {args.config}")
    mtf = MTF(args.config, args.dataset)
    mtf.run()
    print('-' * 100)


# Parser
parser = ArgumentParser(description="Prototype Training Platform")

# Subcommand for analysis
parser.add_argument(
    "-c", "--config", help="Specify an experiment config file (.json) to run",
)
parser.add_argument(
    "-d", "--dataset", help="Specify a dataset to use")

parser.set_defaults(func=experiment)

args = parser.parse_args()

args.func(args)
