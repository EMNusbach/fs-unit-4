import classes from './TextDisplay.module.css';

function TextDisplay({ titleParts = [], bodyParts = [], onClick }) {
  return (
    <li className={classes.textDisplay} onClick={onClick}>
      <h2 className={classes.title}>
        {titleParts.map((part, index) => (
          <span key={index} style={part.style}>{part.text}</span>
        ))}
      </h2>
      <p className={classes.body}>
        {bodyParts.map((part, index) => (
          <span key={index} style={part.style}>{part.text}</span>
        ))}
      </p>
    </li>
  );
}

export default TextDisplay;
