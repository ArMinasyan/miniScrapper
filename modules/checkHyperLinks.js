function checkATags(item, arr = []) {
    if (item.length === 1) {
        if (item[0].tagName === 'A') {
            arr.push({
                tagName: item[0].tagName,
                text: item[0].textContent,
                href: item[0].href
            });
        }
    } else {
        item.forEach(elem => {
            if (elem.tagName !== undefined) {
                if (elem.tagName === 'A') {
                    arr.push({
                        tagName: elem.tagName,
                        text: elem.textContent,
                        href: elem.href
                    })
                }
                if (elem.children.length === 1) checkATags(elem.childNodes, arr);
            }
        })
    }

}

module.exports = checkATags;