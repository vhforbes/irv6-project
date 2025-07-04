import { useEffect } from "react";
import { marked } from "marked";
import { useState, useCallback, useMemo } from "react";

import MarkdownPreview from "./MarkdownPreview";
import markdownContent from "./markdownContent";

// The issue: everytime the interval changes or the text changes on the App, the child will also re-render
// Since MarkdownPreview is a expensivie rerender, because it renders heavy makdown, we need to solve it.
export default function App() {
  const [text, setText] = useState(markdownContent);
  const [time, setTime] = useState(Date.now());
  const [theme, setTheme] = useState("green");

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(Date.now());
    }, 100);
    // only clear the interval when exiting the page
    return () => clearInterval(interval);
  }, []);

  // options is begin re-created every time the interval changes
  // sice a = {} b = {} a === b = false, it will trigger rerender of makdown even if the values are functionaly the same, but the options is in a dff place in memory
  const options = useMemo(() => ({ text, theme }), [text, theme]);

  // both are the same...
  // const renderWithMemo
  // = useMemo((() => (text) => marked.parse(text), []));
  const render = useCallback((text) => marked.parse(text), []);
  // use callback is implemented using useMemo in react codebase

  // this is basically the same idea  of the diff objects, since on every re-render the function will be diff we need a way for it to keep the funcution the same unless change is needed

  // fn1 === fn2 = false , so we useCallback to memoize it, or we could just use a useMemo that returns a function

  // Don't use memo all the time
  // be carefull with memoized components above the tree, what is bellow wont render

  return (
    <div className="app">
      <h1>Performance with React</h1>
      <h2>Current Time: {time}</h2>
      <label htmlFor={"theme"}>
        Choose a theme:
        <select value={theme} onChange={(e) => setTheme(e.target.value)}>
          <option value="green">Green</option>
          <option value="blue">Blue</option>
          <option value="red">Red</option>
          <option value="yellow">Yellow</option>
        </select>
      </label>
      <div className="markdown">
        <textarea
          className="markdown-editor"
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>
        <MarkdownPreview options={options} render={render} />
      </div>
    </div>
  );
}
