import { useState } from 'react';
import TextDisplay from './TextDisplay';
import classes from './TextsDisplayList.module.css';

const stickyNoteColors = [
    '#fbb17c', '#fef38c', '#f98dd1',
    '#b788f5', '#74d1f6', '#a9f57b',
];

function getInitialTexts(userName) {
    const allUsers = JSON.parse(localStorage.getItem('users')) || {};
    return allUsers[userName].notes || [];
}

function getColorById(id, colors) {
    const numericId = typeof id === 'number' ? id : parseInt(id, 10);
    return colors[numericId % colors.length];
}

function TextsDisplayList({ userName, newNote }) {
    const [texts, setTexts] = useState(() => getInitialTexts(userName));
    const [focusedId, setFocusedId] = useState(null);

    // Manual event listener registration 
    if (!window.__texts_display_focus_registered) {

        window.addEventListener('set-focused-note', (e) => {
            setFocusedId(e.detail); // This updates the focused note
        });

        window.__texts_display_focus_registered = true;
    }

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

    function deleteText(idToDelete) {
        const updated = texts.filter((t) => t.id !== idToDelete);
        setTexts(updated);
        const allUsers = JSON.parse(localStorage.getItem('users')) || {};
        allUsers[userName].notes = updated;
        localStorage.setItem('users', JSON.stringify(allUsers));


    }

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
                            onCancel={() => { }}
                            onSave={(updated) => addOrUpdateText({ id: text.id, ...updated })}
                            isFocused={focusedId === text.id}
                            onFocus={() => {
                                setFocusedId(text.id);
                                window.dispatchEvent(new CustomEvent('keyboard-reset-focus'));
                            }

                            }
                            onDelete={deleteText}
                            startEditing={focusedId === text.id}
                            frameColor={getColorById(text.id, stickyNoteColors)}

                        />
                    ))}
                </ul>
            ) : (
                <div style={{ textAlign: 'center', color: 'white' }}>
                    <h2>No notes yet</h2>
                    <p>Click \"New Text\" to start writing.</p>
                </div>
            )}
        </>
    );
}

export default TextsDisplayList;
