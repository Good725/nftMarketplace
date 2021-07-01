import React from 'react';

function FeaturedItem({ item }) {
  return (
    <div>
      {Array.isArray(item.images) ? (
        // determining if item is part of pack or prodocut

        <a
          href={`${item.remainingCards ? 'pack' : 'product'}/${item._id}`}
          className={'featured__image-item'}
        >
          <p className='featured__text'>{item.title}</p>
          <p className='featured__text featured__text--2'>
            {item.writer.username}
          </p>
          {item.images[0].split('/')[4] == 'video' ? (
            <video
              autoPlay
              loop
              muted
              height='auto'
              width='100%'
              className='featured__image'
            >
              <source src={item.images} type='video/mp4' />
              <source src={item.images} type='video/ogg' />
              <source src={item.images} type='video/webm' />
            </video>
          ) : (
            <img className='featured__image' alt='image1' src={item.images} />
          )}
        </a>
      ) : (
        <a
          className='featured__image-item featured__image-item--user'
          href={`/collection/${item._id}`}
        >
          <p className='featured__text'>{item.username}</p>
          <img src={item.image} alt='' className='featured__image' />
        </a>
      )}
    </div>
  );
}

export default FeaturedItem;
