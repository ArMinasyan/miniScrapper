const checkATags = require('./checkHyperLinks');
const request = require('request');
const { JSDOM } = require('jsdom');
const KeywordResearch = require('./KeywordResearch');
const BrokenLinkChecker = require('./brokenLinkChecker');

module.exports = (blogArticlePath, link, classes) => {
    let TC = [];

    request(blogArticlePath, async function (err, res, body) {
        const jD = new JSDOM(body).window.document;

        const paragraph = jD.getElementsByClassName(`${classes.maxTC.name}`);


        let str = '';
        let arr = [];

        let result = [];
        let wordCount = 0;

        paragraph[0].childNodes.forEach(el => {
            if (el.nodeName == 'P') {
                str += el.textContent;
                checkATags(el.childNodes, arr);
            }
        })

        const ParagraphKeywords = KeywordResearch(str);

        wordCount = str.split(' ').length;

        let tempObj = {
            wordCount: wordCount,
            keywords: ParagraphKeywords,
            internal: false,
            foundLink: '',
            anchor: '',
            broken: false
        };

        arr.forEach(async lnk => result.push(BrokenLinkChecker(lnk, link)))


        //console.log(result);
        let tmp = {};

        result.forEach(async d => {
            //  console.log(await d)
            tmp = await d;
            tempObj = { ...tempObj, tmp }
            //console.log(await d)
        })

        console.log(tempObj);
    })
}