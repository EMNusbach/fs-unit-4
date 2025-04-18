import { useEffect, useState } from 'react';

import TextDisplay from './TextDisplay';
import TextEditor from './TextEditor';
import Modal from './Modal';
import classes from './TextsDisplayList.module.css'

let userName = "Bob"; // Temp

// Function to get the initial state of texts from localStorage
const getInitialState = () => {
    const texts = localStorage.getItem(userName);
    return texts ? JSON.parse(texts) : [];
}

function TextsDisplayList({ isEditing, onStopEditing, onEditText, selectedText, onKeyFromKeyboard }) {
    const [texts, setTexts] = useState(getInitialState);

    // Effect hook to update localStorage whenever 'texts' state changes
    useEffect(() => {
        localStorage.setItem(userName, JSON.stringify(texts));
    }, [texts]);

    // Handler to add a new text or update an existing text
    function addTextHandler(textData) {
        setTexts((existingTexts) => {
          const index = existingTexts.findIndex(text => text.id === textData.id);
      
          // If the text already exists, update it; otherwise, add it to the front of the list
          if (index !== -1) {
            const updatedTexts = [...existingTexts];
            updatedTexts[index] = textData;
            return updatedTexts;
          } else {
            return [textData, ...existingTexts];
          }
        });
      }
      
    return (
        <>
            {/* Modal for editing a text (visible when isEditing is true) */}
            {isEditing && (
                <Modal onClose={onStopEditing}>
                    <TextEditor
                        onCancel={onStopEditing} // Close editor handler
                        onAddText={addTextHandler} // Function to add or update text
                        selectedText={selectedText} // Pass the selected text to edit
                        onKeyFromKeyboard={onKeyFromKeyboard} // Keyboard input handler
                        userName={userName} // Pass username to the editor
                    />
                </Modal>
            )}

            {/* Render the list of texts if there are any */}
            {texts.length > 0 && (
                <ul className={classes.texts}>
                    {/* make sure key is unique */}
                    {texts.map((text) => (
                     <TextDisplay
                        key={text.id}
                        titleParts={text.titleParts}
                        bodyParts={text.bodyParts}
                        onClick={() => onEditText(text)}
                      />
                    ))}
                </ul>
            )}

            {/* Display a message when there are no texts yet */}
            {texts.length === 0 && (
                <div style={{ textAlign: 'center', color: 'white' }}>
                    <h2>There are no texts yet.</h2>
                    <p>Start adding some!</p>
                </div>
            )}


        </>

    );
}

export default TextsDisplayList;