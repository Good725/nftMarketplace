import React, { useState } from 'react';
import Dropzone from 'react-dropzone';
import { Button } from 'antd';
import Axios from 'axios';

function AvatarUpload(props) {
  const [Images, setImages] = useState([]);

  const onDrop = (files) => {
    let formData = new FormData();
    const config = {
      header: { 'content-type': 'multipart/form-data' },
    };
    formData.append('file', files[0]);

    //save the Image we chose inside the Node Server
    Axios.post('/api/product/uploadImage', formData, config).then(
      (response) => {
        if (response.data.success) {
          setImages([...Images, response.data.image]);
          props.setAvatar([...Images, response.data.image]);
          props.refreshFunction([...Images, response.data.image]);
        } else {
          alert('failed to save the Image in Server');
        }
      }
    );
  };
  return (
    <div>
      <div>
        <div>
          <Dropzone onDrop={onDrop} multiple={false} maxSize={800000000}>
            {({ getRootProps, getInputProps }) => (
              <div
                style={{
                  display: 'flex',
                }}
              >
                <div {...getRootProps()}>
                  <input {...getInputProps()} />
                  <Button
                    type='link'
                    style={{
                      color: '#0066ff',
                      justifyItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                    }}
                  >
                    Edit
                  </Button>
                </div>
              </div>
            )}
          </Dropzone>
        </div>
      </div>
    </div>
  );
}

export default AvatarUpload;
