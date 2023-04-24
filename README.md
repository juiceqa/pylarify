# Site Locator Repository

This repository contains the code for an automated testing suite that tests site locator API endpoints, compares site location data, and generates CSV files containing site location information.

## Features

- Automated tests for site locator API using Cypress
- Comparison of site location data across different sources and timeframes
- Generation of CSV files containing site location information
- Configurable test settings using the Cypress config file

## Getting Started

To run the test suite, follow these steps:

1. Clone the repository and navigate to the project directory.

2. Install the required dependencies using the following command:

```bash
npm install
```

3. Run the test suite using the following command:

```bash
npm run cypress
```

## Project Structure

- `coordinates.js`: Helper file for coordinate-related functions.
- `csvtojson.js`: Helper file to convert CSV data to JSON format.
- `cypress/`: Contains the Cypress test suite, configuration files, and test results.
  - `README.md`: A brief overview of Cypress and its usage in this project.
  - `cypress.config.ts`: The main configuration file for Cypress tests and plugins.
  - `e2e/`: Contains the end-to-end test files for the site locator API.
  - `fixtures/`: Contains JSON fixture files with sample site location data.
  - `reports/`: Contains test result reports.
  - `result/`: Contains test result artifacts, such as screenshots and videos.
  - `support/`: Contains support files and utilities for the Cypress tests.
- `grid.js`: Helper file for grid-related functions.
- `locametz-diff.py`: Python script to compare site location data from different timeframes.
- `locametz-new-04-11.csv`: Generated CSV file containing unique site location data for the Locametz data source.
- `output.json`: Generated JSON file containing site location data.
- `package-lock.json` and `package.json`: Configuration files for managing project dependencies.
- `pluvicto-diff.py`: Python script to compare site location data from different sources and timeframes for Pluvicto.
- `pluvicto-new-04-11.csv`: Generated CSV file containing unique site location data for the Pluvicto data source.
- `pylarify.js`, `pylarify copy.js`, and `pylarify2.js`: scripts that execute the pylarify site pull that have no dependancy on cypress.
- `site-locations/`: Contains site location data.
- `siteLocator.csv`: Generated CSV file containing site location data.
- `webpack.config.js`: Configuration file for bundling the project assets.
- `yarn.lock`: Configuration file for managing project dependencies using Yarn.

## Contributing

Feel free to submit issues or pull requests to improve the project. Make sure to follow the existing coding conventions and include appropriate test cases when submitting code changes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
