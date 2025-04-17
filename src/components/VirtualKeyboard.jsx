import React, { useState } from 'react';
import classes from './VirtualKeyboard.module.css';
import EmojiPicker from 'emoji-picker-react';


const englishKeys = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['⇧', 'z', 'x', 'c', 'v', 'b', 'n', 'm', '.', '/', '⌫'],
];

const hebrewKeys = [
  ['/', 'ק', 'ר', 'א', 'ט', 'ו', 'ן', 'ם', 'פ', '.'],
  ['ש', 'ד', 'ג', 'כ', 'ע', 'י', 'ח', 'ל', 'ך'],
  ['⇧', 'ז', 'ס', 'ב', 'ה', 'נ', 'מ', 'צ', 'ת', '⌫']
];

const symbolKeys = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
  ['@', '#', '$', '%', '&', '*', '-', '+', '=', '.', '/'],
  ['!', '?', '(', ')', '[', ']', '{', '}', '⌫']
];

function VirtualKeyboard({ onKeyPress }) {
  const [language, setLanguage] = useState('en');
  const [isUppercase, setIsUppercase] = useState(true);
  const [layoutMode, setLayoutMode] = useState('letters'); // letters | symbols
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);


  const getCurrentLayout = () => {
    if (layoutMode === 'symbols') return symbolKeys;
    return language === 'en' ? englishKeys : hebrewKeys;
  };

  const currentKeys = getCurrentLayout();

  function handleKeyPress(key) {
    if (key === '⇧') {
      setIsUppercase((prev) => !prev);
    } else if (key === '⌫') {
      onKeyPress?.('Delete');
    } else if (key === '&123') {
      setLayoutMode('symbols');
    } else if (key === 'ABC') {
      setLayoutMode('letters');
    } else if (key === '🌐') {
      setLanguage((prev) => (prev === 'en' ? 'he' : 'en'));
    } else {
      const char = layoutMode === 'letters' && language === 'en' && key.length === 1
        ? (isUppercase ? key.toUpperCase() : key.toLowerCase())
        : key;
      onKeyPress?.(char);
    }
  }

  return (
    <div className={classes.keyboardWrapper}>
      
      <div className={classes.sidePanelLeft}>
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
  
          <button className={classes.keySpace} onClick={() => onKeyPress?.(' ')}>Space</button>
          <button className={classes.key} onClick={() => handleKeyPress('\n')}>⏎</button>
        </div>
      </div>

      <div className={classes.sidePanelRight}>
        <label className={classes.label}>Text Style</label>
        <select onChange={(e) => onKeyPress?.(`{color:${e.target.value}}`)}>
            <option value="">Color</option>
            <option value="red">🟥 Red</option>
            <option value="green">🟩 Green</option>
            <option value="blue">🟦 Blue</option>
            <option value="orange">🟧 Orange</option>
            <option value="black">⬛ Black</option>
        </select>

        <select onChange={(e) => onKeyPress?.(`{font:${e.target.value}}`)}>
            <option value="">Font</option>
            <option value="Arial">Arial</option>
            <option value="Courier New">Courier</option>
            <option value="Georgia">Georgia</option>
            <option value="Times New Roman">Times</option>
        </select>

        <select onChange={(e) => onKeyPress?.(`{size:${e.target.value}}`)}>
            <option value="">Size</option>
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
            <option value="x-large">X-Large</option>
        </select>
     </div>

  
      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className={classes.emojiWrapper}>
          <EmojiPicker
            onEmojiClick={(emojiData) => {
              onKeyPress?.(emojiData.emoji);
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