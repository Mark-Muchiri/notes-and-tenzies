import './App.css';
// import Main from './components/Main/Main';
// import Navbar from './components/navbar/Navbar';
import { useEffect, useState } from 'react';
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";
// import { data } from "./data"
import Split from "react-split";
import { nanoid } from "nanoid";


export default function App() {
    /** 
     *  Challenge:
     * Lazily initialize our `notes` state so it doesn't
     * reach into localStorage on every single re-render
     * of the App component
      NOTE => Making the state into a function (Here, we've used an arrow functiion, but any function works for this purpose) allows it to lazily initialize 
     */
    const [notes, setNotes] = useState(
        () => (JSON.parse(localStorage.getItem('notes')) || [])
    );
    // const [notes, setNotes] = useState(/*Your code here*/ || [])
    const [currentNoteId, setCurrentNoteId] = useState(
        (notes[0] && notes[0].id) || ""
    );

    useEffect(() => {
        localStorage.setItem('notes', JSON.stringify(notes));
        // console.log(JSON.stringify(notes[0].body.split("\n")))
    }, [notes]);

    function createNewNote() {
        const newNote = {
            id: nanoid(),
            body: "# Type your markdown note's title here"
        };
        setNotes(prevNotes => [newNote, ...prevNotes]);
        setCurrentNoteId(newNote.id);
    }

    function updateNote(text) {
        setNotes(oldNotes => oldNotes.map(oldNote => {
            return oldNote.id === currentNoteId
                ? { ...oldNote, body: text }
                : oldNote;
        }));
    }

    function findCurrentNote() {
        return notes.find(note => {
            return note.id === currentNoteId;
        }) || notes[0];
    }

    return (
        <main>
            {
                notes.length > 0
                    ?
                    <Split
                        sizes={[30, 70]}
                        direction="horizontal"
                        className="split"
                    >
                        <Sidebar
                            notes={notes}
                            currentNote={findCurrentNote()}
                            setCurrentNoteId={setCurrentNoteId}
                            newNote={createNewNote}
                        />
                        {
                            currentNoteId &&
                            notes.length > 0 &&
                            <Editor
                                currentNote={findCurrentNote()}
                                updateNote={updateNote}
                            />
                        }
                    </Split>
                    :
                    <div className="no-notes">
                        <h1>You have no notes</h1>
                        <button
                            className="first-note"
                            onClick={createNewNote}
                        >
                            Create one now
                        </button>
                    </div>

            }
        </main>
    );
}
