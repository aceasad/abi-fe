import React from 'react';
import { Form, Input, Button } from 'antd';

const imageStyle = {
  display: 'inline-block',
  width: '150px',
  height: '150px',
  backgroundColor: 'lightgray',
  borderRadius: '30%',
  border: '10%',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center center',
  backgroundSize: 'cover',
};

const ImageInputField = ({ setImage, setImageFile, image, onImageChange }) => {
  return (
    <div>
      <div className="row" style={{ marginLeft: '40%' }}>
        <img style={imageStyle} alt="clinic" src={image}></img>
      </div>
      <Form.Item>
        <div className="row" style={{ marginLeft: '17%' }}>
          <Input
            style={{ width: '40%' }}
            autoFocus
            accept="image/*"
            name="photo"
            type="file"
            onChange={onImageChange}
          ></Input>
          <Button
            autoFocus
            name="remove"
            onClick={() => {
              setImage(null);
              setImageFile(null);
            }}
          >
            Remove
          </Button>
        </div>
      </Form.Item>
    </div>
  );
};

export default ImageInputField;
