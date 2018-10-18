const { SHA256 } = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var pswd = 'passw0rd';

bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(pswd, salt, (err, hash) => {
        console.log(hash);
    });
});

var hashedPswd = '$2a$10$jRLJJdMXSDsKtRYJeV8j1.5h3SECFehD2f5xerjcBR4mmfjBysYNS';
bcrypt.compare(pswd, hashedPswd, (err, res) => {
    console.log(res);
});
//
// var data = {
//     id: 4444,
//     uid: 'aizen'
// };
//
// var token = jwt.sign(data, 'secret');
// console.log(token);
// var decoded = jwt.verify(token, 'secret');
// console.log(decoded);

// var message = 'user 1';
// var hash = SHA256(message).toString();
//
// console.log(message);
// console.log(hash);
//
// var data = {
//     id: 4
// };
//
// var token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'secret').toString()
// };
// //
// // token.data.id = 5;
// // token.hash = SHA256(JSON.stringify(token.data)).toString();
//
// var resHash = SHA256(JSON.stringify(token.data) + 'secret').toString();
//
// if (resHash === token.hash) {
//     console.log('data was not changed');
// } else {
//     console.log('data was changed');
// }
