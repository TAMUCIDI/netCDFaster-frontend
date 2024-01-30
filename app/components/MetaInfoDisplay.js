import VarList from '@/app/components/VarList';
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
    <div className="shadow-md rounded px-8 pt-6 pb-8 mb-4 max-w-2xl">
        <h2 className="text-xl font-bold text-gray-200 mb-2">NetCDF MetaInfo</h2>
        <div className="collapse collapse-arrow bg-base-200">
            <input type="radio" name="my-accordion-2" checked="checked" /> 
            <div className="collapse-title text-xl font-medium text-gray-200">
                Dimensions:
            </div>
            <div className="collapse-content"> 
                <ul className="list-disc list-inside">
                    {Object.entries(metaInfo.dimensions).map(([key, value]) => (
                        <li key={key} className="text-gray-300">{key}: {value}</li>
                    ))}
                </ul>
            </div>
        </div>
        <div className="collapse collapse-arrow bg-base-200">
            <input type="radio" name="my-accordion-2" checked="checked"/>
            <div className="collapse-title text-xl font-medium text-gray-200">
                Variables:
            </div>
            <div className="collapse-content">
                <VarList varList={metaInfo.variables} />
            </div>
        </div>
        <div className="collapse collapse-arrow bg-base-200">
            <input type="radio" name="my-accordion-2" checked="checked"/>
            <div className="collapse-title text-xl font-medium text-gray-200">
                Attributes:
            </div>
            <div className="collapse-content">
                <ul className="list-disc list-inside">
                    {Object.entries(metaInfo.attributes).map(([key, value]) => (
                        <li key={key} className="text-gray-300">{key}: {value}</li>
                    ))}
                </ul>
            </div>
        </div>
    </div>
  );
};

export default MetaInfoDisplay;