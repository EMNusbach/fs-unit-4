import { useState } from 'react';

import classes from './TextEditor.module.css';

function TextEditor({ onCancel, onAddText }) {
    const [enteredBody, setEnteredBody] = useState('');
    const [enteredTitle, setEnteredTitle] = useState('');

    // Body change handler function
    function bodyChangeHandler(event) {
        setEnteredBody(event.target.value);
    }

    // Title change handler function
    function titleChangeHandler(event) {
        setEnteredTitle(event.target.value);
    }

    // Save text handler function
    function saveHandler(event) {
        event.preventDefault();
        const textData={
            title: enteredTitle,
            body: enteredBody
        };
        onAddText(textData);
        onCancel();
    }

    return (
        <form className={classes.form} onSubmit={saveHandler}>
            <p>
                <label htmlFor="title">Title</label>
                <input type="text" id="title" required onChange={titleChangeHandler} />
            </p>
            <p>
                <label htmlFor="body">Text</label>
                <textarea id="body" required rows={5} onChange={bodyChangeHandler} />
            </p>
            <p className={classes.actions}>
                <button type="button" onClick={onCancel}>Cancel</button>
                <button>Save</button>
            </p>
        </form>
    );
}

export default TextEditor;