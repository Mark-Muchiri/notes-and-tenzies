import propTypes from 'prop-types';

export default function Sidebar(props) {
    // Define PropTypes for the component's props
    Sidebar.propTypes = {
        notes: propTypes.array,                // Expecting an array for notes
        currentNote: propTypes.object,        // Expecting an object for currentNote
        setCurrentNoteId: propTypes.func,      // Expecting a function for setCurrentNoteId
        newNote: propTypes.func,               // Expecting a function for newNote
        deleteNote: propTypes.func,            // Expecting a function for deleteNote
    };

    // Create an array of note elements based on the notes data
    const noteElements = props.notes.map((note) => (
        <div key={note.id}>
            <div
                className={`title ${note.id === props.currentNote.id ? "selected-note" : ""}`}
                // Click event to set the current note ID when clicked
                onClick={() => props.setCurrentNoteId(note.id)}
            >
                <h4 className="text-snippet">{note.body.split("\n")[0]}</h4>
                <button
                    className="delete-btn"
                    // Click event to delete the note
                    onClick={() => props.deleteNote(note.id)}
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
