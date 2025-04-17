import { useState,useEffect } from 'react';

import classes from './TextEditor.module.css';

function TextEditor({ onCancel, onAddText, onKeyFromKeyboard }) {
    const [enteredBody, setEnteredBody] = useState('');
    const [enteredTitle, setEnteredTitle] = useState('');
    const [focusedField, setFocusedField] = useState('body');

   /*  // Body change handler function
    function bodyChangeHandler(event) {
        setEnteredBody(event.target.value);
    }

    // Title change handler function
    function titleChangeHandler(event) {
        setEnteredTitle(event.target.value);
    } */
    function handleVirtualKeyPress(key) {
        if (key === 'Delete') {
          // DELETE
          if (focusedField === 'title') {
            setEnteredTitle((prev) => prev.slice(0, -1));
          } else {
            setEnteredBody((prev) => prev.slice(0, -1));
          }
        } else {
          // ADD
          if (focusedField === 'title') {
            setEnteredTitle((prev) => prev + key);
          } else {
            setEnteredBody((prev) => prev + key);
          }
        }
      }
      useEffect(() => {
        if (onKeyFromKeyboard) {
          onKeyFromKeyboard((key) => {
            handleVirtualKeyPress(key);
          });
        }
      }, [onKeyFromKeyboard, focusedField]);
    
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
        <div>
          <label htmlFor="title">Title</label>
          <div
            id="title"
            className={`${classes.input} ${focusedField === 'title' ? classes.focused : ''}`}
            onClick={() => setFocusedField('title')}
          >
            {enteredTitle || <span className={classes.placeholder}>Enter title...</span>}
            {focusedField === 'title' && <span className={classes.caret}></span>}
          </div>
        </div>
      
        <div>
          <label htmlFor="body">Text</label>
          <div
            id="body"
            className={`${classes.textarea} ${focusedField === 'body' ? classes.focused : ''}`}
            onClick={() => setFocusedField('body')}
          >
            {enteredBody || <span className={classes.placeholder}>Enter text...</span>}
            {focusedField === 'body' && <span className={classes.caret}></span>}
          </div>
        </div>
      
        <p className={classes.actions}>
          <button type="button" onClick={onCancel}>Cancel</button>
          <button>Save</button>
        </p>
      </form>
      
    );
}

export default TextEditor;