import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

const DualInput = () => {
  const router = useRouter();
  const [activeMode, setActiveMode] = useState('url');
  const [url, setUrl] = useState('');
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  
  // New states for validation and progress
  const [urlValidation, setUrlValidation] = useState(null); // null, 'valid', 'invalid'
  const [fileValidation, setFileValidation] = useState(null); // null, 'valid', 'invalid'
  const [processingStep, setProcessingStep] = useState(''); // 'uploading', 'parsing', 'complete'
  const [progress, setProgress] = useState(0); // 0-100
  
  const fileInputRef = useRef(null);

  // Switch input mode
  const switchMode = (mode) => {
    setActiveMode(mode);
    setError(null);
    setResult(null);
  };

  // Validate URL format and potentially check accessibility
  const validateUrl = (urlString) => {
    if (!urlString.trim()) {
      setUrlValidation(null);
      return;
    }
    
    try {
      const url = new URL(urlString);
      // Check if it's a valid HTTP/HTTPS URL
      if (url.protocol === 'http:' || url.protocol === 'https:') {
        // Check if URL ends with netcdf-like extensions
        const pathname = url.pathname.toLowerCase();
        if (pathname.endsWith('.nc') || pathname.endsWith('.netcdf') || pathname.endsWith('.cdf')) {
          setUrlValidation('valid');
        } else {
          setUrlValidation('warning'); // Valid URL but not obvious NetCDF file
        }
      } else {
        setUrlValidation('invalid');
      }
    } catch {
      setUrlValidation('invalid');
    }
  };

  // Handle URL input change
  const handleUrlChange = (e) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
    setError(null);
    validateUrl(newUrl);
  };

  // Handle file selection
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      validateAndSetFile(selectedFile);
    }
  };

  // Validate and set file
  const validateAndSetFile = (selectedFile) => {
    // Validate file extension (NetCDF files may not have proper MIME types)
    const fileName = selectedFile.name.toLowerCase();
    const validExtensions = ['.nc', '.netcdf', '.cdf'];
    const hasValidExtension = validExtensions.some(ext => fileName.endsWith(ext));
    
    if (!hasValidExtension) {
      setFileValidation('invalid');
      setError('Unsupported file type. Please upload NetCDF files (.nc, .netcdf, .cdf).');
      setFile(null);
      return;
    }
    
    // Validate file size (max 100MB for scientific data)
    if (selectedFile.size > 100 * 1024 * 1024) {
      setFileValidation('invalid');
      setError('File size exceeds 100MB limit.');
      setFile(null);
      return;
    }
    
    // File is valid
    setFileValidation('valid');
    setFile(selectedFile);
    setError(null);
  };

  // Drag and drop event handling
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      validateAndSetFile(droppedFile);
    }
  };

  // Open file selection dialog
  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Remove file
  const removeFile = () => {
    setFile(null);
    setFileValidation(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Navigate to variable details with selected variable
  const navigateToVariableDetails = (variableName) => {
    // Navigate to dynamic route with variable name as parameter
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '/netcdfaster-frontend';
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 1.79 4 4 4h8c2.21 0 4-1.79 4-4V7c0-2.21-1.79-4-4-4H8c-2.21 0-4 1.79-4 4z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-200">Data Dimensions</h3>
                <p className="text-sm text-gray-400">Structure and size of the data</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(dimensions).map(([dim, size]) => (
                <div key={dim} className="bg-primary/10 rounded-lg p-3 text-center border border-primary/20">
                  <div className="text-xs text-primary uppercase tracking-wide mb-1">{dim}</div>
                  <div className="text-lg font-bold text-primary">{size}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Variables List */}
        {variables && Object.keys(variables).length > 0 && (
          <div className="bg-base-100 rounded-lg p-6 border border-gray-600">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="bg-secondary/20 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-200">Variables</h3>
                  <p className="text-sm text-gray-400">{Object.keys(variables).length} variables available for visualization</p>
                </div>
              </div>
            </div>
            
            <div className="grid gap-3">
              {Object.entries(variables).map(([varName, varData]) => {
                const isCoordinate = ['time', 'latitude', 'longitude'].includes(varName.toLowerCase()) || 
                                   varData.dims.length === 1 && varData.dims[0] === varName;
                
                return (
                  <div key={varName} className={`rounded-lg p-4 border transition-all ${
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

  // Simulate progress updates
  const simulateProgress = async (steps) => {
    for (const step of steps) {
      setProcessingStep(step.step);
      for (let i = step.startProgress; i <= step.endProgress; i += 5) {
        setProgress(i);
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
  };

  // Handle URL submission
  const handleUrlSubmit = async () => {
    if (!url.trim()) {
      setError('Please enter a valid URL');
      return;
    }
    
    try {
      setIsProcessing(true);
      setError(null);
      setResult(null);
      setProgress(0);
      
      // Simulate progress steps
      const progressSteps = [
        { step: 'Connecting to URL...', startProgress: 0, endProgress: 30 },
        { step: 'Downloading file...', startProgress: 30, endProgress: 70 },
        { step: 'Parsing NetCDF data...', startProgress: 70, endProgress: 90 },
        { step: 'Finalizing...', startProgress: 90, endProgress: 100 }
      ];
      
      // Start progress simulation
      const progressPromise = simulateProgress(progressSteps);
      
      // Get backend URL from environment
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:5000';

      // Call Flask backend API directly for URL processing
      const response = await fetch(`${backendUrl}/file/remoteQuery`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url }),
        credentials: 'include'
      });
      
      // Wait for both API call and progress simulation
      await progressPromise;
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error processing URL');
      }
      
      const data = await response.json();
      setResult(data);
      setProcessingStep('Complete!');
    } catch (err) {
      setError(err.message || 'Error processing URL');
    } finally {
      setIsProcessing(false);
      setProcessingStep('');
      setProgress(0);
    }
  };

  // Handle file upload
  const handleFileUpload = async () => {
    if (!file) {
      setError('Please select a file to upload');
      return;
    }
    
    try {
      setIsProcessing(true);
      setError(null);
      setResult(null);
      setProgress(0);
      
      // Simulate progress steps for file upload
      const progressSteps = [
        { step: 'Preparing upload...', startProgress: 0, endProgress: 20 },
        { step: 'Uploading file...', startProgress: 20, endProgress: 60 },
        { step: 'Processing NetCDF data...', startProgress: 60, endProgress: 90 },
        { step: 'Finalizing...', startProgress: 90, endProgress: 100 }
      ];
      
      // Start progress simulation
      const progressPromise = simulateProgress(progressSteps);
      
      const formData = new FormData();
      formData.append('file', file);
      
      // Get backend URL from environment
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:5000';

      // Call Flask backend API directly
      const response = await fetch(`${backendUrl}/file/upload`, {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });
      
      // Wait for both API call and progress simulation
      await progressPromise;
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error uploading file');
      }
      
      const data = await response.json();
      setResult(data);
      setProcessingStep('Complete!');
    } catch (err) {
      setError(err.message || 'Error uploading file');
    } finally {
      setIsProcessing(false);
      setProcessingStep('');
      setProgress(0);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-base-200 rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-base-300 p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-300">NetCDF Data Input</h1>
          <p className="text-gray-400 mt-2 text-lg">Upload files or process URLs</p>
        </div>
      </div>
      
      {/* Content Area */}
      <div className="p-8">
        {/* Mode Toggle Tabs */}
        <div className="flex bg-base-300 rounded-lg p-1 mb-6">
          <button
            className={`flex-1 py-3 px-4 text-center font-medium rounded-md transition-all duration-200 ${
              activeMode === 'url' 
                ? 'bg-primary text-primary-content shadow-sm' 
                : 'text-gray-400 hover:text-gray-300 hover:bg-base-200'
            }`}
            onClick={() => switchMode('url')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            URL Input
          </button>
          <button
            className={`flex-1 py-3 px-4 text-center font-medium rounded-md transition-all duration-200 ${
              activeMode === 'file' 
                ? 'bg-primary text-primary-content shadow-sm' 
                : 'text-gray-400 hover:text-gray-300 hover:bg-base-200'
            }`}
            onClick={() => switchMode('file')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            File Upload
          </button>
        </div>
        
        {/* URL Input Section */}
        {activeMode === 'url' && (
          <div className="mb-4">
            <label className="block text-gray-300 font-medium mb-2">Enter NetCDF Data URL</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="url"
                value={url}
                onChange={handleUrlChange}
                placeholder="https://example.com/data.nc"
                className={`input input-bordered w-full pl-10 pr-10 bg-base-100 text-gray-300 placeholder-gray-500 focus:border-primary ${
                  urlValidation === 'invalid' ? 'border-error' : 
                  urlValidation === 'valid' ? 'border-success' : 
                  urlValidation === 'warning' ? 'border-warning' : ''
                }`}
                disabled={isProcessing}
              />
              {/* Validation Status Icon */}
              {urlValidation && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  {urlValidation === 'valid' && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                  {urlValidation === 'warning' && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-warning" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  )}
                  {urlValidation === 'invalid' && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-error" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              )}
            </div>
            {/* URL Validation Feedback */}
            {urlValidation && (
              <div className={`text-sm mt-2 flex items-center ${
                urlValidation === 'valid' ? 'text-success' :
                urlValidation === 'warning' ? 'text-warning' :
                urlValidation === 'invalid' ? 'text-error' : ''
              }`}>
                {urlValidation === 'valid' && '✓ Valid NetCDF URL detected'}
                {urlValidation === 'warning' && '⚠ Valid URL, but file extension not recognized as NetCDF'}
                {urlValidation === 'invalid' && '✗ Invalid URL format'}
              </div>
            )}
            {!urlValidation && (
              <p className="text-sm text-gray-500 mt-2">Supports HTTP/HTTPS links to NetCDF files</p>
            )}
            
            <div className="flex flex-wrap gap-3 mt-6">
              <button
                onClick={handleUrlSubmit}
                disabled={isProcessing || !url.trim()}
                className={`btn btn-primary flex items-center ${
                  isProcessing ? 'loading' : ''
                }`}
              >
                {isProcessing ? (
                  'Processing...'
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    Process URL
                  </>
                )}
              </button>
              <button
                onClick={() => setUrl('')}
                disabled={isProcessing}
                className="btn btn-ghost text-gray-400 hover:text-gray-300"
              >
                Clear
              </button>
            </div>
          </div>
        )}
        
        {/* File Upload Section */}
        {activeMode === 'file' && (
          <div className="mb-4">
            <label className="block text-gray-300 font-medium mb-2">Upload NetCDF File</label>
            
            <div
              className={`rounded-lg p-12 text-center cursor-pointer transition border-2 border-dashed ${
                isDragging 
                  ? 'border-primary bg-primary/10' 
                  : 'border-gray-600 hover:border-primary/50 bg-base-100'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={openFileDialog}
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
                disabled={isProcessing}
                accept=".nc,.netcdf,.cdf"
              />
              <div className="mb-6">
                <div className="bg-primary/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
              </div>
              <p className="text-gray-300 font-medium mb-2 text-lg">Drop your NetCDF file here</p>
              <p className="text-gray-500 mb-6">or</p>
              <button
                className="btn btn-secondary"
                onClick={(e) => { e.stopPropagation(); openFileDialog(); }}
                disabled={isProcessing}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Browse Files
              </button>
              <p className="text-gray-500 mt-4">Supports .nc, .netcdf, .cdf formats</p>
            </div>
            
            {/* File Preview */}
            {file && (
              <div className="mt-4">
                <div className={`border rounded-lg p-4 flex items-center bg-base-100 ${
                  fileValidation === 'valid' ? 'border-success bg-success/5' : 
                  fileValidation === 'invalid' ? 'border-error bg-error/5' : 
                  'border-gray-600'
                }`}>
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mr-4 ${
                    fileValidation === 'valid' ? 'bg-success/20' : 
                    fileValidation === 'invalid' ? 'bg-error/20' : 
                    'bg-primary/20'
                  }`}>
                    {fileValidation === 'valid' ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-success" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : fileValidation === 'invalid' ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-error" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-medium truncate max-w-xs text-gray-300 block">{file.name}</span>
                        <div className="text-sm text-gray-500 mt-1">
                          {formatFileSize(file.size)}
                          {fileValidation === 'valid' && (
                            <span className="text-success ml-2">✓ Valid NetCDF file</span>
                          )}
                          {fileValidation === 'invalid' && (
                            <span className="text-error ml-2">✗ Invalid file type or size</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); removeFile(); }}
                    disabled={isProcessing}
                    className="ml-4 text-gray-500 hover:text-error transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
            
            <div className="flex flex-wrap gap-3 mt-6">
              <button
                onClick={handleFileUpload}
                disabled={isProcessing || !file}
                className={`btn btn-primary flex items-center ${
                  isProcessing ? 'loading' : ''
                }`}
              >
                {isProcessing ? (
                  'Uploading...'
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    Upload File
                  </>
                )}
              </button>
              <button
                onClick={() => { setFile(null); setError(null); }}
                disabled={isProcessing}
                className="btn btn-ghost text-gray-400 hover:text-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        
        {/* Progress Display */}
        {isProcessing && (
          <div className="mt-6 p-4 bg-primary/10 border border-primary/30 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-primary font-medium">{processingStep}</span>
              <span className="text-primary text-sm">{progress}%</span>
            </div>
            <div className="w-full bg-base-300 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}
        
        {/* Error Display */}
        {error && (
          <div className="mt-4 p-3 bg-error/10 border border-error/30 rounded-lg">
            <div className="flex items-center text-error">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}
        
        {/* Results Display */}
        {result && (
          <div className="mt-6">
            <div className="mb-4 p-4 bg-success/10 border border-success/30 rounded-lg">
              <h3 className="font-medium text-success mb-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                File Processing Complete
              </h3>
              <p className="text-sm text-success">NetCDF file has been successfully analyzed and is ready for exploration.</p>
            </div>
            {renderNetCDFResults(result)}
          </div>
        )}
      </div>
      
      {/* Footer Information */}
      <div className="bg-base-300 p-4 border-t border-gray-600">
        <div className="flex flex-wrap items-center justify-between text-sm text-gray-500">
          <div className="flex items-center mb-2 md:mb-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Secure Transfer
          </div>
          <div className="flex items-center mb-2 md:mb-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            256-bit Encryption
          </div>
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Fast Processing
          </div>
        </div>
      </div>
    </div>
  );
};

export default DualInput;