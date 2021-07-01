import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import {
  changePassword,
  checkPassword,
  resetPasswordChange,
} from '../../../../_actions/user_actions';
import { useEffect } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Form, Input, Button } from 'antd';
function ChangePassword(props) {
  const dispatch = useDispatch();
  const [password, setPassword] = useState('');
  const { passwordChangeSuccess, passwordCheck, wrongPasswordMessage } =
    useSelector((state) => state.user);
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
  useEffect(() => {
    if (passwordChangeSuccess) {
      alert('Password Change Successful');
      dispatch(resetPasswordChange());
    }
  }, [passwordChangeSuccess]);

  useEffect(() => {
    if (wrongPasswordMessage !== '') {
      alert('Wrong password');
    }
  }, [wrongPasswordMessage]);

  const onChange = (e) => {
    setPassword(e.target.value);
  };
  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(checkPassword(password));
  };
  const [userNameRegex, setUserNameRegex] = useState('');

  useEffect(() => {
    setUserNameRegex(new RegExp(/^(?=.*\d)(?=.*[a-zA-Z]).{6,}$/));
  }, []);
  return (
    <div>
      <h4 style={{ marginBottom: '2rem' }}>Change password</h4>
      {!passwordCheck ? (
        <>
          <p style={{ paddingBottom: '2rem' }}>
            Input current password to change password
          </p>
          <form onSubmit={onSubmit}>
            <Input
              type='password'
              value={password}
              onChange={onChange}
              style={{ paddingRight: '1rem' }}
            />
            <button
              type='submit'
              style={{
                backgroundColor: 'white',
                border: 'none',
                borderRadius: '1rem',
                minWidth: '15rem',
                cursor: 'pointer',
                backgroundColor: '#7ea7f3',
                margin: '1rem 0 2rem',
                color: '#fff',
                padding: '1rem 3rem',
              }}
            >
              Check
            </button>
          </form>
        </>
      ) : (
        <Formik
          initialValues={{
            password: '',
            confirmPassword: '',
          }}
          validationSchema={Yup.object().shape({
            password: Yup.string()
              .min(6, 'Password must be at least 6 characters')
              .required('Password is required')
              .matches(/^(?=.*[a-z])/, 'Password must have at least one letter')
              .matches(
                /^(?=.*[0-9])/,
                'Password must have at least one number'
              ),
            confirmPassword: Yup.string()
              .oneOf([Yup.ref('password'), null], 'Passwords must match')
              .required('Confirm Password is required'),
          })}
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {
              let dataToSubmit = {
                password: values.password,
              };

              dispatch(changePassword(dataToSubmit));

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
                      <div className='input-feedback'>
                        {errors.confirmPassword}
                      </div>
                    )}
                  </Form.Item>
                  <Form.Item {...tailFormItemLayout}>
                    <Button
                      onClick={handleSubmit}
                      type='primary'
                      disabled={isSubmitting}
                    >
                      Change Password
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            );
          }}
        </Formik>
      )}
    </div>
  );
}

export default ChangePassword;
