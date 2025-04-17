import { useEffect, useState } from 'react';

import TextDisplay from './TextDisplay';
import TextEditor from './TextEditor';
import Modal from './Modal';
import classes from './TextsDisplayList.module.css'

let userName = "Bob"; // Temp

const getInitialState = () => {
    const texts = localStorage.getItem(userName);
    return texts ? JSON.parse(texts) : [];
}

function TextsDisplayList({ isEditing, onStopEditing, onEditText, selectedText, onKeyFromKeyboard }) {
    const [texts, setTexts] = useState(getInitialState);

    useEffect(() => {
        localStorage.setItem(userName, JSON.stringify(texts));
    }, [texts]);

    function addTextHandler(textData) {
        setTexts((existingTexts) => {
          const index = existingTexts.findIndex(text => text.id === textData.id);
      
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
            {isEditing && (
                <Modal onClose={onStopEditing}>
                    <TextEditor
                        onCancel={onStopEditing}
                        onAddText={addTextHandler}
                        selectedText={selectedText}
                        onKeyFromKeyboard={onKeyFromKeyboard}
                        userName={userName} 
                    />
                </Modal>
            )}

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