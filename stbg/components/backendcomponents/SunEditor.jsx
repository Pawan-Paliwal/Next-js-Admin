import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";

export default function SunEditorWrapper({ value, onChange }) {
  return (
    <SunEditor
      height="400px"
      setContents={value}
      onChange={onChange}
      setOptions={{
        buttonList: [
          ["undo", "redo"],
          ["bold", "italic", "underline", "strike"],
          ["fontSize", "formatBlock"],
          ["align", "list", "table"],
          ["link", "image", "video"],
          ["codeView"],
        ],
        defaultStyle: "font-size: 14px; line-height: 1.6; font-family: Arial, sans-serif;",
      }}
    />
  );
}
