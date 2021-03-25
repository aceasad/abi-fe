import React, { useEffect, useState } from 'react';
import { UserOutlined } from '@ant-design/icons';
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
    <div>
      <div>
        <input
          id={field.name}
          type="file"
          accept="image/*"
          name={field.name}
          onChange={(e) => {
            form.setFieldValue(field.name, e.target.files[0]);
            e.target.value = null;
          }}
        />
        <div>
          <label htmlFor={field.name}>
            {label}
            <div>
              {imagePreview ? (
                <img src={imagePreview} alt="Upload" />
              ) : (
                <UserOutlined />
              )}
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};
export default FormImageUpload;
