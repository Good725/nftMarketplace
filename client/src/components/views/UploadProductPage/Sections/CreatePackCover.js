import React, { useState, useEffect } from 'react';
import { Typography, Button, Form, Input } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { addToShop } from '../../../../_actions/user_actions';
import Axios from 'axios';
import Card3dMirror from '../../../utils/Card3dMirrorClassic';
import { Formik } from 'formik';
import * as yup from 'yup';
import { addPackAndCards } from '../../../../_actions/pack_actions';
import { categories } from '../../../utils/categoryArray';

const { Title } = Typography;
const { TextArea } = Input;

function CreatePackCover(props) {
  const dispatch = useDispatch();
  const [image, setImage] = useState('');
  const [url, setUrl] = useState(
    'https://res.cloudinary.com/dpboqfopx/image/upload/c_scale,w_10/v1606432278/wwlj0xtrdojdgumpcn1h.png'
  );
  const layoutOptions = ['Classic', 'Opulent', 'Simple'];
  const packCards = useSelector((state) => state.pack.potentialCards);
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
    <div style={{ maxWidth: '100%', margin: '2rem auto' }}>
      <div>
        <br />
        <br />
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Title level={1}>Create Pack Cover</Title>
        </div>
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
                    Choose Pack Cover Image
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
              price: '',
              category: 'None',
              edition: '1',
              layout: 'Classic',
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

              price: yup.string().required(),
              // edition: yup.string().required(),
            })}
            onSubmit={(data, { setSubmitting }) => {
              setSubmitting(true);
              const variables = {
                writer: props.writerId,
                title: data.title,
                description: data.description,
                category: data.category,
                price: data.price,
                numberEditions: parseInt(data.edition),
                images: url,
                type: 0,
              };

              dispatch(addPackAndCards(packCards, variables));

              setTimeout(() => {
                //props.history.push(`/shop/${UserId}`);
                console.log('submit:', data);
                setSubmitting(false);
                props.history.push(`/shop/${props.writerId}`);
                //props.history.push(`/`);
              }, 2000);
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
                      placeholder='Pack Title'
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
                      placeholder='Pack Description'
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
                  <Form.Item label='price in coins (1 coins = 1¢)'>
                    <Input
                      id='price'
                      placeholder='0'
                      type='number'
                      min='0'
                      value={values.price}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={
                        errors.price && touched.price
                          ? 'text-input error'
                          : 'text-input'
                      }
                    />
                    {errors.price && touched.price && (
                      <div className='input-feedback'>{errors.price}</div>
                    )}
                  </Form.Item>
                  <Form.Item label='category'>
                    <select
                      id='category'
                      placeholder='0'
                      type='number'
                      min='0'
                      value={values.category}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={
                        errors.category && touched.category
                          ? 'text-input error'
                          : 'text-input'
                      }
                    >
                      {categories.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                    {errors.category && touched.category && (
                      <div className='input-feedback'>{errors.category}</div>
                    )}
                  </Form.Item>
                  <p>Edition will be auto determine based on card pool</p>
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

        <br />
        <br />
      </div>
    </div>
  );
}

export default CreatePackCover;
