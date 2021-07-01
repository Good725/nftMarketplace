import React, { useState, useEffect } from 'react';

import { Formik } from 'formik';
import * as Yup from 'yup';
import { registerUser } from '../../../_actions/user_actions';
import { useDispatch } from 'react-redux';
import * as EmailValidator from 'email-validator';
import { Form, Input, Button } from 'antd';

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

function RegisterPage(props) {
  const [userNameRegex, setUserNameRegex] = useState('');

  useEffect(() => {
    setUserNameRegex(new RegExp(/^(?=.*\d)(?=.*[a-zA-Z]).{6,}$/));
  }, []);
  const dispatch = useDispatch();
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
  return (
    <Formik
      initialValues={{
        email: '',
        fullname: '',
        lowercasefullname: '',
        username: '',
        accountCategory: '',
        password: '',
        confirmPassword: '',
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string()
          .email('Email is invalid')
          .required('Email is required'),

        fullname: Yup.string()
          .required('Full Name is required')
          .min(3, 'Full Name must be at least 3 characters'),
        username: Yup.string()
          .min(3, 'Username must be at least 3 characters')
          .required('Username is required'),
        password: Yup.string()
          .min(6, 'Password must be at least 6 characters')
          .required('Password is required')
          .matches(/^(?=.*[a-z])/, 'Password must have at least one letter')
          .matches(/^(?=.*[0-9])/, 'Password must have at least one number'),
        confirmPassword: Yup.string()
          .oneOf([Yup.ref('password'), null], 'Passwords must match')
          .required('Confirm Password is required'),
      })}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          let dataToSubmit = {
            email: values.email,
            fullname: values.fullname,
            lowercasefullname: values.fullname.toLowerCase(),
            username: values.username,
            accountCategory: values.accountCategory,
            password: values.password,
            dailyrewardpickup: '0',
            image: `https://res.cloudinary.com/dbilia/image/upload/v1603471732/coveea6mvedw9shmfosp.png`,
          };

          dispatch(registerUser(dataToSubmit)).then((response) => {
            if (response.payload.success) {
              props.history.push('/newlogin');
            } else if (response.payload.err) {
              if (response.payload.err.keyValue.email) {
                alert('This email has already been registered');
              } else if (response.payload.err.keyValue.username) {
                alert('This username has already been registered');
              } else {
                alert(response.payload.err);
              }
            }
          });

          setSubmitting(false);
        }, 500);
      }}
    >
      {(props) => {
        const {
          values,
          touched,
          errors,
          isSubmitting,
          handleChange,
          handleBlur,
          handleSubmit,
        } = props;
        return (
          <div className='app'>
            <h2>Create New Account</h2>
            <Form style={{ minWidth: '300px' }} onSubmit={handleSubmit}>
              <Form.Item
                required
                label='Email'
                hasFeedback
                validateStatus={
                  errors.email && touched.email
                    ? 'error'
                    : values.email !== '' &&
                      EmailValidator.validate(values.email) &&
                      'success'
                }
              >
                <Input
                  id='email'
                  placeholder='Enter your Email'
                  type='email'
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    errors.email && touched.email
                      ? 'text-input error'
                      : 'text-input'
                  }
                />
                {errors.email && touched.email && (
                  <div className='input-feedback'>{errors.email}</div>
                )}
              </Form.Item>

              <Form.Item required label='Full Name'>
                <Input
                  id='fullname'
                  placeholder='Full Name'
                  type='text'
                  value={values.fullname}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    errors.fullname && touched.fullname
                      ? 'text-input error'
                      : 'text-input'
                  }
                />
                {errors.fullname && touched.fullname && (
                  <div className='input-feedback'>{errors.fullname}</div>
                )}
              </Form.Item>

              <Form.Item
                required
                label='Username'
                hasFeedback
                validateStatus={
                  errors.username && touched.username
                    ? 'error'
                    : values.username !== '' &&
                      values.username.split('').length >= 3 &&
                      'success'
                }
              >
                <Input
                  id='username'
                  placeholder='Enter your Username'
                  type='text'
                  value={values.username.replace(' ', '_').toLowerCase()}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    errors.username && touched.username
                      ? 'text-input error'
                      : 'text-input'
                  }
                />
                {errors.username && touched.username && (
                  <div className='input-feedback'>{errors.username}</div>
                )}
              </Form.Item>
              <Form.Item label='Account Category'>
                <select
                  id='accountCategory'
                  style={{
                    width: '100%',
                    border: '1px solid #d9d9d9',
                    height: '32px',
                    padding: '4px 11px',
                    color: 'rgba(0, 0, 0, 0.65)',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                  value={values.accountCategory}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className='text-input'
                >
                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </Form.Item>
              <Form.Item
                required
                label='Password'
                hasFeedback
                validateStatus={
                  errors.password && touched.password
                    ? 'error'
                    : values.password !== '' &&
                      userNameRegex.test(values.password) &&
                      'success'
                }
              >
                <Input
                  id='password'
                  placeholder='Enter your password'
                  type='password'
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    errors.password && touched.password
                      ? 'text-input error'
                      : 'text-input'
                  }
                />
                {errors.password && touched.password && (
                  <div className='input-feedback'>{errors.password}</div>
                )}
              </Form.Item>

              <Form.Item required label='Confirm' hasFeedback>
                <Input
                  id='confirmPassword'
                  placeholder='Confirm Password'
                  type='password'
                  value={values.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    errors.confirmPassword && touched.confirmPassword
                      ? 'text-input error'
                      : 'text-input'
                  }
                />
                {errors.confirmPassword && touched.confirmPassword && (
                  <div className='input-feedback'>{errors.confirmPassword}</div>
                )}
                <p
                  style={{
                    marginTop: '30px',
                    fontSize: '12px',
                    maxWidth: '300px',
                    lineHeight: '100%',
                  }}
                >
                  By clicking Create Account, you agree to our{' '}
                  <a href='/terms'>Terms</a> and{' '}
                  <a href='/privacypolicy'>Privacy Policy</a>.
                </p>
              </Form.Item>
              {/* <p
								style={{
									width: '50%',
								}}
							>
								By clicking Sign Up, you agree to our Terms, Data Policy and Cookies Policy. You may
								receive SMS Notifications from us and can opt out any time.
							</p> */}

              <Form.Item {...tailFormItemLayout}>
                <Button
                  onClick={handleSubmit}
                  type='primary'
                  disabled={isSubmitting}
                >
                  Create Account
                </Button>
              </Form.Item>
            </Form>
          </div>
        );
      }}
    </Formik>
  );
}

export default RegisterPage;
