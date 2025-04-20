import { useState} from 'react';
import TextsDisplayList from './components/TextsDisplayList';
import MainHeader from './components/MainHeader';
import VirtualKeyboard from './components/VirtualKeyboard';

function App() {
  const [modalIsVisible, setModalIsVisible] = useState(false);
  const [selectedText, setSelectedText] = useState(null);

  let userName = "Bob"; // Temp
  function getNextIdForUser(userName) {
    const key = `lastTextId_${userName}`;
    const lastId = parseInt(localStorage.getItem(key) || '0', 10);
    const newId = lastId + 1;
    localStorage.setItem(key, newId.toString());
    return newId;
  }
  // Show modal handler function
  function showModalHandler() {
    const newId = getNextIdForUser(userName);  
    const newNote = {
      id: newId,
      bodyParts: [],
      body: ''
    };
      setSelectedText(newNote);
  }
  

  // Hide modal handler function
  function hideModalHandler() {
    setModalIsVisible(false);
  }

  return (
     <>
      <div className="app-layout">
        <MainHeader onCreateText={showModalHandler} />

        <div className="content-area">
          <main>
            <TextsDisplayList
            selectedText={selectedText} 
            />
          </main>
        </div>

        <VirtualKeyboard />
      </div>
    </>
  );
}

export default App;