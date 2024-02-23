import pandas as pd
import matplotlib.pyplot as plt
from statistics import mean, stdev
from rich.progress import Progress, TimeElapsedColumn, SpinnerColumn
from datetime import datetime
import os
import argparse
from src.utils import print_header

print_header()

parser = argparse.ArgumentParser(
    description='Graph the results of the trials')

parser.add_argument('-f', '--file', type=str, required=True,
                    help='The file containing the results of the trials')


parser.add_argument('-o', '--output', type=str, required=True,
                    help='The folder to output the graphs to')
args = parser.parse_args()


output_location = args.output
df = pd.read_csv(args.file)
total_tasks = 0

# Create folder if doesn't exist
if not os.path.exists(output_location):
    os.makedirs(output_location)


total_tasks += len(df['output'].unique()) * len(df['metric'].unique())
if not os.path.exists(os.path.join(output_location, 'rankings')):
    os.makedirs(os.path.join(output_location, 'rankings'))
    # Create folder for every output
    for output in df['output'].unique():
        if not os.path.exists(os.path.join(output_location, 'rankings', output)):
            os.makedirs(os.path.join(
                output_location, 'rankings', output))

with Progress(
    SpinnerColumn(),
    *Progress.get_default_columns(),
    TimeElapsedColumn()
) as progress:
    main_task = progress.add_task(
        "[red]Graphing Results", total=total_tasks)

    def generate_rank_graphs(data, output_location, progress, main_task):
        combine_trials = dict()

        # loop through all rows
        for index, row in data.iterrows():
            # pass if value is nan
            if pd.isna(row['value']):
                continue

            # Get the key for the dictionary
            key = f"{row['output']}*{row['metric']}*{row['model']}"
            # Check if key exists
            if key in combine_trials:
                # Add the value to the litt of values
                combine_trials[key].append(row['value'])
            else:
                # Create a new list with the value
                combine_trials[key] = [row['value']]

        # get mean of each
        processed_trials = dict()

        # Go through every key

        for key in combine_trials:
            # Get the output, metric, model from the key
            output, metric, model = key.split('*')

            mean_values = mean(combine_trials[key])
            try:
                stdev_values = stdev(combine_trials[key])
            except:
                stdev_values = 0.001
            # create the key if it doesn't exist
            if output not in processed_trials:
                processed_trials[output] = dict()
            if metric not in processed_trials[output]:
                processed_trials[output][metric] = list()

            processed_trials[output][metric].append(
                (model, mean_values, stdev_values))

        for output in processed_trials:
            for metric in processed_trials[output]:
                print(f'Ranking Graph - {output} - {metric}')
                # sort by means
                processed_trials[output][metric].sort(
                    key=lambda x: x[1], reverse=False)

                models, means, stdevs = zip(*processed_trials[output][metric])
                graph_model_metric(models, means, stdevs,
                                   metric, output, output_location)
                progress.update(main_task, advance=1)

    def graph_model_metric(models, means, stdevs, metric, output, output_location):
        plt.figure(figsize=(20, 10))
        plt.rcParams.update({'axes.titlesize': 22})
        # bold the title
        # bold the x and y labels
        plt.rcParams.update({'axes.labelweight': 'bold'})
        plt.rcParams.update({'axes.titleweight': 'bold'})
        # increase size of title
        plt.title(f'{output} - {metric}')
        # make sure y label is not cut off
        plt.barh(models, means, xerr=stdevs)
        # increase size of xerr bar
        plt.errorbar(means, models, xerr=stdevs, fmt='o',
                     ecolor='black', elinewidth=2, capsize=4)
        plt.xlabel(metric)
        plt.ylabel('Model')
        # text labels
        for index, value in enumerate(means):
            # check if positive or negative
            # increase the text size
            plt.text(value, index + 0.2, str(round(value, 5)), fontsize=14)
        plt.grid()
        plt.savefig(os.path.join(
            output_location, 'rankings', output, f'{output}_{metric}.png'))
        plt.clf()

generate_rank_graphs(df, output_location, progress, main_task)
