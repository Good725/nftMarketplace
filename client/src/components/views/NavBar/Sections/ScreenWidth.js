import { useState, useEffect } from 'react';
import { setWidth } from '../../../../_actions/in_view_actions';
import { useDispatch } from 'react-redux';

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}
export default function useWindowDimensions() {
  const dispatch = useDispatch();
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
}
