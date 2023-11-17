import React, { useState } from 'react';
import './App.css';

function App() {
  const [panels, setPanels] = useState(['', '', '', '', '', '', '', '', '', '']);
  const [speechBubbles, setSpeechBubbles] = useState(['', '', '', '', '', '', '', '', '', '']);
  const [comicImages, setComicImages] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (index, value) => {
    const newPanels = [...panels];
    newPanels[index] = value;
    setPanels(newPanels); 
  };

  const handleSpeechBubbleChange = (index, value) => {
    const newSpeechBubbles = [...speechBubbles];
    newSpeechBubbles[index] = value;
    setSpeechBubbles(newSpeechBubbles);
  };

  const query = async (data) => {
    const response = await fetch('https://xdwvg9no7pefghrn.us-east-1.aws.endpoints.huggingface.cloud', {
      headers: {
        'Accept': 'image/png',
        'Authorization': 'Bearer VknySbLLTUjbxXAXCjyfaFIPwUTCeRXbFSOjwRiCxsxFyhbnGjSFalPKrpvvDAaPVzWEevPljilLVDBiTzfIbWFdxOkYJxnOPoHhkkVGzAknaOulWggusSFewzpqsNWM',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(data),
    });

    const result = await response.blob();
    return result;
  };

  const handleCreateComic = async () => {
    try {
      const images = [];

      for (const [index, panelText] of panels.entries()) {
        console.log("start");
        const response = await query({ "inputs": panelText });
        console.log(response);
        const imageUrl = URL.createObjectURL(response);
        console.log("end");
        images.push({ index, imageUrl, speechBubbleText: speechBubbles[index] });
      }

      // Sort images based on the original order
      images.sort((a, b) => a.index - b.index);
      console.log("pushed");
      setComicImages(images);
      setErrorMessage('');
    } catch (error) {
      console.error('Error creating comic', error);
      setErrorMessage('Error creating comic. Please try again.');
    }
  };

  return (
    <div className="container">
      <h1 className="web-app-title">ComicCanvas</h1> 
      <hr style={{ color: "#807d7d", padding: "2px" }}></hr>
      
      <h2  align="center">Comic Strip Generator</h2> 
      <h4 style={{ color: "#807d7d" }}>Add title of image and text for SpeechBubble</h4>
      <div className="form-container">
        {panels.map((panel, index) => (
          <div key={index} className="panel-container">
            <label htmlFor={`panel-${index + 1}`}>{`Panel ${index + 1}:`}</label>
            <input
              type="text"
              id={`panel-${index + 1}`}
              value={panel}
              onChange={(e) => handleInputChange(index, e.target.value)}
            />
            <label htmlFor={`speech-bubble-${index + 1}`}>{`Speech Bubble ${index + 1}:`}</label>
            <input
              type="text"
              id={`speech-bubble-${index + 1}`}
              value={speechBubbles[index]}
              onChange={(e) => handleSpeechBubbleChange(index, e.target.value)}
            />
          </div>
        ))}
        <button onClick={handleCreateComic}>Create Comic</button>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>

      <div className="comic-container">
        {comicImages.map((image, index) => (
          <div key={index} className="comic-panel">
            <img
              src={image.imageUrl}
              alt={`Panel ${index + 1}`}
              className="comic-image"
            />
            <div className="speech-bubble">{image.speechBubbleText}</div>
            <div className="caption">{panels[index]}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
