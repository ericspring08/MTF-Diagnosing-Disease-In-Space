import pandas as pd

def quickanalysis(args):
    #TODO: Implement quick analysis of results.csv file
    print("Quick Analysis")
    # give some statistics about the results file
    # save to output file if specified

    df = pd.read_csv(args.file)
    print(df.head())