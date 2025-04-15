import {useState} from 'react';
import TextDisplay from './TextDisplay';
import TextEditor from './TextEditor';
import classes from './TextsDisplayList.module.css'




function TextsDisplayList() {
    const [ enteredBody, setEnteredBody ] = useState('');
    const [ enteredTitle, setEnteredTitle ] = useState('');

    // Body change handler function
    function bodyChangeHandler(event){
        setEnteredBody(event.target.value);
    }

    // Title change handler function
    function titleChangeHandler(event){
        setEnteredTitle(event.target.value);
    }

    return (
        <>
            <TextEditor onBodyChange = {bodyChangeHandler} onTitleChange = {titleChangeHandler}/>
            <ul className={classes.texts}>
                <TextDisplay title={enteredTitle} body={enteredBody}/>
                {/* <TextDisplay title="Text 2" body="Placeholder for display text 2" /> */}
            </ul>
        </>

    );
}

export default TextsDisplayList;