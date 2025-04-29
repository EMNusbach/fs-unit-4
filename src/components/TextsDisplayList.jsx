import { useState } from 'react';
import TextDisplay from './TextDisplay';
import classes from './TextsDisplayList.module.css';

// List of predefined sticky note colors
const stickyNoteColors = [
    '#fbb17c', '#fef38c', '#f98dd1',
    '#b788f5', '#74d1f6', '#a9f57b',
];

// Deterministically assign a color based on note ID
function getColorById(id, colors) {
    const numericId = typeof id === 'number' ? id : parseInt(id, 10);
    return colors[numericId % colors.length];
}

// Retrieve notes for a specific user from localStorage
function getInitialTexts(userName) {
    const allUsers = JSON.parse(localStorage.getItem('users')) || {};
    return allUsers[userName].notes || [];
}


function TextsDisplayList({ userName, newNote }) {
    // State hooks
    const [texts, setTexts] = useState(() => getInitialTexts(userName));
    const [focusedId, setFocusedId] = useState(null);

    // Register a global event listener only once to handle setting the focused note
    if (!window.__texts_display_focus_registered) {
        window.addEventListener('set-focused-note', (e) => {
            setFocusedId(e.detail); // This updates the focused note
        });
        window.__texts_display_focus_registered = true;
    }

    // If a new note is passed in and not already present, add it to the state
    if (newNote && !texts.find((t) => t.id === newNote.id)) {
        const updated = [newNote, ...texts];
        setTexts(updated);

        const allUsers = JSON.parse(localStorage.getItem('users')) || {};
        allUsers[userName].notes = updated;
        localStorage.setItem('users', JSON.stringify(allUsers));

        setFocusedId(newNote.id);
        setTimeout(() => {
            window.dispatchEvent(new CustomEvent('set-focused-note', { detail: newNote.id }));
        }, 0);
    }

    // Update an existing note
    function addOrUpdateText(noteData) {
        setTexts((prev) => {
            const index = prev.findIndex((t) => t.id === noteData.id);
            const updated = index !== -1
                ? [...prev.slice(0, index), noteData, ...prev.slice(index + 1)]
                : [noteData, ...prev];

            const allUsers = JSON.parse(localStorage.getItem('users')) || {};
            allUsers[userName].notes = updated;
            localStorage.setItem('users', JSON.stringify(allUsers));

            return updated;
        });
    }

    // Delete a note by ID
    function deleteText(idToDelete) {
        const updated = texts.filter((t) => t.id !== idToDelete);
        setTexts(updated);

        const allUsers = JSON.parse(localStorage.getItem('users')) || {};
        allUsers[userName].notes = updated;
        localStorage.setItem('users', JSON.stringify(allUsers));
    }

    // Render the list of notes (or nothing if empty)
    return (
        <>
            {texts.length > 0 ? (
                <ul className={classes.texts}>
                    {texts.map((text) => (
                        <TextDisplay
                            key={text.id}
                            id={text.id}
                            userName={userName}
                            bodyParts={text.bodyParts}
                            onSave={(updated) => addOrUpdateText({ id: text.id, ...updated })}
                            isFocused={focusedId === text.id}
                            onFocus={() => {
                                setFocusedId(text.id);
                                window.dispatchEvent(new CustomEvent('keyboard-reset-focus'));
                            }}
                            onDelete={deleteText}
                            startEditing={focusedId === text.id}
                            frameColor={getColorById(text.id, stickyNoteColors)}
                            
                        />
                    ))}
                </ul>
            ) :null}
        </>
    );
}

export default TextsDisplayList;
