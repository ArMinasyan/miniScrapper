const ignoreList = require('./ignoreList.json');

function isNoneIgnore(w) {
    return !ignoreList.some(W => W == w.trim())
}
function between(w1, w2) {
    return ignoreList.some(W1 => W1 == w1.trim()) && ignoreList.some(W2 => W2 == w2.trim())
}

module.exports = str => {
    // console.log(str);
    let contentSTR = str.replace(/[0-9`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/g, '').trim();

    k = contentSTR.split(' ');

    k = k.map((el) => el.trim());
    k = k.filter(el => el != '');
    k.map((el, index) => k[index] = el.toLowerCase());

    let tempSTR = '';
    const indexOF = k.findIndex(w => w == 'of');

    if (indexOF != -1) {

        if (indexOF > 0 && indexOF < k.length - 1) {
            if (!between(k[indexOF - 1], k[indexOF + 1])) {
                tempSTR += (k[indexOF - 1] + ' ' + k[indexOF] + ' ' + k[indexOF + 1]) + ', ';
                k[indexOF - 1] = "_";
                k[indexOF] = '_';
                k[indexOF + 1] = '_'
            }
        }
    }


    //  console.log(a.textContent);
    let tmp = '';
    for (let i = 0; i < k.length; i++) {
        if (k[i].trim() != '_') {
            if (isNoneIgnore(k[i])) tempSTR += (k[i] + ' ');
            else tempSTR += ', ';
        }
    }

    let tempSTRArray = tempSTR.split(',');
    tempSTRArray.map((el, index) => { if (el.trim().split(' ').length < 2) tempSTRArray[index] = '' });

    tempSTRArray = tempSTRArray.filter(el => el.trim() != '');
    tempSTRArray = tempSTRArray.map(el => el.trim());
    return tempSTRArray.toString()

}