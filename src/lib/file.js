const fs = require('fs');
const path = require('path');
const rmdir = require('rmdir');

module.exports = {

  getCurrentDirectoryBase: () => {
    return path.basename(process.cwd());
  },

  fileExists: (filePath) => {
    try {
      return fs.statSync(filePath).isFile();
    } catch (err) {
      return false;
    }
  },

  directoryExists: (filePath) => {
    try {
      return fs.statSync(filePath).isDirectory();
    } catch (err) {
      return false;
    }
  },

  isValid: (string) => {
    return (
      string.indexOf('<') < 0 &&
      string.indexOf('>') < 0 &&
      string.indexOf(':') < 0 &&
      string.indexOf('"') < 0 &&
      string.indexOf('/') < 0 &&
      string.indexOf('\\') < 0 &&
      string.indexOf('|') < 0 &&
      string.indexOf('?') < 0 &&
      string.indexOf('*') < 0
    );
  },

  rmDir: (path) => {
    return rmdir(path);
  },

  readText: (path) => {
    return fs.readFileSync(path, 'utf8');
  }
  
};