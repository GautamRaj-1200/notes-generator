import { CircleX, CloudUpload, LoaderCircle } from "lucide-react";
import "./FileUpload.scss";
import { ChangeEvent, useState } from "react";
import axios from "axios";
import MDEditor from "@uiw/react-md-editor";

const FileUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [generatedContent, setGeneratedContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (!selectedFile) {
        return;
      }

      if (selectedFile.size > 20 * 1024 * 1024) {
        setError("File size should be less than 20mb");
        setFile(null);
      } else {
        setError("");
        setFile(selectedFile);
      }
    }
  };

  const handleGenerateNotes = async () => {
    if (!file) {
      setError("Please select a file first");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    if (file) {
      formData.append("file", file);
    }
    try {
      const res = await axios.post("http://localhost:5500/notes", formData);
      console.log(res);
      setGeneratedContent(res?.data?.content);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemovePdf = () => {
    setFile(null);
  };

  const handleEditorChange = (value?: string) => {
    if (value !== undefined) {
      setGeneratedContent(value);
    }
  };

  return (
    <>
      <section className="file-upload">
        {loading ? (
          <>
            <div className="loading-state">
              <LoaderCircle className="loading-icon" size={96} />
            </div>
          </>
        ) : (
          <>
            <div className="drag-drop">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                style={
                  file ? { pointerEvents: "none" } : { pointerEvents: "auto" }
                }
              />
              {file ? (
                <>
                  <div className="file-info">
                    <p>{file.name}</p>
                    {file ? (
                      <>
                        {" "}
                        <div onClick={handleRemovePdf} className="remove-pdf">
                          <CircleX color="#f73d3d" />{" "}
                        </div>
                      </>
                    ) : null}
                  </div>
                  <button className="btn" onClick={handleGenerateNotes}>
                    Generate Notes
                  </button>
                </>
              ) : (
                <>
                  <CloudUpload size={128} />
                  <p>Drag and Drop your PDF file here</p>
                  <p>File size should be less than 20mb</p>
                  <button className="btn">Browse</button>
                  <p className="error">{error}</p>
                </>
              )}
            </div>
          </>
        )}
      </section>

      {loading ? (
        <>
          <h3 className="wait">
            Please be patient, while we create awesome notes for you...
          </h3>
        </>
      ) : (
        generatedContent && (
          <>
            <div className="md">
              <MDEditor
                value={generatedContent}
                onChange={handleEditorChange}
                className="md-editor"
                height="100%"
              />
            </div>
          </>
        )
      )}
    </>
  );
};

export default FileUpload;
