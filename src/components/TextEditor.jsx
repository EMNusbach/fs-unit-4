import classes from './TextEditor.module.css';

function TextEditor(props) {
    return (
        <form className={classes.form}>
            <p>
                <label htmlFor="title">Title</label>
                <input type="text" id="title" onChange={props.onTitleChange}/>
            </p>
            <p>
                <label htmlFor="body">Text</label>
                <textarea id="body" required rows={5} onChange={props.onBodyChange}/>
            </p>
        </form>
    );
}

export default TextEditor;