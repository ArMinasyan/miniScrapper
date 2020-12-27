const { default: Axios } = require("axios");

function EmailAddressGenerator(fname, lname, domain) {
    const firstL = fname[0];
    const lastL = lname[0];

    let emails = [];
    for (let i = 1; i <= 8; i++) {

        switch (i) {

            case 1: emails.push(fname + lname + domain); break;
            case 2: emails.push(lname + fname + domain); break;
            case 3: emails.push(lname + '.' + fname + domain); break;
            case 4: emails.push(fname + '.' + lname + domain); break;
            case 5: emails.push(firstL + lname + domain); break;
            case 6: emails.push(firstL + '.' + lname + domain); break;
            // case 7: emails.push(lname + '_' + fname + domain); break;
            // case 8: emails.push(fname + '_' + lname + domain); break;
            case 7: emails.push(fname + domain); break;
            case 8: emails.push(lname + domain); break;
            // case 11: emails.push(lname + firstL + domain); break;
            default: return true;
        }
    }

    console.log(emails);

    Axios.get('API_URL', {
        data: {
            emails: emails
        }
    }).then(res => {
        res.data.forEach(el => {
            console.log({
                email: el.email,
                exist: el.mailbox_exist
            })
        })
    })
}

EmailAddressGenerator('georgi', 'mamajanyan', '@hopperhq.com')