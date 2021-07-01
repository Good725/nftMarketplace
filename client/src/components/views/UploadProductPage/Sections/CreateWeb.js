import React, { useState, useEffect } from 'react';
import { Typography, Button, Form, Input, notification } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import {
  addToShop,
  endCreateTour,
  getProfileUser,
  incrementCreateTour,
  trackCreateTour,
  trackTour,
} from '../../../../_actions/user_actions';
import Axios from 'axios';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import Card3dMirrorClassic from '../../../utils/Card3dMirrorClassic';
import Card3dMirrorSimple from '../../../utils/Card3dMirrorSimple';
import Card3dMirrorOpulant from '../../../utils/Card3dMirrorOpulant';
import moment from 'moment';
import { categories } from '../../../utils/categoryArray';
import useWindowDimensions from '../../NavBar/Sections/ScreenWidth';
import { DatePickerField } from './DatePickerField';
import NavBar from '../../NavBar/NavBar';
import sprite from '../../../../img/sprite.svg';
import { resetShop } from '../../../../_actions/_infinite_actions';
import { LoadingOutlined } from '@ant-design/icons';
const { Title } = Typography;
const { TextArea } = Input;

function CreateWeb({ history }) {
  const [image, setImage] = useState('');
  const [video, setVideo] = useState('');
  const [unlockableVideo, setUnlockableVideo] = useState('');
  const [unlockableImage, setUnlockableImage] = useState('');
  const [guideStep, setGuideStep] = useState(1);
  const [auction, setAuction] = useState('false');
  const [unlockable, setUnlockable] = useState('false');
  const [limit, setLimit] = useState('false');
  const [errors, setErrors] = useState({});
  const [submitAttempts, setSubmitAttempts] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [preventSubmit, setPreventSubmit] = useState(false);
  // this state helps with very long class if or
  // for setting arrow in guide
  const [scenario, setScenario] = useState([]);
  const [url, setUrl] = useState(
    'https://res.cloudinary.com/dbilia/image/upload/c_scale,w_10/v1506432278/jpgaiigmssofjc1vast6.png'
  );
  const [unlockableUrl, setUnlockableUrl] = useState('');
  const [thumbnail, setThumbnail] = useState('');

  const TheUserData = useSelector((state) => state.user.userData);

  const progressTracker = useSelector((state) => state.user.createTourTracker);
  useEffect(() => {
    if (progressTracker && TheUserData.createTourTracker) {
      setGuideStep(TheUserData.createTourTracker);
      if (guideStep !== '') {
        dispatch(trackCreateTour(false));
      }
    }
  }, [progressTracker, TheUserData.createTourTracker]);

  // easy way to track scenarios for lining up the arrow
  // in the correct spot
  useEffect(() => {
    const newArray = [limit, auction, unlockable];
    setScenario(newArray.filter((i) => i === 'true').length);
  }, [limit, auction, unlockable]);
  const { width } = useWindowDimensions();
  useEffect(() => {
    if (TheUserData) {
      if (TheUserData._id === undefined) {
        // history.push('/login');
      } else {
        history.push('/createCard');
      }
    }
  }, [TheUserData]);

  const dispatch = useDispatch();

  /////// FORM ARRAYS //////
  const EditionAmount = Array.apply(null, Array(99))
    .map((v, i) => i + 1)
    .concat(Array.apply(null, Array(10)).map((v, i) => (i + 1) * 100));

  const LimitAmount = Array.apply(null, Array(99))
    .map((v, i) => {
      return { value: i + 1, label: i + 1 };
    })
    .concat(
      Array.apply(null, Array(10)).map((v, i) => {
        return { label: (i + 1) * 100, value: (i + 1) * 100 };
      })
    );
  // .unshift({ label: '', value: 10000000000 });
  LimitAmount.unshift({ label: '', value: 10000000000 });

  const layoutOptions = ['Classic', 'Opulent', 'Simple'];
  const currency = ['Eth', 'USD'];
  const trueFalse = [
    { label: 'True', value: 'true' },
    { label: 'False', value: 'false' },
  ];

  //// REDIRECT ON LOGIN

  // PRODUCT IMAGE ////
  const hiddenFileInput = React.useRef(null);

  const hiddenUpload = React.useRef(null);

  const updateImage = () => {
    hiddenFileInput.current.click();
  };
  useEffect(() => {
    dispatch(trackTour(true));
  }, []);
  useEffect(() => {
    if ((guideStep === 2 && image !== '') || video !== '') {
      setGuideStep((guideStep) => guideStep + 1);
    }
  }, [image, video]);
  const uploadImage = (e) => {
    if (e.target.files[0].type.split('/')[0] === 'video') {
      setVideo(e.target.files[0]);
      setImage('');
    } else {
      setImage(e.target.files[0]);
      setVideo('');
    }
    setTimeout(() => {
      hiddenUpload.current.click();
    }, 1000);
  };
  useEffect(() => {
    video !== '' &&
      setThumbnail(
        `${url
          .split('.')
          .filter((v) => v !== url.split('.').splice(-1)[0])
          .join('.')}.jpg`
      );
  }, [url]);

  const postDetails = () => {
    setPreventSubmit(true);
    const data = new FormData();

    data.append('file', image === '' ? video : image);
    data.append('upload_preset', 'dbilia');
    data.append('cloud_name', 'dbilia');
    fetch(
      `https://api.cloudinary.com/v1_1/dbilia/${
        image ? 'image' : 'video'
      }/upload`,
      {
        method: 'post',
        body: data,
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setUrl(data.url);
        setPreventSubmit(false);
      })
      .catch((err) => {
        setPreventSubmit(false);
      });
  };

  ////// UNLOCKABLE IMAGE //////
  const hiddenUnlockableFileInput = React.useRef(null);

  const hiddenUnlockableUpload = React.useRef(null);

  const uploadUnlockableImage = (e) => {
    if (e.target.files[0].type.split('/')[0] === 'video') {
      setUnlockableVideo(e.target.files[0]);
      setUnlockableImage('');
    } else {
      setUnlockableImage(e.target.files[0]);
      setUnlockableVideo('');
    }
    setTimeout(() => {
      hiddenUnlockableUpload.current.click();
    }, 1000);
  };

  const updateUnlockableImage = () => {
    hiddenUnlockableFileInput.current.click();
  };

  useEffect(() => {
    const handleResize = () => {};
    window.addEventListener('resize', handleResize);
  }, []);

  const addToShopHandler = (productId) => {
    dispatch(addToShop(productId)).then(() => getProfileUser(TheUserData._id));
  };

  const postUnlockableDetails = () => {
    setPreventSubmit(true);
    const data = new FormData();
    data.append(
      'file',
      unlockableImage === '' ? unlockableVideo : unlockableImage
    );
    data.append('upload_preset', 'dbilia');
    data.append('cloud_name', 'dbilia');

    fetch(
      `https://api.cloudinary.com/v1_1/dbilia/${
        unlockableImage ? 'image' : 'video'
      }/upload`,
      {
        method: 'post',
        body: data,
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setUnlockableUrl(data.url);
        setPreventSubmit(false);
      })
      .catch((err) => {
        console.log(err);
        setPreventSubmit(false);
      });
  };

  return (
    <div className='landing__container'>
      <div
        style={{
          display: 'grid',
          gridColumn: '2/3',
          marginTop: TheUserData.createTour && '14rem',
          gridTemplateColumns: 'repeat(2, 50%)',
        }}
      >
        <div
          style={{
            textAlign: 'center',
            gridColumn: '1/3',
            marginBottom: '2rem',
            marginTop: '5rem',
            display: 'grid',
          }}
        >
          <Title level={1}>Create NFT</Title>
        </div>
        <div
          style={{
            gridColumn: width > 900 ? '1/2' : '1/3',
            display: 'grid',
            // width: width < 900 && '75%',
            margin: '0 auto',
          }}
        >
          <button
            onClick={updateImage}
            style={{
              justifyItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              backgroundColor: 'white',
              border: 'none',
              borderRadius: '1rem',
              width: '35rem',
              cursor: 'pointer',
              backgroundColor: '#7ea7f3',
              margin: '1rem 0 2rem',
              color: '#fff',
              padding: '1rem 3rem',
              gridRow: '1/2',
            }}
          >
            {preventSubmit ? (
              <LoadingOutlined
                style={{
                  fontSize: 15,
                  marginRight: '10px',
                }}
                spin
              />
            ) : (
              'Choose Image,Video or Gif!'
            )}
          </button>
          {TheUserData.createTour && guideStep === 2 && (
            <svg
              className='tour__arrow tour__arrow--image'
              onClick={() => setGuideStep((guideStep) => guideStep + 1)}
              style={{ cursor: 'pointer' }}
            >
              <use href={sprite + '#arrow'}></use>
            </svg>
          )}
          <input
            type='file'
            accept='image/x-png,image/gif,image/jpeg ,video/mp4, video/webp'
            ref={hiddenFileInput}
            style={{ display: 'none' }}
            onChange={uploadImage}
          />
        </div>
        <div style={{ gridColumn: '1/2' }}>
          <button
            className='btn waves-effect waves-light #64b5f6 blue darken-1'
            onClick={() => postDetails()}
            ref={hiddenUpload}
            style={{ display: 'none' }}
          >
            Upload Image
          </button>
        </div>
        {video !== '' && (
          <>
            <p>Preview Thumbnail</p>
            <img
              src={thumbnail}
              style={{
                width: '200px',
                height: '200px',
                marginBottom: '3rem',
              }}
            />
          </>
        )}

        <Formik
          validateOnChange={true}
          initialValues={{
            title: '',
            description: '',
            price: '',
            category: '',
            edition: 1,
            purchaseLimit: 'false',
            purchaseLimitAmount: '',
            infinite: '',
            saleDeadline: '',
            layout: 'Classic',
            royalties: '',
            videoPreview: '',
            auction: 'false',
            startingBid: '',
            auctionDeadline: '',
            auctionStartDate: moment(Date.now()),
            auctionStartTime: '',
            auctionDeadlineTime: '',
            unlockable: 'false',
            unlockableText: '',
            // currency: 'USD',
          }}
          // validationSchema={validationSchema}
          validationSchema={Yup.object().shape({
            title: Yup.string()
              .required('title is required')
              .max(40, 'Title must be 40 or less characters'),

            description: Yup.string()
              .required()
              .max(300, 'Title must be 300 or less characters'),

            price: Yup.string().when('auction', {
              is: 'false',
              then: Yup.string()
                .min(0, 'Price must be greater than 0')
                .required('Please enter price'),
            }),
            royalties: Yup.string()
              .min(0, 'Royalties must be greater than 0')
              .required('Please choose a royalty percentage'),
            startingBid: Yup.string().when('auction', {
              is: 'true',
              then: Yup.string()
                .required('Please enter a starting bid')
                .min(0, 'Bid must be above 0'),
            }),
            auctionStartDate: Yup.date().when('auction', {
              is: 'true',
              then: Yup.date()
                .min(
                  moment(Date.now()).subtract(60, 'minute'),
                  'Auction cannot start in the past'
                )
                .required('Start date is required'),
            }),
            auctionDeadline: Yup.date().when('auction', {
              is: 'true',
              then: Yup.date()
                .required('Deadline is required')
                .min(Yup.ref('auctionStartDate'), 'Deadline is before start'),
            }),
            saleDeadline: Yup.date()
              .min(moment(Date.now()), 'Auction cannot start in the past')
              .max(
                moment(Date.now()).add(1000, 'day'),
                'Date too far in the future'
              ),
            purchaseLimitAmount: Yup.number().when('purchaseLimit', {
              is: 'true',
              then: Yup.number()
                .min(0, 'Please select number greater than 0')
                .lessThan(
                  Yup.ref('edition'),
                  'Limit must be less than total editions'
                ),
            }),
          })}
          onSubmit={(data, { setSubmitting }) => {
            setSubmitting(true);
            TheUserData.createTour && dispatch(endCreateTour());

            const variables = {
              writer: TheUserData._id,
              title: data.title,
              description: data.description,
              // currency: data.currency,
              price:
                data.auction === 'true'
                  ? (Math.round(data.startingBid * 100) / 100).toFixed(2)
                  : (Math.round(data.price * 100) / 100).toFixed(2),
              category: data.category,
              numberEditions:
                data.infinite[0] === 'infinite' ? 10000000000 : +data.edition,
              saleDeadline: data.saleDeadline,
              purchaseLimitAmount: data.purchaseLimitAmount,
              images: url,
              type: 0,
              layout: data.layout,
              royalties: data.royalties,
              auction: data.auction,
              startingBid: (Math.round(data.startingBid * 100) / 100).toFixed(
                2
              ),
              auctionStartDate: data.auctionStartDate,
              auctionDeadline: data.auctionDeadline,
              unlockable: data.unlockable,
              unlockableText: data.unlockableText,
              unlockableMedia: data.unlockableMedia,
              videoPreview: video !== '' && thumbnail,
              unlockableMedia: unlockableUrl,
            };

            Axios.post('/api/product/uploadProduct', variables).then(
              (response) => {
                if (response.data.success) {
                  // alert('Product Successfully Uploaded');
                  notification['success']({
                    message: 'Card successfully created',
                    description: `You may now view ${data.title} in your shop`,
                    duration: 5,
                  });
                  addToShopHandler(response.data.id);
                  dispatch(resetShop());
                } else {
                  alert('Failed to upload Product');
                }
              }
            );
            setTimeout(() => {
              setSubmitting(false);
              history.push(`/shop/${TheUserData._id}`);
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
            setFieldTouched,
            setFieldValue,
            isValid,
          }) => (
            <>
              {TheUserData.createTour && (
                <>
                  <NavBar tour={TheUserData.createTour} />
                  <div
                    className={guideStep === 1 ? 'tour tour__page-blur' : ''}
                  >
                    <div className='tour__bar'>
                      <button
                        className={
                          guideStep === 15 && Object.keys(errors).length > 0
                            ? 'tour__button tour__button--next tour__button--next--errors'
                            : 'tour__button tour__button--next'
                        }
                        type={guideStep === 15 && 'submit'}
                        form={guideStep === 15 && 'my-form'}
                        disabled={isSubmitting || preventSubmit}
                        onClick={() => {
                          if (guideStep < 15) {
                            setGuideStep((guideStep) => guideStep + 1);
                          }
                          setErrors(errors);
                          setSubmitAttempts(
                            (submitAttempts) => submitAttempts + 1
                          );
                        }}
                      >
                        {guideStep === 14
                          ? 'Submit'
                          : guideStep === 15 &&
                            Object.keys(errors).length === 0 &&
                            submitting
                          ? 'Submitting...'
                          : guideStep === 15 && Object.keys(errors).length > 0
                          ? 'Errors'
                          : guideStep === 15 &&
                            Object.keys(errors).length === 0 &&
                            !submitting
                          ? 'Submit'
                          : 'Next'}
                      </button>

                      <button
                        onClick={() =>
                          setGuideStep((guideStep) => guideStep - 1)
                        }
                        className='tour__button tour__button--previous'
                      >
                        Previous
                      </button>

                      <button
                        className='tour__button tour__button--skip'
                        onClick={() => `/collection/${TheUserData._id}`}
                      >
                        Skip
                      </button>
                      <div className='tour__text'>
                        <h3 className='tour__text--step'>
                          Create your own NFTs - {guideStep}/ 15
                        </h3>
                        <h3 className='tour__text--description'>
                          {guideStep === 1
                            ? 'Open Create Page'
                            : guideStep === 2
                            ? 'Add Media'
                            : guideStep === 3
                            ? 'Add Title'
                            : guideStep === 4
                            ? 'Add Description'
                            : guideStep === 5
                            ? 'Choose how much your NFT will cost'
                            : guideStep === 6
                            ? `When your NFT is resold this is the percentage you keep of that`
                            : guideStep === 7
                            ? 'Choose the category of your NFT to help buys find it'
                            : guideStep === 8
                            ? 'Choose the design of your NFt'
                            : guideStep === 9
                            ? 'Allow your NFT to be placed up on auction at the time of your choosing'
                            : guideStep === 10
                            ? 'Add content ot your NFT that only the owner can view'
                            : guideStep === 11
                            ? 'Choose how many editions a single user can buy'
                            : guideStep === 12
                            ? 'Choose how many editions to make'
                            : guideStep === 13
                            ? 'Choose when ot end the sale, all unsold NFT editions will be deleted/burned'
                            : guideStep === 14
                            ? 'Create it for free!'
                            : guideStep === 14 &&
                              Object.keys(errors).length === 0 &&
                              submitting
                            ? ''
                            : guideStep === 14 &&
                              Object.keys(errors).length === 0 &&
                              submitAttempts > 0
                            ? 'Please submit again'
                            : 'Please fill the required fields'}
                        </h3>
                        {/* keeping bar height consistent to line up with navbar */}
                        <div style={{ height: '1.8rem' }}></div>
                      </div>
                    </div>
                    {guideStep === 1 && (
                      <div
                        className='tour__blur-text-section'
                        style={{ marginTop: width > 900 ? '10rem' : '25rem' }}
                      >
                        <h1
                          className={
                            width > 900
                              ? 'tour__blur-text'
                              : 'tour__blur-text tour__blur-text--mobile'
                          }
                        >
                          On this page you can can make NFTs for free, let's do
                          it.
                        </h1>
                        <button
                          className='tour__button tour__button--next tour__button--next--blur'
                          onClick={() => {
                            setGuideStep((guideStep) => guideStep + 1);
                          }}
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
              <div
                style={{
                  gridColumn: '1/3',
                  display: 'grid',
                  justifyItems: 'center',
                  zIndex: TheUserData.createTour && guideStep !== 1 && '1001',
                  gridTemplateColumns: width > 900 ? 'repeat(2, 50%)' : '100%',
                }}
              >
                <div
                  style={{
                    gridColumn: width > 900 ? '2/3' : '1/2',
                    gridRow: width > 900 && '1/2',
                    display: 'grid',
                    justifyContent: 'center',
                  }}
                >
                  {values.layout === 'Classic' ? (
                    <Card3dMirrorClassic
                      url={url}
                      guideStep={guideStep}
                      unlockable={values.unlockable}
                      unlockableUrl={unlockableUrl}
                      unlockableText={values.unlockableText}
                      TitleValue={values.title}
                      DescriptionValue={values.description}
                      EditionValue={values.edition}
                      writer={TheUserData.username}
                      price={values.price}
                      infinite={
                        values.infinite.length > 0 && values.infinite[0]
                      }
                    />
                  ) : values.layout === 'Opulent' ? (
                    <Card3dMirrorOpulant
                      url={url}
                      guideStep={guideStep}
                      unlockable={values.unlockable}
                      unlockableUrl={unlockableUrl}
                      unlockableText={values.unlockableText}
                      TitleValue={values.title}
                      EditionValue={values.edition}
                      writer={TheUserData.username}
                      price={values.price}
                      infinite={
                        values.infinite.length > 0 && values.infinite[0]
                      }
                    />
                  ) : (
                    <Card3dMirrorSimple
                      price={values.price}
                      infinite={
                        values.infinite.length > 0 && values.infinite[0]
                      }
                      url={url}
                      guideStep={guideStep}
                      unlockable={values.unlockable}
                      unlockableUrl={unlockableUrl}
                      unlockableText={values.unlockableText}
                      TitleValue={values.title}
                      EditionValue={values.edition}
                      writer={TheUserData.username}
                      profileImage={'hello'}
                    />
                  )}
                  {TheUserData.createTour && guideStep === 14 && (
                    <div
                      style={{
                        width: '8rem',
                        gridColumn: '1/2',
                        gridRow: '2/3',
                      }}
                    ></div>
                  )}
                  {width <= 900 && (
                    <>
                      <button
                        disabled={isSubmitting || preventSubmit}
                        type='submit'
                        form='my-form'
                        onClick={() => {
                          setErrors(errors);
                          !isValid &&
                            setSubmitAttempts(
                              (submitAttempts) => submitAttempts + 1
                            );
                          guideStep === 14 &&
                            setGuideStep((guideStep) => guideStep + 1);

                          setSubmitting(isSubmitting);
                        }}
                        style={{
                          justifyItems: 'center',
                          justifyContent: 'center',
                          textAlign: 'center',
                          backgroundColor: 'white',
                          border: 'none',
                          justifySelf: 'center',
                          borderRadius: '1rem',
                          gridRow: '2/3',
                          cursor: 'pointer',
                          backgroundColor: '#7ea7f3',
                          margin: '1rem 0 2rem',
                          color: '#fff',
                          padding: '1.5rem 10rem',
                        }}
                      >
                        {isSubmitting ? (
                          <LoadingOutlined
                            style={{
                              fontSize: 15,
                              marginRight: '10px',
                            }}
                            spin
                          />
                        ) : (
                          'Create'
                        )}
                      </button>
                      {/* offsetting the arrrow on the right to center card and button */}

                      <>
                        {TheUserData.createTour && guideStep === 14 && (
                          <svg
                            className={
                              'tour__arrow tour__arrow--create-card tour__arrow--create-card--mobile'
                            }
                          >
                            <use href={sprite + '#arrow'}></use>
                          </svg>
                        )}
                      </>
                    </>
                  )}
                </div>
                <div
                  style={{ gridColumn: '1/2', gridRow: '1/2', display: 'grid' }}
                >
                  <Form onSubmit={handleSubmit} id='my-form'>
                    <div style={{ display: 'grid' }}>
                      {TheUserData.createTour &&
                        guideStep !== 2 &&
                        guideStep !== 1 &&
                        guideStep !== 14 &&
                        guideStep !== 15 && (
                          <svg
                            className={
                              guideStep === 3
                                ? 'tour__arrow tour__arrow--title'
                                : guideStep === 4
                                ? 'tour__arrow tour__arrow--description'
                                : guideStep === 5
                                ? 'tour__arrow tour__arrow--price'
                                : guideStep === 6
                                ? 'tour__arrow tour__arrow--royalty'
                                : guideStep === 7
                                ? 'tour__arrow tour__arrow--category'
                                : guideStep === 8
                                ? 'tour__arrow tour__arrow--design'
                                : guideStep === 9
                                ? 'tour__arrow tour__arrow--auction'
                                : guideStep === 10 && scenario === 1
                                ? 'tour__arrow--unlockable tour__arrow tour__arrow--unlockable--auction'
                                : guideStep === 10 && scenario === 0
                                ? 'tour__arrow  tour__arrow--unlockable'
                                : guideStep === 11 && scenario === 2
                                ? 'tour__arrow tour__arrow--limit tour__arrow--limit--auction--unlockable'
                                : guideStep === 11 && scenario === 1
                                ? 'tour__arrow tour__arrow--limit tour__arrow--limit--auction'
                                : guideStep === 11 && scenario === 0
                                ? 'tour__arrow  tour__arrow--limit'
                                : guideStep === 12 && scenario === 3
                                ? 'tour__arrow tour__arrow--number-editions tour__arrow--number-editions--auction--unlockable--limit'
                                : guideStep === 12 && scenario === 2
                                ? 'tour__arrow tour__arrow--number-editions tour__arrow--number-editions--auction--unlockable'
                                : guideStep === 12 && scenario === 1
                                ? 'tour__arrow tour__arrow--number-editions tour__arrow--number-editions--auction'
                                : guideStep === 12 && scenario === 0
                                ? 'tour__arrow  tour__arrow--number-editions'
                                : guideStep === 13 && scenario === 3
                                ? 'tour__arrow tour__arrow--deadline tour__arrow--deadline--auction--unlockable--limit'
                                : guideStep === 13 && scenario === 2
                                ? 'tour__arrow tour__arrow--deadline tour__arrow--deadline--auction--unlockable'
                                : guideStep === 13 && scenario === 1
                                ? 'tour__arrow tour__arrow--deadline tour__arrow--deadline--auction'
                                : guideStep === 13 && scenario === 0
                                ? 'tour__arrow  tour__arrow--deadline'
                                : 'defe'
                            }
                          >
                            <use href={sprite + '#arrow'}></use>
                          </svg>
                        )}
                      <Form.Item
                        style={{ gridColumn: '1/2' }}
                        style={{ fontSize: '3rem' }}
                        label='Title'
                      >
                        <Input
                          id='title'
                          placeholder='Title'
                          type='text'
                          maxLength='40'
                          value={values.title}
                          onChange={handleChange}
                          onBlur={() => {
                            setFieldTouched('title', true);
                            setErrors(errors);
                            if (guideStep === 3) {
                              setGuideStep((guideStep) => guideStep + 1);
                            }
                          }}
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
                      <Form.Item
                        style={{ gridColumn: '1/2' }}
                        label='Description'
                      >
                        <TextArea
                          id='description'
                          placeholder='This is where your description will go'
                          type='text'
                          maxLength='300'
                          value={values.description}
                          onChange={handleChange}
                          onBlur={() => {
                            setFieldTouched('description', true);
                            setErrors(errors);

                            if (guideStep === 4) {
                              setGuideStep((guideStep) => guideStep + 1);
                            }
                          }}
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
                      {/* <Form.Item style={{gridColumn: '1/2'}} label='Currency'>
                      {currency.map((item, i) => (
                        <>
                          <label>
                            <Field
                              id='currency'
                              style={{ margin: '0 .5rem' }}
                              type='radio'
                              value={item}
                              checked={values.currency === item && true}
                              name='currency'
                              onChange={handleChange}
                              onBlur={handleBlur}
                              className={
                                errors.currency && touched.currency
                                  ? 'text-input error'
                                  : 'text-input'
                              }
                            />
                            {errors.currency && touched.currency && (
                              <div className='input-feedback'>
                                {errors.currency}
                              </div>
                            )}

                            {item}
                          </label>
                        </>
                      ))}
                    </Form.Item> */}

                      <Form.Item style={{ gridColumn: '1/2' }} label='Price'>
                        <Input
                          id='price'
                          type='number'
                          min={0}
                          step='.01'
                          pattern='^\d*(\.\d{0,2})?$'
                          disabled={values.auction === 'true'}
                          value={values.price}
                          onChange={handleChange}
                          onBlur={() => {
                            setFieldTouched('price', true);
                            setErrors(errors);

                            if (guideStep === 5) {
                              setGuideStep((guideStep) => guideStep + 1);
                            }
                          }}
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
                      <Form.Item
                        style={{ gridColumn: '1/2' }}
                        label='Royalty percentage from each sale'
                      >
                        <Input
                          id='royalties'
                          placeholder={10}
                          type='number'
                          min={0}
                          max={100}
                          value={values.royalties}
                          onChange={handleChange}
                          onBlur={() => {
                            setFieldTouched('royalties', true);
                            setErrors(errors);

                            if (guideStep === 6) {
                              setGuideStep((guideStep) => guideStep + 1);
                            }
                          }}
                          className={
                            errors.royalties && touched.royalties
                              ? 'text-input error'
                              : 'text-input'
                          }
                        />
                        {errors.royalties && touched.royalties && (
                          <div className='input-feedback'>
                            {errors.royalties}
                          </div>
                        )}
                      </Form.Item>

                      <Form.Item
                        style={{ gridColumn: '1/2' }}
                        s
                        label='Category'
                      >
                        <select
                          id='category'
                          placeholder='0'
                          type='number'
                          min='0'
                          value={values.category}
                          onChange={handleChange}
                          onBlur={() => {
                            setFieldTouched('category', true);
                            setErrors(errors);

                            if (guideStep === 7) {
                              setGuideStep((guideStep) => guideStep + 1);
                            }
                          }}
                          className='text-input'
                        >
                          {categories.map((item) => (
                            <option key={item} value={item}>
                              {item}
                            </option>
                          ))}
                        </select>
                      </Form.Item>
                      <div style={{ marginBottom: '24px', gridColumn: '1/2' }}>
                        <p
                          style={{
                            fontSize: '1.9rem',
                            fontWeight: '500',
                            color: 'rgba(0, 0, 0, 0.85)',
                          }}
                        >
                          Style Design
                        </p>
                        {layoutOptions.map((item, i) => (
                          <>
                            <label>
                              <Field
                                id='layout'
                                type='radio'
                                style={{ margin: '.5rem' }}
                                checked={values.layout === item && true}
                                value={item}
                                name='layout'
                                onChange={handleChange}
                                onBlur={() => {
                                  setFieldTouched('layout', true);
                                  setErrors(errors);

                                  if (guideStep === 8) {
                                    setGuideStep((guideStep) => guideStep + 1);
                                  }
                                }}
                                className='text-input'
                              />
                              {item}
                            </label>
                          </>
                        ))}
                      </div>
                      <div
                        style={{
                          gridColumn: '1/2',
                        }}
                      >
                        <p
                          style={{
                            margin: '3rem 0',
                            fontSize: '1.9rem',
                            fontWeight: '500',
                            color: 'rgba(0, 0, 0, 0.85)',
                          }}
                        >
                          Send card to auction upon creation
                        </p>

                        {trueFalse.map((item, i) => (
                          <>
                            <label>
                              <Field
                                id='auction'
                                style={{ margin: '1rem .5rem 2rem' }}
                                type='radio'
                                checked={values.auction == item.value && true}
                                value={item.value}
                                name='auction'
                                onChange={handleChange}
                                onBlur={() => {
                                  setFieldTouched('auction', true);
                                  setErrors(errors);

                                  setAuction(values.auction);
                                  if (guideStep === 9) {
                                    setGuideStep((guideStep) => guideStep + 1);
                                  }
                                }}
                                className='text-input'
                              />
                              {item.label}
                            </label>
                          </>
                        ))}
                      </div>
                      {values.auction === 'true' && (
                        <div style={{ gridColumn: '1/2' }}>
                          <Form.Item
                            style={{ gridColumn: '1/2' }}
                            label='Starting Bid'
                            style={{ gridRow: '1/2' }}
                          >
                            <Input
                              id='startingBid'
                              type='number'
                              min={0}
                              step='.01'
                              pattern='^\d*(\.\d{0,2})?$'
                              value={values.startingBid}
                              onChange={handleChange}
                              onBlur={() => {
                                setFieldTouched('startingBid', true);
                                setErrors(errors);
                              }}
                              className={
                                values.auction === 'true' &&
                                errors.startingBid &&
                                touched.startingBid
                                  ? 'text-input error'
                                  : 'text-input'
                              }
                            />
                            {values.auction === 'true' &&
                              errors.startingBid &&
                              touched.startingBid && (
                                <div className='input-feedback'>
                                  {errors.startingBid}
                                </div>
                              )}
                          </Form.Item>
                          <div
                            style={{
                              display: 'grid',
                              gridTemplateColumns: 'repeat(2,max-content)',
                            }}
                          >
                            <Form.Item
                              style={{ gridColumn: '1/2' }}
                              label='Starting Date'
                              style={{ gridRow: '1/2' }}
                            >
                              <DatePickerField
                                name='auctionStartDate'
                                min={
                                  new Date(
                                    moment(Date.now()).subtract(60, 'minute')
                                  )
                                }
                                max={
                                  new Date(
                                    moment()
                                      .add(13, 'days')
                                      .format('YYYY-MM-DD')
                                  )
                                }
                                value={values.auctionStartDate}
                                onChange={handleChange}
                                onBlur={() => {
                                  setFieldTouched('auctionStartDate', true);
                                  setErrors(errors);
                                }}
                                className={
                                  values.auction === 'true' &&
                                  errors.auctionStartDate &&
                                  touched.auctionStartDate
                                    ? 'text-input error'
                                    : 'text-input'
                                }
                              />
                              {values.auction === 'true' &&
                                errors.auctionStartDate &&
                                touched.auctionStartDate && (
                                  <div
                                    className='input-feedback'
                                    style={{
                                      gridRow: '1/2',
                                      gridColumn: '1/3',
                                    }}
                                  >
                                    {errors.auctionStartDate}
                                  </div>
                                )}
                            </Form.Item>
                            <Form.Item
                              style={{ gridColumn: '1/2' }}
                              label='Expiration Date'
                              style={{ gridRow: '2/3' }}
                            >
                              <DatePickerField
                                name='auctionDeadline'
                                type='Date'
                                errors={errors}
                                touched={touched}
                                value={values.auctionDeadline}
                                min={new Date(Date.now())}
                                onChange={handleChange}
                                onBlur={() => {
                                  setFieldTouched('auctionDeadline', true);
                                  setErrors(errors);
                                }}
                                max={
                                  new Date(
                                    moment()
                                      .add(14, 'days')
                                      .format('YYYY-MM-DD')
                                  )
                                }
                                className={
                                  values.auction === 'true' &&
                                  errors.auctionDeadline &&
                                  touched.auctionDeadline
                                    ? 'text-input error'
                                    : 'text-input'
                                }
                              />
                              {values.auction === 'true' &&
                                errors.auctionDeadline &&
                                touched.auctionDeadline && (
                                  <div className='input-feedback'>
                                    {errors.auctionDeadline}
                                  </div>
                                )}
                            </Form.Item>
                          </div>
                        </div>
                      )}
                      <div
                        style={{
                          marginBottom: values.unlockable === 'false' && '24px',
                          gridColumn: '1/2',
                        }}
                      >
                        <h3>Unlockable content</h3>
                        <p>Only owner can see unlockable content</p>
                        {trueFalse.map((item, i) => (
                          <>
                            <label>
                              <Field
                                id='unlockable'
                                style={{ margin: '.5rem' }}
                                type='radio'
                                checked={
                                  values.unlockable == item.value && true
                                }
                                value={item.value}
                                name='unlockable'
                                onChange={handleChange}
                                onBlur={() => {
                                  setFieldTouched('unlockable', true);
                                  setUnlockable(values.unlockable);
                                  if (guideStep === 10) {
                                    setGuideStep((guideStep) => guideStep + 1);
                                  }
                                }}
                                className='text-input'
                              />
                              {item.label}
                            </label>
                          </>
                        ))}
                      </div>
                      {values.unlockable === 'true' && (
                        <div style={{ gridColumn: '1/2' }}>
                          <div
                            style={{ display: 'grid', padding: '2rem 2rem' }}
                          ></div>
                          <Form.Item style={{ gridColumn: '1/2' }} label=''>
                            <TextArea
                              id='unlockableText'
                              placeholder='Add text,link, codes...'
                              type='text'
                              maxLength='300'
                              value={values.unlockableText}
                              onChange={handleChange}
                              onBlur={() => {
                                setFieldTouched('unlockableText', true);
                                setErrors(errors);
                              }}
                              className={'text-input'}
                            />
                            {values.unlockable &&
                              errors.unlockableText &&
                              touched.unlockableText && (
                                <div className='input-feedback'>
                                  {errors.unlockableText}
                                </div>
                              )}
                          </Form.Item>
                          <button
                            onClick={updateUnlockableImage}
                            type='button'
                            style={{
                              justifyItems: 'center',
                              justifyContent: 'center',
                              textAlign: 'center',
                              backgroundColor: 'white',
                              border: 'none',
                              width: '30rem',
                              borderRadius: '1rem',
                              cursor: 'pointer',
                              backgroundColor: '#7ea7f3',
                              margin: '0rem 0 3rem',
                              color: '#fff',
                              padding: '1rem 3rem',
                            }}
                          >
                            {preventSubmit ? (
                              <LoadingOutlined
                                style={{
                                  fontSize: 15,
                                  marginRight: '10px',
                                }}
                                spin
                              />
                            ) : (
                              'Choose Image, Video or Gif!'
                            )}
                          </button>
                        </div>
                      )}

                      <div
                        style={{
                          gridColumn: '1/2',
                        }}
                      >
                        <p
                          style={{
                            margin: '.5rem 0 3rem',
                            fontSize: '1.9rem',
                            fontWeight: '500',
                            color: 'rgba(0, 0, 0, 0.85)',
                          }}
                        >
                          Limit purchasing
                        </p>
                        <p>
                          Limit how many editions a single user can purchase
                        </p>

                        {trueFalse.map((item, i) => (
                          <>
                            <label>
                              <Field
                                id='purchaseLimit'
                                style={{ margin: '1rem .5rem 2rem' }}
                                type='radio'
                                checked={
                                  values.purchaseLimit == item.value && true
                                }
                                value={item.value}
                                name='purchaseLimit'
                                onChange={handleChange}
                                onBlur={() => {
                                  setFieldTouched('purchaseLimit', true);
                                  setLimit(values.purchaseLimit);
                                  if (guideStep === 12) {
                                    setGuideStep((guideStep) => guideStep + 1);
                                  }
                                }}
                                className='text-input'
                              />
                              {item.label}
                            </label>
                          </>
                        ))}
                      </div>

                      {values.purchaseLimit === 'true' && (
                        <Form.Item
                          style={{ gridColumn: '1/2' }}
                          label='Maximum number of purchasable editions'
                        >
                          <select
                            id='purchaseLimitAmount'
                            value={values.purchaseLimitAmount}
                            onChange={handleChange}
                            onBlur={() => {
                              setFieldTouched('purchaseLimit', true);
                              setErrors(errors);
                              if (guideStep === 13) {
                                setGuideStep((guideStep) => guideStep + 1);
                              }
                            }}
                            className={
                              errors.purchaseLimitAmount &&
                              touched.purchaseLimitAmount
                                ? 'text-input error'
                                : 'text-input'
                            }
                          >
                            {LimitAmount.map((item) => (
                              <option key={item} value={item.value}>
                                {item.label}
                              </option>
                            ))}
                          </select>

                          {errors.purchaseLimitAmount &&
                            touched.purchaseLimitAmount && (
                              <div className='input-feedback'>
                                {errors.purchaseLimitAmount}
                              </div>
                            )}
                        </Form.Item>
                      )}
                      <div style={{ display: 'grid', gridColumn: '1/2' }}>
                        <div
                          style={{
                            display: 'grid',
                            gridColumn: '1/2',
                            gridRow: '1/2',
                            alignSelf: 'end',
                            gridTemplateColumns: 'repeat(2,max-content)',
                            marginLeft: '14rem',
                            marginBottom: '1.5rem',
                          }}
                        >
                          <label
                            style={{
                              gridRow: '1/2',
                              color: 'rgba(0, 0, 0, 0.85)',
                              fontSize: '1.7rem',
                              marginRight: '1.5rem',
                              marginTop: '1rem',
                            }}
                          >
                            Set Infinite Editions:
                          </label>
                          <Form.Item
                            style={{
                              gridColumn: '2/3',
                              gridRow: '1/2',
                              marginBottom: '1rem',
                              marginTop: '.2rem',
                              zIndex: '1000',
                            }}
                          >
                            <Field name='infinite'>
                              {({ field, form }) => (
                                <input
                                  {...field}
                                  type='checkbox'
                                  checked={field.value.includes('infinite')}
                                  onChange={() => {
                                    const set = new Set(field.value);
                                    if (set.has('infinite')) {
                                      set.delete('infinite');
                                    } else {
                                      set.add('infinite');
                                      setFieldValue('edition', 1);
                                    }
                                    form.setFieldValue(
                                      field.name,
                                      Array.from(set)
                                    );

                                    form.setFieldTouched(field.name, true);
                                  }}
                                  onBlur={() => {
                                    setFieldTouched('infinite', true);
                                    if (guideStep === 11) {
                                      setGuideStep(
                                        (guideStep) => guideStep + 1
                                      );
                                    }
                                  }}
                                />
                              )}
                            </Field>
                          </Form.Item>
                        </div>
                        <Form.Item
                          style={{ gridColumn: '1/2', gridRow: '1/2' }}
                          label='Choose how many editions for this NFT to have'
                        >
                          <select
                            id='edition'
                            placeholder='0'
                            min='0'
                            disabled={values.infinite[0] === 'infinite'}
                            value={values.edition}
                            onChange={handleChange}
                            onBlur={() => {
                              setFieldTouched('editions', true);
                              if (guideStep === 14) {
                                setGuideStep((guideStep) => guideStep + 1);
                              }
                            }}
                            className={'text-input'}
                          >
                            {EditionAmount.map((item) => (
                              <option key={item} value={item}>
                                {item}
                              </option>
                            ))}
                          </select>
                        </Form.Item>
                      </div>

                      {
                        <Form.Item
                          style={{ gridColumn: '1/2' }}
                          label='Sale Deadline (optional)'
                        >
                          <DatePickerField
                            name='saleDeadline'
                            type='Date'
                            errors={errors}
                            touched={touched}
                            disabled={values.auction === 'true' && true}
                            value={values.saleDeadline}
                            min={new Date(Date.now())}
                            onChange={handleChange}
                            onBlur={() => {
                              setFieldTouched('saleDeadline', true);
                              if (guideStep === 14) {
                                setGuideStep((guideStep) => guideStep + 1);
                              }
                            }}
                            max={
                              new Date(
                                moment().add(100, 'days').format('YYYY-MM-DD')
                              )
                            }
                          />
                        </Form.Item>
                      }
                    </div>

                    {width >= 900 && (
                      <div style={{ display: 'grid' }}>
                        {TheUserData.createTour && guideStep === 14 && (
                          <svg
                            className={'tour__arrow tour__arrow--create-card'}
                          >
                            <use href={sprite + '#arrow'}></use>
                          </svg>
                        )}
                        <button
                          disabled={isSubmitting || preventSubmit}
                          type='submit'
                          onClick={() => {
                            setErrors(errors);

                            !isValid &&
                              setSubmitAttempts(
                                (submitAttempts) => submitAttempts + 1
                              );
                            setSubmitting(isSubmitting);
                            guideStep === 14 &&
                              setGuideStep((guideStep) => guideStep + 1);
                          }}
                          style={{
                            justifyItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center',
                            backgroundColor: 'white',
                            border: 'none',
                            borderRadius: '1rem',
                            cursor: 'pointer',
                            backgroundColor: '#7ea7f3',
                            margin: '1rem 0 2rem',
                            color: '#fff',
                            // width: '50%',
                            width: '25rem',
                            padding: '1.5rem 10rem',
                          }}
                        >
                          {isSubmitting ? (
                            <LoadingOutlined
                              style={{
                                fontSize: 15,
                                marginRight: '10px',
                              }}
                              spin
                            />
                          ) : (
                            'Create'
                          )}
                        </button>
                      </div>
                    )}
                  </Form>
                </div>
              </div>
            </>
          )}
        </Formik>

        <input
          type='file'
          accept='image/x-png,image/gif,image/jpeg ,video/mp4, video/webp'
          ref={hiddenUnlockableFileInput}
          style={{ display: 'none' }}
          onChange={uploadUnlockableImage}
        />
        <button
          type='button'
          className='btn waves-effect waves-light #64b5f6 blue darken-1'
          onClick={() => postUnlockableDetails()}
          ref={hiddenUnlockableUpload}
          style={{ display: 'none' }}
        >
          Upload Image
        </button>
      </div>
    </div>
  );
}

export default CreateWeb;
