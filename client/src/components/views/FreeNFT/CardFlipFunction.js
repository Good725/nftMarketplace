(function () {
  var body, container, front, back, isTouch;

  body = $('body');
  container = $('<div>');
  front = $('<div>');
  back = $('<div>');

  TweenMax.set(body, {
    css: {
      width: 258,
      height: 401,
      transformStyle: 'preserve-3d',
      perspective: 800,
      perspectiveOrigin: '50% 50% 0px',
      backgroundColor: '#000000',
      'margin-left': 'auto',
      'margin-right': 'auto',
    },
  });

  TweenMax.set(container, {
    css: {
      transformStyle: 'preserve-3d',
      z: 0,
    },
  });

  TweenMax.set(front, {
    css: {
      backgroundImage: 'url("../../../img/freeNFT.png")',
    },
  });

  TweenMax.set(back, {
    css: {
      backgroundImage: 'url("../../../img/freeNFTOpen.png")',
      rotationY: -180,
    },
  });

  TweenMax.set([front, back], {
    css: {
      width: 258,
      height: 401,
      backfaceVisibility: 'hidden',
      position: 'absolute',
    },
  });

  container.appendTo(body);
  front.appendTo(container);
  back.appendTo(container);

  isTouch = 'touchstart' in document.documentElement;

  enableUI();

  function onMouseDown(e) {
    TweenMa.to(container, 2, {
      css: { rotationY: '+=180' },
      onComplete: enableUI,
      ease: Power2.easeInOut,
    });
    TweenMax.to(container, 1, {
      css: { z: '-=100' },
      yoyo: true,
      repeat: 1,
      ease: Power2.easeIn,
    });
  }

  function enableUI() {
    if (isTouch) {
      container.one('touchend', onMouseDown);
    } else {
      container.one('click', onMouseDown);
    }
  }
})();
