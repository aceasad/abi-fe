import React from 'react';
import Loading from './index';

const MiniLoader = ({ top, right, loaderSize }) => {
  return (
    <div style={{ position: 'absolute', top, right }}>
      <Loading fontSize={loaderSize} />
    </div>
  );
};

MiniLoader.defaultProps = {
  top: 5,
  right: 10,
  loaderSize: 25,
};

export default MiniLoader;
