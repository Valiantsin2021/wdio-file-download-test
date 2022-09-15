const path = require('path')
const fs = require('fs')
// const { PdfReader } = require("pdfreader");
const pdf = require('pdf-parse');

module.exports = function data(filePath) {
  return new Promise((resolve) => {
    pdf(filePath).then(function(data) {
      resolve(data.text)
})
  })
}

// module.exports = function data (pathToPdf) {
//     return new Promise((resolve) => {
//      new PdfReader().parseFileItems(pathToPdf, (err, item) => {
//     if (err) console.error("error:", err);
//     else if (!item) console.warn("end of file");
//     else if (item.text) resolve(item.text);
//     })
//   });
// }

module.exports = function waitForFileExists(filePath, timeout) {
  return new Promise(function (resolve, reject) {

    var timer = setTimeout(function () {
      watcher.close();
      reject(new Error('File does not not exists'));
    }, timeout);

    fs.access(filePath, fs.constants.R_OK, function (err) {
      if (!err) {
        clearTimeout(timer);
        watcher.close();
        resolve();
      }
    });

    var dir = path.dirname(filePath);
    var basename = path.basename(filePath);
    var watcher = fs.watch(dir, function (eventType, filename) {
      if (eventType === 'rename' && filename === basename) {
        clearTimeout(timer);
        watcher.close();
        resolve();
      }
    });
  });
}