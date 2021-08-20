import { useState } from 'react';

// Components
import Header from './layout/header';

// Styles
import './App.css';

function App() {
  const [socket, setSocket] = useState(null);

  return (
    <div className="App">
      <Header socket={socket} setSocket={setSocket} />
    </div>
  );
}

export default App;
