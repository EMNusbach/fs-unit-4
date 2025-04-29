import { useState } from 'react';
import LoginSignup from './components/LoginSignup';
import TextsDisplayList from './components/TextsDisplayList';
import MainHeader from './components/MainHeader';
import VirtualKeyboard from './components/VirtualKeyboard';


function App() {
  // State hooks
  const [isLoggedIn, setIsLoggedIn] = useState(false);  // Tracks login status
  const [userName, setUserName] = useState("");         // Stores logged-in username
  const [newNote, setNewNote] = useState(null);         // Stores a newly created note

  // Generates next ID for new notes
  function getNextIdForUser(userName) {
    const key = `lastTextId_${userName}`;
    const lastId = parseInt(localStorage.getItem(key) || '0', 10);
    const newId = lastId + 1;
    localStorage.setItem(key, newId.toString());
    return newId;
  }

  // Handler: User requests to create a new note
  function handleCreateNoteRequest() {
    const newId = getNextIdForUser(userName);
    const newNote = {
      id: newId,
      bodyParts: [],
      body: ''
    };
    setNewNote(newNote);
  }

  // Handler: User logs in
  function handleLogin(username) {
    setIsLoggedIn(true);
    setUserName(username);
  }

  // Handler: User logs out
  function handleLogout() {
    // Remove cookies
    document.cookie = "user_name=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "user_password=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // Clear localStorage and reset state
    localStorage.removeItem("current_user");
    setUserName("");
    setIsLoggedIn(false);
  }


  return (

    <div className="app-layout">
      {/* Show login/signup form if not logged in */}
      {!isLoggedIn && <LoginSignup onLogin={handleLogin} />}

      {/* Main app layout if logged in */}
      {isLoggedIn && (
        <>
          <MainHeader
            onCreateText={handleCreateNoteRequest}
            onLogOut={handleLogout}
            userName={userName}
          />

          <div className="content-area">
            <main>
              <TextsDisplayList newNote={newNote} userName={userName} />
            </main>
          </div>

          <VirtualKeyboard />
        </>
      )}
    </div>
  );
}

export default App;