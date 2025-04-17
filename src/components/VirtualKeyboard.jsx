import React from 'react';
import classes from './VirtualKeyboard.module.css';

const rows = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P','.', ','],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L','!', '?'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M','←', '↑', '↓'],
];

function VirtualKeyboard({ onKeyPress }) {
  return (
    <div className={classes.keyboardWrapper}>
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className={classes.row}>
          {row.map((key) => (
            <button
              key={key}
              className={classes.key}
              onClick={() => onKeyPress?.(key)}
            >
              {key}
            </button>
          ))}
        </div>
      ))}

      <div className={classes.row}>
        <button className={classes.keyWide} onClick={() => onKeyPress?.(' ')}>
          Space
        </button>
      </div>
    </div>
  );
}

export default VirtualKeyboard;
