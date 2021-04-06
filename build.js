"use strict";
var minify = require("@node-minify/core");
var htmlMinifier = require("@node-minify/html-minifier");
var jsonminify = require("@node-minify/jsonminify");
var cleanCSS = require("@node-minify/clean-css");
// var uglifyJS = require("@node-minify/uglify-js");

var globby = require("globby");
var path = require("path");
var extend = require("extend");
var fs = require("graceful-fs");
var mkdirp = require("mkdirp");

var archiver = require("archiver");



var defaultOptions = {
  comments: true,
  output: "js",
  extension: ".js",
  patterns: ["**/*.js"],
  configFile: null,
  callback: null,
  logLevel: "info",
  removeAttributeQuotes: true
};

function isEmpty(str) {
  if (typeof str != "string" || str.trim() == "") {
    return true;
  }
  return false;
}

function readFile(path) {
  try {
    return fs.readFileSync(path, "utf-8");
  } catch (e) {
    console.error("UGLIFYJS FOLDER ERROR: ", path, "was not found !");
    return "";
  }
}

function copyFileSync( source, target ) {

    var targetFile = target;

    // If target is a directory, a new file with the same name will be created
    if ( fs.existsSync( target ) ) {
        if ( fs.lstatSync( target ).isDirectory() ) {
            targetFile = path.join( target, path.basename( source ) );
        }
    }

    fs.writeFileSync(targetFile, fs.readFileSync(source));
}

function copyFolderRecursiveSync( source, target ) {
    var files = [];

    // Check if folder needs to be created or integrated
    var targetFolder = path.join( target, path.basename( source ) );
    if ( !fs.existsSync( targetFolder ) ) {
        fs.mkdirSync( targetFolder );
    }

    // Copy
    if ( fs.lstatSync( source ).isDirectory() ) {
    if ( fs.lstatSync( source ).isDirectory() ) {
        files = fs.readdirSync( source );
        files.forEach( function ( file ) {
            var curSource = path.join( source, file );
            if ( fs.lstatSync( curSource ).isDirectory() ) {
                copyFolderRecursiveSync( curSource, targetFolder );
            } else {
                copyFileSync( curSource, targetFolder );
            }
        } );
    }
}
}

function ugly (dirPath, options) {
  options = extend({}, defaultOptions, options);
  var state = {
    processCounter: 0,
    logLevel: options.logLevel,
    callback: options.callback
  };
  
  // grab and minify all the js files
  var files = globby.sync(options.patterns, {
    cwd: dirPath
  });
  
  // minify each file individually
  files.forEach(function (fileName) {
    options.output = isEmpty(options.output) ? "_out_" : options.output;
    var newName = path.join(options.output, path.dirname(fileName), path.basename(fileName, path.extname(fileName))) + options.extension;
    var originalCode = readFile(path.join(dirPath, fileName));
    
    minify({
      compressor: options.compressor,
      content: originalCode,
      options: options,options,
    }).then(function(min) {
      console.log(newName);
      writeFile(newName, min, state);
    });
   });
}

function uglyJs (dirPath, options) {
  options = extend({}, defaultOptions, options);

  var minifier = require("terser");
  var state = {
    processCounter: 0,
    logLevel: options.logLevel,
    callback: options.callback
  };

  var uglifyConfiguration = options.configFile ? require(path.resolve(options.configFile)) : {};

  // grab and minify all the js files
  var files = globby.sync(options.patterns, {
    cwd: dirPath
  });

    // minify each file individually
    files.forEach(function (fileName) {
      options.output = isEmpty(options.output) ? "_out_" : options.output;
      var newName = path.join(options.output, path.dirname(fileName), path.basename(fileName, path.extname(fileName))) + options.extension;
      var originalCode = {};
      originalCode[fileName] = readFile(path.join(dirPath, fileName));
      var minifyResult = minifier.minify(originalCode, JSON.parse(JSON.stringify(uglifyConfiguration)));
      if (minifyResult.error) {
        console.error(minifyResult.error);
        throw minifyResult.error;
      }

      writeFile(newName, minifyResult.code, state);
    });
}

copyFolderRecursiveSync("./src/test/apidoc", "build/");
copyFolderRecursiveSync("./src/server/routes/views", "build/routes/");
copyFileSync( "./src/server/query/query.css", "build/query/" );
copyFileSync( "./src/server/query/query.html", "build/query/" );
copyFileSync( "./src/server/query/query.js", "build/query/" );
copyFileSync( "./.env", "build/" );

const packageJson = require("./package.json");
delete packageJson.scripts;
// delete packageJson.devDependencies;
delete packageJson.apidoc;
fs.writeFileSync("build/package.json", JSON.stringify(packageJson, null, 2), {
    encoding: "utf-8"
});

if (process.argv.includes("ugly")) {
ugly("./build/apidoc", {
  compressor: htmlMinifier ,
  output: "build/apidoc",
  extension: ".html",
  patterns: ["**/*.html"],
  options: {
    removeAttributeQuotes: true,
    collapseInlineTagWhitespace: true,
    minifyCSS: true,
    minifyJS: true,
    removeComments: true
  }
});

ugly("./build/apidoc", {
  compressor: jsonminify ,
  output: "build/apidoc",
  extension: ".json",
  patterns: ["**/*.json"],
    options: {
    removeAttributeQuotes: true,
    collapseInlineTagWhitespace: true,
    removeComments: true
  }
});

ugly("./build/apidoc", {
  compressor: cleanCSS ,
  output: "build/apidoc",
  extension: ".css",
  patterns: ["**/*.css"],
    options: {
    removeAttributeQuotes: true,
    collapseInlineTagWhitespace: true,
    removeComments: true
  }
});

uglyJs("./build", {
  comments: true,
  output: "build",
  extension: ".js",
  patterns: ["**/*.js"],
  configFile: null,
  callback: null,
  logLevel: "info"
});
}
function writeFile(filePath, code, state) {
  state.processCounter++;

  mkdirp(path.dirname(filePath)).then(function () {
    fs.writeFile(filePath, code, function (err) {
      state.processCounter--;
      if (state.callback && state.processCounter === 0) {
        state.callback();
      }
      if (err) {
        console.error("Error: " + err);
        return;
      }
      if (state.logLevel == "info") {
        console.info("File " + filePath + " written successfully !");
      }
    });
  })
  .catch(function (err) {
    state.processCounter--;
    if (state.callback && state.processCounter === 0) {
      state.callback();
    }
    
    console.error("Error: " + err);
  });
  
} 

function zipDirectory(source, out) {
  const archive = archiver("zip", { zlib: { level: 9 }});
  const stream = fs.createWriteStream(out);

  return new Promise((resolve, reject) => {
    archive
      .directory(source, false)
      .on("error", err => reject(err))
      .pipe(stream)
    ;

    stream.on("close", () => resolve());
    archive.finalize();
  });
}


zipDirectory("./build", "dist.zip").then(function (e) {
  console.log("ok");
});