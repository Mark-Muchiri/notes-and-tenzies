import './App.css';
import Main from './components/Main/Main';
import Navbar from './components/navbar/Navbar';
import { useState } from 'react';

function App() {
  const [toggler, setToggler] = useState(false);
  function toggleFunction() {
    setToggler(switcher => !switcher)
  }
  return (
    <>
      <div className="container">
        <Navbar
          darkMode={toggler}
          toggleDarkMode={toggleFunction}
        />
        <Main
          darkMode={toggler}
        />
      </div>
    </>
  );
}

export default App;
