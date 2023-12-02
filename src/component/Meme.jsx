import { Box, Button } from '@mui/material';
import { DropzoneAreaBase } from 'material-ui-dropzone';
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Lottie from 'react-lottie';
import animationData from '../assets/js/Animation.json';
import BGimg from '../assets/img/BG_IMG.png'
import Footer from '../component/Footer.jsx'

const Meme = () => {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [results, setResults] = useState([]);
    const [responseMessage, setResponseMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [sentimentGroups, setSentimentGroups] = useState({ positive: [], negative: [] });
    const [uploadedFile, setUploadedFile] = useState(null);
    const [fileNames, setFileNames] = useState([]);
    const resultBoxRef = useRef(null);
    const resultBoxRef1 = useRef(null);

    const handleScrollIntoView = () => {
      if (resultBoxRef.current) {
        resultBoxRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
      if (resultBoxRef1.current) {
        resultBoxRef1.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    };
  
    useEffect(() => {
      // Scroll into view when the component mounts and conditions are met
      if (results) {
        handleScrollIntoView();
      }
    }, [results]);

    useEffect(() => {
      if (results.length === 0) {
        window.scrollTo(0, 0);
      } else {
        document.body.style.overflow = 'auto';
      }
    
      return () => {
        document.body.style.overflow = 'auto';
      };
    }, [results]);

    const handleSubmit = async (fileObjs) => {
      const formDataArray = [];
    
      setIsLoading(true);
      setError(null);
    
      const names = fileObjs.map((fileObj) => fileObj.file.name);
      setFileNames(names);

      for (const fileObj of fileObjs) {
        const formData = new FormData();
        formData.append('file', fileObj.file);
        const fileData = fileObj.data.split(',')[1];
        formData.append('data', fileData);
        formDataArray.push(formData);
      }
    
      try {
        const responses = await Promise.all(
          formDataArray.map((formData) =>
            axios.post('http://localhost:5000/meme', formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            })
          )
        );
    
        const sentimentResults = responses.map((response) => response.data.sentiment);
        setResults(sentimentResults);
    
        const positiveImages = [];
        const negativeImages = [];
    
        for (let i = 0; i < fileObjs.length; i++) {
          if (sentimentResults[i] === 'Positive') {
            positiveImages.push(fileObjs[i]);
          } else {
            negativeImages.push(fileObjs[i]);
          }
        }
    
        setSentimentGroups({ positive: positiveImages, negative: negativeImages });
    
        console.log(responses);
        setResponseMessage('');
        setIsLoading(false);
        setSelectedFiles(fileObjs);
      } catch (error) {
        console.log('error:', error);
        setError('Error occurred while analyzing');
        setIsLoading(false);
      }
    };
    
    const handleClearResults = () => {
      window.scrollTo(0, 0);
      setResults([]);
      setUploadedFile(null);
  }
    return (
        <>
              {uploadedFile ? (
                <>
                  <Box id="custombox3">
                    <h2 id='boxheader'>Uploaded File</h2>
                    {fileNames.map((fileName, index) => (
                      <p key={index}>File{index+1} Name: {fileName}</p>
                    ))}
                    <Box style={{ textAlign: 'center', marginTop: '5%' }}>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={handleClearResults}
                      >
                        Remove File
                      </Button>
                    </Box>
                  </Box>
                  <div id='tex' style={{ position: "absolute", top: "350px" }}>
                    <img style={{ width: "1700px" }} src={BGimg} alt="img" />
                  </div>
                </>
              ) : (
                <>
                <Box id="custombox2">
                  <h2 id='boxheader'>Meme Analysis</h2>
                    <DropzoneAreaBase
                    id="dropbox"
                    onAdd={(fileObjs) => {
                      console.log('Added Files:', fileObjs);
                      if (fileObjs.length > 0) {
                        handleSubmit(fileObjs);
                        setUploadedFile(fileObjs);
                      }
                    }}
                    onDelete={(fileObj) => console.log('Removed File:', fileObj)}
                    onAlert={(message, variant) => console.log(`${variant}: ${message}`)}
                    acceptedFiles={['.png', '.jpg', 'jpeg']}
                  />
                  <h5 style={{ textAlign: "center", paddingTop: "30px", fontWeight: "400" }}>
                     (For File Upload only png, jpeg, jpg format files are accepted and the image should contain atleast one Text)
                  </h5>
                  </Box>
                  <div id='tex' style={{ position: "absolute", top: "550px" }}>
                    <img style={{ width: "1700px" }} src={BGimg} alt="img" />
                  </div>
                </>
              )}
              
            {isLoading && 
            (
              <div style={{ height: '150px', marginTop: '5%' }}>
                  <Lottie options={{
                    loop: true,
                    autoplay: true,
                    animationData: animationData,
                    }} />
                </div>
              )}
             {results.length > 0 && (
                <Box ref={resultBoxRef} style={{ display: 'flex', marginTop: '4%', justifyContent: 'center' }}>
                  {results.length === 1 ? (
                    <div style={{ textAlign: 'center' }}>
                      <img
                        style={{ height: '400px', width: '500px' }}
                        src={URL.createObjectURL(selectedFiles[0].file)}
                        alt="Uploaded Meme"
                      />
                      <h2 style={{ marginTop: '10px' }}>Sentiment: {results[0]}</h2>
                    </div>
                  ) : (
                    <Box ref={resultBoxRef1} >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '28%' }}>
                        <div style={{ flex: 1, padding:'3%', border: '1px solid #ddd', borderRadius: '5px', marginRight: '2%' }}>
                          <div style={{ textAlign: 'center', marginBottom: '5%' }}>
                            <h2>Positive Sentiments</h2>
                          </div>
                          {sentimentGroups.positive.map((fileObj, index) => (
                            <div key={index} className="image-sentiment-container" style={{ }}>
                              <div className="image-container"  style={{ marginBottom: '2%' }}>
                                <img
                                  style={{ height: '400px', width: '500px' }}
                                  src={URL.createObjectURL(fileObj.file)}
                                  alt={`Uploaded Meme ${index + 1}`}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                        <div style={{ flex: 2, padding: '3%', border: '1px solid #ddd', borderRadius: '5px' }}>
                          <div style={{ textAlign: 'center', marginBottom: '5%' }}>
                            <h2>Negative Sentiments</h2>
                          </div>
                          {sentimentGroups.negative.map((fileObj, index) => (
                            <div key={index} className="image-sentiment-container" style={{  }}>
                              <div style={{ marginBottom: '2%' }}>
                                <img
                                  style={{ height: '400px', width: '500px' }}
                                  src={URL.createObjectURL(fileObj.file)}
                                  alt={`Uploaded Meme ${index + 1}`}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Box>    
                  )}
                </Box>
              )}
             <h3 style={{ color: 'red', marginLeft: "40%", marginTop: '3%'}}>{error}</h3>
             <Box style={{ marginTop: results.length >= 1 ? '13%' : '30%' }}>
                  <Footer />
             </Box>
        </>
    )
}

export default Meme
