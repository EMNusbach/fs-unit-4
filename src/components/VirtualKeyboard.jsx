import React, { useState, useEffect  } from 'react';
import classes from './VirtualKeyboard.module.css';
import EmojiPicker from 'emoji-picker-react';

// English keyboard layout
const englishKeys = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['⇧', 'z', 'x', 'c', 'v', 'b', 'n', 'm', '.', '/', '⌫'],
];

// Hebrew keyboard layout
const hebrewKeys = [
  ['/', 'ק', 'ר', 'א', 'ט', 'ו', 'ן', 'ם', 'פ', '.'],
  ['ש', 'ד', 'ג', 'כ', 'ע', 'י', 'ח', 'ל', 'ך'],
  ['⇧', 'ז', 'ס', 'ב', 'ה', 'נ', 'מ', 'צ', 'ת', '⌫']
];

// Symbol keyboard layout
const symbolKeys = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
  ['@', '#', '$', '%', '&', '*', '-', '+', '=', '.', '/'],
  ['!', '?', '(', ')', '[', ']', '{', '}', '⌫']
];

function VirtualKeyboard() {
  const [language, setLanguage] = useState('en');
  const [isUppercase, setIsUppercase] = useState(true);
  const [layoutMode, setLayoutMode] = useState('letters'); // letters | symbols
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);

  const [focusedInput, setFocusedInput] = useState(null); // 'find' | 'replace' | null
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');

  const getCurrentLayout = () => {
    if (layoutMode === 'symbols') return symbolKeys;
    return language === 'en' ? englishKeys : hebrewKeys;
  };

  const currentKeys = getCurrentLayout();

  function handleKeyPress(key) {
    let char = key;

    if (key === '⇧') {
      setIsUppercase(prev => !prev);
      return;
    } else if (key === '⌫') {
      char = 'Delete';
    } else if (key === '&123') {
      setLayoutMode('symbols');
      return;
    } else if (key === 'ABC') {
      setLayoutMode('letters');
      return;
    } else if (key === '🌐') {
      setLanguage(prev => (prev === 'en' ? 'he' : 'en'));
      return;
    } else if (layoutMode === 'letters' && language === 'en' && key.length === 1) {
      char = isUppercase ? key.toUpperCase() : key.toLowerCase();
    }

    if (focusedInput === 'find') {
      if (char === 'Delete') {
        setFindText(prev => prev.slice(0, -1));
      } else {
        setFindText(prev => prev + char);
      }

    } else if (focusedInput === 'replace') {
      if (char === 'Delete') {
        setReplaceText(prev => prev.slice(0, -1));
      } else {
        setReplaceText(prev => prev + char);
      }

    } else {
      window.dispatchEvent(new CustomEvent('virtual-keypress', { detail: char }));
    }
  }

  function applyTextStyle(type, value) {
    if (value !== undefined && value !== '') {
      window.dispatchEvent(
        new CustomEvent('virtual-keypress', { detail: `{${type}:${value}}` })
      );
    }
  }

  // Reset focus
  useEffect(() => {
    const handleTextFocus = () => {
      setFocusedInput(null); 
    };
  
    window.addEventListener('text-body-focus', handleTextFocus);
    return () => window.removeEventListener('text-body-focus', handleTextFocus);
  }, []);

  return (
    <div className={classes.keyboardWrapper}>

      <div className={classes.sidePanelLeft}>
        <label className={classes.label}>Text Actions</label>

        <div className={classes.sidePanelLeftButtons}>
          <div className={classes.sideActionRow}>
            <button className={classes.sideButton}>Fined</button>
            <input
              type="text"
              placeholder="Find text"
              className={classes.sideInput}
              onClick={() => {}}
              onFocus={() => setFocusedInput('find')}
              onKeyDown={(e) => e.preventDefault()}
              value={findText}
              readOnly
            />
          </div>

          <div className={classes.sideActionRow}>
            <button className={classes.sideButton}>Replace</button>
            <input
              type="text"
              placeholder="Replace with"
              className={classes.sideInput}
              onFocus={() => setFocusedInput('replace')}
              onKeyDown={(e) => e.preventDefault()}
              value={replaceText}
              readOnly
            />
          </div>

          <button className={classes.sideButton}>Undo</button>
        </div>
      </div>

      <div className={classes.mainKeyboard}>
        {currentKeys.map((row, rowIndex) => (
          <div key={rowIndex} className={classes.row}>
            {row.map((key) => (
              <button
                key={key}
                className={classes.key}
                onClick={() => handleKeyPress(key)}
              >
                {layoutMode === 'letters' && language === 'en' && key.length === 1
                  ? (isUppercase ? key.toUpperCase() : key.toLowerCase())
                  : key}
              </button>
            ))}
          </div>
        ))}

        <div className={classes.row}>
          {layoutMode === 'letters' ? (
            <>
              <button className={classes.key} onClick={() => handleKeyPress('&123')}>&123</button>
              <button className={classes.key} onClick={() => setShowEmojiPicker(prev => !prev)}>😊</button>
              <button className={classes.key} onClick={() => handleKeyPress('🌐')}>🌐</button>
            </>
          ) : (
            <button className={classes.key} onClick={() => handleKeyPress('ABC')}>ABC</button>
          )}

          <button className={classes.keySpace} onClick={() => handleKeyPress(' ')}>Space</button>
          <button className={classes.key} onClick={() => handleKeyPress('\n')}>⏎</button>
        </div>
      </div>

      <div className={classes.sidePanelRight}>
        <label className={classes.label}>Text Style</label>
        <div className={classes.sidePanelRightButtons}>
          <div className={classes.selectButtons}>
            <select onChange={(e) => applyTextStyle('color', e.target.value)}>
              <option value="">Color</option>
              <option value="red">🟥 Red</option>
              <option value="green">🟩 Green</option>
              <option value="blue">🟦 Blue</option>
              <option value="orange">🟧 Orange</option>
              <option value="black">⬛ Black</option>
            </select>

            <select onChange={(e) => applyTextStyle('font', e.target.value)}>
              <option value="">Font</option>
              <option value="Arial">Arial</option>
              <option value="Courier New">Courier</option>
              <option value="Georgia">Georgia</option>
              <option value="Times New Roman">Times</option>
            </select>

            <select onChange={(e) => applyTextStyle('size', e.target.value)}>
              <option value="">Size</option>
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>
          <div className={classes.toggleButtons}>
            <button className={`${classes.toggleButton} ${isBold ? classes.active : ''}`} onClick={() => {
              const newBold = !isBold; setIsBold(newBold); applyTextStyle('bold', newBold);
            }}>
              <b>B</b>
            </button>
            <button className={`${classes.toggleButton} ${isItalic ? classes.active : ''}`} onClick={() => {
              const newItalic = !isItalic; setIsItalic(newItalic); applyTextStyle('italic', newItalic);
            }}>
              <i>I</i>
            </button>
          </div>
        </div>
      </div>

      {showEmojiPicker && (
        <div className={classes.emojiWrapper}>
          <EmojiPicker
            onEmojiClick={(emojiData) => {
              window.dispatchEvent(
                new CustomEvent('virtual-keypress', { detail: emojiData.emoji })
              );
              setShowEmojiPicker(false);
            }}
            height={300}
            width={300}
          />
        </div>
      )}
    </div>
  );
}

export default VirtualKeyboard;