import { test } from "node:test";
import * as jsdom from "jsdom";
const { getPath } = require('./16-05-24HW');

test('getPath function', () => {
    const { JSDOM } = jsdom;
    const dom = new JSDOM(
        `<!DOCTYPE html> 
                    <body>
                        <div>
                            <p>Test paragraph</p>
                        </div>
                    </body>
`);
    const document = dom.window.document;
    let element = document.querySelector('p');
    expect(getPath(element, document)).toBe('body > div > P:nth-child(1)');
});
