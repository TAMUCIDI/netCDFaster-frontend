import React from 'react';
import { DatePicker, Slider } from 'antd';
import moment from 'moment';
import { render } from 'react-dom';

const DimensionSelector = ({ dimension }) => {
    const { name, min, max } = dimension;

    switch (name) {
        case 'time' || 't' || 'Time' || 'T' || 'TIME':
            const disabledDate = (current, min, max) => {
                // 不允许选择的日期在最小值之前或最大值之后
                return current && (current < moment(min).startOf('day') || current > moment(max).endOf('day'));
            };
            return (
                <div>
                    <h3>{name}</h3>
                    <DatePicker
                        disabledDate={(current) => disabledDate(current, min, max)}
                    />
                </div>
            );
        case 'latitude' || 'lat' || 'Latitude' || 'LAT' || 'LATITUDE':
        case 'longitude' || 'lon' || 'Longitude' || 'LON' || 'LONGITUDE':
            return (
                <div>
                    <h3>{name}</h3>
                    <Slider
                        range
                        defaultValue={[parseFloat(min), parseFloat(max)]}
                        min={parseFloat(min)}
                        max={parseFloat(max)}
                    />
                </div>
            );
        default:
            return null;
    }
};

export default DimensionSelector;