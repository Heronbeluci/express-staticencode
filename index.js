var fs = require('fs');
var UglifyJS = require('uglify-js');
var path = require('path');
var cleanCSS = require('clean-css');
var cache = {};

module.exports = function(config){
   var assetsFolder = config.folder;

   if(config.cssEncode===undefined) config.cssEncode=true;
   if(config.jsEncode===undefined) config.jsEncode=true;
   if(config.preload===undefined) config.preload=true;

   function requestFile(filePath, callback){
      if(cache[filePath] !== undefined){
         if(callback!==undefined) callback(cache[filePath]);
         return;
      }
      fs.readFile(filePath, 'utf8', function(err, source){
        if(err){
          if(callback!==undefined) callback('[StaticEncode]: Failed to load file');
          return;
        }
        if(filePath.indexOf('.js')!=-1){
          var min = UglifyJS.minify(source, config.uglifyOptions);
          if(min.error){
            if(callback!==undefined) callback('[StaticEncode]: Failed to uglify the javascript file');
            return;
          }
          cache[filePath] = min.code;
        }else if(filePath.indexOf('.css')!=-1){
          if(config.cleanCssOptions===undefined){
            var min = new cleanCSS().minify(source);
          }else{
            var min = new cleanCSS(config.cleanCssOptions).minify(source);
          }
          
          cache[filePath] = min.styles;
        }
        
        if(callback!==undefined) callback(cache[filePath]);
      });
   }

   if(config.preload === true){
      function preloadDirectory(dir){
         fs.readdir(dir, function(err, filenames) {
            if(err){
              console.error(err);
              return;
            }
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
                  if(filename.indexOf('.js')!=-1 || filename.indexOf('.css')!=-1){
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

    if(assetPath.indexOf('.js')!=-1 && config.jsEncode===true){
      requestFile(assetsFolder+'/'+assetPath, function(data){
        res.contentType("application/javascript");
        res.end(data);
      });
    }else if(assetPath.indexOf('.css')!=-1 && config.cssEncode===true){
      requestFile(assetsFolder+'/'+assetPath, function(data){
        res.contentType("text/css");
        res.end(data);
      });
    }else{
      res.sendFile(assetsFolder+'/'+assetPath);
    }

  }
}
