[![NPM](https://nodei.co/npm/express-staticencode.png)](https://nodei.co/npm/express-staticencode/)


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

We recommend <a href="https://www.npmjs.com/package/pkg" target="_blank">PKG</a> for encode the serverside source.
