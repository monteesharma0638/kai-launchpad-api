const fs = require('fs');
const fileName = './file.json';
const file = require(fileName);
    

setInterval(() => {
  file.key++;
  if(file.key > 20){
    throw new Error("An Error Occurred");
  }
  fs.writeFile(fileName, JSON.stringify(file), function writeJSON(err) {
    if (err) return console.log(err);
    console.log(JSON.stringify(file));
    console.log('writing to ' + fileName);
  });
}, 1000)