import { MdPostAdd, MdMessage } from 'react-icons/md';

import classes from './MainHeader.module.css';

function MainHeader({ onCreateText,userName }) {
  return (
    <header className={classes.header}>
      <h1 className={classes.logo}>
        <MdMessage />
        {userName}'s Notes 
      </h1>
      <p>
        <button className={classes.button} onClick={onCreateText}>
          <MdPostAdd size={18} />
          New Note
        </button>
      </p>
    </header>
  );
}

export default MainHeader;