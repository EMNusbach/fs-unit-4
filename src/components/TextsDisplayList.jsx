import { useState } from 'react';

import TextDisplay from './TextDisplay';
import TextEditor from './TextEditor';
import Modal from './Modal';
import classes from './TextsDisplayList.module.css'


function TextsDisplayList({ isEditing, onStopEditing }) {
    const [texts, setTexts] = useState([]);

    function addTextHandler(textData) {
        setTexts((existingTexts) => [textData, ...existingTexts]);
    }

    return (
        <>
            {isEditing && (
                <Modal onClose={onStopEditing}>
                    <TextEditor
                        onCancel={onStopEditing}
                        onAddText={addTextHandler}
                    />
                </Modal>
            )}

            {texts.length > 0 && (
                <ul className={classes.texts}>
                    {/* make sure key is unique */}
                    {texts.map((text) => <TextDisplay key={text.title} title={text.title} body={text.body} />)}
                </ul>
            )}

            {texts.length === 0 && (
                <div style={{ textAlign: 'center', color: 'white' }}>
                    <h2>There are no texts yet.</h2>
                    <p>Start adding some!</p>
                </div>
            )}


        </>

    );
}

export default TextsDisplayList;