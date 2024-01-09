"use client";
import React, { useState } from 'react';
import Image from 'next/image'
import FileUpload from '@/components/FileUpload';
import MetaInfoDisplay from '@/components/MetaInfoDisplay';
import Typist from '@/components/Typist';

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
            <div className="flex flex-col items-center justify-center my-8">
                <Image 
                    src="/logo_transparent.png" 
                    width={400}
                    height={400}
                    alt="Logo" 
                />
                <Typist />
                <p className="text-center mt-2 max-w-xl mx-auto">
                    At NetCDFaster, we redefine the boundaries of data processing. Our tool revolutionizes the speed of reading and visualizing netCDF data through an efficient parallel IO interface. Experience lightweight operations with unprecedented speed and intuitive data analysis. Ideal for large datasets or complex scientific computations, NetCDFaster is your go-to solution. Join us on a journey of high-speed data exploration.
                </p>
            </div>
            <div className="flex flex-col items-center justify-center my-8">
                <FileUpload onFileUpload={handleFileUpload} />
                {metaInfoJson && <MetaInfoDisplay jsonData={metaInfoJson} />}
            </div>
        </div> 
    );
}
