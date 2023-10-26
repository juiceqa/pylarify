import pandas as pd

def load_and_prepare_data(file_path):
    """
    Load the CSV data and prepare it for comparison.
    """
    data = pd.read_csv(file_path, encoding='utf-8')
    # If there are specific preprocessing steps (like stripping whitespace, handling nulls, etc.), add them here.
    return data

def compare_datasets(data_older, data_newer):
    """
    Compare two datasets and identify new and closed locations.
    """
    # 'state' is removed from the unique_columns list to avoid mismatches due to abbreviation/full-name differences.
    unique_columns = ['locationName', 'centerType', 'address1', 'address2', 'city', 'zip', 'phoneNumber', 'phoneExtension', 'websiteUrl', 'latitude', 'longitude']

    # Merge and identify new locations
    new_locations = data_newer.merge(data_older, on=unique_columns, how='left', indicator=True).query('_merge == "left_only"')
    new_locations = new_locations.drop(columns=['_merge', 'state_x', 'state_y']).assign(status='New')  # drop state columns and add status

    # Merge and identify closed locations
    closed_locations = data_older.merge(data_newer, on=unique_columns, how='left', indicator=True).query('_merge == "left_only"')
    closed_locations = closed_locations.drop(columns=['_merge', 'state_x', 'state_y']).assign(status='Closed')  # drop state columns and add status

    return pd.concat([new_locations, closed_locations], ignore_index=True)

def main():
    # Adjust the file paths below to point to your actual files.
    may_file_path = '05-2023.csv'
    october_file_path = '10-2023.csv'

    data_may = load_and_prepare_data(may_file_path)
    data_october = load_and_prepare_data(october_file_path)

    comparison_results = compare_datasets(data_may, data_october)

    # Save the comparison results to a new CSV file.
    comparison_results.to_csv('location_changes.csv', index=False, encoding='utf-8')
    print("Comparison complete. Results saved to 'location_changes.csv'.")

if __name__ == "__main__":
    main()
