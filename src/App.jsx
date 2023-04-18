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
import Axios from "axios";

function App() {
  const [imageUpload, setImageUpload] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);
  const fileInputRef = useRef(null);
  const imagesListRef = ref(storage, "images/");
  const MAX_IMAGES = 3;

  const getTextFromImage = async (imageUrl) => {
    const apiKey = "ya29.c.b0Aaekm1K5gF1FqctjJalc2jEoJw1ePjqjyUAbKjtdRBWiVyV7D4SAuSJdAQ5XX4FNw-vBNbm0Jec9xFBMJWR_f91_Q_dXADRULZrGMCTwegt57WjlH9M60DnROyyrH8wv75BGW4fJy_uy0rqn7apv3C4KRETlNWVNk_CoopEqoezg9Oq5a-_5BdW7ZXmsfbv01eOz0kojK4zRBAny5x1FKyGMP-lfRL0joVUWl9UQ2CO6cI0Im5e_L0iAsq38nj0MUitjE22zGRvrnrsmjrbDgW9DKScaf0K2UlsA4ibldrmxVHH6IpPsBiEIumfJeEHwv8YuP4yFLDZ9qpUELlthwC8G352Km5IyXOkQ_fuzZo9wJYm9qZ8jZwXMYbX67SWm7bh6djVytMIy4cwaXmnxdoX37nU-RwzB2vYfx6tlxoS3ooFFsVf_cZ6lfXSZ5bM-p1ufQFIzmibXF9ndnOF4YId7VmU0drI-X8OScIkpgWRo3R9Yp1S52iv4cpd1r67RXi9h_65e1QO3nMQXuMF6SUImw1RhyeOMy-IndFbrwJp9l6s-qjl8RWxRh-XjMcsOah0clmiRluUtoZ5F5p4t4ycqvrzzyM3yR9z05qVVuVOrvZ_42RrF7mmwbnZs9y3ZZ5gt7wqafkySSyYge3W-M7JMb6e6zgJM7a-fr05-RjMbZBjIchur7gZBWMI28W5iX2n27Qq__RjlFRYJ_v9o0FeS5nXjI5o6_QvvxtbmvwQJqkd7b5SsWhrFhQkheBicqz59rhYVpwVrR9URybSit04lfY6qqaSz7qaSoqYfkc2M3peR4_6Sih2nQ6IWn31v553fQ8WxyStY15WS0RR5mW0xamQpx1Y-zuB770ovO8oXeVO6li4me_M1S9jYIk6YlOIeOMc7mrq6f1r2eXk6S18n-8VZ_BWlgY3Xi3OSZBe19balJ1YQh6bkZtBRjdwmbkpiQM_6do7ZzXuJeI_h8d6eJja3I5vrX6ytaamJXwfSYQBS4yWRisb";
    const apiUrl = `https://vision.googleapis.com/v1/images:annotate`;
  
    const requestPayload = {
      requests: [
        {
          image: {
            source: {
              imageUri: imageUrl,
            },
          },
          features: [
            {
              type: "TEXT_DETECTION",
            },
          ],
        },
      ],
    };
  
    try {
      const response = await Axios.post(apiUrl, requestPayload, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
      });
  
      const detections = response.data.responses[0].textAnnotations;
      console.log("Text Detections:");
      console.log(detections[0].description);
      //detections.forEach((text) => console.log(text.description));
    } catch (error) {
      console.error("Error detecting text:", error);
    }
  };

  const handleChooseFileClick = () => {
    fileInputRef.current.click();
  };

  const uploadFile = () => {
    if (imageUpload == null) return;
    const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
    uploadBytes(imageRef, imageUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then(async (url) => {
        setImageUrls((prev) => [...prev, url]);
        await getTextFromImage(url);
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