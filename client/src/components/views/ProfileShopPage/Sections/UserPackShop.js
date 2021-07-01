import React from 'react';
import { Col, Row } from 'antd';
import DbiliaCardThree from '../../../utils/DbiliaCardThree';
import PackCard from '../../../utils/PackCard';
function UserPackShop(props) {
  const renderItems =
    props.packs &&
    props.packs.map((pack) => {
      return (
        <Col lg={props.Large} md={props.Medium} sm={props.Small} xs={32}>
          <PackCard
            class='coin'
            pack={pack}
            writer={pack.writer.username}
            role={pack.writer.role}
            link='/buyPack/'
          />
        </Col>
      );
    });

  return (
    <div>
      <div
        style={{
          display: 'flex',
          textAlign: 'center',
          justifyItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Row gutter={[16, 16]}>{renderItems}</Row>
      </div>
    </div>
  );
}

export default UserPackShop;
