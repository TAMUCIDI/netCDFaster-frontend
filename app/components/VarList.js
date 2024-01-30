import React from 'react';
import { useRouter } from 'next/navigation';

const VarList = ( {varList} ) => {
    const router = useRouter();

    const handleClick = (key) => {
        router.push('/VarDetails/'+key);
    };
    return (
        <ul className="list-disc list-inside">
            {Object.entries(varList).map(([key, value]) => (
                <li key={key} className="text-gray-300">
                    <button 
                        className="btn btn-ghost"
                        onClick={() => handleClick(key)}
                    >
                        {key} (dims: {value.dims.join(', ')}; dtype: {value.dtype})
                    </button>
                </li>
            ))}
        </ul>
    );
};

export default VarList;