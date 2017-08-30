# Express Static Encode
Basically this module will minify all yours javascript files with UglifyJS automatically, with preload all minifications will occur after the module are called, and all minified files will keep stored in the RAM memory, like a cache, when the preload config is in false the file will cache data after first file get.

#### Basic Usage
```javascript
app.get('/assets/*', staticEncode({
  folder:'/assets',      // Static folder
  preload:true,          // Load after config ended
  uglifyOptions:{}       // UglyfyJS options
}));
```
