import { createRoot } from "react-dom/client";
import { createFromReadableStream } from "react-server-dom-webpack/client";
import "doodle.css/doodle.css";

const flightEl = document.getElementById("react-flight");
const flightResponseText = JSON.parse(flightEl.textContent);

console.log("parsed initial flight response");
for (const flightResponseChunk of flightResponseText
  .split("\n")
  // filters out empty chunks
  .filter((chunk) => chunk)) {
  console.log("chunk", flightResponseChunk);
}

const flightTreePromise = createFromReadableStream(
  new Response(flightResponseText).body
);

const root = createRoot(document.getElementById("root"));

console.log("rendering root", flightTreePromise);
root.render(flightTreePromise);
