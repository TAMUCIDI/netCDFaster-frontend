import React from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';

const TimeInput = ({ dimension, onChange }) => {
    const { name, min, max } = dimension;

    const handleChange = (value) => {
        onChange(value);
    };

    const disabledDate = (current, min, max) => {
        // 不允许选择的日期在最小值之前或最大值之后
        return current && (current < moment(min).startOf('day') || current > moment(max).endOf('day'));
    };

    return (
        <div>
            <DatePicker
                disabledDate={(current) => disabledDate(current, min, max)}
                onChange={handleChange}
            />
        </div>
    );
};

export default TimeInput;