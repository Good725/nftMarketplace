import React, { useState } from 'react';
import { Button } from 'antd';

function NewFileUpload(props) {
  const [image, setImage] = useState('');

  const hiddenFileInput = React.useRef(null);

  const hiddenUpload = React.useRef(null);

  const updateImage = () => {
    hiddenFileInput.current.click();
  };

  const uploadImage = (e) => {
    setImage(e.target.files[0]);
    setTimeout(() => {
      hiddenUpload.current.click();
    }, 1000);
  };

  const postDetails = () => {
    const data = new FormData();
    data.append('file', image);
    data.append('upload_preset', 'dbilia');
    data.append('cloud_name', 'dpboqfopx');
    fetch('https://api.cloudinary.com/v1_1/dpboqfopx/image/upload', {
      method: 'post',
      body: data,
    })
      .then((res) => res.json())
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <div
        className='card input-filed'
        style={{
          margin: '30px auto',
          maxWidth: '500px',
          padding: '20px',
          textAlign: 'center',
        }}
      >
        <div className='file-field input-field'>
          <div className='btn #64b5f6 blue darken-1'>
            <h2
              style={{
                fontSize: '15px',
              }}
            >
              Upload square jpg or png
            </h2>

            <Button
              type='primary'
              size={'large'}
              onClick={updateImage}
              style={{
                color: '#0066ff',
                justifyItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                backgroundColor: 'white',
                borderRadius: 25,
              }}
            >
              Choose Image
            </Button>
            <input
              type='file'
              ref={hiddenFileInput}
              style={{ display: 'none' }}
              onChange={uploadImage}
            />
          </div>
        </div>

        <button
          className='btn waves-effect waves-light #64b5f6 blue darken-1'
          onClick={() => postDetails()}
          ref={hiddenUpload}
          style={{ display: 'none' }}
        >
          Upload Image
        </button>
      </div>
    </div>
  );
}

export default NewFileUpload;
