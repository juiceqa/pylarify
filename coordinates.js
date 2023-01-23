import "grid.js"

let coordinates = geojson.features
  .map(feature => feature.geometry.coordinates) // extract the coordinates from each feature
  .filter(coord => coord != null && coord != undefined) // remove any null or undefined values
  .map(coord => ({x:coord[0],y:coord[1]})); // convert the array of coordinates into an array of objects
console.log(coordinates);