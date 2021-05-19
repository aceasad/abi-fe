import React, { useEffect, useState } from 'react';
import { UserOutlined, UpOutlined } from '@ant-design/icons';
import { Badge, Avatar, Button } from 'antd';

const FormImageUpload = ({ field, form, isSubmit, removeImageLabel }) => {
  const [imagePreview, setImagePreview] = useState(field.value);

  useEffect(() => {
    const image = field.value;
    if (image && image instanceof File)
      setImagePreview(URL.createObjectURL(image));
    else if (typeof image == 'string') setImagePreview(image);
    return () => {
      if (!(typeof image == 'string')) URL.revokeObjectURL(image);
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
          isSubmit && form.handleSubmit();
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
      <Button
        className="ml-4"
        onClick={() => {
          form.setFieldValue(field.name, '');
        }}
      >
        {removeImageLabel}
      </Button>
    </div>
  );
};

export default FormImageUpload;
