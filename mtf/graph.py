import pandas as pd
import matplotlib.pyplot as plt
from statistics import mean, stdev
import os
import argparse
from src.utils import print_header
import numpy as np
from scipy.optimize import curve_fit

print_header()

parser = argparse.ArgumentParser(
    description='Graph the results of the trials')

parser.add_argument('-f', '--folder', type=str, required=True,
                    help='The folder containing the results of the trials')


parser.add_argument('-o', '--output', type=str, required=True,
                    help='The folder to output the graphs to')

parser.add_argument('-r', '--rankings', action="store_true", required=False,)
parser.add_argument('-c', '--cvcurve', action="store_true", required=False,)
args = parser.parse_args()


output_location = args.output
total_tasks = 0

# Create folder if doesn't exist
if not os.path.exists(output_location):
    os.makedirs(output_location)


def generate_rank_graphs(data, output_location):
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
    # create the folder if it doesn't exists
    if not os.path.exists(os.path.join(output_location, 'rankings', output)):
        os.makedirs(os.path.join(output_location, 'rankings', output))
    plt.savefig(os.path.join(
        output_location, 'rankings', output, f'{output}_{metric}.png'))
    plt.clf()


def generate_learning_curve(results_folder, output_location):
    # loop through trials in output folder
    subfolders = [f.path for f in os.scandir(
        results_folder) if f.is_dir()]

    for subfolder in subfolders:
        if 'aggregate' in subfolder:
            continue

        print(f'Ranking Curve - {subfolder}')

        # go through all the files in the subfolder cv_results
        for root, dirs, files in os.walk(os.path.join(subfolder, 'cv_results')):
            for file in files:
                if file.endswith('.csv'):
                    df = pd.read_csv(os.path.join(root, file))
                    file_title = file.split('.')[0]
                    trial_number = root.split('/')[-3]
                    # insert cv_results into the path of the output output_location
                    graph_learning_curve(
                        file_title, df, os.path.join(output_location, 'cv_results', trial_number, file_title.split('_')[1]))


def logistic_objective(x, a, b, c):
    return c / (1 + a * np.exp(-b * x))


def graph_learning_curve(file_title, data, output_location):

    plt.figure(figsize=(20, 10))
    plt.rcParams.update({'axes.titlesize': 22})

    x_axis = np.arange(len(data['mean_test_score']))
    y_axis_test = data['mean_test_score']
    y_axis_train = data['mean_train_score']

    # graph the learning Curve logistic regression
    popt_test, pcov_test = curve_fit(
        logistic_objective, np.arange(len(y_axis_test)), y_axis_test)

    # popt_train, pcov_train = curve_fit(
    #     logistic_objective, np.arange(len(y_axis_train)), y_axis_train)
    #
    x_line_test = np.linspace(0, len(y_axis_test), 1000)
    y_line_test = logistic_objective(x_line_test, *popt_test)

    x_line_train = np.linspace(0, len(y_axis_train), 1000)
    # y_line_train = logistic_objective(x_line_train, *popt_train)

    # get upper asymptote
    upper_asymptote_test = popt_test[2]
    # upper_asymptote_train = popt_train[2]

    plt.plot(x_line_test, y_line_test, '--', label='test best fit')
    plt.fill_between(x_line_test, y_line_test, 0, alpha=0.1)
    # text for the best fit line equation
    plt.text(0, upper_asymptote_test - 0.1,
             f'Best Fit Line Test: {round(popt_test[2], 5)} / (1 + {round(popt_test[0], 5)} * exp(-{round(popt_test[1], 5)} * x))', fontsize=14)

    # plt.plot(x_line_train, y_line_train, '--', label='train best fit')
    # plt.fill_between(x_line_train, y_line_train, 0, alpha=0.1)
    # # text for the best fit line equation
    # plt.text(0, upper_asymptote_train - 0.1,
    #          f'Best Fit Line Train: {round(popt_train[2], 5)} / (1 + {round(popt_train[0], 5)} * exp(-{round(popt_train[1], 5)} * x))', fontsize=14)
    #
    # plot the upper upper_asymptote
    plt.axhline(y=upper_asymptote_test, color='r',
                linestyle='--', label='upper asymptote test')
    # plt.axhline(y=upper_asymptote_train, color='r',
    #             linestyle='--', label='upper asymptote train')
    # text labels for the upper and lower asymptote equation
    plt.text(0, upper_asymptote_test,
             f'Upper Asymptote Test: {round(upper_asymptote_test, 5)}', fontsize=14)
    plt.scatter(x_axis, y_axis_test, label='test', color='r', )
    plt.scatter(x_axis, y_axis_train, label='train', color='b')
    plt.title(
        f'Learning Curve {file_title.split("_")[0]} - {file_title.split("_")[1]}')
    plt.xlabel('Number of Trials')
    plt.ylabel('Mean Score')
    plt.legend()
    plt.grid()
    print(f'{output_location}/{file_title}.png')
    # create the folder if it doesn't exists
    if not os.path.exists(output_location):
        os.makedirs(output_location)
    plt.savefig(os.path.join(output_location,
                f'{file_title}.png'))


if args.rankings:
    df = pd.read_csv(os.path.join(args.folder, 'aggregate', 'results_raw.csv'))
    generate_rank_graphs(df, output_location)

if args.cvcurve:
    generate_learning_curve(args.folder, output_location)
