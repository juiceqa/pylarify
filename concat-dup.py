import csv
import os

input_dir = "/path/to/input/dir"
output_dir = "/path/to/output/dir"

# Loop through each CSV file in the input directory
for filename in os.listdir(input_dir):
    if filename.endswith(".csv"):
        input_file = os.path.join(input_dir, filename)
        output_file = os.path.join(output_dir, filename)
        print(f"Processing file: {input_file}")

        # Use a set to keep track of treatmentCenterIds that have already been seen
        seen_ids = set()

        # Open the input and output CSV files
        with open(input_file, newline='') as csvfile_in, \
             open(output_file, 'w', newline='') as csvfile_out:

            # Create CSV reader and writer objects
            reader = csv.DictReader(csvfile_in)
            writer = csv.DictWriter(csvfile_out, fieldnames=reader.fieldnames)

            # Write the header row to the output file
            writer.writeheader()

            # Loop through each row in the input file
            for row in reader:
                # If the treatmentCenterId has not been seen before, write the row to the output file
                if row["treatmentCenterId"] not in seen_ids:
                    writer.writerow(row)

                    # Add the treatmentCenterId to the set of seen ids
                    seen_ids.add(row["treatmentCenterId"])

        print(f"Deduplicated file saved to: {output_file}")
