import { useState, useEffect } from 'react';
import classes from './TextEditor.module.css';

function TextEditor({ onCancel, onAddText, onKeyFromKeyboard }) {
  const [bodyParts, setBodyParts] = useState([]);
  const [titleParts, setTitleParts] = useState([]);
  const [focusedField, setFocusedField] = useState('title');
  const [currentStyle, setCurrentStyle] = useState({
    color: 'black',
    fontSize: '16px',
    fontFamily: 'Arial'
  });

  function handleVirtualKeyPress(key) {
    let updatedStyle = currentStyle;

    if (key.startsWith('{color:')) {
      const value = key.slice(7, -1);
      updatedStyle = { ...currentStyle, color: value };
      setCurrentStyle(updatedStyle);
      return;
    }
    if (key.startsWith('{size:')) {
      const value = key.slice(6, -1);
      const fontSizeMap = {
        small: '14px',
        medium: '18px',
        large: '22px',
        xlarge: '26px'
      };
      updatedStyle = { ...currentStyle, fontSize: fontSizeMap[value] || currentStyle.fontSize };
      setCurrentStyle(updatedStyle);
      return;
    }
    if (key.startsWith('{font:')) {
      const value = key.slice(6, -1);
      updatedStyle = { ...currentStyle, fontFamily: value };
      setCurrentStyle(updatedStyle);
      return;
    }

    // Handle deletion
    if (key === 'Delete' || key === '←') {
      if (focusedField === 'title') {
        setTitleParts((prev) => {
          const last = prev[prev.length - 1];
          if (!last) return [];
          if (last.text.length === 1) return prev.slice(0, -1);
          return [...prev.slice(0, -1), { ...last, text: last.text.slice(0, -1) }];
        });
      } else {
        setBodyParts((prev) => {
          const last = prev[prev.length - 1];
          if (!last) return [];
          if (last.text.length === 1) return prev.slice(0, -1);
          return [...prev.slice(0, -1), { ...last, text: last.text.slice(0, -1) }];
        });
      }
      return;
    }

    const newPart = { text: key, style: { ...updatedStyle } };

    if (focusedField === 'title') {
      setTitleParts((prev) => {
        const last = prev[prev.length - 1];
        if (last && JSON.stringify(last.style) === JSON.stringify(newPart.style)) {
          return [...prev.slice(0, -1), { ...last, text: last.text + key }];
        } else {
          return [...prev, newPart];
        }
      });
    } else {
      setBodyParts((prev) => {
        const last = prev[prev.length - 1];
        if (last && JSON.stringify(last.style) === JSON.stringify(newPart.style)) {
          return [...prev.slice(0, -1), { ...last, text: last.text + key }];
        } else {
          return [...prev, newPart];
        }
      });
    }
  }

  useEffect(() => {
    if (onKeyFromKeyboard) {
      onKeyFromKeyboard((key) => {
        handleVirtualKeyPress(key);
      });
    }
  }, [onKeyFromKeyboard, currentStyle, focusedField]);

  function saveHandler(event) {
    event.preventDefault();
    const textData = {
      title: titleParts.map(part => part.text).join(''),
      body: bodyParts.map(part => part.text).join('')
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
          {titleParts.length === 0
            ? <span className={classes.placeholder}>Enter title...</span>
            : titleParts.map((part, index) => (
                <span key={index} style={part.style}>{part.text}</span>
              ))}
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
