import classes from './TextDisplay.module.css';

function TextDisplay({ title, body, onClick }) {
    return (
        <li className={classes.textDisplay} onClick={onClick}>
            <h2 className={classes.title}>{title}</h2>
            <p className={classes.body}>{body}</p>
        </li>
    );
}

export default TextDisplay;