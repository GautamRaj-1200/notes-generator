import { CloudUpload } from "lucide-react";
import "./FileUpload.scss";
import { useState } from "react";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) {
      return;
    }

    if (selectedFile.size > 20 * 1024 * 1024) {
      setError("File size should be less than 20mb");
      setFile(null);
    } else {
      setError("");
      setFile(selectedFile.name);
    }
  };
  const handleGenerateNotes = (e) => {
    alert("Generated");
  };
  return (
    <>
      <section className="file-upload">
        <div className="drag-drop">
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            style={file ? { pointerEvents: "none" } : { pointerEvents: "auto" }}
          />
          {file ? (
            <>
              <p>{file}</p>
              <button onClick={handleGenerateNotes}>Generate Notes</button>
            </>
          ) : (
            <>
              <CloudUpload size={128} />
              <p>Drag and Drop your PDF file here</p>
              <p>File size should be less than 20mb</p>
              <button>Browse</button>
              <p className="error">{error}</p>
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default FileUpload;
