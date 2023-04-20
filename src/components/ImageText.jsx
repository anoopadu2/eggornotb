import React from "react";

const ImageText = ({ text }) => {
  const hasEgg = text.toLowerCase().includes("egg");

  return (
    <div>
      <h1>{hasEgg ? "There is Egg" : "No Egg"}</h1>
    </div>
  );
};

export default ImageText;