import React, { useState } from 'react';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to React + Nginx</h1>
        <p>This application is built with React and served by Nginx</p>
        
        <div className="card">
          <h2>Counter Application</h2>
          <p>Current Count: <strong>{count}</strong></p>
          <button onClick={() => setCount(count + 1)}>
            Increment
          </button>
          <button onClick={() => setCount(count - 1)}>
            Decrement
          </button>
          <button onClick={() => setCount(0)}>
            Reset
          </button>
        </div>

        <div className="info">
          <h3>Features:</h3>
          <ul>
            <li>React 18 Application</li>
            <li>Nginx Web Server</li>
            <li>Docker & Docker Compose</li>
            <li>Multi-stage Build</li>
            <li>Optimized for Production</li>
          </ul>
        </div>
      </header>
    </div>
  );
}

export default App;
