import pandas as pd
import numpy as np

df = pd.read_csv('../mtf/data/thyroid.csv')

# replace the '?' with NaN
df.replace('?', np.nan, inplace=True)

# print the number of missing values in each column
df.bfill(inplace=True)

# print the number of missing values in each column
print(df.isnull().sum())

df.to_csv('../mtf/data/thyroid_clean.csv', index=False)