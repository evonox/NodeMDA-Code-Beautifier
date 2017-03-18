const fs = require("fs");
const path = require('path')

class FileScanner {

    constructor(extension, fileHandler) {
        this.extension = extension;
        this.fileHandler = fileHandler;
    }

    scan(srcDir) {
        this.scanSubdirectories(srcDir);
        this.scanFiles(srcDir);
    }

    scanFiles(dir) {
        var filteredFiles = this.getFilesWithSearchedExtension(dir);
        filteredFiles.forEach(function(file) {
            this.fileHandler(path.join(dir, file));
        }, this);
    }

    scanSubdirectories(dir) {
        var directories = this.getDirectories(dir);
        directories.forEach(function(subdir) {
            this.scan(path.join(dir, subdir));
        }, this);
    }

    getDirectories(dir) {
        return fs.readdirSync(dir)
            .filter(file => fs.statSync(path.join(dir, file)).isDirectory())
    }

    getFilesWithSearchedExtension(dir) {
        return fs.readdirSync(dir)
            .filter(file => file.endsWith(this.extension));
    }
}

module.exports = {
    scan: function(srcDir, extension, fileHandler) {
        new FileScanner(extension, fileHandler).scan(srcDir);
    }
}