import './App.css';
import React from "react";
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";
import Split from "react-split";
import {
    onSnapshot,
    addDoc,
    doc,
    deleteDoc,
    setDoc
} from "firebase/firestore";
import { notesCollection, db } from "../firebase.js";

export default function App() {
    // Define state variables for notes and the current selected note ID
    const [ notes, setNotes ] = React.useState([]);
    const [ currentNoteId, setCurrentNoteId ] = React.useState("");
    const [ tempNoteText, setTempNoteText ] = React.useState('');

    // Find the currently selected note based on its ID or default to the first note
    const currentNote =
        notes.find(note => note.id === currentNoteId)
        || notes[ 0 ];


    // Set up an effect to listen for changes in the notes collection from Firebase
    React.useEffect(() => {
        const unsubscribe = onSnapshot(notesCollection, function (snapshot) {
            // Sync up our local notes array with the snapshot data from Firebase
            const notesArr = snapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }));
            // Sorts the notes (from: latest to oldest) as they sync
            const sortedNotes = notesArr.sort((a, b) => b.updatedAt - a.updatedAt);
            setNotes(sortedNotes);
        });
        // Unsubscribe when the component unmounts to prevent memory leaks
        return unsubscribe;
    }, []);

    // Set up an effect to update text on the edito to the currentNote state
    React.useEffect(() => {
        if (currentNote) {
            setTempNoteText(currentNote.body);
        }
    }, [ currentNote ]);

    // Debounce with setTimeout JS func.
    // Important:  This is what connects to firestor for the updates
    React.useEffect(() => {
        const timeoutId = setTimeout(() => {
            // So when I click a note it doesn't update the tempNoteText
            // And so only update if the condition is true
            if (tempNoteText !== currentNote.body) {
                updateNote(tempNoteText);
            }
            // Uncomment 👇 for testing puporses only
            // updateNote(tempNoteText);
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [ tempNoteText ]);

    // Set up an effect to initialize the currentNoteId if it's not set
    React.useEffect(() => {
        if (!currentNoteId) {
            setCurrentNoteId(notes[ 0 ]?.id);
        }
    }, [ notes, currentNoteId ]);

    // Function to create a new note
    async function createNewNote() {
        const newNote = {
            body: "# Type your markdown note's title here",
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };
        // Add a new note document to the notes collection in Firebase
        const newNoteRef = await addDoc(notesCollection, newNote);
        setCurrentNoteId(newNoteRef.id);
    }

    // Function to update the content of the current note
    async function updateNote(text) {
        const docRef = doc(db, "notes", currentNoteId);
        // Update the note document in Firebase with the new content
        await setDoc(docRef, { body: text, updatedAt: Date.now() }, { merge: true });
    }

    // Function to delete a note
    async function deleteNote(noteId) {
        const docRef = doc(db, "notes", noteId);
        // Delete the note document from the notes collection in Firebase
        await deleteDoc(docRef);
    }

    return (
        <main>
            {
                // Check if there are any notes to display
                notes.length > 0
                    ? (
                        // Split the UI into Sidebar and Editor components
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
                            <Editor
                                tempNoteText={tempNoteText}
                                setTempNoteText={setTempNoteText}
                            />
                        </Split>
                    )
                    : (
                        // Display a message when there are no notes
                        <div className="no-notes">
                            <h1>You have no notes</h1>
                            <button
                                className="first-note"
                                onClick={createNewNote}
                            >
                                Create one now
                            </button>
                        </div>
                    )
            }
        </main>
    );
}