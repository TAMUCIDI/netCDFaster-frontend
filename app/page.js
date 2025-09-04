"use client";
import React, { useState } from 'react';
import Image from 'next/image'
import DualInput from '@/app/components/DualInput';
import MetaInfoDisplay from '@/app/components/MetaInfoDisplay';
import Typist from '@/app/components/Typist';
import ErrorDisplay from '@/app/components/ErrorDisplay';
import { uploadFile } from '@/app/utils/api';
import { getErrorMessage } from '@/app/utils/errorHandler';

export default function Home() {
  const [metaInfoJson, setMetaInfoJson] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = async (file) => {
    setError(null);
    setIsLoading(true);
    
    try {
      const data = await uploadFile(file);
      setMetaInfoJson(JSON.stringify(data));
    } catch (error) {
      setError(error);
      console.error("Error during file upload: ", error);
    } finally {
      setIsLoading(false);
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
        <p className="text-left my-4 max-w-3xl mx-auto">
          At NetCDFaster, we redefine the boundaries of data processing. Our tool revolutionizes the speed of reading and visualizing netCDF data through an efficient parallel IO interface. Experience lightweight operations with unprecedented speed and intuitive data analysis. Ideal for large datasets or complex scientific computations, NetCDFaster is your go-to solution. Join us on a journey of high-speed data exploration.
        </p>
      </div>
      <div className="w-full">
        <DualInput />
      </div>
      
      {/* Error display */}
      {error && (
        <div className="max-w-2xl mx-auto">
          <ErrorDisplay 
            error={error} 
            onRetry={() => setError(null)}
            onDismiss={() => setError(null)}
          />
        </div>
      )}
      
      {/* Loading state */}
      {isLoading && (
        <div className="max-w-2xl mx-auto mt-4">
          <div className="flex items-center justify-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-blue-700">正在处理文件...</span>
          </div>
        </div>
      )}
      
      {/* Results display */}
      {metaInfoJson && (
        <div className="max-w-2xl mx-auto mt-4">
          <MetaInfoDisplay jsonData={metaInfoJson} />
        </div>
      )}
    </div> 
  );
}
