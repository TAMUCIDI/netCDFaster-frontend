import React from 'react';
import { useRouter } from 'next/navigation';

const VarList = ( {varList} ) => {
    const router = useRouter();

    const handleVarCardClick = async (key) => {
        try {
            const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:5000';
            const response = await fetch(`${backendUrl}/file/detail/${encodeURIComponent(key)}`,
            {
                method: 'GET',
                credentials: 'include',
            });
            const data = await response.json();
            // 将数据存储到LocalStorage中
            localStorage.setItem('varDetails', JSON.stringify(data));
            // 跳转到目标页面
            const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '/netcdfaster-frontend';
            const path = basePath ? `${basePath}/vardetails` : '/vardetails';
            router.push(path)
        } catch (error) {
            console.error("Error during file upload: ", error);
        }
    };
    return (
        <ul className="list-disc list-inside">
            {Object.entries(varList).map(([key, value]) => (
                <li key={key} className="text-gray-300">
                    <button 
                        className="btn btn-ghost"
                        onClick={() => handleVarCardClick(key)}
                    >
                        {key} (dims: {value.dims.join(', ')}; dtype: {value.dtype})
                    </button>
                </li>
            ))}
        </ul>
    );
};

export default VarList;