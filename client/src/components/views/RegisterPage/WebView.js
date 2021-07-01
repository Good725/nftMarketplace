import React from 'react';
import moment from 'moment';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { registerUser } from '../../../_actions/user_actions';
import { useDispatch } from 'react-redux';

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

function WebView(props) {
  const dispatch = useDispatch();
  return (
    <Formik
      initialValues={{
        email: '',
        firstName: '',
        lastName: '',
        name: '',
        lowercaseName: '',
        password: '',
        confirmPassword: '',
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string()
          .email('Email is invalid')
          .required('Email is required'),

        fullName: Yup.string().required('Full Name is required'),
        userName: Yup.string().required('Username is required'),
        password: Yup.string()
          .min(6, 'Password must be at least 6 characters')
          .required('Password is required'),
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
            username: values.username.toLowerCase(),
            password: values.password,
            dailyrewardpickup: '0',
            // image: `http://gravatar.com/avatar/${moment().unix()}?d=identicon`
            image: `https://res.cloudinary.com/dpboqfopx/image/upload/v1603471732/w9a4ineydzogxsj3tboz.png`,
          };

          dispatch(registerUser(dataToSubmit)).then((response) => {
            if (response.payload.success) {
              props.history.push('/login');
            } else {
              alert(response.payload.err.errmsg);
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
          dirty,
          isSubmitting,
          handleChange,
          handleBlur,
          handleSubmit,
          handleReset,
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
                  errors.email && touched.email ? 'error' : 'success'
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
                label='username'
                hasFeedback
                validateStatus={
                  errors.username && touched.username ? 'error' : 'success'
                }
              >
                <Input
                  id='username'
                  placeholder='Enter your Username'
                  type='text'
                  value={values.username}
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
              <Form.Item
                required
                label='Password'
                hasFeedback
                validateStatus={
                  errors.password && touched.password ? 'error' : 'success'
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
                  placeholder='Enter your confirmPassword'
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

export default WebView;
