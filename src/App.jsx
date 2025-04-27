import { useState } from 'react';
import LoginSignup from './components/LoginSignup';
import TextsDisplayList from './components/TextsDisplayList';
import MainHeader from './components/MainHeader';
import VirtualKeyboard from './components/VirtualKeyboard';


function App() {
  //const [modalIsVisible, setModalIsVisible] = useState(false);
  const [selectedText, setSelectedText] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false); //  Add login state
  const [userName, setUserName] = useState("");
  const [newNote, setNewNote] = useState(null);

  function getNextIdForUser(userName) {
    const key = `lastTextId_${userName}`;
    const lastId = parseInt(localStorage.getItem(key) || '0', 10);
    const newId = lastId + 1;
    localStorage.setItem(key, newId.toString());
    return newId;
  }
  
  // Show modal handler function
  function handleCreateNoteRequest() {
    const newId = getNextIdForUser(userName);
    const newNote = {
      id: newId,
      bodyParts: [],
      body: ''
    };

    setNewNote(newNote);
   /*  addTextHandler(newNote);
    setFocusedId(newId); */
  }
  
  function handleLogin(username) {
    setIsLoggedIn(true);
    setUserName(username);
  }
  function handleLogout() {
    // Remove cookies
    document.cookie = "user_name=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "user_password=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  
    // Clear local state
    localStorage.removeItem("current_user");
    setUserName("");
    setIsLoggedIn(false);
  }
  

  return (

    <div className="app-layout">
      {!isLoggedIn && <LoginSignup onLogin={handleLogin} />}

      {isLoggedIn && (
        <>
         
          <MainHeader onCreateText={handleCreateNoteRequest} onLogOut={handleLogout} userName={userName} 
          />

          <div className="content-area">
            <main>
              <TextsDisplayList newNote={newNote} userName={userName}/>
            </main>
          </div>

          <VirtualKeyboard />
        </>
      )}
    </div>

  );
}

export default App;