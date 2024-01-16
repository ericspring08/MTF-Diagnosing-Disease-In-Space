import os
import pickle
from models import model_options
import pandas as pd
from datetime import datetime


class ModelResults:
    results = {}

    def __init__(self, models, outputs, metrics, x_dataset, y_dataset):
        self.x_dataset = x_dataset
        self.y_dataset = y_dataset
        for model in models:
            self.results[model] = {}
            for output in outputs:
                self.results[model][output] = {}
                for metric in metrics:
                    self.results[model][output][metric] = []

    def add_result(self, model, output, metric, value):
        self.results[model][output][metric].append(value)

    def get_results(self):
        return self.results

    def save_results_averages_csv(self, path):
        for model in self.results:
            for output in self.results[model]:
                for metric in self.results[model][output]:
                    if len(self.results[model][output][metric]) == 0:
                        self.results[model][output][metric] = 0
                    else:
                        self.results[model][output][metric] = sum(
                            self.results[model][output][metric]) / len(self.results[model][output][metric])
        df = pd.DataFrame.from_dict(self.results)
        df.to_csv(path, index=False)

    def save_results_raw_csv(self, path):
        raw_results = []
        # combine columns for output and model into one column
        for model in self.results:
            for output in self.results[model]:
                for metric in self.results[model][output]:
                    raw_results.append(
                        [model, output, metric, self.results[model][output][metric]])
        df = pd.DataFrame.from_dict(raw_results, orient='columns')
        df.to_csv(path, header=['model', 'output',
                  'metric', 'value'], index=False)

    def save_models(self, path):
        # Create folders
        if not os.path.exists(path):
            os.makedirs(path)

        # Loop through models
        for model in self.results:
            # Loop through outputs
            for output in self.results[model]:
                # Train the model for the model and output with all of the data
                print(f"Saving {model} on {output}")
                try:
                    training_model = model_options[model]
                    training_model.fit(self.x_dataset, self.y_dataset[output])
                    # Create folder is doesn't exist
                    if not os.path.exists(os.path.join(path, model)):
                        os.makedirs(os.path.join(path, model))
                    if not os.path.exists(os.path.join(path, model, output)):
                        os.makedirs(os.path.join(path, model, output))
                    # Save the model
                    with open(os.path.join(path, model, output, f"{model}-{output}.pkl"), 'wb') as f:
                        pickle.dump(training_model, f)
                except Exception as e:
                    print(
                        f"[{datetime.now().strftime('%H:%M:%S')}] Error with {model} on {output}, {e}")

    def save_model(self, model, path):
        # Create if don't exist
        if not os.path.exists(os.path.dirname(path)):
            os.makedirs(os.path.dirname(path))
        pickle.dump(model, open(path, "wb"))
