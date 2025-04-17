import { useState,useRef} from 'react';
import TextsDisplayList from './components/TextsDisplayList';
import MainHeader from './components/MainHeader';
import VirtualKeyboard from './components/VirtualKeyboard';

function App() {
  const [modalIsVisible, setModalIsVisible] = useState(false);
  const keyHandlerRef = useRef(null);

  function handleKeyboardKey(key) {
    if (keyHandlerRef.current) {
      keyHandlerRef.current(key);
    }
  }

  // Show modal handler function
  function showModalHandler() {
    setModalIsVisible(true);
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
              isEditing={modalIsVisible}
              onStopEditing={hideModalHandler}
              onKeyFromKeyboard={(fn) => (keyHandlerRef.current = fn)}
            />
          </main>
        </div>

        <VirtualKeyboard onKeyPress={handleKeyboardKey}/>
      </div>
    </>
  );
}

export default App;