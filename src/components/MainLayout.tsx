import React from 'react';
import { Col, Row, Space } from 'antd';
import DataTable from './UserTable';
import { Header } from 'antd/es/layout/layout';
import Title from 'antd/es/typography/Title';

const typoStyle = {
  color: 'white',
  margin: '8px 0',
};

// All components are loading into MainLayout
const MainLayout: React.FC = () => {

  return (
    <>
      <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
        <Header className="header">
          <Row justify="center">
            <Title style={typoStyle} type="secondary">User Table</Title>
          </Row>
        </Header>

        <Row justify="center">
          <Col xs={22} sm={20} md={18}>
            {/* Insert users data table  */}
            <DataTable />
          </Col>
        </Row>
      </Space>
    </>
  );
};

export default MainLayout;