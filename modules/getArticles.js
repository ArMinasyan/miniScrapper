const request = require('request');
const getMaxDiv = require('./getMaxChildDiv');
const { JSDOM } = require('jsdom');
const KeywordResearch = require('./KeywordResearch');
const printArticle = require('./printArticle');
const axios = require('axios').default;
module.exports = link => {
    let articles = [];
    let str = '', str2 = '';
    let k = [];
    let arr = [];
    request(link, async function (err, res, body) {
        const jD = new JSDOM(body).window.document;
        const aTag = jD.querySelectorAll('a');

        aTag.forEach(a => {
            str = '';
            str2 = '';
            k = [];
            let keywords = [];
            if (a.href.startsWith(link) && a.href.match(/\//g).length === 5 && a.textContent.trim() !== '' ||
                a.href.startsWith('/blog') && a.href.match(/\//g).length === 3 && a.textContent.trim() !== '') {
                if (!articles.some(obj => obj.href === a.href && obj.title === a.textContent)) {
                    const str = a.textContent.replace(/[\n\t]/g, '').trim();

                    arr.push({
                        href: a.href,
                        textContent: str,
                        keywords: KeywordResearch(str)
                    })
                }
            }
        })
        let classes;


        if (arr.length) {
            if (arr[0].href.startsWith(link)) classes = (await getMaxDiv(arr[0].href));
            else classes = (await getMaxDiv(link + arr[0].href.split('blog')[1]))


            console.log(`Count of articles is: ${arr.length}`);
            arr.forEach((el, index) => {
                printArticle(el.href, link, classes)
            })
        } else console.log("There is an error");


    })


}

