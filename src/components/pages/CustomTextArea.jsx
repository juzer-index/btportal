import React, { useState } from 'react';
import { Editor, EditorState } from 'draft-js';
import 'draft-js/dist/Draft.css';

function EditorComponent() {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  return (
    <div>
      <h2>My Draft.js Editor</h2>
      <Editor editorState={editorState} onChange={setEditorState} />
    </div>
  );
}

export default EditorComponent;
