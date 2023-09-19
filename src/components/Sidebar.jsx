import propTypes from 'prop-types';

export default function Sidebar(props) {
    Sidebar.propTypes = {
        notes: propTypes,
        currentNote: propTypes,
        setCurrentNoteId: propTypes,
        newNote: propTypes,
    };

    const noteElements = props.notes.map(
        (
            note,
            // index
        ) => (
            <div key={note.id}>
                <div
                    className={`title ${note.id === props.currentNote.id ? "selected-note" : ""}`}
                    onClick={() => props.setCurrentNoteId(note.id)}
                >
                    {/* Using split JS func to get the 1st line of the note and display it on the sidebar */}
                    <h4 className="text-snippet">{note.body.split("\n")[0]}</h4>
                    <button
                        className="delete-btn"
                    // Your onClick event handler here
                    >
                        <i className="gg-trash trash-icon"></i>
                    </button>
                </div>
            </div>
        ));

    return (
        <section className="pane sidebar">
            <div className="sidebar--header">
                <h3>Notes</h3>
                <button className="new-note" onClick={props.newNote}>+</button>
            </div>
            {noteElements}
        </section>
    );
}
