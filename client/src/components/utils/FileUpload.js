import React, { useState } from 'react';
import Dropzone from 'react-dropzone';
import { Button } from 'antd';
import Axios from 'axios';

function FileUpload(props) {
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
          props.refreshFunction([...Images, response.data.image]);
        } else {
          alert('failed to save the Image in Server');
        }
      }
    );
  };
  const onDelete = (image) => {
    const currentIndex = Images.indexOf(image);

    let newImages = [...Images];
    newImages.splice(currentIndex, 1);

    setImages(newImages);
    props.refreshFunction(newImages);
  };
  return (
    <div style={{ width: '300%' }}>
      <h2>Upload square jpg or png</h2>
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
                    type='primary'
                    size={'large'}
                    style={{
                      color: '#0066ff',
                      justifyItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                      backgroundColor: 'white',
                      borderRadius: 25,
                    }}
                  >
                    Upload Image
                  </Button>
                </div>
              </div>
            )}
          </Dropzone>

          <div>
            <div>
              {Images.map((image, index) => (
                <div onClick={() => onDelete(image)}>
                  <Button
                    type='link'
                    style={{
                      color: '#d11a2a',
                      justifyItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                    }}
                  >
                    Delete image
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FileUpload;
