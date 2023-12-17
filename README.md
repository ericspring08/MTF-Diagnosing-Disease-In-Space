# PTF: A framework for evaluating machine learning models

## Installation
1. Install [Python 3.6](https://www.python.org/downloads/release/python-360/)
2. Clone this repository
3. Run `source setup.sh` to install the required packages (make sure you have virtualenv installed)
4. Run source env/bin/activate to activate the virtual environment

## Usage
This framework is split into subcommands:
1. 'experiment' - run an experiment based on a config file
2. 'graph' - graph the results of an experiment
### Experiment
Experiment Subcommand run the experiment based on the config.json file
```
python ptf.py experiment ./config.json
```
### Graph
Graph Subcommand graphs the results of an experiment
<br>
*Must use the results_raw.csv produced from the experiment*
```
python ptf.py graph ./results_raw.csv -o ./output_graph_folder
```