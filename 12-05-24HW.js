const fs = require('fs').promises;
const path = require('path');

async function tree(dir, depth = 0, maxDepth = 5) {
    try {
        const entries = await fs.readdir(dir, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);

            if (entry.isDirectory()) {
                console.log(' '.repeat(2 * depth) + '-'.repeat(depth) + '+ ' + entry.name);

                if (depth < maxDepth) {
                    await tree(fullPath, depth + 1, maxDepth);
                }
            } else {
                console.log(' '.repeat(2 * depth) + '-'.repeat(depth) + '| ' + entry.name);
            }
        }
    } catch (error) {
        console.error(`Ошибка при чтении директории ${dir}:`, error.message);
    }
}

async function main() {
    const args = process.argv.slice(2);

    let dir = '.';
    let depth = 0;
    let maxDepth = 2;

    while (args.length > 0) {
        const arg = args.shift();

        if (arg.startsWith('--depth=')) {
            depth = parseInt(arg.split('=')[1]);
        } else if (arg.startsWith('--max-depth=')) {
            maxDepth = parseInt(arg.split('=')[1]);
        } else {
            dir = arg;
        }
    }

    console.log(tree(dir, depth, maxDepth));
}

main().catch(console.error);