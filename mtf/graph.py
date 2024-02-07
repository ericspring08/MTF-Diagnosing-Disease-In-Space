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

parser.add_argument('-d', '--distribution', action='store_true',
                    help='Graph the distributions of the results')
parser.add_argument('-r', '--ranking', action='store_true',
                    help='Graph the rankings of the results')

args = parser.parse_args()


output_location = args.output
df = pd.read_csv(args.file)
total_tasks = 0

# Create folder if doesn't exist
if not os.path.exists(output_location):
    os.makedirs(output_location)
if args.distribution:
    total_tasks += len(df['output'].unique()) * \
        len(df['metric'].unique()) * len(df['model'].unique())
    if not os.path.exists(os.path.join(output_location, 'distributions')):
        os.makedirs(os.path.join(output_location, 'distributions'))
        # Create folder for every output
        for output in df['output'].unique():
            if not os.path.exists(os.path.join(output_location, 'distributions', output)):
                os.makedirs(os.path.join(
                    output_location, 'distributions', output))
            # Create folder for every metric
            for metric in df['metric'].unique():
                if not os.path.exists(os.path.join(output_location, 'distributions', output, metric)):
                    os.makedirs(os.path.join(output_location,
                                'distributions', output, metric))

if args.ranking:
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
    def generate_distribution_graphs(data):
        plt.figure(figsize=(20, 10))
        # Generate histogram for combination of output, metric, model
        outputs = data['output'].unique()
        # Go through every output
        for output in outputs:
            df_output = data[data['output'] == output]

            # Go through every metric
            for metric in df_output['metric'].unique():
                print(f'Distribution Graph - {output} - {metric}')
                df_metric = df_output[df_output['metric'] == metric]

                # Go through every model
                for model in df_metric['model'].unique():
                    df_model = df_metric[df_metric['model'] == model]
                    try:
                        # Get the average of all the individual results of every trial of that model, output, metric combination
                        value = [
                            n.strip() for n in df_model['value'].means[0][1:-1].split(',')]
                        # Convert string means to float
                        value = [float(n) for n in value]
                        # Plot the histogram
                        plt.title(f'{output} - {metric} - {model}')
                        plt.hist(value, bins=20)
                        plt.xlabel(metric)
                        plt.ylabel('Frequency')
                        plt.grid()
                        plt.savefig(os.path.join(
                            output_location, 'distributions', output, metric, f'{output}_{metric}_{model}.png'))
                        plt.clf()
                        progress.update(main_task, advance=1)
                    except:
                        progress.update(main_task, advance=1)

    main_task = progress.add_task(
        "[red]Graphing Results", total=total_tasks)

    def generate_rank_graphs(data, output_location, progress, main_task):
        combine_trials = dict()

        # loop through all rows
        for index, row in data.iterrows():
            if row['value'] == None:
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
        plt.figure(figsize=(20, 20))
        plt.title(f'{output} - {metric}')
        plt.barh(models, means, xerr=stdevs)
        # increase size of xerr bar
        plt.errorbar(means, models, xerr=stdevs, fmt='o',
                     ecolor='black', elinewidth=2, capsize=4)
        plt.xlabel(metric)
        plt.ylabel('Model')
        # make ticks for every 0.1
        plt.xticks([i/10 for i in range(0, 11)])
        # text labels
        for index, value in enumerate(means):
            plt.text(value, index + 0.2, str(round(value, 5)))
        plt.grid()
        plt.savefig(os.path.join(
            output_location, 'rankings', output, f'{output}_{metric}.png'))
        plt.clf()

    # Generate graphs
    if args.ranking:
        generate_rank_graphs(df, output_location, progress, main_task)
    if args.distribution:
        generate_distribution_graphs(df)
