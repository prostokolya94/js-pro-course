const { Transform } = require('stream');
const fs = require('fs');

class WordSplitter extends Transform {
    constructor() {
        super({ objectMode: true });
    }

    _transform(chunk, encoding, next) {
        const words = chunk.toString().split(/\s+/);
        words.forEach(word => this.push(word));
        next();
    }
}

class WordFilter extends Transform {
    constructor() {
        super({ objectMode: true });
        this.wordCount = {};
    }

    _transform(word, encoding, next) {
        const cleanWord = word.toLowerCase().replace(/[^a-zA-Zа-яА-Я]/g, '');

        if (cleanWord) {
            this.wordCount[cleanWord] = (this.wordCount[cleanWord] || 0) + 1;
        }

        next();
    }

    _flush(next) {
        const sortedWords = Object.keys(this.wordCount).sort();
        const frequencyVector = sortedWords.map(word => this.wordCount[word]);

        this.push(JSON.stringify(frequencyVector));
        next();
    }
}

function processFile(inputPath, outputPath) {
    const readStream = fs.createReadStream(inputPath);
    const wordSplitter = new WordSplitter();
    const wordFilter = new WordFilter();
    const writeStream = fs.createWriteStream(outputPath);

    readStream
        .pipe(wordSplitter)
        .pipe(wordFilter)
        .pipe(writeStream);

    readStream.on('error', (err) => console.error('Ошибка чтения:', err));
    writeStream.on('error', (err) => console.error('Ошибка записи:', err));
    writeStream.on('finish', () => console.log('Обработка завершена'));
}


const [_,__, inputPath, outputPath] = process.argv;
processFile(inputPath, outputPath);