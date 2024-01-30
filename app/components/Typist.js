import React, { useState } from 'react';
import { TypeAnimation } from 'react-type-animation';

const Typist = () => {
    return (
        <TypeAnimation
          sequence={[
            'NetCDFaster: Speeding Data, Simplifying Vision.',
            2000, // Waits 2s
          ]}
          wrapper="span"
          cursor={true}
          repeat={Infinity}
          style={{ fontSize: '2em', display: 'inline-block' }}
        />
    );
};

export default Typist;