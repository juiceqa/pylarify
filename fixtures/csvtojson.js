let csvToJson = require('convert-csv-to-json');
let fileInputName = '04-42-nodups.csv';
let fileOutputName = 'set16.json';
csvToJson.formatValueByType().fieldDelimiter(',').generateJsonFileFromCsv(fileInputName, fileOutputName)