'use strict'
const chalk = require('chalk');

const { JSDOM } = require('jsdom')
const request = require('request');
const axios = require('axios').default;

const rp = require('request-promise');

const blc = require('broken-link-checker');

const basePath = ["https://www.dreamhost.com", 'https://www.referralcandy.com', 'https://popupmaker.com',
    'https://dexatel.com'][parseInt(process.argv.pop())];
const ignoreList = require('./ignoreList.json');
//let blogPath = ''
var Rgx = new RegExp('^(?:[a-z]+:)?//', 'i');

const getMaxDiv = require('./modules/getMaxChildDiv');
const KeywordResearch = require('./KeywordResearch');

function isNoneIgnore(w) {
    return !ignoreList.some(W => W == w.trim())
}
function between(w1, w2) {
    return ignoreList.some(W1 => W1 == w1.trim()) && ignoreList.some(W2 => W2 == w2.trim())
}

function between1(w1 = '', w2, w3, w4) {
    return ignoreList.some(W1 => W1 == w1) || ignoreList.some(W2 => W2 == w2)
}
//https://www.referralcandy.com/blog/47-referral-programs/
//https://www.dreamhost.com/blog/how-your-online-business-can-nail-customer-service-during-holidays/
//https://firstsiteguide.com/startup-stats/

function replaceAll(str, mapObj) {
    var re = new RegExp(Object.keys(mapObj).join("|"), "gi");

    return str.replace(re, function (matched) {
        return mapObj[matched.toLowerCase()];
    });
}

const fs = require('fs');



async function Result(lnk, blogPath, blogArticlePath, pL, kW) {
    try {
        let status = (await axios.get(lnk.href)).statusText;
        return {

            internal: lnk.href.startsWith(blogPath) ? true : false,
            foundLink: lnk.href,
            anchor: lnk.text,
            broken: status == 'OK' ? false : true
        };

    } catch (err) {
        return {
            internal: lnk.href.startsWith(blogPath) ? true : false,
            foundLink: lnk.href,
            anchor: lnk.text,
            broken: true
        };
    }
}

function checkDate(item, arr = []) {
    const dateReg = /^\w{1,}\s\d{1,2}\,\s\d{4}/g;

    console.log(item);
}
function checkATags(item, arr = []) {


    if (item.length == 1) {
        if (item[0].tagName == 'A') arr.push({ tagName: item[0].tagName, text: item[0].textContent, href: item[0].href });
    }

    else
        item.forEach(elem => {
            if (elem.tagName != undefined) {
                if (elem.tagName == 'A') {
                    arr.push({
                        tagName: elem.tagName,
                        text: elem.textContent,
                        href: elem.href
                    })
                }
                if (elem.children.length == 1) checkATags(elem.childNodes, arr);
            }

        })
}

//const fs = require('fs');

function test(blogArticlePath, link, classes) {
    let TC = [];

    //console.log(classes);
    request(blogArticlePath, async function (err, res, body) {
        fs.writeFileSync('./index.html', body);
        //   console.log(classes.maxTC.name);
        const jD = new JSDOM(body).window.document;

        const paragraph = jD.getElementsByClassName(`${classes.maxTC.name}`);


        let str = '';
        let str2 = '';
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

        arr.forEach(async lnk => {

            result.push(Result(lnk, link))
        })


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

let arr2 = [];
function getArticles(link) {
    console.log('Link: ' + link);
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
            //console.log(a.href);
            if (a.href.startsWith(link) && a.href.match(/\//g).length == 5 && a.textContent.trim() != '' ||
                a.href.startsWith('/blog') && a.href.match(/\//g).length == 3 && a.textContent.trim() != '') {
                if (!articles.some(obj => obj.href == a.href && obj.title == a.textContent)) {
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
        console.log(arr[0].href);
        if (arr[0].href.startsWith(link)) classes = (await getMaxDiv(arr[0].href));
        else classes = (await getMaxDiv(link + arr[0].href.split('blog')[1]))


        arr.forEach((el, index) => {
            console.log('Article ' + (index + 1));
            test(el.href, link, classes)
        })

    })


}




function checkPages(blogPath) {
    return new Promise((resolve, reject) => {
        request(blogPath, function (err, res, body) {
            const jD = new JSDOM(body).window.document;
            const aTag = jD.querySelectorAll('a');
            let pageCount = 0;
            aTag.forEach(a => {
                if (a.href.match('page')) {
                    pageCount++;
                    console.log(a.href);
                }
            })

            console.log(pageCount);
            if (pageCount > 0) resolve(true);
            else resolve(false);
        })
    })
}
function init(basePath) {

    // test();
    request(basePath, async function (err, res, body) {

        let articles;
        if (err) console.log(err);
        const jD = new JSDOM(body).window.document;

        const aTag = jD.querySelectorAll('a');
        let linkedinUrl;
        let blogPath;
        let countOfPages = 0;
        aTag.forEach(a => {
            if (a.textContent == 'Blog' || a.textContent == 'Blogs') blogPath = a.href;
            if (a.href.startsWith('https://www.linkedin.com')) linkedinUrl = a.href;
        });

        console.log('Linkedin: ' + linkedinUrl);
        let newBlogPath;
        if (Rgx.test(blogPath)) newBlogPath = blogPath;
        else newBlogPath = basePath + blogPath;

        // console.log('Muliple pages: ' + await checkPages(newBlogPath));
        //   console.log('Blog path: ' + newBlogPath);
        getArticles(newBlogPath);
        //console.log(articles);

    })
}

init(basePath);