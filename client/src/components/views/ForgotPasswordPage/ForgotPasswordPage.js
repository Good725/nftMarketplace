import React from 'react';

function ForgotPasswordPage() {
  return (
    <div
      style={{
        display: 'flex',
        height: '100%',
        width: '100%',
        backgroundColor: '#f6f6f6',
        zIndex: 4,
        top: 0,
        left: 0,
        position: 'fixed',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          paddingBottom: '100px',
          position: 'fixed',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <h2>Please email social@dbilia.com to resolve this issues</h2>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
