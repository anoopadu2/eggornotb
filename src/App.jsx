import "./App.css";
import { useState, useEffect, useRef } from "react";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  list,
} from "firebase/storage";
import { storage } from "./config/firebase";
import { v4 } from "uuid";
//import { client } from "./config/vision";

function App() {
  const [imageUpload, setImageUpload] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);
  const fileInputRef = useRef(null);
  const imagesListRef = ref(storage, "images/");
  const MAX_IMAGES = 3;

  const handleChooseFileClick = () => {
    fileInputRef.current.click();
  };

  const uploadFile = () => {
    if (imageUpload == null) return;
    const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
    uploadBytes(imageRef, imageUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setImageUrls((prev) => [...prev, url]);
      });
    });
  };

  useEffect(() => {
    listAll(imagesListRef)
      .then((response) =>
        Promise.all(
          response.items.slice(0, MAX_IMAGES).map((item) => getDownloadURL(item))
        )
      )
      .then((urls) => setImageUrls(urls));
  }, []);

  return (
    <div className="App">
      <div className="upload">
        <h1>
          All we need is a picture{" "}
          <span role="img" aria-label="heart">
            ❤️
          </span>
        </h1>
        <div className="upload-buttons">
          <input
            type="file"
            onChange={(event) => setImageUpload(event.target.files[0])}
            ref={fileInputRef}
            style={{ display: "none" }}
          />
          <button onClick={handleChooseFileClick}>Choose File</button>
          <button onClick={uploadFile}>Upload An Image</button>
        </div>
      </div>

      <h1> or try some samples...</h1>
      <div className="image-container">
        {imageUrls.map((url) => {
          return <img key={url} src={url} alt="uploaded image" />;
        })}
      </div>
    </div>
  );
}

export default App;