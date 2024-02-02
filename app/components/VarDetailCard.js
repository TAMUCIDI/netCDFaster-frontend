import React from 'react';
import { useEffect, useState } from 'react';
import DimensionSelector from '@/app/components/DimensionSelector';
import { Form, Button } from 'antd';

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

    const onFinish = (values) => {
        console.log('Received values of form: ', values);
        if (varDetail) {
            values.varName = varDetail.name;
        }
        if (values.time) {
            values.time = values.time.format('YYYY-MM-DD');
        }
    };
    return (
        <div>
        <Form onFinish={onFinish}>
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
                                        <Form.Item name={coord.name} label={coord.name.charAt(0).toUpperCase() + coord.name.slice(1)}>
                                            <DimensionSelector dimension={coord} />
                                        </Form.Item>
                                        
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
            <Button type="primary" htmlType="submit">
                Submit
            </Button>
        </Form>
        </div>
    );
};

export default VarDetailCard;