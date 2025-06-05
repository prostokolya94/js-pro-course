function getPath(element, document) {
    if (element === document.body) {
        if (!element.parentNode) {
            throw new Error('Element has no parent node');
        }
        if (!element || !document) {
            throw new Error('Element and document must be provided');
        }
        return element.tagName;
    }
    let idx = 0;
    const sameLevelElements = element.parentNode.children;
    for (let i = 0; i < sameLevelElements.length; i++) {
        const iterationItem = sameLevelElements[i];
        if (iterationItem === element) {
            return getPath(element.parentNode) + ' > ' + element.tagName + ':nth-child(' + (idx + 1) + ')';
        }
        if (iterationItem.nodeType === 1 && iterationItem.tagName === element.tagName) {
            idx++;
        }
    }
}

export  { getPath };