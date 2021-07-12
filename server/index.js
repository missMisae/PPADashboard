
const http = require("http");
const path = require("path");
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const yamljs = require("yamljs");
const resolveRefs = require("json-refs").resolveRefs;
const { getSchemaObject } = require("./schema-object/index");
var cors = require('cors');
const { getInfoObject } = require("./info-object/index");
const { getPathObject } = require("./path-object/index");

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
    app.use("/schemaObject", getSchemaObject)

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