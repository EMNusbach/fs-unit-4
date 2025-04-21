import { useEffect, useState } from 'react';
import TextDisplay from './TextDisplay';
import classes from './TextsDisplayList.module.css';

let userName = "Bob"; // Temp

// Function to get the initial state of texts from localStorage
const getInitialState = (userName) => {
  const texts = localStorage.getItem(userName);
  return texts ? JSON.parse(texts) : [];
};

function TextsDisplayList({ selectedText, userName }) {
  const [texts, setTexts] = useState(getInitialState(userName));
  const [focusedId, setFocusedId] = useState(null);

  useEffect(() => {
    localStorage.setItem(userName, JSON.stringify(texts));
  }, [texts, userName]);

  

  function addTextHandler(textData) {
    setTexts((existingTexts) => {
      const index = existingTexts.findIndex((text) => text.id === textData.id);
      if (index !== -1) {
        const updatedTexts = [...existingTexts];
        updatedTexts[index] = textData;
        return updatedTexts;
      } else {
        return [textData, ...existingTexts];
      }
    });
  }

  function deleteTextHandler(idToDelete) {
    setTexts((prev) => prev.filter((text) => text.id !== idToDelete));
  }

  useEffect(() => {
    if (selectedText) {
      const alreadyExists = texts.some((t) => t.id === selectedText.id);
      if (!alreadyExists) {
        setTexts((prev) => [selectedText, ...prev]);
      }
      setFocusedId(selectedText.id);
    }
  }, [selectedText]);

  return (
    <>
      {texts.length > 0 ? (
        <ul className={classes.texts}>
          {texts.map((text) => (
            <TextDisplay
              key={text.id}
              id={text.id}
              bodyParts={text.bodyParts}
              onCancel={() => {}}
              onSave={(updated) => addTextHandler({ id: text.id, ...updated })}
              isFocused={focusedId === text.id}
              onFocus={() => setFocusedId(text.id)}
              onDelete={deleteTextHandler}
              startEditing={focusedId === text.id}
            />
          ))}
        </ul>
      ) : (
        <div style={{ textAlign: 'center', color: 'white' }}>
          <h2>There are no texts yet.</h2>
          <p>Start adding some!</p>
        </div>
      )}
    </>
  );
}

export default TextsDisplayList;
