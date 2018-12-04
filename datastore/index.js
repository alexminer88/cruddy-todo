const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id)=>{
    if (err) {
      throw ('error at file create');
    } else {
      
      // items[id] = text;
      var pathName = `/Users/student/hrsf108-cruddy-todo/test/testData/${id}.txt`;
      // console.log('current pathname', pathName);
      //we will have to come back and fix this pathname
      fs.writeFile(pathName, text, (err) => {
        callback(null, {id: id, text: text});
      });   
    }
  });
};

exports.readAll = (callback) => {
  /* 
  Pseudocode:
    init a local data array to hold data from server
    get data from fs.readDir(path, cb)
      if err, error out
      on success for each item in fs.readDir, 
        push that data {id: id, text: text}, into local data array
    call callback(err, data array)
  */
        
  /*
  var storage = [];
  var count = 0;
  fs.readdir(exports.dataDir, (err, data) => {
    if (err) {
      throw ('readAll error');
    } else {
      // storage = data.map(dataElement => {
      //   return {id: id, text: text}
      // });
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
            
            if (count === data.length){
              callback(null, storage); 
            }
          } 
        });        
      });
      console.log('storage', storage);
      // console.log(data);
     // var dataFiles = data.map(element => {
     //   return 
     // }); 
    }
  });  
  */
  
  var data = [];
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      throw ('error reading files');
    } else {
      files.forEach(function(fileName) {
        data.push({id: fileName.substr(0, 5), text: fileName.substr(0, 5)});
      })
      callback(null, data);
    }
  });
};

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
  
//   var item = items[id];
//   delete items[id];
//   if (!item) {
//     // report an error if item not found
//     callback(new Error(`No item with id: ${id}`));
//   } else {
//     callback();
//   }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
