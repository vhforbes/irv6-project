import { memo } from "react";
const JANK_DELAY = 150;

// Dont re-render if props havent changed their values, so the clock changes wont affect this component render
export default memo(function MarkdownPreview({ render, options }) {
  const expensiveRender = () => {
    const start = performance.now();
    // tie the thread for a bit
    while (performance.now() - start < JANK_DELAY) {}
    return null;
  };

  return (
    <div>
      <h1>Last Render: {Date.now()}</h1>
      <div
        className="markdown-preview"
        dangerouslySetInnerHTML={{ __html: render(options.text) }}
        style={{ color: options.theme }}
      ></div>
      {expensiveRender()}
    </div>
  );
});
