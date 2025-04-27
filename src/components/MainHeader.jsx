import { MdPostAdd, MdMessage } from 'react-icons/md';

import classes from './MainHeader.module.css';

function MainHeader({ onCreateText,userName,onLogOut }) {
  return (
    <header className={classes.header}>
      <h1 className={classes.logo}>
        <MdMessage />
        {userName}'s Notes 
      </h1>
      <p>
        <button className={classes.button} onClick={onCreateText}>
          <MdPostAdd />
          New Text
        </button>
        <button onClick={onLogOut} className={classes.button} >
        Logout
        </button>
      </p>
    </header>
  );
}

export default MainHeader;