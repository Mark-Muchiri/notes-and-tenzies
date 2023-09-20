import './App.css';
// import Main from './components/Main/Main';
// import Navbar from './components/navbar/Navbar';
import { useEffect, useState } from 'react';
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";
import Split from "react-split";
import { notesCollection, db } from '../firebase.js';
// OnSnapshot Hellps us keep data in sync
import { addDoc, onSnapshot, doc, deleteDoc } from 'firebase/firestore';


export default function App() {
    /** 
     * DOCUMENTATION :
      INFO: => Making the state into a function 
      allows it to lazily initialize 
      (Here, we've used an arrow function, 
      but any function works for this purpose)
     */

    // notes has to be an array of data (in form of objects)
    const [ notes, setNotes ] = useState([]);
    const [ currentNoteId, setCurrentNoteId ] = useState(
        (notes[ 0 ]?.id) || ""
    );

    const currentNote = notes.find(note => note.id === setCurrentNoteId) || notes[ 0 ];

    useEffect(() => {
        // eslint-disable-next-line no-unused-vars
        const unsubscribe = onSnapshot(notesCollection, function (snapshot) {
            // INFO: sync up our local array with the snapshot data
            const notesArr = snapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }));
            setNotes(notesArr);
        });
        return unsubscribe;
    }, []);
    /*
    INFO: CRUD Functions. 
    Passed to children components as props. 
    Tree format architecture
    */
    async function createNewNote() {
        const newNote = {
            body: "Type your markdown note's title here",
        };
        const newNoteRef = await addDoc(notesCollection, newNote);
        setCurrentNoteId(newNoteRef.id);
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

    async function deleteNote(noteId) {
        // INFO: `doc()` helps us get access to a single document
        const docRef = doc(db, "notes", noteId);
        await deleteDoc(docRef);
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
                            currentNote={currentNote}
                            setCurrentNoteId={setCurrentNoteId}
                            newNote={createNewNote}
                            deleteNote={deleteNote}
                        />
                        {
                            currentNoteId &&
                            notes.length > 0 &&
                            <Editor
                                currentNote={currentNote}
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
