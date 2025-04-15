import classes from './TextDisplay.module.css';

function TextDisplay(props) {
  return (
    <li className={classes.textDisplay}>
      <h2 className={classes.title}>{props.title}</h2>
      <p className={classes.body}>{props.body}</p>
    </li>
  );
}

export default TextDisplay;