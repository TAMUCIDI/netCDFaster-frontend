import React, { useState, useEffect } from 'react';

import TimeInput from '@/app/components/TimeInput';
import LonLatInput from '@/app/components/LonLatInput';

// Function to format time strings for better readability
const formatTimeString = (timeStr) => {
    if (!timeStr) return timeStr;
    
    try {
        // Handle various time formats
        
        // 1. ISO 8601 format (e.g., "2020-01-01T00:00:00", "2020-01-01T00:00:00.000000")
        if (timeStr.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)) {
            const date = new Date(timeStr);
            if (!isNaN(date.getTime())) {
                return date.toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    timeZoneName: 'short'
                });
            }
        }
        
        // 2. Date only format (e.g., "2020-01-01")
        if (timeStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
            const date = new Date(timeStr + 'T00:00:00');
            if (!isNaN(date.getTime())) {
                return date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
            }
        }
        
        // 3. Unix timestamp (seconds)
        if (timeStr.match(/^\d{10}$/)) {
            const date = new Date(parseInt(timeStr) * 1000);
            if (!isNaN(date.getTime())) {
                return date.toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    timeZoneName: 'short'
                });
            }
        }
        
        // 4. Unix timestamp (milliseconds)
        if (timeStr.match(/^\d{13}$/)) {
            const date = new Date(parseInt(timeStr));
            if (!isNaN(date.getTime())) {
                return date.toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    timeZoneName: 'short'
                });
            }
        }
        
        // 5. NetCDF time units format (e.g., "days since 1900-01-01", "hours since 2000-01-01 00:00:00")
        const netcdfMatch = timeStr.match(/^(\d+(?:\.\d+)?)\s+(.*)/);
        if (netcdfMatch) {
            const [, value, unit] = netcdfMatch;
            const numValue = parseFloat(value);
            
            if (unit.includes('since')) {
                const referenceMatch = unit.match(/since\s+(.+)/);
                if (referenceMatch) {
                    const referenceDate = new Date(referenceMatch[1]);
                    if (!isNaN(referenceDate.getTime())) {
                        let milliseconds = 0;
                        
                        if (unit.includes('days')) {
                            milliseconds = numValue * 24 * 60 * 60 * 1000;
                        } else if (unit.includes('hours')) {
                            milliseconds = numValue * 60 * 60 * 1000;
                        } else if (unit.includes('minutes')) {
                            milliseconds = numValue * 60 * 1000;
                        } else if (unit.includes('seconds')) {
                            milliseconds = numValue * 1000;
                        }
                        
                        const resultDate = new Date(referenceDate.getTime() + milliseconds);
                        if (!isNaN(resultDate.getTime())) {
                            return resultDate.toLocaleString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                timeZoneName: 'short'
                            });
                        }
                    }
                }
            }
        }
        
        // 6. Try to parse as general date
        const date = new Date(timeStr);
        if (!isNaN(date.getTime())) {
            return date.toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                timeZoneName: 'short'
            });
        }
        
    } catch (error) {
        console.warn('Time parsing error:', error);
    }
    
    // If all parsing fails, return original string
    return timeStr;
};

