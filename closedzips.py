import pandas as pd

def create_missing_locations_object(file_path):
    # Load the data into a pandas DataFrame
    data = pd.read_csv(file_path)

    # Filter out rows where the status is "Closed"
    closed_locations = data[data['status'] == 'Closed']

    # Check if 'zip' column exists in the DataFrame
    if 'zip' not in closed_locations.columns:
        raise ValueError("The 'zip' column is missing in the CSV file.")

    # Create a dictionary counting the occurrences of each zip code
    missing_locations_count = closed_locations['zip'].value_counts().to_dict()

    # Convert integer counts to integer values (if they are not already)
    missing_locations_data = {str(zip_code): int(count) for zip_code, count in missing_locations_count.items()}

    return missing_locations_data

# Provide the correct path to your file
file_path = 'location_changes.csv'
try:
    missing_locations_object = create_missing_locations_object(file_path)
    print(missing_locations_object)
except Exception as e:
    print(f"An error occurred: {e}")
