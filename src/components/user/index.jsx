import axios from 'axios';
import React from 'react';
import { useState, useEffect } from 'react';
import './style.css'
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
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
            .catch(err => console.error(err))
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
            .catch(err => console.error(err))
    }

    const handleDownload = async (id, file) => {
        const link = document.createElement('a');
        link.href = file
        link.download = `imagefile.${file.split('.')[1]}`
        link.click()

        try {
            await axios.get(`${process.env.REACT_APP_BASE_URL}/file/download/${id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Accept': 'application/json'
                }
            })

        } catch (err) {
            console.log(err)
        }
    }
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
                                            <img src={`${file.file_url}`} alt="" />
                                        </div>
                                        <span className="spanner" onClick={() => showAction(!action)}>Action</span>
                                        <div className={`actions ${action ? 'show' : ''}`}>
                                            <button onClick={() => handlePreview(file.file_url)} style={{ cursor: 'pointer' }}>Preview</button>
                                            <button onClick={() => handleShare(file.file_url, file._id)} style={{ cursor: 'pointer' }}>
                                                Share
                                                <span className='count shares'>{file.emailCount}</span>
                                            </button>
                                            <button onClick={() => handleDownload(file._id, file.file_url)} style={{ cursor: 'pointer' }} >
                                                Download
                                                <span className='count downloads'>{file.downloadCount}</span>
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

export default Dashboard