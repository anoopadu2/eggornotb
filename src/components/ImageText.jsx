import React from "react";

const ImageText = ({ hasEgg, onResetDetection, uploadedImageUrl }) => {

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