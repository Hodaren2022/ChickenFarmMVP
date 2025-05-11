import React, { useState, useEffect } from 'react';
import { 
  Typography, Form, DatePicker, Button, Input, Select, 
  Card, Row, Col, Upload, message, Radio, Divider, Table,
  Spin, Switch, Tooltip, Modal
} from 'antd';
import { 
  CloudOutlined, SunOutlined, CloudDownloadOutlined, 
  ThunderboltOutlined, UploadOutlined, CheckCircleOutlined,
  WarningOutlined, CloseCircleOutlined, SaveOutlined,
  PlusOutlined, EnvironmentOutlined, ReloadOutlined,
  EditOutlined, UserAddOutlined, UserOutlined
} from '@ant-design/icons';
import EditableButtonGroup from '../components/EditableButtonGroup';
import dayjs from 'dayjs';
import { saveToStorage, getFromStorage, STORAGE_KEYS } from '../utils/storage';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const DailyRecord = () => {
  const [form] = Form.useForm();
  const [customerForm] = Form.useForm();
  const [records, setRecords] = useState(getFromStorage(STORAGE_KEYS.DAILY_RECORDS, []));
  const [location, setLocation] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [autoWeather, setAutoWeather] = useState(true);
  const [weatherError, setWeatherError] = useState('');
  
  // 客戶資訊相關狀態，從localStorage獲取或使用默認值
  const [customers, setCustomers] = useState(
    getFromStorage(STORAGE_KEYS.CUSTOMERS, [
      { id: 1, name: '農友市場', type: '市場', contact: '0912-345-678', address: '台北市中正區' },
      { id: 2, name: '吉祥超市', type: '超市', contact: '0923-456-789', address: '新北市板橋區' },
      { id: 3, name: '永豐餐廳', type: '餐廳', contact: '0934-567-890', address: '台北市信義區' },
      { id: 4, name: '個人客戶', type: '個人', contact: '0945-678-901', address: '台北市大安區' },
      { id: 5, name: '其他', type: '其他', contact: '', address: '' }
    ])
  );
  const [isCustomerModalVisible, setIsCustomerModalVisible] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(getFromStorage(STORAGE_KEYS.SELECTED_CUSTOMER, null));
  
  // 自動設置當前日期和時間
  const currentDate = dayjs();
  
  // 預設天氣選項，從localStorage獲取或使用默認值
  const [weatherOptions, setWeatherOptions] = useState(
    getFromStorage(STORAGE_KEYS.WEATHER_OPTIONS, [
      { id: 1, label: '晴天', value: '晴天', icon: <SunOutlined /> },
      { id: 2, label: '多雲', value: '多雲', icon: <CloudOutlined /> },
      { id: 3, label: '雨天', value: '雨天', icon: <CloudDownloadOutlined /> },
      { id: 4, label: '雷雨', value: '雷雨', icon: <ThunderboltOutlined /> }
    ])
  );
  
  // 預設健康狀況選項，從localStorage獲取或使用默認值
  const [healthOptions, setHealthOptions] = useState(
    getFromStorage(STORAGE_KEYS.HEALTH_OPTIONS, [
      { id: 1, label: '良好', value: '良好', icon: <CheckCircleOutlined style={{ color: '#52c41a' }} /> },
      { id: 2, label: '一般', value: '一般', icon: <WarningOutlined style={{ color: '#faad14' }} /> },
      { id: 3, label: '不佳', value: '不佳', icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} /> }
    ])
  );
  
  // 預設環境安全選項，從localStorage獲取或使用默認值
  const [environmentOptions, setEnvironmentOptions] = useState(
    getFromStorage(STORAGE_KEYS.ENVIRONMENT_OPTIONS, [
      { id: 1, label: '正常', value: '正常' },
      { id: 2, label: '需要清潔', value: '需要清潔' },
      { id: 3, label: '需要消毒', value: '需要消毒' },
      { id: 4, label: '需要修繕', value: '需要修繕' }
    ])
  );
  
  // 客戶類型選項
  const customerTypes = [
    { label: '市場', value: '市場' },
    { label: '超市', value: '超市' },
    { label: '餐廳', value: '餐廳' },
    { label: '個人', value: '個人' },
    { label: '其他', value: '其他' }
  ];
  
  // 初始化表單數據
  const initFormData = () => {
    form.setFieldsValue({
      recordDate: currentDate,
      recordTime: currentDate,
      weather: '晴天',
      temperature: '25',
      humidity: '60',
      healthStatus: '良好',
      environmentStatus: '正常',
      customer: selectedCustomer ? selectedCustomer.name : '',
    });
  };
  
  // 獲取用戶地理位置
  const getUserLocation = () => {
    setLoading(true);
    setWeatherError('');
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          fetchWeatherData(latitude, longitude);
        },
        (error) => {
          console.error('獲取位置失敗:', error);
          setWeatherError('無法獲取您的位置，請檢查位置權限設置');
          setLoading(false);
          message.error('無法獲取您的位置，請檢查位置權限設置');
        }
      );
    } else {
      setWeatherError('您的瀏覽器不支持地理位置功能');
      setLoading(false);
      message.error('您的瀏覽器不支持地理位置功能');
    }
  };
  
  // 從OpenWeatherMap API獲取天氣數據
  const fetchWeatherData = async (latitude, longitude) => {
    try {
      // 這裡應該使用您自己的API密鑰
      const apiKey = '4d8fb5b93d4af21d66a2948710284366'; // 請替換為您自己的OpenWeatherMap API密鑰
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`
      );
      
      if (!response.ok) {
        throw new Error('天氣數據獲取失敗');
      }
      
      const data = await response.json();
      setWeatherData(data);
      
      // 如果啟用了自動天氣，則更新表單
      if (autoWeather) {
        updateFormWithWeatherData(data);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('獲取天氣數據失敗:', error);
      setWeatherError('獲取天氣數據失敗，請稍後再試');
      setLoading(false);
      message.error('獲取天氣數據失敗，請稍後再試');
    }
  };
  
  // 根據天氣數據更新表單
  const updateFormWithWeatherData = (data) => {
    if (!data) return;
    
    // 設置溫度和濕度
    form.setFieldsValue({
      temperature: Math.round(data.main.temp).toString(),
      humidity: data.main.humidity.toString()
    });
    
    // 根據天氣狀況設置天氣選項
    const weatherCondition = data.weather[0].main.toLowerCase();
    let weatherValue = '晴天'; // 默認值
    
    if (weatherCondition.includes('cloud')) {
      weatherValue = '多雲';
    } else if (weatherCondition.includes('rain')) {
      weatherValue = '雨天';
    } else if (weatherCondition.includes('thunderstorm')) {
      weatherValue = '雷雨';
    } else if (weatherCondition.includes('clear')) {
      weatherValue = '晴天';
    }
    
    form.setFieldsValue({ weather: weatherValue });
  };
  
  // 處理自動天氣開關變更
  const handleAutoWeatherChange = (checked) => {
    setAutoWeather(checked);
    if (checked && weatherData) {
      updateFormWithWeatherData(weatherData);
    }
  };
  
  // 組件加載時初始化表單並獲取位置
  useEffect(() => {
    initFormData();
    if (autoWeather) {
      getUserLocation();
    }
  }, []);
  
  // 處理表單提交
  const handleSubmit = (values) => {
    const newRecord = {
      ...values,
      recordDate: values.recordDate.format('YYYY-MM-DD'),
      recordTime: values.recordTime.format('HH:mm'),
      id: Date.now(), // 使用時間戳作為臨時ID
    };
    
    // 更新記錄並保存到localStorage
    const updatedRecords = [newRecord, ...records];
    setRecords(updatedRecords);
    saveToStorage(STORAGE_KEYS.DAILY_RECORDS, updatedRecords);
    
    message.success('記錄已保存');
    
    // 重置表單為當前時間和預設值
    initFormData();
  };
  
  // 打開客戶編輯模態框
  const showCustomerModal = (customer = null) => {
    setEditingCustomer(customer);
    customerForm.resetFields();
    
    if (customer) {
      customerForm.setFieldsValue({
        name: customer.name,
        type: customer.type,
        contact: customer.contact,
        address: customer.address
      });
    }
    
    setIsCustomerModalVisible(true);
  };
  
  // 處理客戶表單提交
  const handleCustomerSubmit = () => {
    customerForm.validateFields().then(values => {
      let updatedCustomers;
      
      if (editingCustomer) {
        // 更新現有客戶
        updatedCustomers = customers.map(item => 
          item.id === editingCustomer.id ? { ...item, ...values } : item
        );
        message.success('客戶資訊已更新');
      } else {
        // 添加新客戶
        const newCustomer = {
          ...values,
          id: Date.now()
        };
        updatedCustomers = [...customers, newCustomer];
        message.success('新客戶已添加');
      }
      
      // 更新狀態並保存到localStorage
      setCustomers(updatedCustomers);
      saveToStorage(STORAGE_KEYS.CUSTOMERS, updatedCustomers);
      
      setIsCustomerModalVisible(false);
    }).catch(error => {
      console.error('表單驗證失敗:', error);
    });
  };
  
  // 處理客戶選擇
  const handleCustomerSelect = (customerId) => {
    const customer = customers.find(c => c.id === customerId);
    setSelectedCustomer(customer);
    // 保存選中的客戶到localStorage
    saveToStorage(STORAGE_KEYS.SELECTED_CUSTOMER, customer);
    form.setFieldsValue({ customer: customer.name });
  };
  
  // 處理客戶按鈕變更（新增、編輯、刪除、排序）
  const handleCustomersChange = (updatedButtons) => {
    // 將按鈕數據轉換回客戶數據格式
    const updatedCustomers = updatedButtons.map(button => {
      // 查找原始客戶數據以保留完整信息
      const originalCustomer = customers.find(c => c.id === button.value) || {};
      
      return {
        id: button.value,
        name: button.label,
        type: originalCustomer.type || '其他',
        contact: originalCustomer.contact || '',
        address: originalCustomer.address || ''
      };
    });
    
    // 更新狀態並保存到localStorage
    setCustomers(updatedCustomers);
    saveToStorage(STORAGE_KEYS.CUSTOMERS, updatedCustomers);
    message.success('客戶列表已更新');
  };
  
  // 設置天氣快捷按鈕
  const handleWeatherSelect = (weather) => {
    form.setFieldsValue({ weather });
  };
  
  // 設置健康狀況快捷按鈕
  const handleHealthSelect = (healthStatus) => {
    form.setFieldsValue({ healthStatus });
  };
  
  // 設置環境狀況快捷按鈕
  const handleEnvironmentSelect = (environmentStatus) => {
    form.setFieldsValue({ environmentStatus });
  };
  
  // 表格列定義
  const columns = [
    {
      title: '日期',
      dataIndex: 'recordDate',
      key: 'recordDate',
    },
    {
      title: '時間',
      dataIndex: 'recordTime',
      key: 'recordTime',
    },
    {
      title: '天氣',
      dataIndex: 'weather',
      key: 'weather',
    },
    {
      title: '健康狀況',
      dataIndex: 'healthStatus',
      key: 'healthStatus',
    },
    {
      title: '環境狀況',
      dataIndex: 'environmentStatus',
      key: 'environmentStatus',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Button type="link" onClick={() => message.info('查看詳情功能開發中')}>查看詳情</Button>
      ),
    },
  ];
  
  return (
    <div>
      <Title level={2}>日常記錄</Title>
      
      <Card title="客戶資訊" className="customer-info-card" style={{ marginBottom: 16 }}>
        <Row gutter={16} align="middle">
          <Col span={24}>
            <div style={{ marginBottom: 16 }}>
              <EditableButtonGroup
                title="選擇客戶"
                buttons={customers.map(customer => ({
                  id: customer.id,
                  label: customer.name,
                  value: customer.id,
                  icon: <UserOutlined />
                }))}
                onSelect={handleCustomerSelect}
                onChange={handleCustomersChange}
                selectedValue={selectedCustomer?.id}
              />
            </div>
          </Col>
          
          {selectedCustomer && (
            <Col span={24}>
              <Card size="small" title="客戶詳細資訊" extra={(
                <Button 
                  type="link" 
                  icon={<EditOutlined />} 
                  onClick={() => showCustomerModal(selectedCustomer)}
                >
                  編輯
                </Button>
              )}>
                <Row gutter={16}>
                  <Col span={12}>
                    <p><strong>名稱：</strong> {selectedCustomer.name}</p>
                    <p><strong>類型：</strong> {selectedCustomer.type}</p>
                  </Col>
                  <Col span={12}>
                    <p><strong>聯絡方式：</strong> {selectedCustomer.contact}</p>
                    <p><strong>地址：</strong> {selectedCustomer.address}</p>
                  </Col>
                </Row>
              </Card>
            </Col>
          )}
        </Row>
        
        {/* 客戶編輯模態框 */}
        <Modal
          title={editingCustomer ? "編輯客戶資訊" : "新增客戶"}
          open={isCustomerModalVisible}
          onOk={handleCustomerSubmit}
          onCancel={() => setIsCustomerModalVisible(false)}
          destroyOnClose={true}
        >
          <Form
            form={customerForm}
            layout="vertical"
          >
            <Form.Item
              name="name"
              label="客戶名稱"
              rules={[{ required: true, message: '請輸入客戶名稱' }]}
            >
              <Input placeholder="請輸入客戶名稱" />
            </Form.Item>
            
            <Form.Item
              name="type"
              label="客戶類型"
              rules={[{ required: true, message: '請選擇客戶類型' }]}
            >
              <Select placeholder="請選擇客戶類型">
                {customerTypes.map(option => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            
            <Form.Item
              name="contact"
              label="聯絡方式"
            >
              <Input placeholder="請輸入聯絡方式" />
            </Form.Item>
            
            <Form.Item
              name="address"
              label="地址"
            >
              <Input placeholder="請輸入地址" />
            </Form.Item>
          </Form>
        </Modal>
      </Card>
      
      <Card title="新增日常記錄" className="data-entry-form">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            recordDate: currentDate,
            recordTime: currentDate,
            weather: '晴天',
            temperature: '25',
            humidity: '60',
            healthStatus: '良好',
            environmentStatus: '正常',
            customer: '',
          }}
        >
          <Row gutter={16}>
            <Col xs={24} sm={12} md={6}>
              <Form.Item name="recordDate" label="日期" rules={[{ required: true }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item name="recordTime" label="時間" rules={[{ required: true }]}>
                <DatePicker picker="time" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item name="customer" label="客戶" rules={[{ required: true, message: '請選擇客戶' }]}>
                <Input disabled placeholder="請先在客戶資訊區塊選擇客戶" />
              </Form.Item>
            </Col>
          </Row>
          
          <Divider orientation="left">
            <span style={{ marginRight: '10px' }}>天氣狀況</span>
            <Tooltip title={autoWeather ? '自動獲取天氣數據已開啟' : '自動獲取天氣數據已關閉'}>
              <Switch 
                checkedChildren="自動" 
                unCheckedChildren="手動" 
                checked={autoWeather} 
                onChange={handleAutoWeatherChange} 
                style={{ marginRight: '10px' }}
              />
            </Tooltip>
            <Tooltip title="重新獲取天氣數據">
              <Button 
                icon={<ReloadOutlined />} 
                size="small" 
                onClick={getUserLocation} 
                loading={loading}
                disabled={!autoWeather}
              />
            </Tooltip>
          </Divider>
          
          {loading ? (
            <Row gutter={16} style={{ marginBottom: '20px' }}>
              <Col span={24} style={{ textAlign: 'center' }}>
                <Spin tip="正在獲取天氣數據..." />
              </Col>
            </Row>
          ) : weatherError ? (
            <Row gutter={16} style={{ marginBottom: '20px' }}>
              <Col span={24} style={{ textAlign: 'center', color: '#ff4d4f' }}>
                <WarningOutlined style={{ marginRight: '8px' }} />
                {weatherError}
              </Col>
            </Row>
          ) : weatherData && autoWeather ? (
            <Row gutter={16} style={{ marginBottom: '20px' }}>
              <Col span={24}>
                <Card size="small">
                  <Row gutter={16} align="middle">
                    <Col>
                      <EnvironmentOutlined style={{ marginRight: '8px' }} />
                      {weatherData.name || '未知位置'}
                    </Col>
                    <Col>
                      <img 
                        src={`http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`} 
                        alt="天氣圖標" 
                        style={{ width: '40px', height: '40px' }}
                      />
                      {weatherData.weather[0].description}
                    </Col>
                    <Col>
                      溫度: {Math.round(weatherData.main.temp)}°C
                    </Col>
                    <Col>
                      濕度: {weatherData.main.humidity}%
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          ) : null}
          
          <Row gutter={16}>
            <Col span={24}>
              <EditableButtonGroup
                buttons={weatherOptions}
                onSelect={handleWeatherSelect}
                onChange={(newOptions) => {
                  setWeatherOptions(newOptions);
                  saveToStorage(STORAGE_KEYS.WEATHER_OPTIONS, newOptions);
                }}
                selectedValue={form.getFieldValue('weather')}
                title="天氣選項"
              />
            </Col>
            
            <Col xs={24} sm={12}>
              <Form.Item name="weather" label="天氣" rules={[{ required: true }]}>
                <Select disabled={loading && autoWeather}>
                  {weatherOptions.map(option => (
                    <Option key={option.id} value={option.value}>
                      {option.icon} {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            
            <Col xs={24} sm={6}>
              <Form.Item name="temperature" label="溫度 (°C)">
                <Input suffix="°C" disabled={loading && autoWeather} />
              </Form.Item>
            </Col>
            
            <Col xs={24} sm={6}>
              <Form.Item name="humidity" label="濕度 (%)">
                <Input suffix="%" disabled={loading && autoWeather} />
              </Form.Item>
            </Col>
          </Row>
          
          <Divider orientation="left">健康觀察</Divider>
          
          <Row gutter={16}>
            <Col span={24}>
              <EditableButtonGroup
                buttons={healthOptions}
                onSelect={handleHealthSelect}
                onChange={(newOptions) => {
                  setHealthOptions(newOptions);
                  saveToStorage(STORAGE_KEYS.HEALTH_OPTIONS, newOptions);
                }}
                selectedValue={form.getFieldValue('healthStatus')}
                title="健康狀況選項"
              />
            </Col>
            
            <Col xs={24} sm={12}>
              <Form.Item name="healthStatus" label="整體健康狀況" rules={[{ required: true }]}>
                <Select>
                  {healthOptions.map(option => (
                    <Option key={option.id} value={option.value}>
                      {option.icon} {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            
            <Col xs={24}>
              <Form.Item name="healthNotes" label="健康備註">
                <TextArea rows={3} placeholder="輸入任何關於雞群健康的觀察..." />
              </Form.Item>
            </Col>
          </Row>
          
          <Divider orientation="left">環境與生物安全</Divider>
          
          <Row gutter={16}>
            <Col span={24}>
              <EditableButtonGroup
                buttons={environmentOptions}
                onSelect={handleEnvironmentSelect}
                onChange={(newOptions) => {
                  setEnvironmentOptions(newOptions);
                  saveToStorage(STORAGE_KEYS.ENVIRONMENT_OPTIONS, newOptions);
                }}
                selectedValue={form.getFieldValue('environmentStatus')}
                title="環境狀況選項"
              />
            </Col>
            
            <Col xs={24} sm={12}>
              <Form.Item name="environmentStatus" label="環境狀況" rules={[{ required: true }]}>
                <Select>
                  {environmentOptions.map(option => (
                    <Option key={option.id} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            
            <Col xs={24}>
              <Form.Item name="environmentNotes" label="環境備註">
                <TextArea rows={3} placeholder="輸入任何關於環境和生物安全的觀察..." />
              </Form.Item>
            </Col>
          </Row>
          
          <Divider orientation="left">多媒體附件</Divider>
          
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item name="attachments" label="上傳照片或影片">
                <Upload
                  listType="picture-card"
                  beforeUpload={() => false}
                  multiple
                >
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>上傳</div>
                  </div>
                </Upload>
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
      
      <Card title="歷史記錄" style={{ marginTop: 16 }}>
        <Table 
          columns={columns} 
          dataSource={records} 
          rowKey="id" 
          pagination={{ pageSize: 5 }}
          className="data-table"
        />
      </Card>
    </div>
  );
};

export default DailyRecord;