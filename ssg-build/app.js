import { createElement as h } from "react";

// Built like this so we dont need to setup the build that will transpile the JSX to JS code
function App() {
  return h(
    "div",
    null,
    h("h1", null, "Hello FE Masters"),
    h("p", null, "This is SSG")
  );
}

export default App;
