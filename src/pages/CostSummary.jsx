import React, { useState, useEffect } from 'react';
import { 
  Typography, Card, Row, Col, Statistic, Table, DatePicker,
  Button, Tabs, Divider, Select, message
} from 'antd';
import { 
  DollarOutlined, ShoppingCartOutlined, MedicineBoxOutlined,
  TeamOutlined, BarChartOutlined, DownloadOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title } = Typography;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;
const { Option } = Select;

const CostSummary = () => {
  // 模擬數據 - 實際應用中應從數據存儲中獲取
  const [dateRange, setDateRange] = useState([dayjs().subtract(30, 'day'), dayjs()]);
  const [timeUnit, setTimeUnit] = useState('month');
  
  // 模擬成本數據
  const costData = {
    chicken: 25000, // 雞苗成本
    feed: 35000,    // 飼料成本
    medicine: 8000, // 藥品疫苗成本
    labor: 20000,   // 人工成本
    utilities: 5000, // 水電成本
    other: 3000,    // 其他成本
  };
  
  // 模擬收入數據
  const incomeData = {
    sales: 120000,  // 雞隻銷售
    other: 5000,    // 其他收入
  };
  
  // 計算總成本
  const totalCost = Object.values(costData).reduce((sum, cost) => sum + cost, 0);
  
  // 計算總收入
  const totalIncome = Object.values(incomeData).reduce((sum, income) => sum + income, 0);
  
  // 計算利潤
  const profit = totalIncome - totalCost;
  
  // 成本明細表格數據
  const costDetailColumns = [
    {
      title: '成本類別',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: '金額 (NT$)',
      dataIndex: 'amount',
      key: 'amount',
      render: (text) => `NT$ ${text.toLocaleString()}`,
    },
    {
      title: '佔比',
      dataIndex: 'percentage',
      key: 'percentage',
      render: (text) => `${text}%`,
    },
  ];
  
  const costDetailData = [
    {
      key: '1',
      category: '雞苗成本',
      amount: costData.chicken,
      percentage: ((costData.chicken / totalCost) * 100).toFixed(1),
    },
    {
      key: '2',
      category: '飼料成本',
      amount: costData.feed,
      percentage: ((costData.feed / totalCost) * 100).toFixed(1),
    },
    {
      key: '3',
      category: '藥品疫苗成本',
      amount: costData.medicine,
      percentage: ((costData.medicine / totalCost) * 100).toFixed(1),
    },
    {
      key: '4',
      category: '人工成本',
      amount: costData.labor,
      percentage: ((costData.labor / totalCost) * 100).toFixed(1),
    },
    {
      key: '5',
      category: '水電成本',
      amount: costData.utilities,
      percentage: ((costData.utilities / totalCost) * 100).toFixed(1),
    },
    {
      key: '6',
      category: '其他成本',
      amount: costData.other,
      percentage: ((costData.other / totalCost) * 100).toFixed(1),
    },
  ];
  
  // 收入明細表格數據
  const incomeDetailColumns = [
    {
      title: '收入類別',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: '金額 (NT$)',
      dataIndex: 'amount',
      key: 'amount',
      render: (text) => `NT$ ${text.toLocaleString()}`,
    },
    {
      title: '佔比',
      dataIndex: 'percentage',
      key: 'percentage',
      render: (text) => `${text}%`,
    },
  ];
  
  const incomeDetailData = [
    {
      key: '1',
      category: '雞隻銷售',
      amount: incomeData.sales,
      percentage: ((incomeData.sales / totalIncome) * 100).toFixed(1),
    },
    {
      key: '2',
      category: '其他收入',
      amount: incomeData.other,
      percentage: ((incomeData.other / totalIncome) * 100).toFixed(1),
    },
  ];
  
  // 模擬月度數據
  const monthlyData = [
    {
      key: '1',
      month: '2023-06',
      income: 95000,
      cost: 75000,
      profit: 20000,
    },
    {
      key: '2',
      month: '2023-07',
      income: 105000,
      cost: 80000,
      profit: 25000,
    },
    {
      key: '3',
      month: '2023-08',
      income: 110000,
      cost: 82000,
      profit: 28000,
    },
    {
      key: '4',
      month: '2023-09',
      income: 115000,
      cost: 85000,
      profit: 30000,
    },
    {
      key: '5',
      month: '2023-10',
      income: 118000,
      cost: 88000,
      profit: 30000,
    },
    {
      key: '6',
      month: '2023-11',
      income: 125000,
      cost: 90000,
      profit: 35000,
    },
  ];
  
  const monthlyColumns = [
    {
      title: '月份',
      dataIndex: 'month',
      key: 'month',
    },
    {
      title: '收入 (NT$)',
      dataIndex: 'income',
      key: 'income',
      render: (text) => `NT$ ${text.toLocaleString()}`,
    },
    {
      title: '成本 (NT$)',
      dataIndex: 'cost',
      key: 'cost',
      render: (text) => `NT$ ${text.toLocaleString()}`,
    },
    {
      title: '利潤 (NT$)',
      dataIndex: 'profit',
      key: 'profit',
      render: (text) => `NT$ ${text.toLocaleString()}`,
    },
    {
      title: '利潤率',
      key: 'profitRate',
      render: (_, record) => `${((record.profit / record.income) * 100).toFixed(1)}%`,
    },
  ];
  
  // 處理日期範圍變更
  const handleDateRangeChange = (dates) => {
    if (dates) {
      setDateRange(dates);
    }
  };
  
  // 處理時間單位變更
  const handleTimeUnitChange = (value) => {
    setTimeUnit(value);
  };
  
  // 處理導出報表
  const handleExportReport = () => {
    message.success('報表導出功能開發中');
  };
  
  return (
    <div>
      <Title level={2}>成本彙總</Title>
      
      {/* 篩選條件 */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16} align="middle">
          <Col xs={24} sm={12} md={8} lg={6}>
            <div style={{ marginBottom: 16 }}>
              <span style={{ marginRight: 8 }}>時間範圍:</span>
              <RangePicker 
                value={dateRange} 
                onChange={handleDateRangeChange} 
                style={{ width: '100%' }}
              />
            </div>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <div style={{ marginBottom: 16 }}>
              <span style={{ marginRight: 8 }}>時間單位:</span>
              <Select 
                value={timeUnit} 
                onChange={handleTimeUnitChange}
                style={{ width: 120 }}
              >
                <Option value="day">日</Option>
                <Option value="week">週</Option>
                <Option value="month">月</Option>
                <Option value="quarter">季</Option>
                <Option value="year">年</Option>
              </Select>
            </div>
          </Col>
          <Col xs={24} sm={24} md={8} lg={6}>
            <Button 
              type="primary" 
              icon={<DownloadOutlined />}
              onClick={handleExportReport}
            >
              導出報表
            </Button>
          </Col>
        </Row>
      </Card>
      
      {/* 統計卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic 
              title="總收入" 
              value={totalIncome} 
              prefix={<DollarOutlined />} 
              suffix="NT$" 
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic 
              title="總成本" 
              value={totalCost} 
              prefix={<ShoppingCartOutlined />} 
              suffix="NT$" 
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic 
              title="淨利潤" 
              value={profit} 
              prefix={<BarChartOutlined />} 
              suffix="NT$" 
              valueStyle={{ color: profit >= 0 ? '#3f8600' : '#cf1322' }}
            />
          </Card>
        </Col>
      </Row>
      
      <Tabs defaultActiveKey="1">
        <TabPane tab="成本分析" key="1">
          <Card title="成本明細" className="data-table">
            <Table 
              columns={costDetailColumns} 
              dataSource={costDetailData} 
              pagination={false}
            />
          </Card>
          
          <Divider />
          
          <Card title="成本趨勢" className="data-table">
            <Table 
              columns={monthlyColumns} 
              dataSource={monthlyData} 
              pagination={false}
            />
          </Card>
        </TabPane>
        
        <TabPane tab="收入分析" key="2">
          <Card title="收入明細" className="data-table">
            <Table 
              columns={incomeDetailColumns} 
              dataSource={incomeDetailData} 
              pagination={false}
            />
          </Card>
          
          <Divider />
          
          <Card title="收入趨勢" className="data-table">
            <Table 
              columns={monthlyColumns} 
              dataSource={monthlyData} 
              pagination={false}
            />
          </Card>
        </TabPane>
        
        <TabPane tab="利潤分析" key="3">
          <Card title="利潤趨勢" className="data-table">
            <Table 
              columns={monthlyColumns} 
              dataSource={monthlyData} 
              pagination={false}
            />
          </Card>
          
          <Divider />
          
          <Card title="利潤率分析">
            <Row gutter={16}>
              <Col span={24}>
                <div style={{ marginBottom: 16 }}>
                  <Statistic 
                    title="平均利潤率" 
                    value={((profit / totalIncome) * 100).toFixed(1)} 
                    suffix="%" 
                    precision={1}
                    valueStyle={{ color: '#3f8600' }}
                  />
                </div>
              </Col>
            </Row>
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default CostSummary;