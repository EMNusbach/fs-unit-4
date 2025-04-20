import { useState, useEffect } from 'react';
import classes from './TextDisplay.module.css';

function TextDisplay({ id, titleParts = [], bodyParts = [], onSave, onCancel, isFocused, onFocus, onDelete, startEditing }) {
    const [isEditing, setIsEditing] = useState(startEditing || false);
    const [localParts, setLocalParts] = useState(bodyParts);
    const [currentStyle, setCurrentStyle] = useState({
        color: 'black',
        fontSize: '16px',
        fontFamily: 'Arial'
    });
    let currentStyleRef = currentStyle;

    useEffect(() => {
        if (isEditing) {
            setLocalParts(bodyParts); // Reset when editing starts
        }
    }, [isEditing]);

    function handleVirtualKeyPress(key) {
        // Create a fresh copy of current style
        let newStyle = { ...currentStyleRef };

        // Handle color
        if (key.startsWith('{color:')) {
            const value = key.slice(7, -1);
            newStyle.color = value;
            setCurrentStyle(newStyle);
            currentStyleRef = newStyle;
            return;
        }

        // Handle size
        if (key.startsWith('{size:')) {
            const value = key.slice(6, -1);
            const fontSizeMap = {
                small: '14px',
                medium: '18px',
                large: '22px'
            };
            newStyle.fontSize = fontSizeMap[value] || newStyle.fontSize;
            setCurrentStyle(newStyle);
            currentStyleRef = newStyle;
            return;
        }

        // Handle font family
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

        // Handle deletion
        if (key === 'Delete' || key === '←') {
            setLocalParts((prev) => {
                const last = prev[prev.length - 1];
                if (!last) return [];
                if (last.text.length === 1) return prev.slice(0, -1);
                return [...prev.slice(0, -1), { ...last, text: last.text.slice(0, -1) }];
            });
            return;
        }

        // Handle regular character input
        const newPart = { text: key, style: { ...currentStyleRef } };

        setLocalParts((prev) => {
            const last = prev[prev.length - 1];
            if (last && JSON.stringify(last.style) === JSON.stringify(newPart.style)) {
                return [...prev.slice(0, -1), { ...last, text: last.text + key }];
            } else {
                return [...prev, newPart];
            }
        });
    }

    useEffect(() => {
        if (!isEditing || !isFocused) return;

        function handleKey(event) {
            handleVirtualKeyPress(event.detail);
        }

        window.addEventListener('virtual-keypress', handleKey);
        return () => window.removeEventListener('virtual-keypress', handleKey);
    }, [isEditing, isFocused]);


    function handleBodyClick(e) {
        onFocus?.();
        if (isEditing) {
          window.dispatchEvent(new CustomEvent('text-body-focus'));
        }
    }

    function handleEditClick() {
        onFocus?.();
        setIsEditing(true);
    }

    function handleCancelClick() {
        setIsEditing(false);
    }

    function handleSaveClick() {
        const updatedText = {
            bodyParts: localParts,
            body: localParts.map(part => part.text).join('')
        };
        onSave?.(updatedText); // Call the onSave function with the updated text
        setIsEditing(false);
    }

    return (
        <li className={classes.textDisplay}>
            <div className={classes.actions}>
                <button className={classes.deleteBtn} onClick={() => {
                    if (confirm('Are you sure you want to delete this note?')) {
                        onDelete?.(id);
                    }
                }}>🗑️</button>

                {!isEditing && (
                    <button onClick={handleEditClick}>✏️</button>
                )}
                {isEditing && (
                    <>
                        <button onClick={handleSaveClick}>✔</button>
                        <button onClick={handleCancelClick}>❌</button>
                    </>
                )}
            </div>

            <div className={classes.body} onClick={handleBodyClick}
            >
                {(isEditing ? localParts : bodyParts).map((part, index) => (
                    <span key={index} style={part.style}>{part.text}</span>
                ))}
                {isFocused && <span className={classes.caret}></span>}
            </div>
        </li>
    );
}

export default TextDisplay;

/* <h2 className={classes.title}>
{titleParts.map((part, index) => (
    <span key={index} style={part.style}>{part.text}</span>
))}
</h2> */
