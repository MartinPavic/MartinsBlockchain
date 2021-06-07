"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConnectionFile = exports.saveConfig = exports.getConfig = void 0;
const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
function getConfig() {
    const filePath = path.join(process.cwd(), 'config.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents);
}
exports.getConfig = getConfig;
function saveConfig(config) {
    const filePath = path.join(process.cwd(), 'config.json');
    fs.writeFileSync(filePath, JSON.stringify(config));
}
exports.saveConfig = saveConfig;
function getConnectionFile() {
    const filePath = path.resolve(process.cwd(), 'connection.yaml');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const connectionFile = yaml.load(fileContents);
    return connectionFile;
}
exports.getConnectionFile = getConnectionFile;
//# sourceMappingURL=config.js.map