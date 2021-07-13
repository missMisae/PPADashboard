'use strict';
//firestore init
const admin = require('firebase-admin');
// const serviceAccount = require("../key.json");
// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount)
// });
admin.initializeApp()
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
    // Set CORS headers for preflight requests
    // Allows GETs from any origin with the Content-Type header
    // and caches preflight response for 3600s

    res.set('Access-Control-Allow-Origin', '*');

    if (req.method === 'OPTIONS') {
        // Send response to OPTIONS requests
        res.set('Access-Control-Allow-Methods', 'GET');
        res.set('Access-Control-Allow-Headers', 'Content-Type');
        res.set('Access-Control-Max-Age', '3600');
        res.status(204).send('');
    } else {
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
        })
    }

};
