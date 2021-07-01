import React, { useState, useEffect } from 'react';
import { Typography, Button, Form, Input } from 'antd';
import DbiliaCardThree from './DbiliaCardThree';
import { useDispatch } from 'react-redux';
import { addToShop } from '../../../../_actions/user_actions';
import Axios from 'axios';
import { Formik } from 'formik';
import * as yup from 'yup';

const { Title } = Typography;
const { TextArea } = Input;

function CreateMobile(props) {
  const dispatch = useDispatch();

  const [image, setImage] = useState('');
  const [url, setUrl] = useState(
    'https://res.cloudinary.com/dpboqfopx/image/upload/c_scale,w_10/v1606432278/wwlj0xtrdojdgumpcn1h.png'
  );

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

  const addToShopHandler = (productId) => {
    dispatch(addToShop(productId));
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
      .then((data) => {
        setUrl(data.url);
        console.log(data.url);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <Title level={1}>Create a card</Title>
        <div>
          {' '}
          Welcome to Season One of Back Creators. In Season One we are limiting
          users to only creating one card.
        </div>
        <div> Once the card is made it can not be removed.</div>
      </div>
      {props.CanCreate ? (
        <div>
          <Form>
            <div style={{}}>
              {' '}
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
                      Upload square jpg or png.
                      <div>
                        If the file is too large the upload will cancel.
                      </div>
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
            {/* <Col>
					<DbiliaCardThree
						url={props.url}
						TitleValue={props.TitleValue}
						DescriptionValue={props.DescriptionValue}
						EditionValue={props.EditionValue}
					/>
				</Col> */}

            <br />
            <br />
            <Formik
              validateOnChange={true}
              initialValues={{
                title: 'Title',
                description: 'Description',
                price: '',
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

                price: yup.string().required(),
                // edition: yup.string().required(),
              })}
              onSubmit={(data, { setSubmitting }) => {
                setSubmitting(true);
                const variables = {
                  writer: props.writerId,
                  title: data.title,
                  description: data.description,
                  price: data.price,
                  numberEditions: parseInt(data.edition),
                  images: url,
                  type: 0,
                };

                Axios.post('/api/product/uploadProduct', variables).then(
                  (response) => {
                    if (response.data.success) {
                      alert('Product Successfully Uploaded');
                      console.log(response.data.id);
                      addToShopHandler(response.data.id);
                    } else {
                      alert('Failed to upload Product');
                    }
                  }
                );

                //{props.onSubmit}
                //make async call
                console.log('submit:', data);
                //setSubmitting(false)

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
                  {/* <div style={{ marginLeft: '70%', display: 'flex', marginTop: '-100px' }}>
							<Card3dMirror
								url={url}
								TitleValue={values.title}
								DescriptionValue={values.description}
								EditionValue={values.edition}
								writer={props.writerName}
							/>
						</div> */}

                  <div style={{}}>
                    <DbiliaCardThree
                      url={url}
                      TitleValue={values.title}
                      DescriptionValue={values.description}
                      EditionValue={values.edition}
                      writer={props.writerName}
                    />
                  </div>
                  <br />
                  <div>
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
                        <div className='input-feedback'>
                          {errors.description}
                        </div>
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
                          <option key={item.key} value={item.value}>
                            {item.value}
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
          </Form>
        </div>
      ) : (
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          We are in Season One. Who have already made your card for this Season
        </div>
      )}

      <br />
      <br />
    </div>
  );
}

export default CreateMobile;
