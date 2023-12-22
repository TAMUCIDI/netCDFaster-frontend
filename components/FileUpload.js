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
        <div>
            <input type="file" className="file-input file-input-bordered file-input-primary w-full max-w-xs" onChange={handleFileChange} />
            <button className="btn btn-primary" onClick={handleUpload}>Upload</button>
        </div>
    );
};

export default FileUpload;
