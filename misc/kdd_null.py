import pandas as pd

# Load the data
df = pd.read_csv('../mtf/data/KDD.csv')

# Check for missing values
print(df.isnull().sum())

# Output
df.ffill(inplace=True)

df.to_csv('../mtf/data/KDD_filled.csv', index=False)
