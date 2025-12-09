"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function FileMetaPage() {
  const router = useRouter();
  const [fileData, setFileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Retrieve file metadata from localStorage
    const storedData = localStorage.getItem('currentFileMetadata');

    if (!storedData) {
      // No data found, redirect back to homepage
      router.push('/');
      return;
    }

    try {
      const parsedData = JSON.parse(storedData);
      setFileData(parsedData);
      setLoading(false);
    } catch (err) {
      console.error('Error parsing file metadata:', err);
      setError('Failed to load file metadata');
      setLoading(false);
    }
  }, [router]);

  // Navigate to variable details with selected variable
  const navigateToVariableDetails = (variableName) => {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '/netcdfaster';
    const path = basePath ? `${basePath}/vardetails/${encodeURIComponent(variableName)}` : `/vardetails/${encodeURIComponent(variableName)}`;
    router.push(path);
  };

  // Render NetCDF results in a user-friendly format
  const renderNetCDFResults = (data) => {
    if (!data?.data) return null;

    const { upload_info, dimensions, variables, attributes } = data.data;

    return (
      <div className="space-y-6">
        {/* File Information Card */}
        <div className="bg-base-100 rounded-lg p-6 border border-gray-600">
          <div className="flex items-center mb-4">
            <div className="bg-success/20 w-12 h-12 rounded-full flex items-center justify-center mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-200">File Information</h3>
              <p className="text-sm text-gray-400">NetCDF file successfully processed</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-base-200 rounded-lg p-4">
              <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">Filename</div>
              <div className="text-sm font-medium text-gray-200 truncate">{upload_info?.original_filename || 'N/A'}</div>
            </div>
            <div className="bg-base-200 rounded-lg p-4">
              <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">File Size</div>
              <div className="text-sm font-medium text-gray-200">{upload_info?.file_size_mb ? `${upload_info.file_size_mb} MB` : 'N/A'}</div>
            </div>
            <div className="bg-base-200 rounded-lg p-4">
              <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">Upload Time</div>
              <div className="text-sm font-medium text-gray-200">{upload_info?.upload_time ? new Date(upload_info.upload_time).toLocaleString() : 'N/A'}</div>
            </div>
          </div>

          {/* Global Attributes */}
          {attributes && Object.keys(attributes).length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-300 mb-2">Global Attributes</h4>
              <div className="bg-base-200 rounded-lg p-3">
                <div className="space-y-1">
                  {Object.entries(attributes).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-xs">
                      <span className="text-gray-400">{key}:</span>
                      <span className="text-gray-300 max-w-xs truncate">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Dimensions Card */}
        {dimensions && Object.keys(dimensions).length > 0 && (
          <div className="bg-base-100 rounded-lg p-6 border border-gray-600">
            <div className="flex items-center mb-4">
              <div className="bg-primary/20 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-200">Dimensions</h3>
                <p className="text-sm text-gray-400">{Object.keys(dimensions).length} dimension{Object.keys(dimensions).length !== 1 ? 's' : ''} found</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.entries(dimensions).map(([name, size]) => (
                <div key={name} className="bg-base-200 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-200">{name}</span>
                    <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">{size}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Variables Card */}
        {variables && variables.length > 0 && (
          <div className="bg-base-100 rounded-lg p-6 border border-gray-600">
            <div className="flex items-center mb-4">
              <div className="bg-accent/20 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-200">Variables</h3>
                <p className="text-sm text-gray-400">{variables.length} variable{variables.length !== 1 ? 's' : ''} available</p>
              </div>
            </div>

            <div className="space-y-2">
              {variables.map((variable) => (
                <button
                  key={variable.var_short_name}
                  onClick={() => navigateToVariableDetails(variable.var_short_name)}
                  className="w-full bg-base-200 hover:bg-base-300 rounded-lg p-4 text-left transition-colors duration-200 border border-transparent hover:border-primary group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-gray-200 group-hover:text-primary">{variable.var_short_name}</span>
                        <span className="text-xs bg-info/20 text-info px-2 py-0.5 rounded">{variable.dtype}</span>
                      </div>
                      <p className="text-xs text-gray-400 line-clamp-1">{variable.var_long_name}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                        <span>Shape: {variable.shape}</span>
                        {variable.units && <span>Units: {variable.units}</span>}
                      </div>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 group-hover:text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center">
        <Image
          src="/logo_transparent.png"
          width={400}
          height={400}
          alt="Logo"
        />
        <div className="loading loading-spinner loading-lg text-primary mt-4"></div>
        <span className="ml-4 text-gray-300 mt-2">Loading file metadata...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center">
        <Image
          src="/logo_transparent.png"
          width={400}
          height={400}
          alt="Logo"
        />
        <div className="alert alert-error mt-4 max-w-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
        <button
          className="btn btn-primary mt-4"
          onClick={() => router.push('/')}
        >
          Go Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Back Button - Upper Left */}
      <button
        onClick={() => window.history.back()}
        className="fixed top-4 left-4 btn btn-ghost btn-sm z-10 flex items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      {/* Header with Logo */}
      <div className="flex justify-center pt-8 pb-4">
        <Image
          src="/logo_transparent.png"
          width={300}
          height={300}
          alt="Logo"
        />
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 pb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          NetCDF File Metadata
        </h1>

        {fileData && renderNetCDFResults(fileData)}
      </div>
    </div>
  );
}
