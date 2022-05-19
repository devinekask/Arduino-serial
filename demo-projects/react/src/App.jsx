import { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import useStore from "./store";

function App() {
  const increaseCount = useStore((state) => state.increaseCount);
  const count = useStore((state) => state.count);
  const connect = useStore((state) => state.connect);
  const disconnect = useStore((state) => state.disconnect);
  const connected = useStore((state) => state.connected);

  return (
    <div className="App">
      <button onClick={() => (connected ? disconnect() : connect())}>
        {connected ? "Disconnect" : "Connect"}
      </button>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Hello Vite + React!</p>

        <p>
          <button type="button" onClick={() => increaseCount()}>
            count is: {count}
          </button>
        </p>
      </header>
    </div>
  );
}

export default App;
