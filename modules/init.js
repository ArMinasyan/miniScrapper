const request = require('request');
const getArticles = require('./getArticles');
const { JSDOM } = require('jsdom');
const Rgx = new RegExp('^(?:[a-z]+:)?//', 'i');
module.exports = basePath => {
    request(basePath, async function (err, res, body) {

        // let articles;
        if (err) throw new Error(err);
        const jD = new JSDOM(body).window.document;

        const aTag = jD.querySelectorAll('a');
        let linkedinUrl = 'none';
        let blogPath = '';
        // countOfPages = 0;
        aTag.forEach(a => {
            // console.log(a.href.startsWith('https://www.linkedin.com'));
            if (a.textContent === 'Blog' || a.textContent === 'Blogs') blogPath = a.href;
            if (a.href.startsWith('https://www.linkedin.com')) linkedinUrl = a.href;
        });



        let newBlogPath;
        if (Rgx.test(blogPath)) newBlogPath = blogPath;
        else newBlogPath = basePath + blogPath;
        console.log('LinkedIn: ' + linkedinUrl);
        console.log('Blog path: ' + newBlogPath);
        getArticles(newBlogPath)

    })
}