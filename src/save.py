import pandas as pd

class ModelResults:
    results = {}

    def __init__(self, models, outputs, metrics):
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
                    self.results[model][output][metric] = sum(self.results[model][output][metric]) / len(self.results[model][output][metric])
        df = pd.DataFrame.from_dict(self.results)
        df.to_csv(path, index=False)

    def save_results_raw_csv(self, path):
        raw_results = []
        # combine columns for output and model into one column
        for model in self.results:
            for output in self.results[model]:
                for metric in self.results[model][output]:
                    raw_results.append([model, output, metric, self.results[model][output][metric]])
        df = pd.DataFrame.from_dict(raw_results, orient='columns')
        df.to_csv(path, header=['model', 'output', 'metric', 'value'], index=False)