import pandas as pd
import matplotlib.pyplot as plt
from statistics import mean, stdev
from rich.progress import Progress, TimeElapsedColumn, SpinnerColumn
from datetime import datetime
import os

def graph(args):
    output_location = args.output
    df = pd.read_csv(args.file)
    total_tasks = 0

    # Create folder if doesn't exist
    if not os.path.exists(output_location):
        os.makedirs(output_location)
    if args.distribution:
        total_tasks += len(df['output'].unique()) * len(df['metric'].unique()) * len(df['model'].unique())
        if not os.path.exists(os.path.join(output_location, 'distributions')):
            os.makedirs(os.path.join(output_location, 'distributions'))
            # Create folder for every output
            for output in df['output'].unique():
                if not os.path.exists(os.path.join(output_location, 'distributions', output)):
                    os.makedirs(os.path.join(output_location, 'distributions', output))
                # Create folder for every metric
                for metric in df['metric'].unique():
                    if not os.path.exists(os.path.join(output_location, 'distributions', output, metric)):
                        os.makedirs(os.path.join(output_location, 'distributions', output, metric))

    if args.ranking:
        total_tasks += len(df['output'].unique()) * len(df['metric'].unique())
        if not os.path.exists(os.path.join(output_location, 'rankings')):
            os.makedirs(os.path.join(output_location, 'rankings'))
            # Create folder for every output
            for output in df['output'].unique():
                if not os.path.exists(os.path.join(output_location, 'rankings', output)):
                    os.makedirs(os.path.join(output_location, 'rankings', output))

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
                            value = [n.strip() for n in df_model['value'].means[0][1:-1].split(',')]
                            # Convert string means to float
                            value = [float(n) for n in value]
                            # Plot the histogram
                            plt.title(f'{output} - {metric} - {model}')
                            plt.hist(value, bins=20)
                            plt.xlabel(metric)
                            plt.ylabel('Frequency')
                            plt.grid()
                            plt.savefig(os.path.join(output_location, 'distributions', output, metric, f'{output}_{metric}_{model}.png'))
                            plt.clf()
                        except Exception as e:
                            print(f"{datetime.now().strftime('%H:%M:%S')} {e}")
                        progress.update(main_task, advance=1)

        def generate_rank_graphs(data):
            plt.figure(figsize=(20, 20))
            outputs = data['output'].unique()

            # Go through every output
            for output in outputs:
                df_output = data[data['output'] == output]

                # Go through every metric
                for metric in df_output['metric'].unique():
                    print(f'Rank Graph - {output} - {metric}')
                    df_metric = df_output[df_output['metric'] == metric]

                    models = []
                    raw = []
                    means = []
                    stdevs = []
                    # Go through every model
                    for model in df_metric['model'].unique():
                        df_model = df_metric[df_metric['model'] == model]

                        # Get the average of all the individual results of every trial of that model, output, metric combination
                        value = [n.strip() for n in df_model['value'].values[0][1:-1].split(',')]
                        # Convert string means to float
                        if value[0] != '':
                            value = [float(n) for n in value]
                            raw.append(value)
                            means.append(mean(value))
                            stdevs.append(stdev(value))
                            models.append(model)
                        else:
                            means.append(0)
                            stdevs.append(0)
                            models.append(model)

                    # Sort the means and models
                    means, models = zip(*sorted(zip(means, models)))

                    # Plot the bar
                    plt.title(f'{output} - {metric}')
                    plt.barh(models, means, label=metric)
                    for i, v in enumerate(means):
                        if v == 0:
                            plt.text(0, i, str("Model could not be executed"), color='red', fontweight='bold')
                        else:
                            plt.text(v, i, str(round(v, 5)), color='black', fontweight='bold')
                    # Ticks in smaller intervals
                    plt.grid(axis='x')
                    plt.xlabel(metric)
                    plt.ylabel('Model')
                    plt.savefig(os.path.join(output_location, 'rankings', output, f'{output}_{metric}_mean.png'))
                    plt.clf()

                    # Generate a graph for the deviation of the means
                    stdevs, models = zip(*sorted(zip(stdevs, models)))
                    plt.barh(models, stdevs, label=metric)
                    for i, v in enumerate(means):
                        if v == 0:
                            plt.text(0, i, str("Model could not be executed"), color='red', fontweight='bold')
                        else:
                            plt.text(v, i, str(round(v, 5)), color='black', fontweight='bold')
                    # Ticks in smaller intervals
                    plt.grid(axis='x')
                    plt.xlabel(metric)
                    plt.ylabel('Model')
                    plt.title(f'{output} - {metric} - Deviation')
                    plt.savefig(os.path.join(output_location, 'rankings', output, f'{output}_{metric}_deviation.png'))
                    plt.clf()

                    progress.update(main_task, advance=1)

        main_task = progress.add_task("[red]Graphing Results", total=total_tasks)

        # Generate graphs
        if args.ranking:
            generate_rank_graphs(df)
        if args.distribution:
            generate_distribution_graphs(df)