import React, { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import sprite from '../../../../img/sprite.svg';
import { Row, Button, Modal, Input, Form } from 'antd';
import {
  updateUsername,
  updateBio,
  updateProfileImage,
  updateFullname,
  updateLowercaseFullname,
  endTour,
  incrementTour,
  trackTour,
  updateCategory,
} from '../../../../_actions/user_actions';
import Axios from 'axios';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../../../../hoc/getCroppedImage';
import useWindowDimensions from '../../NavBar/Sections/ScreenWidth';
import NavBar from '../../NavBar/NavBar';
const { TextArea } = Input;

function EditProfile(props) {
  const { width } = useWindowDimensions();
  const [imageSrc, setImageSrc] = React.useState(null);
  const [duplicateName, setDuplicateName] = useState('');
  const [duplicateMessage, setDuplicateMessage] = useState('');
  const [usernameValue, setUsernameValue] = useState('');
  const [usernameChanged, setUsernameChanged] = useState(false);
  const [fullNameValue, setFullNameValue] = useState('');
  const [fullNameChanged, setFullNameChanged] = useState(false);
  const [bioValue, setBioValue] = useState('');
  const [bioChanged, setBioChanged] = useState(false);
  const [categoryValue, setCategoryValue] = useState('');
  const [categoryChanged, setCategoryChanged] = useState(false);
  const [url, setUrl] = useState('');
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const categories = [
    '',
    'Actor',
    'Artist',
    'Athlete',
    'Blogger',
    'Clothing (Brand)',
    'Community',
    'Digital Creator',
    'Editor',
    'Educator',
    'Entrepreneur',
    'Gamer',
    'Health/Beauty',
    'Influencers',
    'Musician/Band',
    'Photographer',
    'Product/Service',
    'Restaurant',
    'Writer',
  ];

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.userData);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);
  const onFullNameChange = (e) => {
    setFullNameChanged(true);
    setFullNameValue(e.target.value);
  };

  const onCategoryChange = (e) => {
    setCategoryChanged(true);
    setCategoryValue(e.target.value);
  };
  useEffect(() => {
    if (user.firstLoginTracker) {
      dispatch(trackTour(false));
    }
  }, [user]);
  const showCroppedImage = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);

      const data = new FormData();
      data.append('file', croppedImage);
      data.append('upload_preset', 'dbilia');
      data.append('cloud_name', 'dbilia');
      fetch('https://api.cloudinary.com/v1_1/dbilia/image/upload', {
        method: 'post',
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setUrl(data.url);
          dispatch(updateProfileImage(data.url));
          setImageSrc(null);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (e) {
      console.error(e);
    }
  }, [url, croppedAreaPixels]);

  const onChangeUsername = (event) => {
    setUsernameValue(event.currentTarget.value);
    setUsernameChanged(true);

    // props.refreshFunction(event.currentTarget.value),
  };

  const checkUsername = (event) => {
    if (usernameValue.length >= 3) {
      Axios.get(`/api/users/getname?username=${usernameValue}`).then(
        (response) => {
          if (response.data.success) {
            //console.log('length'),
            if (response.data.users.length >= 1) {
              setDuplicateMessage('Username already exists');
              setDuplicateName('error');
            } else {
              setDuplicateMessage('');
              setDuplicateName('success');
            }
            //console.log(response.data.users.length),
          } else {
            alert('failed to fetch check username');
          }
        }
      );
    } else {
      setDuplicateMessage('Username must be more than 2 characters');
      setDuplicateName('error');
    }
  };

  const onChangeBio = (event) => {
    setBioValue(event.currentTarget.value);
    setBioChanged(true);

    // props.refreshFunction(event.currentTarget.value),
  };

  const handleSave = () => {
    if (usernameChanged && usernameValue.length >= 3) {
      dispatch(updateUsername(usernameValue.replace(' ', '_').toLowerCase()));
    }
    if (bioChanged) {
      dispatch(updateBio(bioValue));
    }
    if (fullNameChanged && fullNameValue.length >= 3) {
      dispatch(updateFullname(fullNameValue));
      dispatch(updateLowercaseFullname(fullNameValue));
    }

    if (categoryChanged) {
      dispatch(updateCategory(categoryValue));
    }
    if (user.firstLoginTracker === 4) {
      console.log('incrementing');
      dispatch(incrementTour());
    }
    setTimeout(() => {
      if (user.firstLogin) {
        props.history.push('/freeNft');
      } else {
        props.history.push(`/collection/${user._id}`);
      }
    }, 3000);
  };

  const hiddenFileInput = React.useRef(null);

  const hiddenUpload = React.useRef(null);

  const updateImage = (event) => {
    hiddenFileInput.current.click();
  };

  const uploadImage = async (e) => {
    console.log('uploadImage');

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      let imageDataUrl = await readFile(file);

      setImageSrc(imageDataUrl);
    }
    setTimeout(() => {
      hiddenUpload.current.click();
    }, 1000);
  };
  function readFile(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.addEventListener('load', () => resolve(reader.result), false);
      reader.readAsDataURL(file);
    });
  }

  useEffect(() => {
    if (user.image) {
      setUrl(user.image);
    }
  }, [user]);
  return (
    <div className='edit-profile' style={{ zIndex: user.firstLogin && 5000 }}>
      {user && user.firstLogin && (
        <>
          <NavBar tour={user.firstLogin} />
          <div className='tour__bar'>
            <button
              className='tour__button tour__button--next'
              onClick={handleSave}
            >
              Next
            </button>
            <button
              onClick={() => props.history.push(`/yourMarket/${user._id}`)}
              className='tour__button tour__button--previous'
            >
              Previous
            </button>
            <button
              className='tour__button tour__button--skip'
              onClick={() => props.history.push('/freeNFT')}
            >
              Skip
            </button>
            <div className='tour__text'>
              <h3 className='tour__text--step'>Profile Guide - 4/4</h3>
              <h3 className='tour__text--description'>
                Add a Profile Picture, change your username and Fullname and add
                Bio
              </h3>
              {/* lining up nav bar below bar */}
              <div style={{ minHeight: '1.8rem' }}></div>
            </div>
          </div>
        </>
      )}

      <div>
        <div className='file-field input-field'>
          <div className='btn #64b5f6 blue darken-1'>
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
          ref={hiddenUpload}
          style={{ display: 'none' }}
        >
          Upload Image
        </button>
      </div>
      {imageSrc && (
        <>
          <div
            style={{
              backgroundColor: '#333',
              width: '100vw',
              height: '100vh',
              position: 'fixed',
              top: 0,
              left: 0,
              zIndex: 1000,
            }}
          ></div>
          <div style={{ zIndex: 1000 }}>
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={4 / 4}
              cropShape='round'
              showGrid={false}
              style={{ zIndex: 1005 }}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </div>
          <button
            style={{
              zIndex: 1001,
              position: 'fixed',
              top: '90vh',
              left: '50%',
              transform: ' translate(-50%, -50%)',
              padding: '1rem 1rem',
            }}
            onClick={showCroppedImage}
            variant='contained'
            className='edit-profile__change-picture'
            color='primary'
          >
            Change Profile Photo
          </button>

          <button
            className='bid-popup__close'
            style={{ zIndex: 1000, color: '#fff' }}
            onClick={() => setImageSrc(null)}
          >
            &times;
          </button>
        </>
      )}
      <div className='edit-profile__info'>
        <img className='edit-profile__image' alt='profileImage' src={url} />
        <h2 className='edit-profile__username'>{user.username}</h2>
        <button onClick={updateImage} className='edit-profile__change-picture'>
          Change Profile Picture
        </button>
      </div>
      <div>
        <label>Username</label>
        <Form>
          <Form.Item
            style={{
              display: 'inline-block',
              width: '100%',
            }}
          >
            <Row gutter={8}>
              <Form.Item
                hasFeedback
                validateStatus={duplicateName}
                help={duplicateMessage}
                style={{
                  display: 'inline-block',
                  width: width > 970 ? '84%' : '95%',
                }}
              >
                <Input
                  // defaultValue="hello"

                  size='default'
                  type='text'
                  placeholder={props.Name}
                  value={usernameValue.replace(' ', '_').toLowerCase()}
                  onChange={onChangeUsername}
                  maxLength={12}
                />
              </Form.Item>

              <Form.Item
                style={{
                  display: 'inline-block',
                }}
              >
                <Button
                  onClick={checkUsername}
                  style={{
                    width: '100%',
                    marginLeft: '5px',
                  }}
                >
                  Check
                </Button>
              </Form.Item>
            </Row>
          </Form.Item>
          <label>Full Name</label>
          <Form.Item style={{ width: '95%' }}>
            <Input type='text' onChange={onFullNameChange} />
          </Form.Item>
          <label>Account Category</label>
          <select
            id='accountCategory'
            style={{
              width: '95%',
              border: '1px solid #d9d9d9',
              height: '32px',
              padding: '4px 11px',
              marginBottom: '2.4rem',
              color: 'rgba(0, 0, 0, 0.65)',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
            onChange={onCategoryChange}
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </Form>
      </div>
      <div></div>
      <div
        style={{
          display: 'inline',
          textAlign: 'center',
          justifyItems: 'center',
          justifyContent: 'center',
          width: '95%',
        }}
      >
        <h2
          style={{
            display: 'inline-block',
            float: 'left',
          }}
        >
          Bio
        </h2>
        <TextArea
          maxLength={150}
          rows={4}
          placeholder={props.Bio}
          value={bioValue}
          onChange={onChangeBio}
        />
      </div>
      <div style={{ padding: '2rem 0' }}>
        <button
          style={{
            padding: '1rem 10rem',
            border: 'none',
            borderRadius: '.5rem',
            cursor: 'pointer',
            color: '#fff',
            backgroundColor: 'rgba(62, 149, 239, 255)',
          }}
          onClick={handleSave}
        >
          Save
        </button>
        {user && user.firstLogin && (
          <svg className='tour__arrow tour__arrow--bio'>
            <use href={sprite + '#arrow'}></use>
          </svg>
        )}
      </div>
    </div>
  );
}

export default EditProfile;
