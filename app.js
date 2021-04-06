//example
//     "https://www.dreamhost.com",
//     'https://www.referralcandy.com',
//     'https://popupmaker.com',
//     'https://dexatel.com'

const init = require('./modules/init');
const basePath = process.argv.pop();
init(basePath);