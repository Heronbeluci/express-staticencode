var fs = require('fs');
var UglifyJS = require("uglify-js");
var path = require("path");
var cache = {};

module.exports = function(config){
   var assetsFolder = config.folder;

   function requestFile(filePath, callback){
      if(cache[filePath] !== undefined){
         if(callback!==undefined) callback(cache[filePath]);
         return;
      }
      fs.readFile(filePath, 'utf8', function(err, data){
         if(err){
            if(callback!==undefined) callback('[AutoUglify]: Failed to load file');
            return;
         }
         var min = UglifyJS.minify(data, config.uglifyOptions);
        
         if(min.error){
            if(callback!==undefined) callback('[AutoUglify]: Failed to minify file');
            return;
         }
         cache[filePath] = min.code;
         if(callback!==undefined) callback(cache[filePath]);
      });
   }

   if(config.preload === true){
      function preloadDirectory(dir){
         fs.readdir(dir, function(err, filenames) {
            if(err){
              console.log(err);
              return;
            }
           // console.log(filenames)
            filenames.forEach(function(filename) {
              fs.readFile(path.resolve(dir, filename), 'utf-8', function(err, content) {
                if(err){
                     if(err.code == 'EISDIR'){
                        preloadDirectory(dir+'/'+filename)
                     }else{
                        console.error(err.code);
                     }
                     return;
                  }
                  if(filename.indexOf('.js')!=-1){
                     requestFile(dir+'/'+filename);
                  }
              });
            });
         });
      }
      preloadDirectory(assetsFolder);
   }

   return function(req, res){
      var assetPath = req.params[0] ? req.params[0] : 'index.html';
      if(assetPath.indexOf('.js')==-1){
         res.sendfile(assetsFolder+'/'+assetPath);
      }else{
         requestFile(assetsFolder+'/'+assetPath, function(data){
            res.end(data);
         });
      }      
   }
}