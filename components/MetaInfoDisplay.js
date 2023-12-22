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
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
  <h2 className="text-xl font-bold text-gray-900 mb-2">NetCDF MetaInfo</h2>
  
  <h3 className="text-lg font-semibold text-gray-700 mt-4">Dimensions:</h3>
  <ul className="list-disc list-inside">
    {Object.entries(metaInfo.dimensions).map(([key, value]) => (
      <li key={key} className="text-gray-600">{key}: {value}</li>
    ))}
  </ul>

  <h3 className="text-lg font-semibold text-gray-700 mt-4">Variables:</h3>
  <ul className="list-disc list-inside">
    {Object.entries(metaInfo.variables).map(([key, value]) => (
      <li key={key} className="text-gray-600">
        {key} (dims: {value.dims.join(', ')}; dtype: {value.dtype})
      </li>
    ))}
  </ul>

  <h3 className="text-lg font-semibold text-gray-700 mt-4">Global Attributes:</h3>
  <ul className="list-disc list-inside">
    {Object.entries(metaInfo.attributes).map(([key, value]) => (
      <li key={key} className="text-gray-600">{key}: {value}</li>
    ))}
  </ul>
</div>
  );
};

export default MetaInfoDisplay;