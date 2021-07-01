import React, { useState } from 'react';

import Axios from 'axios';
import ImageCrop from './Sections/imageCrop';

function UploadImage(props) {
  const [Images, setImages] = useState([]);
  const [userProfilePic, setUserProfilePic] = useState('');
  const [editor, setEditor] = useState(null);
  const [scaleValue, setScaleValue] = useState(1);
  const [selectedImage, setSelectedImage] = useState([]);

  const onSave = (files) => {
    let formData = new FormData();
    const config = {
      header: { 'content-type': 'multipart/form-data' },
    };
    formData.append('file', files);

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

  const setEditorRef = (newEditor) => setEditor(newEditor);

  const onCrop = (userProfilePic) => {
    if (editor !== null) {
      const url = editor.getImageScaledToCanvas().toDataURL();
      setUserProfilePic(url);
      onSave(userProfilePic);
    }
  };

  const onScaleChange = (scaleChangeEvent) => {
    setScaleValue(parseFloat(scaleChangeEvent.target.value));
  };

  const profilePicChange = (fileChangeEvent) => {
    const file = fileChangeEvent.target.files[0];
    const { type } = file;
    if (
      !(
        type.endsWith('jpeg') ||
        type.endsWith('png') ||
        type.endsWith('jpg') ||
        type.endsWith('gif')
      )
    ) {
    } else {
      setSelectedImage(fileChangeEvent.target.files[0]);
    }
  };

  return (
    <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
      <div className='App'>
        <br />
        <br />
        <br />
        <br />
        <input
          type='file'
          name='profilePicBtn'
          accept='image/png, image/jpeg'
          onChange={profilePicChange}
        />
        <ImageCrop
          imageSrc={selectedImage}
          setEditorRef={setEditorRef}
          onCrop={onCrop}
          scaleValue={scaleValue}
          onScaleChange={onScaleChange}
        />

        <img src={userProfilePic} alt='Profile' />
      </div>

      {/* <FileUpload refreshFunction={updateImages} /> */}
    </div>
  );
}

export default UploadImage;
