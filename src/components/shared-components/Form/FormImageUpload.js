import React, { useEffect, useState } from 'react';
import { UserOutlined, UpOutlined } from '@ant-design/icons';
import { Badge, Avatar } from 'antd';

const FormImageUpload = ({ field, form, label }) => {
  const [imagePreview, setImagePreview] = useState();

  useEffect(() => {
    const image = field.value;
    if (image && typeof image !== 'string')
      setImagePreview(URL.createObjectURL(image));
    else if (image) setImagePreview(image);
    return () => {
      if (!(image instanceof String)) URL.revokeObjectURL(image);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [field.value]);

  return (
    <div className="form-image-upload-container">
      <input
        id={field.name}
        type="file"
        accept="image/*"
        name={field.name}
        onChange={(e) => {
          form.setFieldValue(field.name, e.target.files[0]);
          e.target.value = null;
        }}
        style={{ position: 'absolute' }}
        className="invisible"
      />
      <label htmlFor={field.name} className="cursor-pointer">
        <Badge className="form-image-upload-badge" count={<UpOutlined />}>
          <Avatar
            size={96}
            icon={
              imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Upload"
                  className="form-image-upload-image"
                />
              ) : (
                <UserOutlined />
              )
            }
          />
        </Badge>
      </label>
    </div>
  );
};

export default FormImageUpload;
