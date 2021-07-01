import { useEffect, useCallback } from 'react';
import {
  getFeaturedPage,
  getFeedPage,
  getMarketPage,
  getCollectionPage,
  getSearchCardPage,
  getSearchUserPage,
  getShopPage,
  getSalePage,
} from '../_actions/_infinite_actions';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

// infinite scrolling with intersection observer
export const useInfiniteScrollFeature = (scrollRef, prevent) => {
  const dispatch = useDispatch();
  const { featuredLoading, featuredSection } = useSelector(
    (state) => state.infinite
  );
  const scrollObserver = useCallback(
    (node) => {
      new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (
            en.intersectionRatio > 0 &&
            !featuredLoading &&
            featuredSection.length !== 0
          ) {
            dispatch(getFeaturedPage());
          }
        });
      }).observe(node);
    },
    [featuredLoading, featuredSection]
  );

  useEffect(() => {
    if (scrollRef.current) {
      scrollObserver(scrollRef.current);
    }
  }, [scrollObserver, scrollRef]);
};

export const useInfiniteScrollFeed = (scrollRef) => {
  const dispatch = useDispatch();
  const { feedLoading, feedSection } = useSelector((state) => state.infinite);
  const scrollObserver = useCallback(
    (node) => {
      new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (
            en.intersectionRatio > 0 &&
            !feedLoading &&
            feedSection.length !== 0
          ) {
            console.log('feed');
            dispatch(getFeedPage());
          }
        });
      }).observe(node);
    },
    [feedLoading, feedSection]
  );

  useEffect(() => {
    if (scrollRef.current) {
      scrollObserver(scrollRef.current);
    }
  }, [scrollObserver, scrollRef]);
};

export const useInfiniteScrollShop = (scrollRef, prevent) => {
  const dispatch = useDispatch();
  const { shopLoading, shopSection } = useSelector((state) => state.infinite);
  const scrollObserver = useCallback(
    (node) => {
      new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (
            en.intersectionRatio > 0 &&
            !shopLoading &&
            shopSection.length !== 0
          ) {
            dispatch(getShopPage());
          }
        });
      }).observe(node);
    },
    [shopLoading, shopSection]
  );

  useEffect(() => {
    if (scrollRef.current) {
      scrollObserver(scrollRef.current);
    }
  }, [scrollObserver, scrollRef]);
};

export const useInfiniteScrollCollection = (scrollRef, prevent) => {
  const dispatch = useDispatch();
  const { collectionLoading, collectionSection } = useSelector(
    (state) => state.infinite
  );
  const scrollObserver = useCallback(
    (node) => {
      new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (
            en.intersectionRatio > 0 &&
            !collectionLoading &&
            collectionSection.length !== 0
          ) {
            dispatch(getCollectionPage());
          }
        });
      }).observe(node);
    },
    [collectionLoading, collectionSection]
  );

  useEffect(() => {
    if (scrollRef.current) {
      scrollObserver(scrollRef.current);
    }
  }, [scrollObserver, scrollRef]);
};

export const useInfiniteScrollMarket = (scrollRef, prevent) => {
  const dispatch = useDispatch();
  const { marketLoading, marketSection } = useSelector(
    (state) => state.infinite
  );
  const scrollObserver = useCallback(
    (node) => {
      new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (
            en.intersectionRatio > 0 &&
            !marketLoading &&
            marketSection.length !== 0
          ) {
            dispatch(getMarketPage());
          }
        });
      }).observe(node);
    },
    [marketLoading, marketSection]
  );

  useEffect(() => {
    if (scrollRef.current) {
      scrollObserver(scrollRef.current);
    }
  }, [scrollObserver, scrollRef]);
};

export const useInfiniteScrollSale = (scrollRef, prevent) => {
  const dispatch = useDispatch();
  const { saleLoading, saleSection } = useSelector((state) => state.infinite);
  const scrollObserver = useCallback(
    (node) => {
      new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (
            en.intersectionRatio > 0 &&
            !saleLoading &&
            saleSection.length !== 0
          ) {
            dispatch(getSalePage());
          }
        });
      }).observe(node);
    },
    [saleLoading, saleSection]
  );

  useEffect(() => {
    if (scrollRef.current) {
      scrollObserver(scrollRef.current);
    }
  }, [scrollObserver, scrollRef]);
};

export const useInfiniteScrollSearchCard = (scrollRef) => {
  const dispatch = useDispatch();
  const { searchCardLoading, searchCardSection } = useSelector(
    (state) => state.infinite
  );
  const scrollObserver = useCallback(
    (node) => {
      new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (
            en.intersectionRatio > 0 &&
            !searchCardLoading &&
            searchCardSection.length !== 0
          ) {
            dispatch(getSearchCardPage());
          }
        });
      }).observe(node);
    },
    [searchCardLoading, searchCardSection]
  );

  useEffect(() => {
    if (scrollRef.current) {
      scrollObserver(scrollRef.current);
    }
  }, [scrollObserver, scrollRef]);
};

export const useInfiniteScrollSearchUser = (scrollRef) => {
  const dispatch = useDispatch();
  const { searchUserLoading, searchUserSection } = useSelector(
    (state) => state.infinite
  );
  const scrollObserver = useCallback(
    (node) => {
      new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (
            en.intersectionRatio > 0 &&
            !searchUserLoading &&
            searchUserSection.length !== 0
          ) {
            dispatch(getSearchUserPage());
          }
        });
      }).observe(node);
    },
    [searchUserLoading, searchUserSection]
  );

  useEffect(() => {
    if (scrollRef.current) {
      scrollObserver(scrollRef.current);
    }
  }, [scrollObserver, scrollRef]);
};
