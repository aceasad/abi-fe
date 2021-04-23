import React from 'react';
import { Spin } from 'antd';
import PropTypes from 'prop-types';
import { LoadingOutlined } from '@ant-design/icons';

const Icon = ({ fontSize }) => <LoadingOutlined style={{ fontSize }} spin />;

const Loading = (props) => {
  const { align, cover, defaultSpinner, fontSize } = props;
  return (
    <div className={`loading text-${align} cover-${cover}`}>
      {defaultSpinner ? (
        <Spin />
      ) : (
        <Spin indicator={<Icon fontSize={fontSize} />} />
      )}
    </div>
  );
};

Loading.propTypes = {
  size: PropTypes.string,
  cover: PropTypes.string,
};

Loading.defaultProps = {
  align: 'center',
  cover: 'inline',
  fontSize: 35,
};

export default Loading;
