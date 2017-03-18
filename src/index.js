const fs = require("fs");
const winston = require("winston");
const fileScanner = require("./FileScanner");
const PHP_Beautifier = require("./beautifiers/phpcbf");

class AdapterPHP {
    constructor() {
        this.beautifier = new PHP_Beautifier();
    }

    beautifyFile(filePath) {
        let fileContent = fs.readFileSync(filePath).toString();
        this.beautifier.beautify(fileContent, 
                                "PHP", 
                                {"tabWidth": 4, "standard": "PSR2"})
        .then((outputContent) => {
            fs.writeFileSync(filePath, outputContent);
        });
    }
}

let languageConfiguration = {
    "php": {
        extension: "php",
        adapter: new AdapterPHP()
    }
};

function processFiles(outputDir, config) {
    fileScanner.scan(outputDir, config.extension, (filePath) => {
        config.adapter.beautifyFile(filePath);
    });
}


module.exports = {
    beautify: function(language, outputDir) {
        let config = languageConfiguration[language];
        if(config === undefined) {
            winston.error(`Beautifier for language ${language} is not defined.`);
            return;
        }
        processFiles(outputDir, config);
    }
}