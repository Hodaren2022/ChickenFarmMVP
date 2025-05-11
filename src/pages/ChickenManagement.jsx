import React, { useState, useEffect } from 'react';
import { 
  Typography, Form, DatePicker, Button, Input, Select, 
  Card, Row, Col, Table, Tabs, InputNumber, message,
  Statistic, Divider, Radio, Empty
} from 'antd';
import { 
  PlusOutlined, SaveOutlined, DeleteOutlined,
  WarningOutlined, TeamOutlined, LineChartOutlined
} from '@ant-design/icons';
import EditableButtonGroup from '../components/EditableButtonGroup';
import dayjs from 'dayjs';
import { saveToStorage, getFromStorage, STORAGE_KEYS } from '../utils/storage';

const { Title } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

const ChickenManagement = () => {
  const [chickenForm] = Form.useForm();
  const [deathForm] = Form.useForm();
  const [chickenRecords, setChickenRecords] = useState(getFromStorage(STORAGE_KEYS.CHICKEN_RECORDS, []));
  const [deathRecords, setDeathRecords] = useState(getFromStorage(STORAGE_KEYS.DEATH_RECORDS, []));
  
  // 自動設置當前日期
  const currentDate = dayjs();
  
  // 預設雞種選項，從localStorage獲取或使用默認值
  const [chickenBreeds, setChickenBreeds] = useState(
    getFromStorage(STORAGE_KEYS.CHICKEN_BREEDS, [
      { id: 1, label: '黑羽土雞', value: '黑羽土雞' },
      { id: 2, label: '白羽土雞', value: '白羽土雞' },
      { id: 3, label: '紅羽土雞', value: '紅羽土雞' },
      { id: 4, label: '花羽土雞', value: '花羽土雞' },
      { id: 5, label: '其他', value: '其他' }
    ])
  );
  
  // 預設供應商選項，從localStorage獲取或使用默認值
  const [suppliers, setSuppliers] = useState(
    getFromStorage(STORAGE_KEYS.SUPPLIERS, [
      { id: 1, label: '農友畜牧場', value: '農友畜牧場' },
      { id: 2, label: '吉祥雞苗場', value: '吉祥雞苗場' },
      { id: 3, label: '永豐畜牧', value: '永豐畜牧' },
      { id: 4, label: '其他', value: '其他' }
    ])
  );
  
  // 預設死亡原因選項，從localStorage獲取或使用默認值
  const [deathReasons, setDeathReasons] = useState(
    getFromStorage(STORAGE_KEYS.DEATH_REASONS, [
      { id: 1, label: '疾病', value: '疾病' },
      { id: 2, label: '意外', value: '意外' },
      { id: 3, label: '自然死亡', value: '自然死亡' },
      { id: 4, label: '捕食者攻擊', value: '捕食者攻擊' },
      { id: 5, label: '其他', value: '其他' }
    ])
  );
  
  // 處理雞種選項變更
  const handleChickenBreedsChange = (newOptions) => {
    setChickenBreeds(newOptions);
    saveToStorage(STORAGE_KEYS.CHICKEN_BREEDS, newOptions);
  };
  
  // 處理供應商選項變更
  const handleSuppliersChange = (newOptions) => {
    setSuppliers(newOptions);
    saveToStorage(STORAGE_KEYS.SUPPLIERS, newOptions);
  };
  
  // 處理死亡原因選項變更
  const handleDeathReasonsChange = (newOptions) => {
    setDeathReasons(newOptions);
    saveToStorage(STORAGE_KEYS.DEATH_REASONS, newOptions);
  };
  
  // 初始化雞苗表單數據
  const initChickenForm = () => {
    chickenForm.setFieldsValue({
      entryDate: currentDate,
      breed: '黑羽土雞',
      quantity: 100,
      supplier: '農友畜牧場',
      unitPrice: 20,
      batchNumber: `B${dayjs().format('YYYYMMDD')}`,
    });
  };
  
  // 初始化死亡記錄表單數據
  const initDeathForm = () => {
    deathForm.setFieldsValue({
      deathDate: currentDate,
      quantity: 1,
      reason: '疾病',
      batchNumber: chickenRecords.length > 0 ? chickenRecords[0].batchNumber : '',
    });
  };
  
  // 組件加載時初始化表單
  React.useEffect(() => {
    initChickenForm();
    initDeathForm();
  }, []);
  
  // 處理雞苗表單提交
  const handleChickenSubmit = (values) => {
    const newRecord = {
      ...values,
      entryDate: values.entryDate.format('YYYY-MM-DD'),
      totalAmount: values.quantity * values.unitPrice,
      id: Date.now(),
    };
    
    // 更新記錄並保存到localStorage
    const updatedRecords = [newRecord, ...chickenRecords];
    setChickenRecords(updatedRecords);
    saveToStorage(STORAGE_KEYS.CHICKEN_RECORDS, updatedRecords);
    
    message.success('雞苗記錄已保存');
    
    // 重置表單為當前時間和預設值
    initChickenForm();
  };
  
  // 處理死亡記錄表單提交
  const handleDeathSubmit = (values) => {
    const newRecord = {
      ...values,
      deathDate: values.deathDate.format('YYYY-MM-DD'),
      id: Date.now(),
    };
    
    // 更新記錄並保存到localStorage
    const updatedRecords = [newRecord, ...deathRecords];
    setDeathRecords(updatedRecords);
    saveToStorage(STORAGE_KEYS.DEATH_RECORDS, updatedRecords);
    
    message.success('死亡記錄已保存');
    
    // 重置表單為當前時間和預設值
    initDeathForm();
  };
  
  // 設置雞種快捷按鈕
  const handleBreedSelect = (breed) => {
    chickenForm.setFieldsValue({ breed });
  };
  
  // 設置供應商快捷按鈕
  const handleSupplierSelect = (supplier) => {
    chickenForm.setFieldsValue({ supplier });
  };
  
  // 設置死亡原因快捷按鈕
  const handleReasonSelect = (reason) => {
    deathForm.setFieldsValue({ reason });
  };
  
  // 雞苗表格列定義
  const chickenColumns = [
    {
      title: '批次編號',
      dataIndex: 'batchNumber',
      key: 'batchNumber',
    },
    {
      title: '進雞日期',
      dataIndex: 'entryDate',
      key: 'entryDate',
    },
    {
      title: '雞種',
      dataIndex: 'breed',
      key: 'breed',
    },
    {
      title: '數量',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: '供應商',
      dataIndex: 'supplier',
      key: 'supplier',
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
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Button type="link" onClick={() => message.info('查看詳情功能開發中')}>查看詳情</Button>
      ),
    },
  ];
  
  // 死亡記錄表格列定義
  const deathColumns = [
    {
      title: '日期',
      dataIndex: 'deathDate',
      key: 'deathDate',
    },
    {
      title: '批次編號',
      dataIndex: 'batchNumber',
      key: 'batchNumber',
    },
    {
      title: '數量',
      dataIndex: 'quantity',
      key: 'quantity',
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
  
  // 計算總存活雞數
  const totalChickens = chickenRecords.reduce((sum, record) => sum + record.quantity, 0) - 
                        deathRecords.reduce((sum, record) => sum + record.quantity, 0);
                        
  // 計算活雞數量變化的數據
  const [chickenTrendData, setChickenTrendData] = useState([]);
  
  useEffect(() => {
    // 合併所有記錄並按日期排序
    const allRecords = [];
    
    // 添加進雞記錄
    chickenRecords.forEach(record => {
      allRecords.push({
        date: record.entryDate,
        type: 'entry',
        quantity: record.quantity,
      });
    });
    
    // 添加死亡記錄
    deathRecords.forEach(record => {
      allRecords.push({
        date: record.deathDate,
        type: 'death',
        quantity: record.quantity,
      });
    });
    
    // 從銷售管理獲取的出售和淘汰記錄 (如果有的話)
    const salesRecords = getFromStorage(STORAGE_KEYS.SALES_RECORDS, []);
    const cullingRecords = getFromStorage(STORAGE_KEYS.CULLING_RECORDS, []);
    
    // 添加出售記錄
    salesRecords.forEach(record => {
      allRecords.push({
        date: record.saleDate,
        type: 'sale',
        quantity: record.quantity,
      });
    });
    
    // 添加淘汰記錄
    cullingRecords.forEach(record => {
      allRecords.push({
        date: record.cullingDate,
        type: 'culling',
        quantity: record.quantity,
      });
    });
    
    // 按日期排序
    allRecords.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // 計算每個時間點的活雞數量
    let currentCount = 0;
    const trendData = allRecords.map(record => {
      if (record.type === 'entry') {
        currentCount += record.quantity;
      } else {
        currentCount -= record.quantity;
      }
      
      return {
        date: record.date,
        count: currentCount
      };
    });
    
    // 如果沒有記錄，添加一個當前日期的數據點
    if (trendData.length === 0) {
      trendData.push({
        date: dayjs().format('YYYY-MM-DD'),
        count: 0
      });
    }
    
    setChickenTrendData(trendData);
  }, [chickenRecords, deathRecords]);
  
  return (
    <div>
      <Title level={2}>雞隻管理</Title>
      
      {/* 統計卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic 
              title="總進雞數量" 
              value={chickenRecords.reduce((sum, record) => sum + record.quantity, 0)} 
              prefix={<TeamOutlined />} 
              suffix="隻" 
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={8}>
          <Card>
            <Statistic 
              title="總死亡數量" 
              value={deathRecords.reduce((sum, record) => sum + record.quantity, 0)} 
              prefix={<WarningOutlined style={{ color: '#ff4d4f' }} />} 
              suffix="隻" 
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={8}>
          <Card>
            <Statistic 
              title="目前存活數量" 
              value={totalChickens} 
              prefix={<TeamOutlined style={{ color: '#52c41a' }} />} 
              suffix="隻" 
            />
          </Card>
        </Col>
      </Row>
      
      {/* 趨勢圖 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col xs={24}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <LineChartOutlined style={{ marginRight: 8 }} />
                <span>活雞數量趨勢圖</span>
              </div>
            }
          >
            {chickenTrendData.length > 0 ? (
              <div className="chicken-trend-chart" style={{ height: 300, position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
                  <svg width="100%" height="100%" viewBox="0 0 600 300" preserveAspectRatio="none">
                    {/* Y軸 */}
                    <line x1="50" y1="20" x2="50" y2="280" stroke="#ccc" strokeWidth="1" />
                    
                    {/* X軸 */}
                    <line x1="50" y1="280" x2="580" y2="280" stroke="#ccc" strokeWidth="1" />
                        
                        {/* 計算最大值和最小值 */}
                        {(() => {
                          const maxCount = Math.max(...chickenTrendData.map(d => d.count));
                          const minCount = 0; // 最小值設為0
                          const range = maxCount - minCount;
                          
                          // 計算Y軸刻度
                          const yTicks = [];
                          const tickCount = 5;
                          for (let i = 0; i <= tickCount; i++) {
                            const value = Math.round(minCount + (range * i) / tickCount);
                            const y = 280 - ((value - minCount) / (range || 1)) * 260;
                            yTicks.push(
                              <g key={`y-tick-${i}`}>
                                <line x1="45" y1={y} x2="50" y2={y} stroke="#ccc" strokeWidth="1" />
                                <text x="40" y={y + 5} textAnchor="end" fontSize="12" fill="#666">
                                  {value}
                                </text>
                              </g>
                            );
                          }
                          
                          // 計算X軸刻度 (顯示部分日期)
                          const xTicks = [];
                          const dataLength = chickenTrendData.length;
                          const xTickCount = Math.min(5, dataLength);
                          
                          for (let i = 0; i < xTickCount; i++) {
                            const index = Math.floor((dataLength - 1) * (i / ((xTickCount - 1) || 1)));
                            const data = chickenTrendData[index];
                            const x = 50 + (index / ((dataLength - 1) || 1)) * 530;
                            
                            xTicks.push(
                              <g key={`x-tick-${i}`}>
                                <line x1={x} y1="280" x2={x} y2="285" stroke="#ccc" strokeWidth="1" />
                                <text x={x} y="300" textAnchor="middle" fontSize="12" fill="#666">
                                  {data.date}
                                </text>
                              </g>
                            );
                          }
                          
                          // 繪製折線
                          let pathD = '';
                          chickenTrendData.forEach((data, index) => {
                            const x = 50 + (index / ((dataLength - 1) || 1)) * 530;
                            const y = 280 - ((data.count - minCount) / ((range) || 1)) * 260;
                            
                            if (index === 0) {
                              pathD += `M ${x} ${y}`;
                            } else {
                              pathD += ` L ${x} ${y}`;
                            }
                          });
                          
                          // 繪製數據點
                          const dataPoints = chickenTrendData.map((data, index) => {
                            const x = 50 + (index / ((dataLength - 1) || 1)) * 530;
                            const y = 280 - ((data.count - minCount) / ((range) || 1)) * 260;
                            
                            return (
                              <g key={`point-${index}`}>
                                <circle cx={x} cy={y} r="4" fill="#1890ff" />
                                <title>{`日期: ${data.date}, 數量: ${data.count}`}</title>
                              </g>
                            );
                          });
                          
                          return (
                            <>
                              {yTicks}
                              {xTicks}
                              <path d={pathD} fill="none" stroke="#1890ff" strokeWidth="2" />
                              {dataPoints}
                              <text x="20" y="10" fontSize="12" fill="#666">數量 (隻)</text>
                              <text x="580" y="295" fontSize="12" fill="#666">日期</text>
                            </>
                          );
                        })()} 
                      </svg>
                    </div>
                  </div>
                ) : (
                  <Empty description="暫無數據" style={{ margin: '40px 0' }} />
                )}
              </Card>
            </Col>
          </Row>
      
      <Tabs defaultActiveKey="1">
        <TabPane tab="雞苗/進雞記錄" key="1">
          <Card title="新增雞苗/進雞記錄" className="data-entry-form">
            <Form
              form={chickenForm}
              layout="vertical"
              onFinish={handleChickenSubmit}
              initialValues={{
                entryDate: currentDate,
                breed: '黑羽土雞',
                quantity: 100,
                supplier: '農友畜牧場',
                unitPrice: 20,
                batchNumber: `B${dayjs().format('YYYYMMDD')}`,
              }}
            >
              <Row gutter={16}>
                <Col xs={24} sm={12} md={6}>
                  <Form.Item name="entryDate" label="進雞日期" rules={[{ required: true }]}>
                    <DatePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Form.Item name="batchNumber" label="批次編號" rules={[{ required: true }]}>
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              
              <Divider orientation="left">雞種選擇</Divider>
              
              <Row gutter={16}>
                <Col span={24}>
                  <EditableButtonGroup
                    buttons={chickenBreeds}
                    onSelect={handleBreedSelect}
                    onChange={handleChickenBreedsChange}
                    selectedValue={chickenForm.getFieldValue('breed')}
                    title="雞種選項"
                  />
                </Col>
                
                <Col xs={24} sm={12}>
                  <Form.Item name="breed" label="雞種" rules={[{ required: true }]}>
                    <Select>
                      {chickenBreeds.map(option => (
                        <Option key={option.id} value={option.value}>
                          {option.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                
                <Col xs={24} sm={12}>
                  <Form.Item name="quantity" label="數量" rules={[{ required: true }]}>
                    <InputNumber min={1} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>
              
              <Divider orientation="left">供應商與價格</Divider>
              
              <Row gutter={16}>
                <Col span={24}>
                  <EditableButtonGroup
                    buttons={suppliers}
                    onSelect={handleSupplierSelect}
                    onChange={handleSuppliersChange}
                    selectedValue={chickenForm.getFieldValue('supplier')}
                    title="供應商選項"
                  />
                </Col>
                
                <Col xs={24} sm={12}>
                  <Form.Item name="supplier" label="供應商" rules={[{ required: true }]}>
                    <Select>
                      {suppliers.map(option => (
                        <Option key={option.id} value={option.value}>
                          {option.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                
                <Col xs={24} sm={12}>
                  <Form.Item name="unitPrice" label="單價 (NT$)" rules={[{ required: true }]}>
                    <InputNumber min={0} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>
              
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item name="notes" label="備註">
                    <Input.TextArea rows={3} placeholder="輸入任何關於此批雞苗的備註..." />
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
          
          <Card title="雞苗/進雞歷史記錄" style={{ marginTop: 16 }}>
            <Table 
              columns={chickenColumns} 
              dataSource={chickenRecords} 
              rowKey="id" 
              pagination={{ pageSize: 5 }}
              className="data-table"
            />
          </Card>
        </TabPane>
        
        <TabPane tab="死亡記錄" key="2">
          <Card title="新增死亡記錄" className="data-entry-form">
            <Form
              form={deathForm}
              layout="vertical"
              onFinish={handleDeathSubmit}
              initialValues={{
                deathDate: currentDate,
                quantity: 1,
                reason: '疾病',
                batchNumber: chickenRecords.length > 0 ? chickenRecords[0].batchNumber : '',
              }}
            >
              <Row gutter={16}>
                <Col xs={24} sm={12} md={6}>
                  <Form.Item name="deathDate" label="死亡日期" rules={[{ required: true }]}>
                    <DatePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Form.Item name="batchNumber" label="批次編號" rules={[{ required: true }]}>
                    <Select>
                      {chickenRecords.map(record => (
                        <Option key={record.batchNumber} value={record.batchNumber}>
                          {record.batchNumber} ({record.breed})
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Form.Item name="quantity" label="死亡數量" rules={[{ required: true }]}>
                    <InputNumber min={1} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>
              
              <Divider orientation="left">死亡原因</Divider>
              
              <Row gutter={16}>
                <Col span={24}>
                  <EditableButtonGroup
                    buttons={deathReasons}
                    onSelect={handleReasonSelect}
                    onChange={handleDeathReasonsChange}
                    selectedValue={deathForm.getFieldValue('reason')}
                    title="死亡原因選項"
                  />
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item name="reason" label="死亡原因" rules={[{ required: true }]}>
                    <Select>
                      {deathReasons.map(option => (
                        <Option key={option.id} value={option.value}>
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
                    <Input.TextArea rows={3} placeholder="輸入任何關於死亡原因的詳細說明..." />
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
            
          <Card title="死亡記錄歷史" style={{ marginTop: 16 }}>
            <Table 
              columns={deathColumns} 
              dataSource={deathRecords} 
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
  
export default ChickenManagement;