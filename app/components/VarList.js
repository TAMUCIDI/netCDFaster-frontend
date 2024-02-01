import React from 'react';
import { useRouter } from 'next/navigation';

const VarList = ( {varList} ) => {
    const router = useRouter();

    const handleVarCardClick = async (key) => {
        try {
            const response = await fetch('http://localhost:5000/file/detail/'+key,
            {
                method: 'GET',
                credentials: 'include',
            });
            const data = await response.json();
            // 将数据存储到LocalStorage中
            localStorage.setItem('varDetails', JSON.stringify(data));
            // 跳转到目标页面
            router.push(`/vardetails`)
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