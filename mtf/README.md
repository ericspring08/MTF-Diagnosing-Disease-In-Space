# MTF: A framework for evaluating machine learning models
This folder contains the 

## Installation & Setup
1. Install [Python 3.6](https://www.python.org/downloads/release/python-360/)
2. Clone this repository
3. Run `source setup.sh` to install the required packages (make sure you have virtualenv installed)
4. Run source env/bin/activate to activate the virtual environment
5. Install [Docker](https://docs.docker.com/engine/install/)

## Running the Experiment
Create a configuration file and in the root directory, run this command to start the experiment.
```bash
  python3 run_exp.py --config [config path]
```

## Configuration File
### Format
```json
  {
    "location": {
      "dataset": [Dataset Location],
      "results": [Results Location]
    },
    "experiment": {
      "metrics": [Metrics to evaluate],
      "outputs": [Names of the output columns],
      "numerical": [Names of the numerical columns],
      "categorical": [Names of the categorical columns],
      "models": [Models to evaluate],
      "trials": [Number of trials],
      "tuning_iterations": [Number of tuning iterations],
      "sample_size": [Sample size (number of rows)]
    },
    "outputs": {
      [column name of target]: {
        [target in dataset]: [number (1, 0)]
      }
    }
  }
```
### Example Configuration
```json
{
  "location": {
    "dataset": "/Users/ericzhang/Desktop/Code/NasaHunch23/mtf/data/hdd.csv",
    "results": "/Users/ericzhang/Desktop/Code/NasaHunch23/mtf/results/hdd_results/"
  },
  "experiment": {
    "metrics": [
      "accuracy",
      "precision",
      "recall",
      "f1",
      "train_time",
      "predict_time",
      "logloss",
      "shscore",
      "roc_auc",
      "balanced_accuracy",
      "jaccard"
    ],
    "outputs": [
      "target"
    ],
    "numerical": [
      "age",
      "trestbps",
      "thalach",
      "oldpeak"
    ],
    "categorical": [
      "sex",
      "cp",
      "fbs",
      "restecg",
      "exang",
      "slope",
      "ca",
      "thal"
    ],
    "models": "all",
    "trials": 5,
    "tuning_iterations": 32,
    "sample_size": 100
  },
  "outputs": {}
}
```
