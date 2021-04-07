const axios = require('axios').default;

module.exports = async (lnk, blogPath) => {
    try {
        let status = (await axios.get(lnk.href)).statusText;
        return {
            internal: lnk.href.startsWith(blogPath),
            foundLink: lnk.href,
            anchor: lnk.text,
            broken: status !== 'OK'
        };
    } catch (err) {
        return {
            internal: lnk.href.startsWith(blogPath),
            foundLink: lnk.href,
            anchor: lnk.text,
            broken: true
        };
    }
}