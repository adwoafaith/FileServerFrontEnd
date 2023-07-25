import axios from 'axios';
import React from 'react';
import { useState, useEffect } from 'react';
import './style.css'
import { useNavigate } from 'react-router-dom';
import pdfImage from '../../assets/image.jpeg'
import videoImage from '../../assets/video.avif';
import audioImage from '../../assets/audio.jpg';

const User = () => {
    const navigate = useNavigate()
    const [files, setFiles] = useState([])
    const [fullScreenImage, setFullScreenImage] = useState(false);
    const [shareScreen, setshareScreen] = useState(false);
    const [reciepient, setReciepient] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [fileId, setFileId] = useState('');
    const [action, showAction] = useState(false);
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BASE_URL}/findfile`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Accept': 'application/json'
            }
        })
            .then(res => {
                setFiles(res.data.response.reverse())
            })
            .catch(error => alert(error.message))
    }, [files])

    const handleShare = (url, id) => {
        setImageUrl(url)
        setFileId(id)
        setshareScreen(!shareScreen)
    }

    const handlePreview = (url) => {
        setImageUrl(url)
        setFullScreenImage(true)
    }


    const handleLogout = () => {
        localStorage.removeItem('token')
        navigate('/login')
    }

    const shareFile = () => {
        setIsLoading(true)
        axios.post(`${process.env.REACT_APP_BASE_URL}/sendEmail/${fileId}`, { email: reciepient }, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Accept': 'application/json'
            }
        })
            .then(res => {
                setIsLoading(false)
                setshareScreen(false)
                alert(res.data.message)
                setReciepient('')
            })
            .catch(error => alert(error.message))
    }


     const handleDownload = async (id, file, format) => {
    if (format === 'pdf') {
      // For PDFs, set the download link as the PDF URL directly
      const link = document.createElement('a');
      link.href = file;
      link.download = `pdffile.pdf`; // You can customize the downloaded PDF file name
      link.click();
    } else {
      // For other formats, make an API call to fetch the file for download
      try {
        await axios.get(`${process.env.REACT_APP_BASE_URL}/file/download/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Accept': 'application/json'
          },
          responseType: 'blob', // Set the response type to 'blob' to handle binary data
        }).then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.download = `file.${file.split('.')[1]}`;
          link.click();
        });
      } catch (err) {
        console.log(err);
      }
    }
  };
    return (
        <>
            <button className='logout' onClick={handleLogout}>Logout</button>
            <form className='dash-form' onSubmit={(e) => e.preventDefault()}>
                <h1>Welcome </h1>
                <>
                    <div className='table'>
                        <div className='table-row'>
                            <h2>Title</h2>
                            <h2>Description</h2>
                            <h2>Image File</h2>
                        </div>
                        {
                            files.map((file, index) =>
                                <div className='table-row' key={index}>
                                    <span>{file.title}</span>
                                    <span>{file.description}</span>
                                    <div className='file-image'>
                                        <div className='image'>
                                                {file.format === 'pdf' && <img src = {pdfImage} alt=''/>}
                                                {file.format === 'video' && <img src = {videoImage} alt=''/>}
                                                {file.format === 'mp4' && <img src = {audioImage} alt=''/>}
                                                {file.format !== 'pdf' && file.format !== 'mp4' && ( <img src={file.file_url} alt="" />)}
                                             
                                        </div>
                                        <span className="spanner" onClick={() => showAction(!action)}>Action</span>
                                        <div className={`actions ${action ? 'show' : ''}`}>
                                            <button onClick={() => handlePreview(file.file_url)} style={{ cursor: 'pointer' }}>Preview</button>
                                            <button onClick={() => handleShare(file.file_url, file._id)} style={{ cursor: 'pointer' }}>
                                                Share
                                        
                                            </button>
                                            <button onClick={() => handleDownload(file._id, file.file_url)} style={{ cursor: 'pointer' }} >
                                                Download
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </>
            </form>

            {fullScreenImage && (
                <div className="fullscreen-overlay" onClick={() => setFullScreenImage(false)}>
                    <img src={imageUrl} alt="Full Screen" className="fullscreen-image" />
                </div>
            )}

            {shareScreen && (
                <div className="fullscreen-share-overlay">
                    <span onClick={() => setshareScreen(!shareScreen)} className='close'>X</span>
                    <div className='share-window'>
                        <h2>Share a file with your friends and network</h2>
                        <div style={{ display: 'flex', gap: 15, justifyContent: 'space-between' }}>
                            <input type="email" placeholder="Please enter reciepient's email address" value={reciepient} onChange={(e) => setReciepient(e.target.value)} />
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <button className='shareBtn' onClick={shareFile} >Share</button>
                                <span className="loader" style={{ display: isLoading ? 'block' : 'none' }}></span>
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '20px 0' }}>
                            <img src={imageUrl} alt="" width={300} />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default User