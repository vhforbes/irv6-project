import { createRoot } from "react-dom/client";
import { createFromFetch } from "react-server-dom-webpack/client";
import "doodle.css/doodle.css";

console.log("fetching flight response");
const fetchPromise = fetch("/react-flight");
const root = createRoot(document.getElementById("root"));
const promise = createFromFetch(fetchPromise);
console.log("rendering root", promise);
root.render(promise);
