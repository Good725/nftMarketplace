import React from 'react';

function AdminPage() {
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
        }}
      >
        <h2>
          Admin Page
          <br />
          <br />
          Update password
          <br />
          user email
          <br />
          <input />
          <br />
          New Password
          <br />
          <input />
        </h2>
      </div>
    </div>
  );
}

export default AdminPage;
