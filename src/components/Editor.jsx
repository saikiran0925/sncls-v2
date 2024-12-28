import DummyPropsWrapper from "./DummyPropsWrapper";
import "./EditorComponent.css"

const EditorComponent = () => {
  return (
    <div className="editor-container">
      <div className="editor-header">
        <h2>Blank Space</h2>
        <div className="tabs">
          <button className="tab active">Prettify</button>
          <button className="tab">Stringify</button>
        </div>
      </div>
      <div className="editor-component">
        <DummyPropsWrapper />
      </div>
    </div>
  );
}

export default EditorComponent;