const VarDetailCard = ({ varDetail, onSubmit }) => {
    // Initialize queryJson with default values
    const [queryJson, setQueryJson] = useState({
        varName: null,
        time: null,
        lonMin: null,
        lonMax: null,
        latMin: null,
        latMax: null
    });

    // Update queryJson when varDetail changes and set default values
    useEffect(() => {
        if (varDetail) {
            const newQuery = {
                varName: varDetail.var_short_name,
                time: null,
                lonMin: null,
                lonMax: null,
                latMin: null,
                latMax: null
            };

            // Set default values from coordinates
            if (varDetail.coords) {
                varDetail.coords.forEach(coord => {
                    if (coord.name === 'time' || coord.name === 't' || coord.name === 'Time' || coord.name === 'T' || coord.name === 'TIME') {
                        newQuery.time = coord.min;
                    } else if (coord.name === 'latitude' || coord.name === 'lat' || coord.name === 'Latitude' || coord.name === 'LAT' || coord.name === 'LATITUDE') {
                        newQuery.latMin = coord.min;
                        newQuery.latMax = coord.min;
                    } else if (coord.name === 'longitude' || coord.name === 'lon' || coord.name === 'Longitude' || coord.name === 'LONGITUDE' || coord.name === 'LON') {
                        newQuery.lonMin = coord.min;
                        newQuery.lonMax = coord.min;
                    }
                });
            }

            setQueryJson(newQuery);
        }
    }, [varDetail]);

    const handleTimeChange = (value) => {
        setQueryJson(prev => ({
            ...prev,
            time: value ? value.toISOString() : null
        }));
    };

    const handleLonChange = (value) => {
        if (value && Array.isArray(value) && value.length >= 2) {
            setQueryJson(prev => ({
                ...prev,
                lonMin: value[0].toString(),
                lonMax: value[1].toString()
            }));
        }
    };

    const handleLatChange = (value) => {
        if (value && Array.isArray(value) && value.length >= 2) {
            setQueryJson(prev => ({
                ...prev,
                latMin: value[0].toString(),
                latMax: value[1].toString()
            }));
        }
    };

    const handleSubmit = () => {
        onSubmit(queryJson);
    };

    if (!varDetail) {
        return <div>Loading...</div>;
    }


    return (
        <div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full'>
            {/* Header */}
            <div className='mb-6 border-b border-gray-200 dark:border-gray-600 pb-4'>
                <h1 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>
                    Variable Details
                </h1>
                <p className='text-sm text-gray-500 dark:text-gray-400'>
                    Configure visualization parameters for {varDetail.var_short_name}
                </p>
            </div>

            {/* Variable Attributes Section */}
            <div className="mb-6">
                <div className="collapse collapse-arrow bg-gray-50 dark:bg-gray-700">
                    <input type="radio" name="var-accordion" defaultChecked /> 
                    <div className="collapse-title text-lg font-semibold text-gray-900 dark:text-white">
                        <span className="flex items-center">
                            <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Variable Attributes
                        </span>
                    </div>
                    <div className="collapse-content px-4"> 
                        <div className="grid gap-3 mt-2">
                            <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded border">
                                <span className="font-medium text-gray-700 dark:text-gray-300">Variable Name:</span>
                                <span className="text-blue-600 dark:text-blue-400 font-mono">{varDetail.var_short_name}</span>
                            </div>
                            <div className="flex flex-col space-y-2 p-3 bg-white dark:bg-gray-800 rounded border">
                                <span className="font-medium text-gray-700 dark:text-gray-300">Long Name:</span>
                                <span className="text-gray-900 dark:text-gray-100 text-sm break-words" title={varDetail.var_long_name}>{varDetail.var_long_name}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded border">
                                <span className="font-medium text-gray-700 dark:text-gray-300">Data Type:</span>
                                <span className="text-green-600 dark:text-green-400 font-mono">{varDetail.dtype}</span>
                            </div>
                            <div className="flex flex-col space-y-2 p-3 bg-white dark:bg-gray-800 rounded border">
                                <span className="font-medium text-gray-700 dark:text-gray-300">Shape:</span>
                                <span className="text-purple-600 dark:text-purple-400 font-mono text-sm break-all">{varDetail.shape}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded border">
                                <span className="font-medium text-gray-700 dark:text-gray-300">Units:</span>
                                <span className="text-orange-600 dark:text-orange-400">{varDetail.units}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Coordinates Section */}
            <div className="mb-6">
                <div className="collapse collapse-arrow bg-gray-50 dark:bg-gray-700">
                    <input type="radio" name="var-accordion" defaultChecked /> 
                    <div className="collapse-title text-lg font-semibold text-gray-900 dark:text-white">
                        <span className="flex items-center">
                            <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Coordinate Filters
                        </span>
                    </div>
                    <div className="collapse-content px-4"> 
                        {varDetail.coords && varDetail.coords.length > 0 ? (
                            <div className='space-y-4 mt-2'>
                                {varDetail.coords.map((coord) => (
                                    <div key={coord.name} className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                                        <div className="collapse collapse-arrow bg-white dark:bg-gray-800">
                                            <input type="checkbox" defaultChecked /> 
                                            <div className="collapse-title text-base font-medium text-gray-800 dark:text-gray-200 py-3">
                                                <span className="flex items-center justify-between">
                                                    <span className="font-semibold text-blue-600 dark:text-blue-400">{coord.name}</span>
                                                    <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                                        {coord.dtype}
                                                    </span>
                                                </span>
                                            </div>
                                            <div className="collapse-content bg-gray-50 dark:bg-gray-700"> 
                                                <div className='p-4 space-y-3'>
                                                    <div className="space-y-3 text-sm">
                                                        <div className="flex flex-col space-y-1">
                                                            <span className="text-gray-600 dark:text-gray-400 font-medium">Min:</span>
                                                            <div className="bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded">
                                                                {(coord.name === 'time' || coord.name === 't' || coord.name === 'Time' || coord.name === 'T' || coord.name === 'TIME') ? (
                                                                    <div>
                                                                        <div className="text-gray-900 dark:text-gray-100 text-xs font-medium">
                                                                            {formatTimeString(coord.min)}
                                                                        </div>
                                                                        <div className="text-gray-500 dark:text-gray-400 text-xs font-mono mt-1" title={coord.min}>
                                                                            Raw: {coord.min}
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <span className="font-mono text-gray-900 dark:text-gray-100 text-xs break-all" title={coord.min}>
                                                                        {coord.min}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col space-y-1">
                                                            <span className="text-gray-600 dark:text-gray-400 font-medium">Max:</span>
                                                            <div className="bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded">
                                                                {(coord.name === 'time' || coord.name === 't' || coord.name === 'Time' || coord.name === 'T' || coord.name === 'TIME') ? (
                                                                    <div>
                                                                        <div className="text-gray-900 dark:text-gray-100 text-xs font-medium">
                                                                            {formatTimeString(coord.max)}
                                                                        </div>
                                                                        <div className="text-gray-500 dark:text-gray-400 text-xs font-mono mt-1" title={coord.max}>
                                                                            Raw: {coord.max}
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <span className="font-mono text-gray-900 dark:text-gray-100 text-xs break-all" title={coord.max}>
                                                                        {coord.max}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Input Controls */}
                                                    <div className="mt-4">
                                                        {coord.name === 'time' || coord.name === 't' || coord.name === 'Time' || coord.name === 'T' || coord.name === 'TIME' ? (
                                                            <div className="space-y-2">
                                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Select Time:</label>
                                                                <TimeInput dimension={coord} onChange={handleTimeChange} />
                                                            </div>
                                                        ) : null}
                                                        {(coord.name === 'latitude' || coord.name === 'lat' || coord.name === 'Latitude' || coord.name === 'LAT' || coord.name === 'LATITUDE') ? (
                                                            <div className="space-y-2">
                                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Latitude Range:</label>
                                                                <LonLatInput dimension={coord} onChange={handleLatChange} />
                                                            </div>
                                                        ) : null}
                                                        {(coord.name === 'longitude' || coord.name == 'lon' || coord.name === 'Longitude' || coord.name === 'LONGITUDE' || coord.name == 'LON' ) ? (
                                                            <div className="space-y-2">
                                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Longitude Range:</label>
                                                                <LonLatInput dimension={coord} onChange={handleLonChange} />
                                                            </div>
                                                        ) : null}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                
                                {/* Submit Button */}
                                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
                                    <button 
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                                        onClick={handleSubmit}
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m5 0H3a2 2 0 00-2 2v12a2 2 0 002 2h18a2 2 0 002-2V6a2 2 0 00-2-2z" />
                                        </svg>
                                        Generate Plot
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <p className="text-gray-500 dark:text-gray-400">No coordinates available for this variable.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VarDetailCard;