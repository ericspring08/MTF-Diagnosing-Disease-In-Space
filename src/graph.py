import pandas as pd
import matplotlib.pyplot as plt
from statistics import mean
from rich.progress import Progress
from datetime import datetime
import os


def graph(args):
    output_location = args.output
    # Create folder if doesn't exist 
    if not os.path.exists(output_location):
        os.makedirs(output_location)

    with Progress() as progress:
        def generate_rank_graphs(df):
            plt.figure(figsize=(20, 10))
            outputs = df['output'].unique()

            # Go through every output
            for output in outputs:
                df_output = df[df['output'] == output]

                # Go through every metric
                for metric in df_output['metric'].unique():
                    curr_time = datetime.now().strftime("%H:%M:%S")
                    progress.console.print(f'[{curr_time}] Rank Graph - {output} - {metric}')
                    df_metric = df_output[df_output['metric'] == metric]

                    models = df_metric['model'].unique()
                    values = []
                    # Go through every model
                    for model in df_metric['model'].unique():
                        df_model = df_metric[df_metric['model'] == model]

                        # Get the average of all the individual results of every trial of that model, output, metric combination
                        value = [n.strip() for n in df_model['value'].values[0][1:-1].split(',')]
                        # Convert string values to float
                        value = [float(n) for n in value]
                        values.append(mean(value))

                    # Sort the values and models
                    values, models = zip(*sorted(zip(values, models)))

                    # Plot the bar
                    plt.title(f'{output} - {metric}')
                    plt.barh(models, values, label=metric)
                    for i, v in enumerate(values):
                        plt.text(v, i, str(round(v, 5)), color='black', fontweight='bold')
                    # Ticks in smaller intervals
                    plt.grid(axis='x')
                    plt.xlabel(metric)
                    plt.ylabel('Model')
                    plt.savefig(os.path.join(output_location, f'{output}_{metric}.png'))
                    plt.clf()
                    progress.update(main_task, advance=1/len(outputs)/len(df_metric['metric'].unique()))

        main_task = progress.add_task("[red]Graphing Results", total=1)
        # TODO: Implement graphing of results.csv file
        # Read in results.csv file
        df = pd.read_csv(args.file)

        # Generate graphs
        generate_rank_graphs(df)
        

        