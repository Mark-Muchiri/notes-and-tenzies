import { useState } from "react";
import ReactMde from "react-mde";
import Showdown from "showdown";
import propTypes from 'prop-types';

export default function Editor({ tempNoteText, setTempNoteText }) {
    // Define PropTypes for the component's props
    Editor.propTypes = {
        tempNoteText: propTypes.object, // Expecting an object for currentNote
        setTempNoteText: propTypes.func,   // Expecting a function for updateNote
    };

    // Initialize the selectedTab state to "write"
    const [ selectedTab, setSelectedTab ] = useState("write");

    // Create a Showdown converter for rendering Markdown
    const converter = new Showdown.Converter({
        tables: true,
        simplifiedAutoLink: true,
        strikethrough: true,
        tasklists: true,
    });

    return (
        <section className="pane-editor">
            <ReactMde
                // Set the initial value to the tempNoteText for debouncing
                value={tempNoteText}
                // function to update the note content to the debounced data
                onChange={setTempNoteText}
                // Selected tab for write/preview
                selectedTab={selectedTab}
                // Callback to change the selected tab
                onTabChange={setSelectedTab}
                // Function to generate a Markdown preview
                generateMarkdownPreview={(markdown) =>
                    Promise.resolve(converter.makeHtml(markdown))
                }
                // Set the minimum editor height and height units
                minEditorHeight={80}
                heightUnits="vh"
            />
        </section>
    );
}
