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
  ['⇧', 'ז', 'ס', 'ב', 'ה', 'נ', 'מ', 'צ', 'ת', '⌫'],
];

const symbolKeys = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
  ['@', '#', '$', '%', '&', '*', '-', '+', '=', '.', '/'],
  ['!', '?', '(', ')', '[', ']', '{', '}', '⌫'],
];

function VirtualKeyboard() {
  const [language, setLanguage] = useState('en');
  const [isUppercase, setIsUppercase] = useState(true);
  const [layoutMode, setLayoutMode] = useState('letters');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
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
      setFindText(prev => char === 'Delete' ? prev.slice(0, -1) : prev + char);
    } else if (focusedInput === 'replace') {
      setReplaceText(prev => char === 'Delete' ? prev.slice(0, -1) : prev + char);
    } else {
      window.dispatchEvent(new CustomEvent('virtual-keypress', { detail: char }));
    }
  }

  function handleFindClick() {
    window.dispatchEvent(new CustomEvent('find-text', { detail: findText }));
  }

  function handleReplaceClick() {
    window.dispatchEvent(new CustomEvent('replace-text', {
      detail: { find: findText, replace: replaceText }
    }));
  }

  function handleAppTolayAllClick() {
    window.dispatchEvent(new CustomEvent('apply-style-to-all'));
  }

  function applyTextStyle(type, value) {
    if (value !== '') {
      window.dispatchEvent(new CustomEvent('virtual-keypress', { detail: `{${type}:${value}}` }));
    }
  }

  if (!window.__virtual_keyboard_initialized) {
    window.addEventListener('keyboard-reset-focus', () => setFocusedInput(null));
    window.__virtual_keyboard_initialized = true;
  }
  
  if (!window.__virtual_keyboard_style_listener) {
    window.addEventListener('update-style-ui', (e) => {
      const style = e.detail;
      console.log('set style', style);
      document.querySelector('select[data-style="color"]').value = style.color || '';
      document.querySelector('select[data-style="font"]').value = style.fontFamily || '';
      document.querySelector('select[data-style="size"]').value =  Object.entries({
        '14px': 'small',
        '18px': 'medium',
        '20px': 'large'
      }).find(([px]) => px === style.fontSize)?.[1] || '';
      
      setIsBold(style.fontWeight === 'bold');
      setIsItalic(style.fontStyle === 'italic');
    });
    window.__virtual_keyboard_style_listener = true;
  }
  

  return (
    <div className={classes.keyboardWrapper}>
      <div className={classes.sidePanelLeft}>
        <label className={classes.label}>Text Actions</label>
        <div className={classes.sidePanelLeftButtons}>
          <div className={classes.deleteButtons}>
            <div className={classes.sideActionRow}>
              <button className={classes.sideButton} onClick={handleFindClick}>Find</button>
              <input
                type="text"
                placeholder="Find text"
                className={classes.sideInput}
                value={findText}
                onFocus={() => setFocusedInput('find')}
                onKeyDown={e => e.preventDefault()}
                readOnly
              />
            </div>
            <div className={classes.sideActionRow}>
              <button className={classes.sideButton} onClick={handleReplaceClick}>Replace</button>
              <input
                type="text"
                placeholder="Replace with"
                className={classes.sideInput}
                value={replaceText}
                onFocus={() => setFocusedInput('replace')}
                onKeyDown={e => e.preventDefault()}
                readOnly
              />
            </div>
          </div>
          <div className={classes.deleteButtons}>
            <button className={classes.sideButton} onClick={() => window.dispatchEvent(new CustomEvent('undo-text'))}>Undo</button>
            <button className={classes.sideButton} onClick={() => window.dispatchEvent(new CustomEvent('virtual-keypress', { detail: '{deleteWord}' }))}>Delete Word</button>
            <button className={classes.sideButton} onClick={() => window.dispatchEvent(new CustomEvent('virtual-keypress', { detail: '{deleteAll}' }))}>Delete All</button>
          </div>
        </div>
      </div>

      <div className={classes.mainKeyboard}>
        {currentKeys.map((row, i) => (
          <div key={i} className={classes.row}>
            {row.map((key) => (
              <button key={key} className={classes.key} onClick={() => handleKeyPress(key)}>
                {layoutMode === 'letters' && language === 'en' && key.length === 1 ? (isUppercase ? key.toUpperCase() : key.toLowerCase()) : key}
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
          <select data-style="color" onChange={(e) => applyTextStyle('color', e.target.value)}>
              <option value="">Color</option>
              <option value="red">🟥 Red</option>
              <option value="green">🟩 Green</option>
              <option value="blue">🟦 Blue</option>
              <option value="orange">🟧 Orange</option>
              <option value="black">⬛ Black</option>
            </select>
            <select data-style="font" onChange={(e) => applyTextStyle('font', e.target.value)}>
              <option value="">Font</option>
              <option value="Arial">Arial</option>
              <option value="Courier New">Courier</option>
              <option value="Georgia">Georgia</option>
              <option value="Times New Roman">Times</option>
            </select>
            <select data-style="size" onChange={(e) => applyTextStyle('size', e.target.value)}>
              <option value="">Size</option>
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
            <button className={classes.sideButton} onClick={handleAppTolayAllClick}>Apply to All</button>
          </div>
          <div className={classes.toggleButtons}>
            <button className={`${classes.toggleButton} ${isBold ? classes.active : ''}`} onClick={() => {
              const newBold = !isBold;
              setIsBold(newBold);
              applyTextStyle('bold', newBold);
            }}>
              <b>B</b>
            </button>
            <button className={`${classes.toggleButton} ${isItalic ? classes.active : ''}`} onClick={() => {
              const newItalic = !isItalic;
              setIsItalic(newItalic);
              applyTextStyle('italic', newItalic);
            }}>
              <i>I</i>
            </button>
          </div>
        </div>
      </div>

      {showEmojiPicker && (
        <div className={classes.emojiWrapper}>
          <EmojiPicker
            height={300}
            width={300}
            onEmojiClick={(emojiData) => {
              window.dispatchEvent(new CustomEvent('virtual-keypress', { detail: emojiData.emoji }));
              setShowEmojiPicker(false);
            }}
          />
        </div>
      )}
    </div>
  );
}

export default VirtualKeyboard;