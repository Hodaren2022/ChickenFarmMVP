import React from 'react';
import { Card, Row, Col, Statistic, Button, List, Typography } from 'antd';
import { 
  CalendarOutlined, 
  TeamOutlined, 
  ShoppingCartOutlined,
  MedicineBoxOutlined,
  WarningOutlined,
  PlusOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Title } = Typography;

const Dashboard = () => {
  // 模擬數據 - 實際應用中應從數據存儲中獲取
  const stats = {
    totalChickens: 500,
    feedStock: 1200,
    medicineStock: 15,
    recentDeaths: 2,
    averageHealth: '良好',
    lastRecordDate: '2023-11-25'
  };

  const recentActivities = [
    { date: '2023-11-25', activity: '添加日常記錄' },
    { date: '2023-11-24', activity: '購入飼料 500kg' },
    { date: '2023-11-23', activity: '疫苗接種 - 新城疫' },
    { date: '2023-11-22', activity: '出售 50 隻雞' },
  ];

  const quickActions = [
    { title: '添加日常記錄', icon: <CalendarOutlined />, link: '/daily-record' },
    { title: '雞隻管理', icon: <TeamOutlined />, link: '/chicken-management' },
    { title: '飼料管理', icon: <ShoppingCartOutlined />, link: '/feed-management' },
    { title: '用藥與疫苗', icon: <MedicineBoxOutlined />, link: '/medicine-vaccine' },
  ];

  return (
    <div>
      <Title level={2}>儀表板</Title>
      
      {/* 統計卡片 */}
      <div className="card-container">
        <Card>
          <Statistic 
            title="總雞隻數量" 
            value={stats.totalChickens} 
            prefix={<TeamOutlined />} 
            suffix="隻" 
          />
        </Card>
        <Card>
          <Statistic 
            title="飼料庫存" 
            value={stats.feedStock} 
            prefix={<ShoppingCartOutlined />} 
            suffix="kg" 
          />
        </Card>
        <Card>
          <Statistic 
            title="藥品庫存" 
            value={stats.medicineStock} 
            prefix={<MedicineBoxOutlined />} 
            suffix="種" 
          />
        </Card>
        <Card>
          <Statistic 
            title="近期死亡數" 
            value={stats.recentDeaths} 
            prefix={<WarningOutlined style={{ color: '#ff4d4f' }} />} 
            suffix="隻" 
            valueStyle={{ color: stats.recentDeaths > 5 ? '#ff4d4f' : 'inherit' }}
          />
        </Card>
      </div>

      <Row gutter={16}>
        {/* 快速操作 */}
        <Col xs={24} lg={12}>
          <Card title="快速操作" style={{ marginBottom: 16 }}>
            <div className="quick-action-buttons">
              {quickActions.map((action, index) => (
                <Button 
                  key={index} 
                  type="primary" 
                  icon={action.icon}
                  size="large"
                >
                  <Link to={action.link}>{action.title}</Link>
                </Button>
              ))}
            </div>
          </Card>
        </Col>

        {/* 最近活動 */}
        <Col xs={24} lg={12}>
          <Card title="最近活動" style={{ marginBottom: 16 }}>
            <List
              size="small"
              dataSource={recentActivities}
              renderItem={(item) => (
                <List.Item>
                  <Typography.Text type="secondary">{item.date}</Typography.Text> - {item.activity}
                </List.Item>
              )}
              footer={
                <div style={{ textAlign: 'center' }}>
                  <Button type="link" icon={<PlusOutlined />}>查看更多</Button>
                </div>
              }
            />
          </Card>
        </Col>
      </Row>

      {/* 健康狀況摘要 */}
      <Card title="健康狀況摘要" className="summary-card">
        <Row gutter={16}>
          <Col span={12}>
            <Statistic title="平均健康狀況" value={stats.averageHealth} />
          </Col>
          <Col span={12}>
            <Statistic title="最後記錄日期" value={stats.lastRecordDate} />
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default Dashboard;