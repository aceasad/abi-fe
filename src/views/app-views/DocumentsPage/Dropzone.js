import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

const Dropzone = ({ onChange, fileListToUpload }) => {
  const onDrop = useCallback(
    (acceptedFiles) => {
      console.log(acceptedFiles);

      acceptedFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onabort = () => console.log('file reading was aborted');
        reader.onerror = () => console.log('file reading has failed');
        reader.readAsBinaryString(file);
      });

      onChange([...fileListToUpload, ...acceptedFiles]);
    },
    [fileListToUpload, onChange]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  function formatBytes(a, b = 2, k = 1024) {
    let d = Math.floor(Math.log(a) / Math.log(k));
    return 0 == a
      ? '0 Bytes'
      : parseFloat((a / Math.pow(k, d)).toFixed(Math.max(0, b))) +
          ' ' +
          ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'][d];
  }

  const files = fileListToUpload.map((file) => (
    <div key={file.path}>
      <div>
        <div>
          {file.path} - {formatBytes(file.size)}
        </div>
      </div>
      {/* <IconButton
          onClick={removeFile(file)}
          fontSize="15px"
          size="sm"
          icon={<BsTrashFill />}
        /> */}
    </div>
  ));

  return (
    <>
      {files.length === 0 && (
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>
              Drag 'n' drop some files here, or{' '}
              <span style={{ color: '#5d4ebf', cursor: 'pointer' }}>click</span>{' '}
              to select files
            </p>
          )}
        </div>
      )}
      {files.length > 0 && (
        <div>
          <div>{files}</div>
        </div>
      )}
    </>
  );
};

export default Dropzone;
