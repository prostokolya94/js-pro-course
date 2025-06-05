import * as jsdom from "jsdom";
import {getPath} from "./16-05-24HW";
import * as assert from "node:assert";
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
    assert.ok(document, "Document should be defined");
    assert.ok(element, "Element should be found");
});
