const fs = require('fs');

function config(filePath = './.env') {

    try {
        const openFile = fs.openSync(filePath, 'r');
        const bSize = 256;
        const buffer = Buffer.alloc(bSize);

        const readFile = fs.readSync(openFile, buffer, 0, bSize, null);
        let txt = buffer.toString('utf-8', 0, readFile);

        const parsed = parseText(txt);
        Object.keys(parsed).forEach((key) => process.env[key] = parsed[key]);
        // console.log('Parsed: ', parsed);

        return { parsed };
    } catch (error) {
        // console.log('Error', error);
        return { error: error };
    }
}

function parseText(file) {
    const object = {};
    file.split('\n').forEach((line) => {
        const keysValues = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
        if(keysValues != null) {
            const key = keysValues[1];
            let value = keysValues[2] || '';
            const endIndex = value.length - 1;

            const singleQuote = value[0] === "'" && value[endIndex] === "'";
            const doubleQuote = value[0] === '"' && value[endIndex] === '"';

            if (singleQuote || doubleQuote) {
                value = value.substring(1, endIndex);
        
                if (doubleQuote) {
                    value = value.replace(/\\n/g, '\n');
                }
            } else {
                value = value.trim();
            }
        
            object[key] = value;
        } 
    });

    return object;
}

module.exports.config = config;
module.exports.parseText = parseText;