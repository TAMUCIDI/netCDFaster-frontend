"use client";
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';

import VarDetailCard from '@/app/components/VarDetailCard';

export default function VariableDetails() {
    const params = useParams();
    const [varDetail, setVarDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [plotImage, setPlotImage] = useState(null);
    
    const varName = params.varname ? decodeURIComponent(params.varname) : null;

    useEffect(() => {
        const fetchVariableDetails = async () => {
            if (!varName) {
                setError('Variable name not provided');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                
                const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || 'http://127.0.0.1:5000';
                const response = await fetch(`${backendUrl}/file/detail/${encodeURIComponent(varName)}`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || `Failed to fetch variable details for ${varName}`);
                }

                const data = await response.json();
                setVarDetail(data.data);
            } catch (err) {
                console.error('Error fetching variable details:', err);
                setError(err.message || 'Failed to load variable details');
            } finally {
                setLoading(false);
            }
        };

        fetchVariableDetails();
    }, [varName]);

    const submitQuery = async (queryJson) => {
        const queryString = new URLSearchParams(queryJson).toString();
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || 'http://127.0.0.1:5000';
        const url = `${backendUrl}/file/varplot?${queryString}`;

        try {
            const response = await fetch(url, {
                method: 'GET',
                credentials: 'include',
            });
            
            if (!response.ok) {
                throw new Error('Failed to generate plot');
            }
            
            const data = await response.blob();
            const imgURL = URL.createObjectURL(data);
            setPlotImage(imgURL);
        } catch (error) {
            console.error("Error during plotting variables:", error);
        }
    };

    if (loading) {
        return (
            <div className='flex flex-col items-center justify-center my-8'>
                <Image 
                    src="/logo_transparent.png" 
                    width={400}
                    height={400}
                    alt="Logo" 
                />
                <div className='flex items-center justify-center mt-8'>
                    <div className="loading loading-spinner loading-lg text-primary"></div>
                    <span className="ml-4 text-gray-300">Loading variable details...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className='flex flex-col items-center justify-center my-8'>
                <Image 
                    src="/logo_transparent.png" 
                    width={400}
                    height={400}
                    alt="Logo" 
                />
                <div className='flex flex-col items-center justify-center mt-8'>
                    <div className="alert alert-error">
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Error: {error}</span>
                    </div>
                    <button 
                        className="btn btn-primary mt-4" 
                        onClick={() => window.history.back()}
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
            {/* Header with Logo */}
            <div className='flex justify-center pt-8 pb-4'>
                <Image 
                    src="/logo_transparent.png" 
                    width={300}
                    height={300}
                    alt="Logo" 
                />
            </div>
            
            {/* Main Content Area */}
            <div className='flex flex-col lg:flex-row gap-8 px-6 pb-8 justify-center'>
                {/* Left Side - Variable Details Card */}
                <div className='flex-shrink-0 lg:w-1/2 xl:w-2/5'>
                    <VarDetailCard 
                        varDetail={varDetail}
                        onSubmit={submitQuery}
                    />
                </div>
                
                {/* Right Side - Plot Display */}
                {plotImage && (
                    <div className='flex-shrink-0 lg:w-1/2 xl:w-3/5'>
                        <div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6'>
                            <h3 className='text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200 text-center'>
                                Generated Plot
                            </h3>
                            <div className='flex justify-center'>
                                <img 
                                    src={plotImage} 
                                    alt="NetCDF Variable Plot" 
                                    className='max-w-full h-auto rounded-lg shadow-md'
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}