// components/FileUpload.js
import React, { useState } from 'react';

const FileUpload = ({ onFileUpload }) => {
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = () => {
        if (file) {
            onFileUpload(file);
        }
    };

    return (
        <div className='flex max-w-xl justify-around'>
            <input type="file" className="file-input file-input-bordered file-input-primary mx-8" onChange={handleFileChange} />
            <button className="btn btn-primary mx-8" onClick={handleUpload}>Upload</button>
        </div>
    );
};

export default FileUpload;
