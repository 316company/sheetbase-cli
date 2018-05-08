const fs = require('fs');
const path = require('path');
const rmdir = require('rmdir');
const editJsonFile = require('edit-json-file');

/**
 * Get current directory base
 */
export function getCurrentDirectoryBase(): string {
  return path.basename(process.cwd());
}

/**
 * Check if file exists
 * @param path - Path to the file
 */
export function fileExists(path: string): boolean {
  try {
    return fs.statSync(path).isFile();
  } catch (err) {
    return false;
  }
}

/**
 * Check if directory exists
 * @param path - Path to the directory
 */
export function directoryExists(path: string): boolean {
  try {
    return fs.statSync(path).isDirectory();
  } catch (err) {
    return false;
  }
}

/**
 * Check if a string is a valid file/directory name
 * @param name - File/directory name
 */
export function isValidName(name: string): boolean {
  return (
    name.indexOf('<') < 0 &&
    name.indexOf('>') < 0 &&
    name.indexOf(':') < 0 &&
    name.indexOf('"') < 0 &&
    name.indexOf('/') < 0 &&
    name.indexOf('\\') < 0 &&
    name.indexOf('|') < 0 &&
    name.indexOf('?') < 0 &&
    name.indexOf('*') < 0
  );
}

/**
 * Turn string into a valid file/directory name
 * @param name - File/directory name
 */
export function buildValidName(name) {
  return name.replace(/\ /g, '-')
      .replace(/\</g, '-')
      .replace(/\,/g, '-')
      .replace(/\>/g, '-')
      .replace(/\./g, '-')
      .replace(/\?/g, '-')
      .replace(/\//g, '-')
      .replace(/\:/g, '-')
      .replace(/\;/g, '-')
      .replace(/\"/g, '-')
      .replace(/\'/g, '-')
      .replace(/\{/g, '-')
      .replace(/\[/g, '-')
      .replace(/\}/g, '-')
      .replace(/\]/g, '-')
      .replace(/\|/g, '-')
      .replace(/\\/g, '-')
      .replace(/\`/g, '-')
      .replace(/\~/g, '-')
      .replace(/\!/g, '-')
      .replace(/\@/g, '-')
      .replace(/\#/g, '-')
      .replace(/\$/g, '-')
      .replace(/\%/g, '-')
      .replace(/\^/g, '-')
      .replace(/\&/g, '-')
      .replace(/\*/g, '-')
      .replace(/\(/g, '-')
      .replace(/\)/g, '-')
      .replace(/\+/g, '-')
      .replace(/\=/g, '-')
}

/**
 * Delete directory
 * @param path - Path to the directory
 */
export function rmDir(path: string): any {
  return rmdir(path);
}

/**
 * Read file contains text
 * @param path - Path to text file
 */
export function readText(path: string): string {
  return fs.readFileSync(path, 'utf8');
}

/**
 * Edit a JSON file
 * @param path - Path to the JSON file
 * @param data - Data to be updated
 */
export async function editJson(path: string, data: Object = {}): Promise<any> {
  let jsonFile = editJsonFile(path);
  for(let key in data) {
    jsonFile.set(key, data[key]);        
  }
  return jsonFile.save();
}