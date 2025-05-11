import React, { useState, useEffect } from 'react';
import { 
  Typography, Form, DatePicker, Button, Input, Select, 
  Card, Row, Col, Table, Tabs, InputNumber, message,
  Statistic, Divider
} from 'antd';
import { 
  PlusOutlined, SaveOutlined, ShoppingOutlined,
  DollarOutlined, TeamOutlined
} from '@ant-design/icons';
import EditableButtonGroup from '../components/EditableButtonGroup';
import dayjs from 'dayjs';
import { saveToStorage, getFromStorage, STORAGE_KEYS } from '../utils/storage';

const { Title } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

const SalesManagement = () => {
  const [salesForm] = Form.useForm();
  const [cullingForm] = Form.useForm();
  const [salesRecords, setSalesRecords] = useState(getFromStorage(STORAGE_KEYS.SALES_RECORDS, []));
  const [cullingRecords, setCullingRecords] = useState(getFromStorage(STORAGE_KEYS.CULLING_RECORDS, []));
  
  // 自動設置當前日期
  const currentDate = dayjs();
  
  // 從localStorage獲取客戶選項，或使用默認值
  const [customers, setCustomers] = useState(
    getFromStorage(STORAGE_KEYS.SALES_CUSTOMERS, [
      { id: 1, label: '農友市場', value: '農友市場' },
      { id: 2, label: '吉祥超市', value: '吉祥超市' },
      { id: 3, label: '永豐餐廳', value: '永豐餐廳' },
      { id: 4, label: '個人客戶', value: '個人客戶' },
      { id: 5, label: '其他', value: '其他' }
    ])
  );
  
  // 從localStorage獲取淘汰原因選項，或使用默認值
  const [cullingReasons, setCullingReasons] = useState(
    getFromStorage(STORAGE_KEYS.CULLING_REASONS, [
      { id: 1, label: '生長不良', value: '生長不良' },
      { id: 2, label: '疾病', value: '疾病' },
      { id: 3, label: '年齡', value: '年齡' },
      { id: 4, label: '產能下降', value: '產能下降' },
      { id: 5, label: '其他', value: '其他' }
    ])
  );
  
  // 預設批次選項 (從雞隻管理中獲取)
  const batchOptions = [
    { label: 'B20231125', value: 'B20231125' },
    { label: 'B20231110', value: 'B20231110' },
    { label: 'B20231001', value: 'B20231001' }
  ];
  
  // 初始化出售表單數據
  const initSalesForm = () => {
    salesForm.setFieldsValue({
      saleDate: currentDate,
      quantity: 10,
      unitPrice: 200,
      customer: '農友市場',
      chickenBatch: batchOptions.length > 0 ? batchOptions[0].value : '',
    });
  };
  
  // 初始化淘汰表單數據
  const initCullingForm = () => {
    cullingForm.setFieldsValue({
      cullingDate: currentDate,
      quantity: 5,
      reason: '生長不良',
      chickenBatch: batchOptions.length > 0 ? batchOptions[0].value : '',
    });
  };
  
  // 組件加載時初始化表單
  React.useEffect(() => {
    initSalesForm();
    initCullingForm();
  }, []);
  
  // 處理出售表單提交
  const handleSalesSubmit = (values) => {
    const newRecord = {
      ...values,
      saleDate: values.saleDate.format('YYYY-MM-DD'),
      totalAmount: values.quantity * values.unitPrice,
      id: Date.now(),
    };
    
    // 保存到本地存儲
    const updatedRecords = [newRecord, ...salesRecords];
    setSalesRecords(updatedRecords);
    saveToStorage(STORAGE_KEYS.SALES_RECORDS, updatedRecords);
    message.success('出售記錄已保存');
    
    // 重置表單為當前時間和預設值
    initSalesForm();
  };
  
  // 處理淘汰表單提交
  const handleCullingSubmit = (values) => {
    const newRecord = {
      ...values,
      cullingDate: values.cullingDate.format('YYYY-MM-DD'),
      id: Date.now(),
    };
    
    // 保存到本地存儲
    const updatedRecords = [newRecord, ...cullingRecords];
    setCullingRecords(updatedRecords);
    saveToStorage(STORAGE_KEYS.CULLING_RECORDS, updatedRecords);
    message.success('淘汰記錄已保存');
    
    // 重置表單為當前時間和預設值
    initCullingForm();
  };
  
  // 設置客戶快捷按鈕
  const handleCustomerSelect = (customer) => {
    salesForm.setFieldsValue({ customer });
  };
  
  // 設置淘汰原因快捷按鈕
  const handleReasonSelect = (reason) => {
    cullingForm.setFieldsValue({ reason });
  };
  
  // 處理客戶選項變更
  const handleCustomersChange = (updatedCustomers) => {
    setCustomers(updatedCustomers);
    saveToStorage(STORAGE_KEYS.SALES_CUSTOMERS, updatedCustomers);
  };
  
  // 處理淘汰原因選項變更
  const handleCullingReasonsChange = (updatedReasons) => {
    setCullingReasons(updatedReasons);
    saveToStorage(STORAGE_KEYS.CULLING_REASONS, updatedReasons);
  };
  
  // 出售記錄表格列定義
  const salesColumns = [
    {
      title: '出售日期',
      dataIndex: 'saleDate',
      key: 'saleDate',
    },
    {
      title: '雞隻批次',
      dataIndex: 'chickenBatch',
      key: 'chickenBatch',
    },
    {
      title: '數量',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (text) => `${text} 隻`,
    },
    {
      title: '單價',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      render: (text) => `NT$ ${text}`,
    },
    {
      title: '總金額',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (text) => `NT$ ${text}`,
    },
    {
      title: '客戶',
      dataIndex: 'customer',
      key: 'customer',
    },
    {
      title: '備註',
      dataIndex: 'notes',
      key: 'notes',
      ellipsis: true,
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Button type="link" onClick={() => message.info('查看詳情功能開發中')}>查看詳情</Button>
      ),
    },
  ];
  
  // 淘汰記錄表格列定義
  const cullingColumns = [
    {
      title: '淘汰日期',
      dataIndex: 'cullingDate',
      key: 'cullingDate',
    },
    {
      title: '雞隻批次',
      dataIndex: 'chickenBatch',
      key: 'chickenBatch',
    },
    {
      title: '數量',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (text) => `${text} 隻`,
    },
    {
      title: '原因',
      dataIndex: 'reason',
      key: 'reason',
    },
    {
      title: '備註',
      dataIndex: 'notes',
      key: 'notes',
      ellipsis: true,
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Button type="link" onClick={() => message.info('查看詳情功能開發中')}>查看詳情</Button>
      ),
    },
  ];
  
  // 計算總銷售額
  const totalSales = salesRecords.reduce((sum, record) => sum + record.totalAmount, 0);
  
  // 計算總出售數量
  const totalSoldQuantity = salesRecords.reduce((sum, record) => sum + record.quantity, 0);
  
  // 計算總淘汰數量
  const totalCulledQuantity = cullingRecords.reduce((sum, record) => sum + record.quantity, 0);
  
  return (
    <div>
      <Title level={2}>出售/淘汰管理</Title>
      
      {/* 統計卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic 
              title="總銷售額" 
              value={totalSales} 
              prefix={<DollarOutlined />} 
              suffix="NT$" 
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic 
              title="總出售數量" 
              value={totalSoldQuantity} 
              prefix={<ShoppingOutlined />} 
              suffix="隻" 
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic 
              title="總淘汰數量" 
              value={totalCulledQuantity} 
              prefix={<TeamOutlined />} 
              suffix="隻" 
            />
          </Card>
        </Col>
      </Row>
      
      <Tabs defaultActiveKey="1">
        <TabPane tab="出售記錄" key="1">
          <Card title="新增出售記錄" className="data-entry-form">
            <Form
              form={salesForm}
              layout="vertical"
              onFinish={handleSalesSubmit}
              initialValues={{
                saleDate: currentDate,
                quantity: 10,
                unitPrice: 200,
                customer: '農友市場',
                chickenBatch: batchOptions.length > 0 ? batchOptions[0].value : '',
              }}
            >
              <Row gutter={16}>
                <Col xs={24} sm={12} md={6}>
                  <Form.Item name="saleDate" label="出售日期" rules={[{ required: true }]}>
                    <DatePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Form.Item name="chickenBatch" label="雞隻批次" rules={[{ required: true }]}>
                    <Select>
                      {batchOptions.map(option => (
                        <Option key={option.value} value={option.value}>
                          {option.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              
              <Divider orientation="left">出售資訊</Divider>
              
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item name="quantity" label="數量" rules={[{ required: true }]}>
                    <InputNumber min={1} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                
                <Col xs={24} sm={12}>
                  <Form.Item name="unitPrice" label="單價 (NT$)" rules={[{ required: true }]}>
                    <InputNumber min={0} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>
              
              <Divider orientation="left">客戶資訊</Divider>
              
              <Row gutter={16}>
                <Col span={24}>
                  <EditableButtonGroup
                    buttons={customers}
                    onSelect={handleCustomerSelect}
                    onChange={handleCustomersChange}
                    selectedValue={salesForm.getFieldValue('customer')}
                    title="客戶選擇"
                  />
                </Col>
                
                <Col xs={24} sm={12}>
                  <Form.Item name="customer" label="客戶" rules={[{ required: true }]}>
                    <Select>
                      {customers.map(option => (
                        <Option key={option.value} value={option.value}>
                          {option.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item name="notes" label="備註">
                    <Input.TextArea rows={3} placeholder="輸入任何關於此次出售的備註..." />
                  </Form.Item>
                </Col>
              </Row>
              
              <Form.Item>
                <Button type="primary" htmlType="submit" icon={<SaveOutlined />} size="large">
                  保存記錄
                </Button>
              </Form.Item>
            </Form>
          </Card>
          
          <Card title="出售歷史記錄" style={{ marginTop: 16 }}>
            <Table 
              columns={salesColumns} 
              dataSource={salesRecords} 
              rowKey="id" 
              pagination={{ pageSize: 5 }}
              className="data-table"
            />
          </Card>
        </TabPane>
        
        <TabPane tab="淘汰記錄" key="2">
          <Card title="新增淘汰記錄" className="data-entry-form">
            <Form
              form={cullingForm}
              layout="vertical"
              onFinish={handleCullingSubmit}
              initialValues={{
                cullingDate: currentDate,
                quantity: 5,
                reason: '生長不良',
                chickenBatch: batchOptions.length > 0 ? batchOptions[0].value : '',
              }}
            >
              <Row gutter={16}>
                <Col xs={24} sm={12} md={6}>
                  <Form.Item name="cullingDate" label="淘汰日期" rules={[{ required: true }]}>
                    <DatePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Form.Item name="chickenBatch" label="雞隻批次" rules={[{ required: true }]}>
                    <Select>
                      {batchOptions.map(option => (
                        <Option key={option.value} value={option.value}>
                          {option.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Form.Item name="quantity" label="數量" rules={[{ required: true }]}>
                    <InputNumber min={1} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>
              
              <Divider orientation="left">淘汰原因</Divider>
              
              <Row gutter={16}>
                <Col span={24}>
                  <EditableButtonGroup
                    buttons={cullingReasons}
                    onSelect={handleReasonSelect}
                    onChange={handleCullingReasonsChange}
                    selectedValue={cullingForm.getFieldValue('reason')}
                    title="淘汰原因選擇"
                  />
                </Col>
                
                <Col xs={24} sm={12}>
                  <Form.Item name="reason" label="淘汰原因" rules={[{ required: true }]}>
                    <Select>
                      {cullingReasons.map(option => (
                        <Option key={option.value} value={option.value}>
                          {option.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item name="notes" label="備註">
                    <Input.TextArea rows={3} placeholder="輸入任何關於淘汰原因的詳細說明..." />
                  </Form.Item>
                </Col>
              </Row>
              
              <Form.Item>
                <Button type="primary" htmlType="submit" icon={<SaveOutlined />} size="large">
                  保存記錄
                </Button>
              </Form.Item>
            </Form>
          </Card>
          
          <Card title="淘汰記錄歷史" style={{ marginTop: 16 }}>
            <Table 
              columns={cullingColumns} 
              dataSource={cullingRecords} 
              rowKey="id" 
              pagination={{ pageSize: 5 }}
              className="data-table"
            />
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default SalesManagement;