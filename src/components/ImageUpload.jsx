
import React from "react";

const ImageUpload = ({ onFileChange, onChooseFileClick, onUploadFile, fileInputRef }) => {

  return (
    <div className="upload">
      <h1>
        All we need is a picture{" "}
        <span role="img" aria-label="heart">
          ❤️
        </span>
      </h1>
      <div className="upload-buttons">
        {/* The file input is hidden and connected to the Choose File button via the ref */}
        <input
          type="file"
          onChange={onFileChange}
          ref={fileInputRef}
          style={{ display: "none" }}
        />
        {/* The Choose File button triggers a click event on the hidden file input */}
        <button onClick={onChooseFileClick}>Choose File</button>
        <button onClick={onUploadFile}>Upload An Image</button>
      </div>
    </div>
  );
};

export default ImageUpload;