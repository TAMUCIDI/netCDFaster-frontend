import React, { useState, useEffect } from 'react';

const MetaInfoDisplay = ({ jsonData }) => {
  const [metaInfo, setMetaInfo] = useState(null);

  useEffect(() => {
    // 假设 jsonData 是从后端API传来的JSON字符串
    // 这里我们解析JSON字符串为JavaScript对象
    const parsedData = JSON.parse(jsonData);
    setMetaInfo(parsedData);
  }, [jsonData]);

  if (!metaInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>NetCDF MetaInfo</h2>
      <h3>Dimensions:</h3>
      <ul>
        {Object.entries(metaInfo.dimensions).map(([key, value]) => (
          <li key={key}>{key}: {value}</li>
        ))}
      </ul>
      <h3>Variables:</h3>
      <ul>
        {Object.entries(metaInfo.variables).map(([key, value]) => (
          <li key={key}>
            {key} (dims: {value.dims.join(', ')}; dtype: {value.dtype})
          </li>
        ))}
      </ul>
      <h3>Global Attributes:</h3>
      <ul>
        {Object.entries(metaInfo.attributes).map(([key, value]) => (
          <li key={key}>{key}: {value}</li>
        ))}
      </ul>
    </div>
  );
};

export default MetaInfoDisplay;