import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import DbiliaCardThreeClassic from './DbiliaCardThreeClassic';
import DbiliaCardThreeOpulent from './DbiliaCardThreeOpulent';
import DbiliaCardThreeSimple from './DbiliaCardThreeSimple';
function DbiliaCardThree(props) {
  //////  STATE ///////

  // # OF CARDS USER OWNS OF SAME CARD
  const [cardCount, setCardCount] = useState(0);
  const [countdown, setCountdown] = useState(0);
  // DISPLAYING LOWEST EDITION USER OWNS
  const [edition, setCardEdition] = useState(0);

  // FINDING USERS CART
  const [cart, setCart] = useState('');

  // PASSES WHICH EDITION IS CHOSEN TO GO TO MARKET
  const [editionSelected] = useState(0);

  // PASSES WHICH EDITION IS CHOSEN TO GO TO MARKET

  // const [dropdownMenu, setDropDown] = useState(false);
  ///// REDUX STATE ////

  // BOOLEAN DETERMINING IF WEVE JUST COME FROM CLICKING ON ADD TO COLLECTION
  const addToCollection = useSelector((state) => state.product.addToCollection);

  // LOGGED IN USERS CART INFO
  const user = useSelector((state) => state.user.userData);

  ////////  UPDATING CARDS OWNED, LOWEST EDITION, NON MARKET EDITIONS OWNED ////
  useEffect(() => {
    // IF COMING FROM ADD TO COLLECTION PAGE
    // ENSURE WE GET AN UPDATED CART FROM REDUX

    if (props.displayCardsOwned) {
      if (addToCollection) {
        setCart(user.cart);
      } else {
        // CAN JUST SHOW PROPS USER CART AS NO NEED TO GET MOST UP TO DATE STATE
        // THIS WILL EVENTUALLY CHANGE TO ALL REDUX
        setCart(props.user.cart);
      }
    } else if (props.marketUser) {
      // this is for user market
      setCart(props.userCart);
    }

    // GETTING CARD INFO
    const cartObject =
      cart && cart.filter((cartItem) => props.product._id === cartItem.id);

    if (cartObject && cartObject.length > 0) {
      const item = cartObject[0].ownedEditions;

      // SETTING THE NUMBER OF CARDS OWNED BY THE PROFILE INDIVIDUAL
      item.length > 0 && setCardCount(item.length);

      // SETTING THE LOWEST EDITION OF THAT CARD COLLECTION USER OWNS
      item.length > 0 && setCardEdition(item[0].edition);

      // CREATING AN ARRAY OF EDITIONS USER OWNS OF THAT CARD
    }

    // eslint-disable-next-line
  }, [props.user, props.userCart, cart, user, editionSelected]);

  ///////   ONCLICKS  ///////

  // PASSING CARD OWNER INFO TO REDUX STATE, USED BY PRODUCTION

  ////// RENDER /////
  return (
    <div style={{ zIndex: user.firstLogin && 201 }}>
      {props.product.layout === 'Classic' ? (
        <DbiliaCardThreeClassic
          product={props.product}
          collection={props.collection}
          edition={edition}
          pack={props.pack}
          writer={props.writer}
          role={props.role}
          displayCardsOwned={props.displayCardsOwned}
          link={props.link}
          history={props.history}
          cardCount={cardCount}
          countdown={countdown}
          lowestEdition={edition}
          marketUser={props.marketUser}
          totalEditionsInMarket={props.totalEditionsInMarket}
        />
      ) : props.product.layout === 'Opulent' ? (
        <DbiliaCardThreeOpulent
          product={props.product}
          collection={props.collection}
          edition={edition}
          pack={props.pack}
          writer={props.writer}
          role={props.role}
          displayCardsOwned={props.displayCardsOwned}
          link={props.link}
          history={props.history}
          cardCount={cardCount}
          countdown={countdown}
          lowestEdition={edition}
          marketUser={props.marketUser}
          totalEditionsInMarket={props.totalEditionsInMarket}
        />
      ) : (
        <DbiliaCardThreeSimple
          product={props.product}
          collection={props.collection}
          edition={edition}
          pack={props.pack}
          writer={props.writer}
          role={props.role}
          displayCardsOwned={props.displayCardsOwned}
          link={props.link}
          history={props.history}
          cardCount={cardCount}
          countdown={countdown}
          lowestEdition={edition}
          marketUser={props.marketUser}
          totalEditionsInMarket={props.totalEditionsInMarket}
        />
      )}
    </div>
  );
}

export default DbiliaCardThree;

// how many cards owned,  when you click on collectino of cards i profile it will show all the cards, in purchase editions dropdown menu to see cards that they own, 100 editions, all 100 will show up in dropdown menu, whichever editions that  they own will be clickcable.

// if you are in someones collection and click on a card whether its your own, show the edition that user owns, add to collection button, add to collection ,  profile page, they own ediition number 1 so show lowest edition in the profile page,  on actual collection page.

// product page is the page where you can buy.

// collection product page is when you are in your own collection.

// show here the lowest edition as well but also buttons. feed the ones thats for sale, in shop one thats for sale now.  only see the banner in the users collection where the profile card.  only buttons in the product page not the banner of how many cards.
