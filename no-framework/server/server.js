const path = require("node:path");
const stream = require("node:stream");
const { readFileSync } = require("node:fs");
const { finished } = require("node:stream/promises");
const Fastify = require("fastify");
const fastifyStaticPlugin = require("@fastify/static");
const React = require("react");
const { renderToPipeableStream } = require("react-server-dom-webpack/server");
const AppImport = require("../src/app/App.jsx");

const App = AppImport.default;

const MANIFEST = readFileSync(
  path.resolve(__dirname, "../dist/react-client-manifest.json"),
  "utf8"
);
const MODULE_MAP = JSON.parse(MANIFEST);

const HTML_SHELL = readFileSync(
  path.resolve(__dirname, "../dist/index.html"),
  "utf8"
);

const PORT = process.env.PORT ? process.env.PORT : 3000;

const fastify = Fastify({
  logger: {
    transport: {
      target: "pino-pretty",
      options: {
        ignore: "pid,hostname",
      },
    },
    level: "debug",
  },
});

fastify.register(fastifyStaticPlugin, {
  root: path.join(__dirname, "../dist"),
  prefix: "/assets/",
});

fastify.register(fastifyStaticPlugin, {
  root: path.join(__dirname, "../public"),
  decorateReply: false,
});

fastify.get("/", async function rootHandler(request, reply) {
  let flightResponse = "";
  const flightStream = new stream.Writable({
    write: (chunk, encoding, next) => {
      request.log.debug("accumulating React Flight chunk");
      request.log.debug(String(chunk));
      flightResponse += chunk;
      next();
    },
  });
  const { pipe } = renderToPipeableStream(React.createElement(App), MODULE_MAP);
  pipe(flightStream);
  await finished(flightStream);
  request.log.info("accumulated React Flight Response.");
  request.log.info(
    "serving HTML shell with injected inline Flight response ..."
  );
  reply.header("Content-Type", "text/html");
  return HTML_SHELL.replace("<!--FLIGHT-->", JSON.stringify(flightResponse));
});

fastify.get("/react-flight", function reactFlightHandler(request, reply) {
  try {
    if (!request.query.props) {
      throw new Error("Missing expected 'props' querystring parameter");
    }

    const props = JSON.parse(request.query.props);
    request.log.debug(
      "incoming /react-flight request with props, validating ...",
      { props }
    );

    reply.header("Content-Type", "application/octet-stream");
    const { pipe } = renderToPipeableStream(
      React.createElement(App, props),
      MODULE_MAP
    );
    pipe(reply.raw);
  } catch (err) {
    request.log.error("react-flight err", err);
    throw err;
  }
});

module.exports = async function start() {
  try {
    await fastify.listen({ port: PORT });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
