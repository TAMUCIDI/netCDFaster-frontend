import React from 'react';
import { useEffect, useState } from 'react';

const VarDetailCard = () => {
    const [varDetail, setvarDetail] = useState(null);

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
        <div>
            <h1>Variable Details</h1>
            <div className="collapse bg-base-200">
                <input type="checkbox" /> 
                <div className="collapse-title text-xl font-medium">
                    Attributes
                </div>
                <div className="collapse-content"> 
                    <p><strong>Variable Name: </strong> {varDetail.name}</p>
                    <p><strong>Long Name: </strong> {varDetail.long_name}</p>
                    <p><strong>Variable DataType: </strong> {varDetail.dtype}</p>
                    <p><strong>Shape:</strong> {varDetail.shape}</p>
                    <p><strong>Units:</strong> {varDetail.units}</p>
                </div>
            </div>
            
            <div className="collapse bg-base-200">
                <input type="checkbox" /> 
                <div className="collapse-title text-xl font-medium">
                    Coordinates
                </div>
                <div className="collapse-content"> 
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
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No coordinates available.</p>
                )}
                </div>
            </div>
        </div>
    );
};

export default VarDetailCard;