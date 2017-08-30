[![NPM](https://nodei.co/npm/express-staticencode.png)](https://nodei.co/npm/express-staticencode/)


# Express Static Encode
Basically this module will minify all yours javascript and CSS files with UglifyJS and CleanCSS automatically, with preload all minifications will occur after the module are called, and all minified files will keep stored in the RAM memory, like a cache, when the preload config is in false the file will cache data after first file get.

#### Basic Usage
```javascript
app.get('/assets/*', staticEncode({
  folder:'/assets',      // Static folder
  jsEncode: true,        // If you dont want to encode JS set to false (Default is true)
  cssEncode: true,       // If you dont want to encode CSS set to false (Default is true)
  preload:true,          // Load after config ended
  uglifyOptions:{},      // UglyfyJS options
  cleanCssOptions:{}     // CleanCSS options
}));
```

We recommend <a target="_blank" href="https://www.npmjs.com/package/pkg">PKG</a> to encode the serverside source.
