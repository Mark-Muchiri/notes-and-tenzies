import { useState } from "react";
import ReactMde from "react-mde";
import Showdown from "showdown";
import propTypes from 'prop-types';

export default function Editor({ currentNote, updateNote }) {
    Editor.propTypes = {
        currentNote: propTypes,
        updateNote: propTypes,
    };
    const [ selectedTab, setSelectedTab ] = useState("write");

    const converter = new Showdown.Converter({
        tables: true,
        simplifiedAutoLink: true,
        strikethrough: true,
        tasklists: true,
    });

    return (
        <section className="pane-editor">
            <ReactMde
                /* Just in-case `curretNote` doesn't exist, 
                we added `?` before `.` to male it optional
                */
                value={currentNote?.body}
                onChange={updateNote}
                selectedTab={selectedTab}
                onTabChange={setSelectedTab}
                generateMarkdownPreview={(markdown) =>
                    Promise.resolve(converter.makeHtml(markdown))
                }
                minEditorHeight={80}
                heightUnits="vh"
            />
        </section>
    );
}
