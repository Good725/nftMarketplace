import React from 'react';

function GuidelinesPage() {
  return (
    <div
      style={{
        alignContent: 'center',
        alignItems: 'center',
        justifyItems: 'center',
        justifyContent: 'center',
        float: 'center',
        // margin: '3rem auto',
        margin: '10%',
        // textAlign: 'center',
      }}
    >
      <h1
        style={{
          textAlign: 'center',
        }}
      >
        Guidelines
      </h1>

      <h3>
        Dbilia is designed to be a safe place for sharing, communicating and to
        support influencers and brand growth in a safe way. Our guidelines (the{' '}
        <b>“Guidelines”</b>) are created to help foster that culture.
        <br />
        <br />
        By using Dbilia and its services, you agree to follow the Guidelines and
        our Terms of Use.
        <br />
        <br />
        <ul>
          <li>
            Share only photos, videos and Content that you own or have the right
            to share;
          </li>
          <li>Post only photos, videos and Content that is appropriate;</li>
          <li>
            Aim to foster real, meaningful and genuine interactions with the
            Dbilia community;
          </li>
          <li>Do not impersonate other people, brands or businesses;</li>
          <li>
            Do not create an account for the purposes of violating our Terms of
            Use or for harassing others;
          </li>
          <li>Always comply with the applicable law; and</li>
          <li>Respect other users and their rights on Dbilia.</li>
        </ul>
      </h3>
    </div>
  );
}

export default GuidelinesPage;
