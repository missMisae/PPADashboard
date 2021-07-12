'use strict';
//const { } = require('./analytics-utils');
//firestore init
const admin = require('firebase-admin');
const serviceAccount = require("../key.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();
const settings = { timestampsInSnapshots: true };
db.settings(settings);




/**
 * HTTP Cloud Function.
 * This function is exported by index.js, and is executed when
 * you make an HTTP request to the deployed function's endpoint.
 *
 * @param {Object} req Cloud Function request context.
 *                     More info: https://expressjs.com/en/api.html#req
 * @param {Object} res Cloud Function response context.
 *                     More info: https://expressjs.com/en/api.html#res
 * 
 */
exports.getImmediateInsights = async (req, res) => {
    const dbRef = db.collection('entities');
    let numLoansGiven = 0;
    let totalAmountGiven = 0;
    //large amount of data, using a stream here
    dbRef.stream().on('data', (documentSnapshot) => {
        let docData = documentSnapshot.data();
        numLoansGiven++;
        totalAmountGiven += docData.InitialApprovalAmount;
    }).on('end', () => {
        res.send({
            loansGiven: numLoansGiven,
            totalDispersed: totalAmountGiven
        })
        // res.end();
    })

};
