'use strict';
// //firestore init
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
exports.getInsightsOverTime = async (req, res) => {
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
        let loansAmountPerMonth = new Map();
        let loansGivenPerMonth = new Map();
        //large amount of data, using a stream here
        dbRef.stream().on('data', (documentSnapshot) => {
            let docData = documentSnapshot.data();
            //format for date in db is mm/dd/yyyy, split on / and grab first index to get mm 
            let month = returnMonth(docData.DateApproved.split("/")[0])
            //if this month is in the map then we already have a value for it, so get that value to append to it 
            let currAmountPerMonth = loansAmountPerMonth.has(month) ? loansAmountPerMonth.get(month) : 0;
            currAmountPerMonth += docData.InitialApprovalAmount
            //update the amount if this month existed in the key, or just make a new key with the curr value in the map
            loansAmountPerMonth.set(month, currAmountPerMonth)
            //get num loans per month 
            let currNumLoans = loansGivenPerMonth.has(month) ? loansGivenPerMonth.get(month) : 0;
            //update num loans per month 
            currNumLoans++;
            loansGivenPerMonth.set(month, currNumLoans);



        }).on('end', () => {
            let amntArray = autoConvertMap(loansAmountPerMonth)
            let apprArray = autoConvertMap(loansGivenPerMonth)
            let amntSorted = sortByMonth(amntArray)
            let apprSorted = sortByMonth(apprArray)


            res.send({
                amountPerMonth: formatForClient(amntSorted, "amountPerMonth"),
                approvedPerMonth: formatForClient(apprSorted, "approvedPerMonth")
            })
        })
    }

};

/**
 * 
 * @param {} arr 
 * @param {*} label 
 * @returns format response for client, so it doesnt have to lift. 
 */
const formatForClient = (arr, label) => {
    let jsonReturn = {
        labels: [],
        datasets: [{
            label: label,
            data: []
        }]
    }
    //array is in order so just iterate through and push to labels and datasets 
    arr.forEach((obj) => {
        let currKey = Object.keys(obj)
        jsonReturn.labels.push(currKey[0])
        jsonReturn.datasets[0].data.push(obj[currKey])
    })
    return jsonReturn;
}

/**
 * 
 * @param {} mm month in this format: 01, 05, etc 
 * @returns string version of month 
 */
const returnMonth = (mm) => {
    switch (mm) {
        case '01':
            return 'Jan';
        case '02':
            return 'Feb';
        case '03':
            return 'Mar';
        case '04':
            return 'Apr';
        case '05':
            return 'May';
        case '06':
            return 'Jun';
        case '07':
            return 'Jul';
        case '08':
            return 'Aug';
        case '09':
            return 'Sep';
        case '10':
            return 'Oct';
        case '11':
            return 'Nov';
        case '12':
            return 'Dec';
    }
}
/**
 * @param Map 
 * {
 *  May => 1, 
 *  Jun => 5
 * }
 *  
 * @returns 
 * [{may: 1}, {june: 5 }]
 * 
 */
const autoConvertMap = (map) => {
    const objArr = [];
    for (const item of [...map]) {
        let currVal = {}
        const [key, value] = item;
        currVal[key] = value
        //obj[key] = value;
        objArr.push(currVal)
    }
    return objArr;
}

/**
 * 
 * @param {*} arr 
 * [{may: 1}, {feb : 3}, {june: 5 }]
 * @returns 
 * [{feb: 3}, {may: 1}, {june: 5 }]
 */
function sortByMonth(arr) {
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return arr.sort(function (a, b) {
        return months.indexOf(Object.keys(a)[0])
            - months.indexOf(Object.keys(b)[0]);
    });

}