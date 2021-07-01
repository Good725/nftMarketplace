import React, { useState } from 'react';
import { Input } from 'antd';

const { Search } = Input;

function UserSearchFeature(props) {
  const [UserSearchTerms, setUserSearchTerms] = useState('');

  const onChangeSearch = (event) => {
    setUserSearchTerms(event.currentTarget.value);

    props.refreshFunction(event.currentTarget.value);
  };
  return (
    <div>
      <Search
        value={UserSearchTerms}
        onChange={onChangeSearch}
        placeholder='Search'
      />
    </div>
  );
}

export default UserSearchFeature;
