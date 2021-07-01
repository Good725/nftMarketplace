import React from 'react';
import NavBarList from './Sections/NavBarList';
import './Sections/Navbar.css';
import useWindowDimensions from './Sections/ScreenWidth';
import NavCollapse from './Sections/NavCollapse';
import { useSelector } from 'react-redux';

function NavBar(props) {
  const { width } = useWindowDimensions();
  const navOpen = useSelector((state) => state.view.navOpen);

  return (
    <>
      {width > 830 && navOpen === false ? (
        <>
          <NavBarList tour={props.tour} guideStep={props.guideStep} />
        </>
      ) : (
        <NavCollapse tour={props.tour} />
      )}
    </>
  );
}

export default NavBar;
