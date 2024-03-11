import os
import pickle
import pandas as pd


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
                    self.results[model][output][metric] = None

    def add_result(self, model, output, metric, value):
        self.results[model][output][metric] = value

    def save_results_raw_csv(self, path):
        raw_results = []
        # convert to rows
        for model in self.results:
            for output in self.results[model]:
                for metric in self.results[model][output]:
                    raw_results.append(
                        [model, output, metric, self.results[model][output][metric]])
        df = pd.DataFrame.from_dict(raw_results, orient='columns')
        # create /results folder if doesn't exist
        if not os.path.exists(os.path.dirname(path)):
            os.makedirs(os.path.dirname(path))
        df.to_csv(path, header=['model', 'output',
                  'metric', 'value'], index=False)
        print(self.results)

    def save_model(self, model, path):
        # Create if don't exist
        if not os.path.exists(os.path.dirname(path)):
            os.makedirs(os.path.dirname(path))
        pickle.dump(model, open(path, "wb"))
        print('Model saved to', path)

    def save_perf_curve(self, perf, path):
        # save array to csv
        # Create if don't exist
        if not os.path.exists(os.path.dirname(path)):
            os.makedirs(os.path.dirname(path))
        pd.DataFrame(perf, columns=['shscore']).to_csv(
            path, header=True, index=False)
        print('Performance curve saved to', path)
