import React from 'react';
import { Slider } from 'antd';

const LonLatInput = ({ dimension, onChange }) => {
    const { name, min, max } = dimension;

    const handleChange = (value) => {
        onChange(value);
    };

    return (
        <div>
            <Slider
                range
                defaultValue={[parseFloat(min), parseFloat(max)]}
                min={parseFloat(min)}
                max={parseFloat(max)}
                onChange={handleChange}
            />
        </div>
    );
};

export default LonLatInput;