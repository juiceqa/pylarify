import pandas as pd

# Load the two CSV files into Pandas dataframes
df1 = pd.read_csv('https://gist.githubusercontent.com/juiceqa/08aa1cbdb5c98d13581654a29d9e0bfa/raw/0419bd52e4de61758a2baa3a5569d715c2ab65c8/loca-03-16.csv')
df2 = pd.read_csv('https://gist.githubusercontent.com/juiceqa/08aa1cbdb5c98d13581654a29d9e0bfa/raw/0419bd52e4de61758a2baa3a5569d715c2ab65c8/loca-04-11.csv')

# Merge the two dataframes and drop duplicates
merged_df = pd.concat([df1, df2])
unique_rows = merged_df.drop_duplicates(subset=['Center', 'Address'], keep=False)

# Write the unique rows to a file named "output.csv"
unique_rows.to_csv('locametz-new-04-11.csv', index=False)