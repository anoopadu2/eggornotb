import React from "react";

const ImageText = ({ text, onResetDetection, uploadedImageUrl }) => {
  const hasEgg = text.toLowerCase().includes("egg");

  return (
    <div>
      <img src={uploadedImageUrl} alt="Uploaded" className="uploaded-image" />
      <h1 style={{ color: hasEgg ? "red" : "green" }}>
        {hasEgg ? "EGG ALERT!" : "YAYY!! NO EGG!"}
      </h1>
      <button onClick={onResetDetection}>Try another image</button>
    </div>
  );
};

export default ImageText;