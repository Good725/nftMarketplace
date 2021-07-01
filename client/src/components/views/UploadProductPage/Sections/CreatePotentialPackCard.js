import { Typography, Button, Form, Input } from 'antd';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Card3dMirror from '../../../utils/Card3dMirrorClassic';
import { Formik } from 'formik';
import * as yup from 'yup';
import {
  addPotentialCardToPack,
  setCardIndex,
} from '../../../../_actions/pack_actions';

import arrow from '../../../../img/arrow.svg';
import sprite from '../../../../img/sprite.svg';
const { Title } = Typography;
const { TextArea } = Input;

function CreatePotentialPackCard(props) {
  console.log(props);
  const dispatch = useDispatch();
  const [image, setImage] = useState('');
  const [url, setUrl] = useState(
    'https://res.cloudinary.com/dpboqfopx/image/upload/c_scale,w_10/v1606432278/wwlj0xtrdojdgumpcn1h.png'
  );

  const cardPackNumber = useSelector((state) => state.pack.cardPackNumber);
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

  useEffect(() => {
    const handleResize = () => {};
    window.addEventListener('resize', handleResize);
  }, []);

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
      .then((data) => {
        setUrl(data.url);
        console.log(data.url);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div
      style={{ maxWidth: '100%', margin: '2rem auto' }}
      className='create-potential-card'
    >
      <div className='create-potential-card__section'>
        <div className='create-potential-card__arrow-section'>
          {props.cardArray.map((v, i) => (
            <div
              style={{ gridColumn: `${i + 1}/${i + 2}` }}
              className='create-potential-card__select-card'
            >
              <svg
                className='create-potential-card__image'
                src={arrow}
                style={{
                  fill:
                    i + 1 < cardPackNumber
                      ? '#34aaff'
                      : i + 1 == cardPackNumber
                      ? '#1d77ff'
                      : '#888',
                }}
              >
                <use href={sprite + '#arrow'}></use>
              </svg>
              <p className='create-potential-card__number'>{i + 1}</p>
            </div>
          ))}
        </div>
      </div>
      <br />
      <br />
      <div className='create-potential-card__form'>
        <Title level={1}>Create card {cardPackNumber}</Title>

        <div>
          <div style={{ marginRight: '50%', display: 'flex' }}>
            <div
              className='card input-filed'
              style={{
                margin: '10px auto',
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
                    Upload square jpg or png.
                    <div>If the file is too large the upload will cancel.</div>
                  </h2>

                  <Button
                    type='primary'
                    size='large'
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

          <Formik
            validateOnChange={true}
            initialValues={{
              title: 'Title',
              description: 'Description',

              edition: '1',
            }}
            // validationSchema={validationSchema}
            validationSchema={yup.object().shape({
              title: yup
                .string()
                .required('title is required')
                .max(40, 'Title must be 40 or less characters'),

              description: yup
                .string()
                .required()
                .max(300, 'Title must be 300 or less characters'),
              // edition: yup.string().required(),
            })}
            onSubmit={(data, { setSubmitting }) => {
              setSubmitting(true);
              const variables = {
                writer: props.writerId,
                title: data.title,
                description: data.description,
                price: 0,
                numberEditions: parseInt(data.edition),
                images: url,
                type: 0,
              };
              console.log(variables);
              dispatch(addPotentialCardToPack(variables));

              const number = cardPackNumber + 1;
              dispatch(setCardIndex(number));
              data.title = 'Title';
              data.description = 'Description';
              data.price = '0';
              data.edition = '1';
              setUrl(
                'https://res.cloudinary.com/dpboqfopx/image/upload/c_scale,w_10/v1606432278/wwlj0xtrdojdgumpcn1h.png'
              );
              setTimeout(() => {
                setSubmitting(false);
              }, 200);
            }}
          >
            {({
              values,
              errors,
              isSubmitting,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              resetForm,
            }) => (
              <Form onSubmit={handleSubmit}>
                <div
                  style={{
                    marginLeft: '70%',
                    display: 'flex',
                    marginTop: '-100px',
                  }}
                >
                  <Card3dMirror
                    url={url}
                    TitleValue={values.title}
                    DescriptionValue={values.description}
                    EditionValue={values.edition}
                    writer={props.writerName}
                  />
                </div>

                <div
                  style={{
                    width: '50%',
                    marginTop: '-400px',
                  }}
                >
                  <Form.Item label='Title'>
                    <Input
                      id='title'
                      placeholder='Title'
                      type='text'
                      maxLength='40'
                      value={values.title}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={
                        errors.title && touched.title
                          ? 'text-input error'
                          : 'text-input'
                      }
                    />
                    {errors.title && touched.title && (
                      <div className='input-feedback'>{errors.title}</div>
                    )}
                  </Form.Item>
                  <Form.Item label='Description'>
                    <TextArea
                      id='description'
                      placeholder='This is where your description will go'
                      type='text'
                      maxLength='300'
                      value={values.description}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={
                        errors.description && touched.description
                          ? 'text-input error'
                          : 'text-input'
                      }
                    />
                    {errors.description && touched.description && (
                      <div className='input-feedback'>{errors.description}</div>
                    )}
                  </Form.Item>

                  <Form.Item label='edition'>
                    <select
                      id='edition'
                      placeholder='0'
                      type='number'
                      min='0'
                      value={values.edition}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={
                        errors.edition && touched.edition
                          ? 'text-input error'
                          : 'text-input'
                      }
                    >
                      {props.EditionAmount.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                    {errors.edition && touched.edition && (
                      <div className='input-feedback'>{errors.edition}</div>
                    )}
                  </Form.Item>
                </div>
                {props.LoggedIn ? (
                  <div>
                    <button
                      disabled={isSubmitting}
                      type='submit'
                      style={{
                        color: '#0066ff',
                        justifyItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        backgroundColor: 'white',
                        border: '1px blue solid',
                        borderRadius: 5,
                        fontSize: '15px',
                        width: '200px',
                        height: '40px',
                        cursor: 'pointer',
                      }}
                    >
                      Create
                    </button>
                  </div>
                ) : (
                  <div>
                    <h4> Log in/Sign up to create </h4>
                    <button
                      style={{
                        color: '#0066ff',
                        justifyItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        backgroundColor: 'white',
                        border: '1px blue solid',
                        borderRadius: 5,
                        fontSize: '15px',
                        width: '200px',
                        height: '40px',
                        cursor: 'pointer',
                      }}
                    >
                      <a href={'/login'}>Log in/Sign up</a>
                    </button>
                  </div>
                )}
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}

export default CreatePotentialPackCard;
