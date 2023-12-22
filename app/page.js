"use client";
import React, { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import MetaInfoDisplay from '@/components/MetaInfoDisplay';

export default function Home() {
  const [metaInfoJson, setMetaInfoJson] = useState(null);

    const handleFileUpload = async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost:5000/upload', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            setMetaInfoJson(JSON.stringify(data));
        } catch (error) {
            console.error("Error during file upload: ", error);
        }
    };
    return (
        <div>
            <FileUpload onFileUpload={handleFileUpload} />
            {metaInfoJson && <MetaInfoDisplay jsonData={metaInfoJson} />}
        </div>
    );
}
