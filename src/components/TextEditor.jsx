import { useState, useEffect } from 'react';
import classes from './TextEditor.module.css';

/**
 * TextEditor component handles styled text input using a virtual keyboard.
 * It supports formatting styles like color, font size, family, bold, italic.
 * It separates the content into parts (titleParts & bodyParts), each with its own style.
 */
function TextEditor({ titleParts, setTitleParts, bodyParts, setBodyParts, onCancel, onAddText, onKeyFromKeyboard, selectedText, userName }) {
    const [focusedField, setFocusedField] = useState('title');
    const [currentStyle, setCurrentStyle] = useState({
        color: 'black',
        fontSize: '16px',
        fontFamily: 'Arial'
    });


    // Preload existing selectedText (if any) into editor fields
    // useEffect(() => {
    //     if (selectedText) {
    //         setTitleParts(selectedText.titleParts || []);
    //         setBodyParts(selectedText.bodyParts || []);
    //     } else {
    //         setTitleParts([]);
    //         setBodyParts([]);
    //     }
    // }, [selectedText]);

    // Generate the next available text ID for a given user
    function getNextIdForUser(userName) {
        const key = `lastTextId_${userName}`;
        const lastId = parseInt(localStorage.getItem(key) || '0', 10);
        const newId = lastId + 1;
        localStorage.setItem(key, newId.toString());
        return newId;
    }

    let currentStyleRef = currentStyle;    
    
    // Handle input from the virtual keyboard (style commands and character input)
    function handleVirtualKeyPress(key) {
      // This ref object keeps the most recent style for accurate text formatting
      let newStyle = { ...currentStyleRef };
    
      // Handle color change
      if (key.startsWith('{color:')) {
        const value = key.slice(7, -1);
        newStyle.color = value;
        setCurrentStyle(newStyle);
        currentStyleRef = newStyle;
        return;
      }
    
      // Handle font size change
      if (key.startsWith('{size:')) {
        const value = key.slice(6, -1);
        const fontSizeMap = {
          small: '14px',
          medium: '18px',
          large: '22px',
        };
        newStyle.fontSize = fontSizeMap[value] || newStyle.fontSize;
        setCurrentStyle(newStyle);
        currentStyleRef = newStyle;
        return;
      }
    
      // Handle font family change
      if (key.startsWith('{font:')) {
        const value = key.slice(6, -1);
        newStyle.fontFamily = value;
        setCurrentStyle(newStyle);
        currentStyleRef = newStyle;
        return;
      }
    
      // Handle bold toggle
      if (key.startsWith('{bold:')) {
        const value = key.slice(6, -1) === 'true';
        newStyle.fontWeight = value ? 'bold' : 'normal';
        setCurrentStyle(newStyle);
        currentStyleRef = newStyle;
        return;
      }
    
      // Handle italic toggle
      if (key.startsWith('{italic:')) {
        const value = key.slice(8, -1) === 'true';
        newStyle.fontStyle = value ? 'italic' : 'normal';
        setCurrentStyle(newStyle);
        currentStyleRef = newStyle;
        return;
      }
    
      // Handle backspace/delete
      if (key === 'Delete' || key === '←') {
        const updateParts = (setParts) => {
          setParts((prev) => {
            const last = prev[prev.length - 1];
            if (!last) return [];
            if (last.text.length === 1) return prev.slice(0, -1);
            return [...prev.slice(0, -1), { ...last, text: last.text.slice(0, -1) }];
          });
        };
     /*    (focusedField === 'title' ? updateParts(setTitleParts) : */ updateParts(setBodyParts)//);
        return;
      }
    
      // Create a new text part using the most recent style from currentStyleRef
      const newPart = { text: key, style: { ...currentStyleRef } };
    
   /*    if (focusedField === 'title') {
        setTitleParts((prev) => {
          const last = prev[prev.length - 1];
          if (last && JSON.stringify(last.style) === JSON.stringify(newPart.style)) {
            return [...prev.slice(0, -1), { ...last, text: last.text + key }];
          } else {
            return [...prev, newPart];
          }
        });
      } else { */
        setBodyParts((prev) => {
          const last = prev[prev.length - 1];
          if (last && JSON.stringify(last.style) === JSON.stringify(newPart.style)) {
            return [...prev.slice(0, -1), { ...last, text: last.text + key }];
          } else {
            return [...prev, newPart];
          }
        });
      }
    //}
    
       // Pre-fill the editor with selectedText (if exists)
       useEffect(() => {
        if (selectedText) {
         // setTitleParts(selectedText.titleParts || []);
          setBodyParts(selectedText.bodyParts || []);
        } else {
         // setTitleParts([]);
          setBodyParts([]);
        }
      }, [selectedText]);
    
    
    useEffect(() => {
      function handleVirtualKeyboardEvent(event) {
        if (event.detail) {
          handleVirtualKeyPress(event.detail);
        }
      }
    
      window.addEventListener('virtual-keypress', handleVirtualKeyboardEvent);
      return () => {
        window.removeEventListener('virtual-keypress', handleVirtualKeyboardEvent);
      };
    }, []);
    

    // Save handler for form submission
    function saveHandler(event) {
      event.preventDefault();
    
      const textData = {
        id: selectedText?.id || getNextIdForUser(userName),
       // titleParts,
        bodyParts,
       // title: titleParts.map(part => part.text).join(''),
        body: bodyParts.map(part => part.text).join('')
      };
    
      onAddText(textData);
      onCancel();
    }


    return (
        <form className={classes.form} onSubmit={saveHandler}>
            {/* <div>
                <label htmlFor="title">Title</label>
                <div
                    id="title"
                    className={`${classes.input} ${focusedField === 'title' ? classes.focused : ''}`}
                    onClick={() => setFocusedField('title')}
                >
                    {titleParts.length === 0
                        ? <span className={classes.placeholder}>Enter title...</span>
                        : titleParts.map((part, index) => (
                            <span key={index} style={part.style}>{part.text}</span>
                        ))}
                    {focusedField === 'title' && <span className={classes.caret}></span>}
                </div>
            </div> */}

            <div>
                <label htmlFor="body">Text</label>
                <div
                    id="body"
                    className={`${classes.textarea} ${focusedField === 'body' ? classes.focused : ''}`}
                    onClick={() => setFocusedField('body')}
                >
                    {bodyParts.length === 0
                        ? <span className={classes.placeholder}>Enter text...</span>
                        : bodyParts.map((part, index) => (
                            <span key={index} style={part.style}>{part.text}</span>
                        ))}
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