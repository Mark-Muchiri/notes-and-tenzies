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
     * DOCUMENTATION :
      INFO: => Making the state into a function 
      allows it to lazily initialize 
      (Here, we've used an arrow function, 
      but any function works for this purpose)
     */

    const [ notes, setNotes ] = useState(
        () => (JSON.parse(localStorage.getItem('notes')) || [])
    );
    const [ currentNoteId, setCurrentNoteId ] = useState(
        (notes[ 0 ] && notes[ 0 ].id) || ""
    );

    useEffect(() => {
        localStorage.setItem('notes', JSON.stringify(notes));
    }, [ notes ]);

    // INFO: CRUD Functions. Passed to children components as props. Tree format architecture
    function createNewNote() {
        const newNote = {
            id: nanoid(),
            body: "Type your markdown note's title here",
        };
        setNotes(prevNotes => [ newNote, ...prevNotes ]);
        setCurrentNoteId(newNote.id);
    }

    function updateNote(text) {
        //  INFO: => This puts recently-modified note to the top
        setNotes(oldNotes => {
            const newArray = [];
            for (let i = 0; i < oldNotes.length; i++) {
                const oldNote = oldNotes[ i ];
                if (oldNote.id === currentNoteId) {
                    newArray.unshift({ ...oldNote, body: text });
                } else {
                    newArray.push(oldNote);
                }
            }
            return newArray;
        });
    }

    function deleteNote(event, noteId) {
        event.stopPropagation();
        setNotes(oldNotes => oldNotes.filter((note) => note.id !== noteId));
    }

    function findCurrentNote() {
        return notes.find(note => {
            return note.id === currentNoteId;
        }) || notes[ 0 ];
    }

    return (
        <main>
            {
                notes.length > 0
                    ?
                    <Split
                        sizes={[ 30, 70 ]}
                        direction="horizontal"
                        className="split"
                    >
                        <Sidebar
                            notes={notes}
                            currentNote={findCurrentNote()}
                            setCurrentNoteId={setCurrentNoteId}
                            newNote={createNewNote}
                            deleteNote={deleteNote}
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
