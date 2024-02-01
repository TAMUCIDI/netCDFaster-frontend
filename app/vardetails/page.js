"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import VarDetailCard from '@/app/components/VarDetailCard';

export default function vardetails() {
    return (
        <div>
            <VarDetailCard/>
        </div>
    );
};