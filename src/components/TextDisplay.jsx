import { useState} from 'react';
import classes from './TextDisplay.module.css';

function TextDisplay({
    id,
    bodyParts = [],
    onSave,
    onCancel,
    isFocused,
    onFocus,
    onDelete,
    startEditing,
    frameColor
}) {
    // === State ===
    const [isEditing, setIsEditing] = useState(startEditing || false);
    const [localParts, setLocalParts] = useState(bodyParts);
    const [undoStack, setUndoStack] = useState([]);
    const [currentStyle, setCurrentStyle] = useState({
        color: 'black',
        fontSize: '16px',
        fontFamily: 'Arial',
    });
    const [searchTerm, setSearchTerm] = useState('');
    let currentStyleRef = currentStyle;

    if (!window[`__registered_find_${id}`]) {
        window.addEventListener('find-text', (e) => {
          setSearchTerm(e.detail);
        });
        window[`__registered_find_${id}`] = true;
      }
      

      if (!window[`__registered_undo_${id}`]) {
        window.addEventListener('undo-text', () => {
          handleUndo();
        });
        window[`__registered_undo_${id}`] = true;
      }
      

      if (!window[`__registered_apply_all_${id}`]) {
        window.addEventListener('apply-style-to-all', () => {
          setLocalParts(prevParts => {
            pushToUndoStack(prevParts);
            return prevParts.map(part => ({
              ...part,
              style: { ...currentStyle }
            }));
          });
        });
        window[`__registered_apply_all_${id}`] = true;
      }
      
    if (!window[`__registered_keypress_${id}`]) {
        window.addEventListener('virtual-keypress', (e) => {
          handleVirtualKeyPress(e.detail); 
        });
        window[`__registered_keypress_${id}`] = true;
      }
      
    if (!window[`__registered_replace_${id}`]) {
        window.addEventListener('replace-text', (e) => {
          const { find, replace } = e.detail;
          if (!find) return;
      
          setLocalParts(prevParts => {
            pushToUndoStack(prevParts);
            return prevParts.flatMap(part => {
              const pieces = part.text.split(find);
              if (pieces.length === 1) return [part];
      
              const result = [];
              for (let i = 0; i < pieces.length; i++) {
                if (pieces[i]) result.push({ ...part, text: pieces[i] });
                if (i < pieces.length - 1) result.push({ ...part, text: replace });
              }
              return result;
            });
          });
        });
        window[`__registered_replace_${id}`] = true;
      }

      if (!window[`__registered_note_focus_${id}`]) {
        window.addEventListener('set-focused-note', (e) => {
          const newId = e.detail;
          if (newId === id) {
            window.__active_text_id = id;
          }
        });
        window[`__registered_note_focus_${id}`] = true;
      }
      
      
    // === Helpers ===
    function highlightMatches(parts, searchTerm) {
        if (!searchTerm) return parts;

        const highlighted = [];
        parts.forEach((part) => {
            const index = part.text.toLowerCase().indexOf(searchTerm.toLowerCase());

            if (index === -1) {
                highlighted.push(part);
            } else {
                const before = part.text.slice(0, index);
                const match = part.text.slice(index, index + searchTerm.length);
                const after = part.text.slice(index + searchTerm.length);

                if (before) highlighted.push({ text: before, style: part.style });
                highlighted.push({ text: match, style: { ...part.style, backgroundColor: 'yellow' } });
                if (after) highlighted.push({ text: after, style: part.style });
            }
        });

        return highlighted;
    }

    function handleVirtualKeyPress(key) {
        if (window.__active_text_id !== id) return;

        let newStyle = { ...currentStyleRef };

        if (key.startsWith('{color:')) {
            newStyle.color = key.slice(7, -1);
        } else if (key.startsWith('{size:')) {
            const size = key.slice(6, -1);
            newStyle.fontSize = { small: '14px', medium: '18px', large: '22px' }[size] || newStyle.fontSize;
        } else if (key.startsWith('{font:')) {
            newStyle.fontFamily = key.slice(6, -1);
        } else if (key.startsWith('{bold:')) {
            newStyle.fontWeight = key.slice(6, -1) === 'true' ? 'bold' : 'normal';
        } else if (key.startsWith('{italic:')) {
            newStyle.fontStyle = key.slice(8, -1) === 'true' ? 'italic' : 'normal';
        } else if (key === 'Delete' || key === '←') {
            setLocalParts((prev) => {
                pushToUndoStack(prev); 
                const last = prev[prev.length - 1];
                if (!last) return [];
                if (last.text.length === 1) return prev.slice(0, -1);
                return [...prev.slice(0, -1), { ...last, text: last.text.slice(0, -1) }];
            });
            return;
        } else if (key === '{deleteWord}') {
            setLocalParts((prev) => {
                pushToUndoStack(prev); 
                if (prev.length === 0) return [];
                const last = prev[prev.length - 1];
                const newText = last.text.trimEnd().split(' ');
                if (newText.length <= 1) {
                    return prev.slice(0, -1);
                }
                const updatedLast = { ...last, text: newText.slice(0, -1).join(' ') + ' ' };
                return [...prev.slice(0, -1), updatedLast];
            });
            return;
        } else if (key === '{deleteAll}') {
            setLocalParts(prev => {
                pushToUndoStack(prev);
                return [];
            });
            return;
        }

         else {
            const newPart = { text: key, style: { ...currentStyleRef } };
            setLocalParts((prev) => {
                pushToUndoStack(prev); 
                const last = prev[prev.length - 1];
                if (last && JSON.stringify(last.style) === JSON.stringify(newPart.style)) {
                    return [...prev.slice(0, -1), { ...last, text: last.text + key }];
                } else {
                    return [...prev, newPart];
                }
            });
        }

        setCurrentStyle(newStyle);
        currentStyleRef = newStyle;
    }

    function handleUndo() {
        setUndoStack(prevStack => {
            if (prevStack.length === 0) return prevStack;
    
            const newStack = [...prevStack];
            const lastState = newStack.pop();
            setLocalParts(lastState);
            return newStack;
        });
    }
    

    // === Event Handlers ===
    function handleEditClick() {
        startEditing=true;
        onFocus?.();
        setLocalParts(bodyParts);
        window.__active_text_id = id;
        window.dispatchEvent(new CustomEvent('set-focused-note', { detail: id }));
      }
      
    function handleCancelClick() {
        setIsEditing(false);
    }

    function handleSaveClick() {
        const updatedText = {
            bodyParts: localParts,
            body: localParts.map(part => part.text).join('')
        };
        onSave?.(updatedText);
        setIsEditing(false);
    }

    function handleBodyClick(e) {
        onFocus?.();
        window.__active_text_id = id;
        window.dispatchEvent(new CustomEvent('set-focused-note', { detail: id })); 
        console.log('Body clicked for ID:', id); // Debugging line
        console.log('startEditing:', startEditing); // Debugging line
        console.log('window.__active_text_id:', window.__active_text_id); // Debugging line
        console.log('Focused ID:', id); // Debugging line
        console.log('isEditing:', isEditing); // Debugging line
        
    }
      
    function pushToUndoStack(currentState) {
        setUndoStack(prev => {
          const last = prev[prev.length - 1];
      
          if (last && JSON.stringify(last) === JSON.stringify(currentState)) {
            return prev;
          }
      
          const clone = JSON.parse(JSON.stringify(currentState));
          return [...prev, clone];
        });
      }
      
    // === JSX ===
    return (
        <li className={classes.textDisplay} style={{ border: `3px solid ${frameColor}` }}>
            <div className={classes.actions}>
                <button
                    className={classes.deleteBtn}
                    onClick={() => {
                        if (confirm('Are you sure you want to delete this note?')) {
                            onDelete?.(id);
                        }
                    }}
                >
                    🗑️
                </button>

                {!isEditing ? (
                    <button onClick={handleEditClick}>✏️</button>
                ) : (
                    <>
                        <button onClick={handleSaveClick}>✔</button>
                        <button onClick={handleCancelClick}>❌</button>
                    </>
                )}
            </div>

            <div className={classes.body} onClick={handleBodyClick}>
                {(isEditing ? highlightMatches(localParts, searchTerm) : highlightMatches(bodyParts, searchTerm)).map(
                    (part, index) => (
                        <span key={index} style={part.style}>{part.text}</span>
                    )
                )}
                {isFocused && <span className={classes.caret}></span>}
            </div>
        </li>
    );
}

export default TextDisplay;
