import { useEffect, useState } from 'react';
import axios from 'axios';
import './style.css';


const ImageUploader = () =>{
    const [isOnRoids, setIsOnRoids] = useState(null);
    const [steroidScore, setSteroidScore] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [uploadStatus, setUploadStatus] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [hasResult, setHasResult] = useState(false);
    const [imageUrl, setImageUrl] = useState(null);



    const handleFileChange = (event) => {
      const file = event.target.files[0];
      if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
        setSelectedFile(file);

        const blob = new Blob([file], { type: file.type });

        setPreviewUrl(URL.createObjectURL(file));

        const url = URL.createObjectURL(blob);
        setImageUrl(url);
        
        console.log('File Preview: ', file);
      } else {
        setSelectedFile(null);
        setPreviewUrl(null);
        setUploadStatus({ type: 'error', message: 'Please select a valid JPG or PNG image.' });
      }
    };


    const handleUpload = async () => {
      if (!selectedFile) {
        setUploadStatus({ type: 'error', message: 'Please select an image to upload.' });
        return;
      }
      

      const formData = new FormData();
      formData.append('file', selectedFile);
      let uploadUrl = 'http://localhost:5000/upload'
      
      
      try {
        setIsLoading(true);
        const response = await axios.post(uploadUrl, formData
        )
        .then( response=>
           {
            console.log(response);
            setSteroidScore(response.data['probability']);
            setIsOnRoids(response.data['judgment']);

            // console.log(steroidScore);
            setHasResult(true);
            setIsLoading(false);
          }
        )
        .then(data => {
          console.log(data)
        })
        
      } catch (error) {
        setUploadStatus({ type: 'error', message: 'An error occurred during upload. Please try again.' });
      }
    };

    return(
        <div>
            <input
            type="file"
            accept=".jpg,.jpeg,.png"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
             />
            <button className='upload-button' onClick={handleUpload}>Am I Natty?</button>
            {/* Implement a column of components */}
            <ul className='list'>
              <li>
                {imageUrl && (
                  <div className="mt-4">
                    <img className='image-style' src={imageUrl} alt="Displayed from blob" />
                  </div>
                )}
              </li>
              <li>
                {isLoading && <div className='loading-animation'>Loading...</div>}
              </li>
              <li>
                {/* Display prediction from Machine Learning model */}
                {hasResult && isOnRoids && <div className='loading-animation'>
                  <div>Conclusion: Steroid User!</div>
                  <div>You Are A Meathead!</div>
                  <div>Steroid Score: {steroidScore}</div>
                </div> 
                  ||
                hasResult && !isOnRoids && <div>
                  <div className='loading-animation'>
                    <div>Conclusion: Drug Free</div>
                    <div>You Are Most Likely Natural! Do You Even Lift!</div>
                    <div>Steroid Score: {steroidScore}</div>
                  </div>
                </div> 
                }   
              </li>
            </ul>
            
            
           
                     
        </div>        
    );
}

export default ImageUploader;