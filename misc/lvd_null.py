import pandas as pd

df = pd.read_csv('../mtf/data/LVD.csv')

# on dataset column convert 1 to 0 and 2 to 1
df['Dataset'] = df['Dataset'].apply(lambda x: 0 if x == 1 else 1)

df.to_csv('../mtf/data/LVD_null.csv', index=False)
