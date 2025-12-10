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
        {variables && Object.keys(variables).length > 0 && (
          <div className="bg-base-100 rounded-lg p-6 border border-gray-600">
            <div className="flex items-center mb-4">
              <div className="bg-accent/20 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-200">Variables</h3>
                <p className="text-sm text-gray-400">{Object.keys(variables).length} variable{Object.keys(variables).length !== 1 ? 's' : ''} available</p>
              </div>
            </div>

            <div className="grid gap-3">
              {Object.entries(variables).map(([varName, varData]) => {
                const isCoordinate = ['time', 'latitude', 'longitude'].includes(varName.toLowerCase()) ||
                                   varData.dims?.length === 1 && varData.dims[0] === varName;

                return (
                  <div
                    key={varName}
                    className={`rounded-lg p-4 border transition-all ${
                      isCoordinate
                        ? 'bg-base-200 border-gray-600'
                        : 'bg-secondary/5 border-secondary/20 hover:bg-secondary/10 hover:border-secondary/30 cursor-pointer'
                    }`}
                    onClick={!isCoordinate ? () => navigateToVariableDetails(varName) : undefined}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h4 className="font-medium text-gray-200">{varName}</h4>
                          {isCoordinate && (
                            <span className="ml-2 px-2 py-1 bg-gray-600 text-gray-300 rounded-full text-xs">Coordinate</span>
                          )}
                          {!isCoordinate && (
                            <span className="ml-2 px-2 py-1 bg-secondary/20 text-secondary rounded-full text-xs">Data Variable</span>
                          )}
                        </div>

                        <div className="text-sm text-gray-400 mb-2">
                          {varData.attributes?.long_name || 'No description available'}
                        </div>

                        <div className="flex flex-wrap gap-2 text-xs">
                          <span className="bg-base-300 px-2 py-1 rounded text-gray-400">
                            Shape: [{varData.shape?.join(', ') || 'N/A'}]
                          </span>
                          <span className="bg-base-300 px-2 py-1 rounded text-gray-400">
                            Type: {varData.dtype || 'N/A'}
                          </span>
                          {varData.attributes?.units && (
                            <span className="bg-base-300 px-2 py-1 rounded text-gray-400">
                              Units: {varData.attributes.units}
                            </span>
                          )}
                        </div>
                      </div>

                      {!isCoordinate && (
                        <div className="ml-4">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 p-3 bg-info/10 border border-info/20 rounded-lg">
              <p className="text-sm text-info flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Click on any data variable to visualize and analyze it
              </p>
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
      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 pt-8 pb-8">
        {/* Header with Logo */}
        <div className="flex justify-center pb-4">
          <Image
            src="/logo_transparent.png"
            width={300}
            height={300}
            alt="Logo"
          />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          NetCDF File Metadata
        </h1>

        {fileData && renderNetCDFResults(fileData)}
      </div>
    </div>
  );
}
