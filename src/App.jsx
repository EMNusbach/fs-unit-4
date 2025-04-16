import { useState } from 'react';
import TextsDisplayList from './components/TextsDisplayList';
import MainHeader from './components/MainHeader';

function App() {
  const [modalIsVisible, setModalIsVisible] = useState(false);

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
      <MainHeader onCreateText={showModalHandler} />
      <main>
        <TextsDisplayList
          isEditing={modalIsVisible}
          onStopEditing={hideModalHandler}
        />

      </main>
    </>

  );
}

export default App;