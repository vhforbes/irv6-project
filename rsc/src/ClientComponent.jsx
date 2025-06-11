"use client";

import { useState } from "react";

export default function ClientComponent() {
  console.log("rendering Client Component");

  const [counter, setCouter] = useState(0);

  return (
    <fieldset>
      <legend>client component</legend>
      <p>Counter {counter}</p>
      <button onClick={() => setCouter(counter + 1)}>Increment</button>
    </fieldset>
  );
}
