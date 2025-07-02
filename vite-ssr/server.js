import fastifyStatic from "@fastify/static";
import fastify from "fastify";
import { readFileSync } from "node:fs";
import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createElement as h } from "react";

// Differnt than renderToMarkup, it has the metadata it need to hydrate
import { renderToString } from "react-dom/server";
import App from "./App.js";

const __filename = fileURLToPath(import.meta.url); // import.meta.url => Url of the current module eg: file:///home/user/project/src/app.js
const __dirname = dirname(__filename);

const shell = readFileSync(path.join(__dirname, "dist", "index.html"), "utf-8");

const app = fastify();

app.register(fastifyStatic, {
  root: path.join(__dirname, "dist"),
  prefix: "/",
});

// Split the html into parts so we only replace inner HTML.
const parts = shell.split("<!--ROOT-->");

// Separating into parts so that we flush the head asap
app.get("/", (req, reply) => {
  reply.raw.write(parts[0]); // what is this?
  const reactApp = renderToString(h(App));

  console.log(reactApp);

  reply.raw.write(reactApp);
  reply.raw.write(parts[1]);
  reply.raw.end();
});

app.listen({ port: "3000" });
