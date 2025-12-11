import React, { useState } from 'react';
import { TypeAnimation } from 'react-type-animation';

const Typist = () => {
    return (
        <TypeAnimation
          sequence={[
            'NetCDFaster: Accelerating Data Visualization with Advanced Cyberinfrastructure and High-Performance AI.',
            2000, // Waits 2s
          ]}
          wrapper="span"
          cursor={true}
          repeat={Infinity}
          style={{ whiteSpace: 'pre-line',fontSize: '2em', display: 'block' }}
        />
    );
};

export default Typist;