'use strict';
//const { } = require('./analytics-utils');
//firestore init
const admin = require('./node_modules/firebase-admin');
const serviceAccount = require("./key.json");
const collectionKey = "entities"; //name of the collection
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
const functions = require('firebase-functions');
const firestore = admin.firestore();
const settings = { timestampsInSnapshots: true };
firestore.settings(settings);

if (data && (typeof data === "object")) {
    Object.keys(data).forEach(LoanNumber => {
        firestore
            .collection(collectionKey)
            .doc(LoanNumber)
            .set(data[LoanNumber])
            .then((res) => {
                console.log("Document " + LoanNumber + " successfully written!");
            }).catch((error) => {
                console.error("Error writing document: ", error);
            });
    });
}


/**
 * HTTP Cloud Function.
 * This function is exported by index.js, and is executed when
 * you make an HTTP request to the deployed function's endpoint.
 *
 * @param {Object} req Cloud Function request context.
 *                     More info: https://expressjs.com/en/api.html#req
 * @param {Object} res Cloud Function response context.
 *                     More info: https://expressjs.com/en/api.html#res
  * example of what you're recieving: 
 * 
 * {
 *   "paths": [{
    *   "pathName": "string",
    *   "pathSummary": "string", 
    *   "pathDescription": "string", 
    *   "pathParameters": [], 
    *   "pathOperations": [
    *      { 
    *          "opperationType": "get", 
    *          "tags": ["tag1", "tag2", ... , "tagN"],
    *          "summary": "summary of operation 1", 
    *          "description": "description of operation", 
    *          "operationId": "operationId1", 
    *          "parameters": [{}, {}, ...., {}], 
    *          "responses": [{}, {}, {}], 
    *          "externalDocs": {"description": "", "url": "myurl.com"}
    *      
    *      }, 
    *      {
    *          ....
    *      }
    *    ]
    * },
    * {
    *  ...
    * }
    * ]
*   "commonParameters": [{...}, {...}...]
 * }
 */
exports.getPathObject = (req, res) => {
    let path = { paths: {}, components: {} };
    let commonParameters = {}
    let commonRequestBodies = {};
    let commonResponses = {};
    try {
        let arrayOfPaths = req.body.paths;
        //check to see if there are common parameters, its possible there are not 
        if ('commonParameters' in req.body) {

            commonParameters = { ...commonParameters, ...getParameters(req.body.commonParameters) }
        }
        //check to see if thera re common requst bodies, its possible there are not
        if ('commonRequestBodies' in req.body) {
            commonRequestBodies = { ...commonRequestBodies, ...getRequestBody(req.body.commonRequestBodies) }

        }
        if ('commonResponses' in req.body) {
            commonResponses = { ...commonResponses, ...getResponses(req.body.commonResponses) }
        }
        arrayOfPaths.map((currPath, index) => {
            let currPathObject = getCurrPathObject(currPath);
            path.paths = { ...path.paths, ...currPathObject }
        });
        path.components = { ...path.components, ...commonParameters, ...commonRequestBodies, ...commonResponses }
        //console logging for debugging
        //const jsonString = JSON.stringify(path, null, 2);

    }
    catch (err) {
        console.error(err.message);
    }
    res.send(path);
};
