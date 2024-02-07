"use client";
import React, { useState } from 'react';
import Image from 'next/image'

import VarDetailCard from '@/app/components/VarDetailCard';

export default function vardetails() {
    const [imageSrc, setImageSrc] = useState(null);
    const submitQuery = async (queryJson) => {
        const queryString = new URLSearchParams(queryJson).toString();
        const url = `http://127.0.0.1:5000/file/varplot?${queryString}`;

        try {
            const response = await fetch(
                url,
                {
                    method: 'GET',
                    credentials: 'include',
                }
            );
            const data = await response.blob();
            const imgURL = URL.createObjectURL(data);
            setImageSrc(imgURL);
        } catch (error) {
            console.error("Error during plotting variables:", error);
        }
    };
    return (
        <div className='flex flex-col flex-wrap items-center justify-center my-8'>
            <Image 
                    src="/logo_transparent.png" 
                    width={400}
                    height={400}
                    alt="Logo" 
            />
            <div className='flex flex-row flex-wrap items-center justify-center mx-8'>
            
                <VarDetailCard onSubmit={submitQuery}/>
                {imageSrc && 
                    <Image 
                        src={imageSrc} 
                        width={800}
                        height={1200}
                        alt="VarPlot" 
                    />
                }
            </div>
        </div>
    );
};