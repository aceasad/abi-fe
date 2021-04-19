import React, { useEffect } from 'react';

const DirtyFieldWrapper = ({ children, dependencies, name, setFieldDirty }) => {
  useEffect(() => {
    if (dependencies.some((dep) => dep)) setFieldDirty(name, true);
  }, [...dependencies]);

  return <>{children}</>;
};

export default DirtyFieldWrapper;
