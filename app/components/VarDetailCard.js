import React from 'react';
import { useEffect, useState } from 'react';

import TimeInput from '@/app/components/TimeInput';
import LonLatInput from '@/app/components/LonLatInput';

const VarDetailCard = () => {
    const [varDetail, setvarDetail] = useState(null);

    const queryJson = {};
    queryJson.varName = varDetail? varDetail.name: null;
    queryJson.time = new Date().toISOString();
    queryJson.lon = {};
    queryJson.lon.min = null;
    queryJson.lon.max = null;
    queryJson.lat = {};
    queryJson.lat.min = null;
    queryJson.lat.max = null;

    const handleTimeChange = (value) => {
        queryJson.time = value.toISOString();
    };
    const handleLonChange = (value) => {
        queryJson.lon.min = value[0];
        queryJson.lon.max = value[1];
    };
    const handleLatChange = (value) => {
        queryJson.lat.min = value[0];
        queryJson.lat.max = value[1];
    };

    const submitQuery = () => {
        console.log(queryJson);

    };
    useEffect(() => {
        // 从LocalStorage读取数据
        const storedData = localStorage.getItem('varDetails');
        if (storedData) {
            setvarDetail(JSON.parse(storedData));
            // 可选：读取数据后从LocalStorage中清除
            localStorage.removeItem('varDetails');
        }
    }, []);

    if (!varDetail) {
        return <div>Loading...</div>;
    }


    return (
        <div className='bg-base-200'>
            <h1 className='text-gray-300 text-3xl'>
                Variable Details
            </h1>
            <div className="collapse bg-base-200">
                <input type="checkbox" /> 
                <div className="collapse-title text-xl font-medium text-gray-300">
                    Attributes
                </div>
                <div className="collapse-content text-gray-400"> 
                    <p><strong>Variable Name: </strong> {varDetail.name}</p>
                    <p><strong>Long Name: </strong> {varDetail.long_name}</p>
                    <p><strong>Variable DataType: </strong> {varDetail.dtype}</p>
                    <p><strong>Shape:</strong> {varDetail.shape}</p>
                    <p><strong>Units:</strong> {varDetail.units}</p>
                </div>
            </div>
            
            <div className="collapse bg-base-200">
                <input type="checkbox" /> 
                <div className="collapse-title text-xl font-medium text-gray-300">
                    Coordinates
                </div>
                <div className="collapse-content text-gray-400"> 
                {varDetail.coords && varDetail.coords.length > 0 ? (
                    <ul>
                        {varDetail.coords.map((coord, index) => (
                            <li key={index}>
                                <div className="collapse bg-base-200">
                                    <input type="checkbox" /> 
                                    <div className="collapse-title text-xl font-medium">
                                        {coord.name}
                                    </div>
                                    <div className="collapse-content"> 
                                        <p><strong>Type:</strong> {coord.dtype}</p>
                                        <p><strong>Min:</strong> {coord.min}</p>
                                        <p><strong>Max:</strong> {coord.max}</p>
                                        
                                        {coord.name === 'time' || coord.name === 't' || coord.name === 'Time' || coord.name === 'T' || coord.name === 'TIME'? (
                                            <TimeInput dimension={coord} onChange={handleTimeChange} />
                                        ) : null}
                                        {(coord.name === 'latitude' || coord.name === 'lat' || coord.name === 'Latitude' || coord.name === 'LAT' || coord.name === 'LATITUDE') ? (
                                            <LonLatInput dimension={coord} onChange={handleLatChange} />
                                        ) : null}
                                        {(coord.name === 'longitude' || coord.name == 'lon' || coord.name === 'Longitude' || coord.name === 'LONGITUDE' || coord.name == 'LON' ) ? (
                                            <LonLatInput dimension={coord} onChange={handleLonChange} />
                                        ) : null}
                                        
                                        
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No coordinates available.</p>
                )}
                <button className="btn btn-primary" onClick={() => submitQuery()}>Submit</button>
                </div>
            </div>
        </div>
    );
};

export default VarDetailCard;