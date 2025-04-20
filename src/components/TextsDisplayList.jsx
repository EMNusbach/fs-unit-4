import { useEffect, useState } from 'react';

import TextDisplay from './TextDisplay';
import TextEditor from './TextEditor';
import Modal from './Modal';
import classes from './TextsDisplayList.module.css'

let userName = "Bob"; // Temp

// Get initial texts from localStorage
const getInitialState = () => {
    const texts = localStorage.getItem(userName);
    return texts ? JSON.parse(texts) : [];
}

/**
 * Displays the list of texts and controls editing via the modal TextEditor.
 * Text parts are stored with styles and updated through virtual keyboard input.
 */
function TextsDisplayList({ isEditing, onStopEditing, onEditText, selectedText, onKeyFromKeyboard }) {
    const [texts, setTexts] = useState(getInitialState);

    const [titleParts, setTitleParts] = useState([]);
    const [bodyParts, setBodyParts] = useState([]);

    // Pre-fill text fields when editing an existing text
    useEffect(() => {
        if (selectedText) {
            setTitleParts(selectedText.titleParts || []);
            setBodyParts(selectedText.bodyParts || []);
        } else {
            setTitleParts([]);
            setBodyParts([]);
        }
    }, [selectedText]);

    // Persist all texts to localStorage when updated
    useEffect(() => {
        localStorage.setItem(userName, JSON.stringify(texts));
    }, [texts]);

    // Add or update a text entry
    function addTextHandler(textData) {
        setTexts((existingTexts) => {
            const index = existingTexts.findIndex(text => text.id === textData.id);

            // Update if already exists, otherwise add new
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
                        titleParts={titleParts}
                        setTitleParts={setTitleParts}
                        bodyParts={bodyParts}
                        setBodyParts={setBodyParts}
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
                    {texts.map((text) => {
                        const isSelected = selectedText && text.id === selectedText.id;
                        return (

                            <TextDisplay
                                key={text.id}
                                titleParts={isSelected ? titleParts : text.titleParts}
                                bodyParts={isSelected ? bodyParts : text.bodyParts}
                                onClick={() => onEditText(text)}
                            />
                        );
                    })}
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