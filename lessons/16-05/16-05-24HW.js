function getPath(element, document) {
    if (element === document.body) {
        return element.tagName;
    }
    let idx = 0;
    const sameLevelElements = element.parentNode.childNodes;
    for (let i = 0; i < sameLevelElements.length; i++) {
        let iterationItem = sameLevelElements[i];
        if (iterationItem === element) {
            return getPath(element.parentNode) + ' > ' + element.tagName + ':nth-child(' + (idx + 1) + ')';
        }
        if (iterationItem.nodeType === 1 && iterationItem.tagName === element.tagName) {
            idx++;
        }
    }
}

module.exports = { getPath };