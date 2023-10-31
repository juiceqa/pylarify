import pandas as pd


def load_and_prepare_data(file_path):
    """
    Load the CSV data and prepare it for comparison.
    """
    try:
        # Try to read the CSV file
        data = pd.read_csv(file_path, encoding='utf-8')

        # Check if the file is empty
        if data.empty:
            print(f"Warning: The file {file_path} is empty.")
            return None
        print("Data loaded successfully. First 5 rows:")
        print(data.head())
        return data

    except FileNotFoundError as e:
        print(f"Error: The file {file_path} was not found.")
        print(e)  # or use 'e' somewhere else in your code
        return None
    except Exception as e:
        print(f"An unexpected error occurred: {e}")


def compare_datasets(data_older, data_newer):
    """
    Compare two datasets and identify new and closed locations.
    """
    print("Debug: Data in compare_datasets")
    print("Older data:")
    print(data_older.head())
    print("Newer data:")
    print(data_newer.head())

    # Dynamically generate the list of columns to compare, excluding 'treatmentCenterId'
    unique_columns = [col for col in data_older.columns if col != 'treatmentCenterId']

    # Error Handling: Check if either dataset is None
    if data_older is None or data_newer is None:
        print("One of the datasets is None. Cannot proceed with comparison.")
        return None

    # Debugging: Print column names
    print("Columns in older data:", data_older.columns)
    print("Columns in newer data:", data_newer.columns)

    # Error Handling: Check if essential columns exist
    for col in unique_columns:
        if col not in data_older.columns:
            print(f"Error: Column '{col}' not found in older data.")
            return None
        if col not in data_newer.columns:
            print(f"Error: Column '{col}' not found in newer data.")
            return None

    # Identify new locations: Those that are in the new dataset but not in the old dataset
    new_locations = data_newer.merge(data_older.drop_duplicates(subset=unique_columns), on=unique_columns, how='left', indicator=True)
    new_locations = new_locations[new_locations['_merge'] == 'left_only']
    new_locations = new_locations.assign(status='New')
    new_locations.drop('_merge', axis=1, inplace=True)

    # Identify closed locations: Those that are in the old dataset but not in the new dataset
    closed_locations = data_older.merge(data_newer.drop_duplicates(subset=unique_columns), on=unique_columns, how='left', indicator=True)
    closed_locations = closed_locations[closed_locations['_merge'] == 'left_only']
    closed_locations = closed_locations.assign(status='Closed')
    closed_locations.drop('_merge', axis=1, inplace=True)

    # Identify locations that are both in the older and newer dataset
    both_locations = data_newer.merge(data_older.drop_duplicates(subset=unique_columns), on=unique_columns, how='inner', indicator=True)
    both_locations = both_locations.assign(status='Both')
    both_locations.drop('_merge', axis=1, inplace=True)

    # Concatenate the new, closed, and both locations
    return pd.concat([new_locations, closed_locations, both_locations], ignore_index=True)


def main():
    print("Debug: Entered Python main function")

    # Adjust the file paths below to point to your actual files.
    may_file_path = '05-2023.csv'
    october_file_path = '10-2023.csv'

    data_may = load_and_prepare_data(may_file_path)
    data_october = load_and_prepare_data(october_file_path)

    # Check if either of the datasets is None before proceeding
    if data_may is None or data_october is None:
        print("One of the datasets could not be loaded. Exiting.")
        return

    print("Debug: Starting dataset comparison")
    comparison_results = compare_datasets(data_may, data_october)
    if comparison_results is not None and not comparison_results.empty:
        print("Comparison complete. Saving results.")
        comparison_results.to_csv('location_changes.csv', index=False, encoding='utf-8')
    else:
        print("Debug: comparison_results is empty or None")


if __name__ == "__main__":
    main()
