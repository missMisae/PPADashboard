
const http = require("http");
const path = require("path");
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const yamljs = require("yamljs");
const resolveRefs = require("json-refs").resolveRefs;
var cors = require('cors');
const { getImmediateInsights } = require("./immediateInsights/index.js");
const { getInsightsOverTime } = require("./insightsOverTime/index.js");
const { getSusLoans } = require("./susLoans/index.js");
/**
 * Return JSON with resolved references
 * @param {array | object} root - The structure to find JSON References within (Swagger spec)
 * @returns {Promise.<JSON>}
 */
const multiFileSwagger = (root) => {
    const options = {
        filter: ["relative", "remote"],
        loaderOptions: {
            processContent: function (res, callback) {
                callback(null, yamljs.parse(res.text));
            },
        },
    };

    return resolveRefs(root, options).then(
        function (results) {
            return results.resolved;
        },
        function (err) {
            console.log(err.stack);
        }
    );
};

const createServer = async () => {
    const app = express();

    const swaggerDocument = await multiFileSwagger(
        yamljs.load(path.resolve(__dirname, "./openapi-root.yaml"))
    );
    app.use(cors())
    app.use(express.json())
    app.use(express.urlencoded());

    app.use("/api/doc", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    app.use("/immediateInsights", getImmediateInsights)
    app.use("/insightsOverTime", getInsightsOverTime)
    app.use("/susLoans", getSusLoans)

    const server = http.createServer(app);

    return server;
};

createServer()
    .then((server) => {
        const port = 8080;
        server.listen(port);
        console.log(`[API] Webhook is running on port ${port}`);
        console.log(`[API] Swagger UI available with path: /api/doc`);
    })
    .catch((err) => {
        console.error(err.stack);
        process.exit(1);
    });