const request = require('request');
const { JSDOM } = require('jsdom');
const axios = require('axios').default;


module.exports = (blogArticlePath) => {
    console.log(blogArticlePath);
    let TC = [];
    let TM = [];
    let maxTC, maxTM;
    return new Promise((resolve, reject) => {
        request(blogArticlePath,async function (err, res, body) {
            const jD = new JSDOM(body).window.document;
            const classes = jD.querySelectorAll('div');
            classes.forEach((elem, index) => {
                if (elem.getAttribute('class') != undefined) {
                    if (elem.getAttribute('class').split(' ').length > 0) {
                        TC.push({ name: elem.getAttribute('class'), length: elem.children.length })
                    }

                    if (elem.getAttribute('class').includes('meta'))
                        TM.push({ name: elem.getAttribute('class'), length: elem.children.length });
                }
            })

            maxTC = TC.reduce(function (prev, current) {
                return (prev.length > current.length) ? prev : current
            })

            // maxTM = TM.reduce(function (prev, current) {
            //     return (prev.length > current.length) ? prev : current
            // })


            resolve({ maxTC: maxTC, maxTM: TM[0] })
        })
    })
}
