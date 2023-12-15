# PTF: A framework for evaluating machine learning models

## Installation
1. Install [Python 3.6](https://www.python.org/downloads/release/python-360/)
2. Clone this repository
3. Run `source setup.sh` to install the required packages (make sure you have virtualenv installed)
4. Run source env/bin/activate to activate the virtual environment

## Usage
### Experiment
Experiment Subcommand run the experiment based on the config.json file
```
python ptf.py experiment ./configs/cad_config.json
```