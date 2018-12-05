const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const Promise = require('bluebird');
const readFile = Promise.promisify(fs.readFile);

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id)=> {
    var filePath = path.join(exports.dataDir, `${id}.txt`);
    fs.writeFile(filePath, text, (err) => {
      if (err) {
        throw ('error at file create');
      } else {
        callback(null, {id: id, text: text});
      }   
    });
  });
};

exports.readAll = (callback) => {   

  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      throw ('readAll error');
    } 
      var data = _.map(files, (file) => {
        var id = path.basename(file, '.txt');
        var filePath = path.join(exports.dataDir, file);
        return readFile(filePath)
          .then((fileData) => {
            return {
              id: id,
              text: fileData.toString()
            };
          }); 
      });
      Promise.all(data)
        .then((items) => callback(null, items), (err) => callback(err));
    
  });
};  

/*
  var storage = [];
  var count = 0;
  fs.readdir(exports.dataDir, (err, data) => {
    if (err) {
      throw ('readAll error');
    } else {
      if (data.length === 0) {
        callback(null, storage);
      }
      _.each(data, (file) => {
        let filePath = path.join(exports.dataDir, file);
        fs.readFile(filePath, 'utf8', (err, innerData) => {
          if (err) {
            throw ('inner readFile error');
          } else {
            storage.push({id: file.slice(0, -4), text: innerData});
            count++;
            if (count === data.length) {
              callback(null, storage);    
            }
          } 
        });        
      });
    }
  }); 
};
*/

exports.readOne = (id, callback) => {
  var filePath = path.join(exports.dataDir, `${id}.txt`);
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      callback(err);
    } else {
      callback(null, {id: id, text: data});
    }
  });
};

exports.update = (id, text, callback) => {
  var filePath = path.join(exports.dataDir, `${id}.txt`);
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (data === undefined) {
      callback(err);
    } else {
      fs.writeFile(filePath, text, (err ) => {
        if (err) {
          callback(err);
        } else {
          callback(null, {id: id, text: text});
        }
      });   
    }
  });
};

exports.delete = (id, callback) => {
  // unlink with fs.unlink(path, callback)
  var filePath = path.join(exports.dataDir, `${id}.txt`);
  fs.unlink(filePath, (err) => {
    if (err) {
      callback(err);
    } else {
      callback();
    }  
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
