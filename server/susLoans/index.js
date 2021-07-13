'use strict';
//firestore init
const admin = require('firebase-admin');
const fetch = require("node-fetch");
// const serviceAccount = require("../key.json");
// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount)
// });
admin.initializeApp()
const db = admin.firestore();
const settings = { timestampsInSnapshots: true };
db.settings(settings);
const placeKeyAPI = "https://api.placekey.io/v1/placekey"
const placeKeyAPIKey = process.env.PLACE_KEY
const safeGraphAPIKey = process.env.SAFE_GRAPH_KEY


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
exports.getSusLoans = async (req, res) => {
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
        let locationWithPlaceKey = [];
        let numFrauds = 0;
        //large amount of data, using a stream here
        dbRef.stream().on('data', async (documentSnapshot) => {
            let fraud = false;
            let docData = documentSnapshot.data();
            let placeKeyObject = await requestPlaceKey(docData)
            let placeKey = placeKeyObject.placekey
            let currObject = {
                loanNum: docData.LoanNumber,
                name: docData.BorrowerName,
                loanAmount: docData.InitialApprovalAmount,
                pkey: placeKey
            }

            if (placeKey === "Invalid address" || !placeKey) {
                fraud = true;
                numFrauds++;
            }
            currObject["fraud"] = fraud;
            locationWithPlaceKey.push(currObject)
            // if (placeKey) {
            //     let covidImpact = covidImpactScore(docData, placeKey)
            // }

        }).on('end', () => {
            res.send({
                locationData: locationWithPlaceKey,
                fraudCount: numFrauds

            })
        })
    }

};

const covidImpactScore = async (docData, pkeyObject) => {
    console.log("in covid impact")
    let monthGotLoan = docData.DateApproved.split("/")[0]
    let yearGotLoan = docData.DateApproved.split("/")[2]
    //making assumption that peak affected date is the date they were approved for loan. 
    //compare peak affected date visits to past visits
    // let peakAffectedDate = new Date(yearGotLoan, monthGotLoan)
    // let lastYearDate = new Date(yearGotLoan - 1, monthGotLoan)
    let allPatterns = await getPatterns(pkeyObject.placekey)
    console.log("allPatterns = ", allPatterns)
    console.log("location = ", allPatterns.locations)

}

const getPatterns = async (placekey) => {
    const queryStr = `query($placekey: Placekey!) {
	place(placekey: $placekey) { 
		placekey 
		safegraph_patterns {
            date_range_start
            date_range_end
            median_dwell
		}
        }
    }`;
    try {
        const response = await fetch('https://api.safegraph.com/v1/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': safeGraphAPIKey,
            },
            body: JSON.stringify({
                query: queryStr,
                variables: { placekey }
            })
        })
        return response.json()
    } catch (error) {
        console.error(error)
        return {};
    }
}

const requestPlaceKey = async (docData) => {
    let streetAdd = docData.BorrowerAddress
    let city = docData.BorrowerCity
    let region = docData.BorrowerState
    //only take first 5 of zip 
    let zip = docData.BorrowerZip.toString();
    let postalCode = zip.includes("-") ? zip.split("-")[0] : zip
    //this is for us covid relief, i feel like i can hard code this, sorry if this made u throw up 
    let countryCode = "US"
    let placeKey = await getPlaceKey(streetAdd, city, region, postalCode, countryCode)
    return placeKey;
}

/**
 * get place key for location
 * @param {} street 
 * @param {*} city 
 * @param {*} region 
 * @param {*} postal 
 * @param {*} country 
 * @returns 
 */
const getPlaceKey = async (street, city, region, postal, country, borrower_name) => {
    const data = {
        query: {
            street_address: street,
            city: city,
            region: region,
            postal_code: postal,
            iso_country_code: country,
            location_name: borrower_name

        }
    }
    try {
        const response = await fetch(placeKeyAPI, {
            method: 'POST',

            headers: {
                'X-API-KEY': placeKeyAPIKey,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data) // body data type must match "Content-Type" header

        });
        return response.json();
    } catch (error) {
        console.error(error)
        return {};
    }
}
