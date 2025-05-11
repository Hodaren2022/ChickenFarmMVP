import React, { useState } from 'react';
import { 
  Typography, Form, DatePicker, Button, Input, Select, 
  Card, Row, Col, Table, Tabs, InputNumber, message,
  Statistic, Divider, Modal, Tooltip
} from 'antd';
import { 
  PlusOutlined, SaveOutlined, ShoppingCartOutlined,
  AreaChartOutlined, DollarOutlined, EditOutlined,
  UserAddOutlined, UserOutlined
} from '@ant-design/icons';
import EditableButtonGroup from '../components/EditableButtonGroup';
import dayjs from 'dayjs';
import { saveToStorage, getFromStorage, STORAGE_KEYS } from '../utils/storage';

const { Title } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

const FeedManagement = () => {
  const [purchaseForm] = Form.useForm();
  const [usageForm] = Form.useForm();
  const [supplierForm] = Form.useForm();
  const [purchaseRecords, setPurchaseRecords] = useState([]);
  const [usageRecords, setUsageRecords] = useState([]);
  
  // 供應商資訊相關狀態，從localStorage獲取或使用默認值
  const [suppliers, setSuppliers] = useState(
    getFromStorage(STORAGE_KEYS.FEED_SUPPLIERS, [
      { id: 1, name: '農友飼料行', type: '飼料行', contact: '0912-345-678', address: '台北市中正區' },
      { id: 2, name: '吉祥飼料廠', type: '飼料廠', contact: '0923-456-789', address: '新北市板橋區' },
      { id: 3, name: '永豐飼料', type: '飼料行', contact: '0934-567-890', address: '台北市信義區' },
      { id: 4, name: '其他', type: '其他', contact: '', address: '' }
    ])
  );
  const [isSupplierModalVisible, setIsSupplierModalVisible] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  
  // 自動設置當前日期
  const currentDate = dayjs();
  
  // 預設飼料類型選項，從localStorage獲取或使用默認值
  const [feedTypes, setFeedTypes] = useState(
    getFromStorage(STORAGE_KEYS.FEED_TYPES, [
      { id: 1, label: '幼雞飼料', value: '幼雞飼料' },
      { id: 2, label: '成長期飼料', value: '成長期飼料' },
      { id: 3, label: '成雞飼料', value: '成雞飼料' },
      { id: 4, label: '有機飼料', value: '有機飼料' },
      { id: 5, label: '其他', value: '其他' }
    ])
  );
  
  // 供應商類型選項，從localStorage獲取或使用默認值
  const [supplierTypes, setSupplierTypes] = useState(
    getFromStorage(STORAGE_KEYS.SUPPLIER_TYPES, [
      { id: 1, label: '飼料行', value: '飼料行' },
      { id: 2, label: '飼料廠', value: '飼料廠' },
      { id: 3, label: '農場', value: '農場' },
      { id: 4, label: '其他', value: '其他' }
    ])
  );
  
  // 預設批次選項 (從雞隻管理中獲取)
  const batchOptions = [
    { label: 'B20231125', value: 'B20231125' },
    { label: 'B20231110', value: 'B20231110' },
    { label: 'B20231001', value: 'B20231001' }
  ];
  
  // 初始化飼料購買表單數據
  const initPurchaseForm = () => {
    purchaseForm.setFieldsValue({
      purchaseDate: currentDate,
      feedType: '成長期飼料',
      quantity: 500,
      supplier: '農友飼料行',
      unitPrice: 15,
      batchNumber: `F${dayjs().format('YYYYMMDD')}`,
    });
  };
  
  // 初始化飼料使用表單數據
  const initUsageForm = () => {
    usageForm.setFieldsValue({
      usageDate: currentDate,
      feedType: '成長期飼料',
      quantity: 50,
      batchNumber: purchaseRecords.length > 0 ? purchaseRecords[0].batchNumber : '',
      chickenBatch: batchOptions.length > 0 ? batchOptions[0].value : '',
    });
  };
  
  // 組件加載時初始化表單
  React.useEffect(() => {
    initPurchaseForm();
    initUsageForm();
  }, []);
  
  // 處理飼料購買表單提交
  const handlePurchaseSubmit = (values) => {
    const newRecord = {
      ...values,
      purchaseDate: values.purchaseDate.format('YYYY-MM-DD'),
      totalAmount: values.quantity * values.unitPrice,
      id: Date.now(),
    };
    
    // 在實際應用中，這裡應該將數據保存到本地存儲或後端
    setPurchaseRecords([newRecord, ...purchaseRecords]);
    message.success('飼料購買記錄已保存');
    
    // 重置表單為當前時間和預設值
    initPurchaseForm();
  };
  
  // 處理飼料使用表單提交
  const handleUsageSubmit = (values) => {
    const newRecord = {
      ...values,
      usageDate: values.usageDate.format('YYYY-MM-DD'),
      id: Date.now(),
    };
    
    // 在實際應用中，這裡應該將數據保存到本地存儲或後端
    setUsageRecords([newRecord, ...usageRecords]);
    message.success('飼料使用記錄已保存');
    
    // 重置表單為當前時間和預設值
    initUsageForm();
  };
  
  // 設置飼料類型快捷按鈕
  const handleFeedTypeSelect = (feedType, formInstance) => {
    formInstance.setFieldsValue({ feedType });
  };
  
  // 處理飼料類型選項變更
  const handleFeedTypesChange = (newOptions) => {
    setFeedTypes(newOptions);
    saveToStorage(STORAGE_KEYS.FEED_TYPES, newOptions);
    message.success('飼料類型已更新');
  };
  
  // 設置供應商快捷按鈕
  const handleSupplierSelect = (supplierId) => {
    const supplier = suppliers.find(s => s.id === supplierId);
    setSelectedSupplier(supplier);
    purchaseForm.setFieldsValue({ supplier: supplier.name });
  };
  
  // 打開供應商編輯模態框
  const showSupplierModal = (supplier = null) => {
    setEditingSupplier(supplier);
    supplierForm.resetFields();
    
    if (supplier) {
      supplierForm.setFieldsValue({
        name: supplier.name,
        type: supplier.type,
        contact: supplier.contact,
        address: supplier.address
      });
    }
    
    setIsSupplierModalVisible(true);
  };
  
  // 處理供應商表單提交
  const handleSupplierSubmit = () => {
    supplierForm.validateFields().then(values => {
      let updatedSuppliers;
      
      if (editingSupplier) {
        // 更新現有供應商
        updatedSuppliers = suppliers.map(item => 
          item.id === editingSupplier.id ? { ...item, ...values } : item
        );
        message.success('供應商資訊已更新');
      } else {
        // 添加新供應商
        const newSupplier = {
          ...values,
          id: Date.now()
        };
        updatedSuppliers = [...suppliers, newSupplier];
        message.success('新供應商已添加');
      }
      
      // 更新狀態並保存到localStorage
      setSuppliers(updatedSuppliers);
      saveToStorage(STORAGE_KEYS.FEED_SUPPLIERS, updatedSuppliers);
      
      setIsSupplierModalVisible(false);
    }).catch(error => {
      console.error('表單驗證失敗:', error);
    });
  };
  
  // 處理供應商類型選項變更
  const handleSupplierTypesChange = (newOptions) => {
    setSupplierTypes(newOptions);
    saveToStorage(STORAGE_KEYS.SUPPLIER_TYPES, newOptions);
    message.success('供應商類型已更新');
  };
  
  // 處理供應商按鈕變更（新增、編輯、刪除、排序）
  const handleSuppliersChange = (updatedButtons) => {
    // 將按鈕數據轉換回供應商數據格式
    const updatedSuppliers = updatedButtons.map(button => {
      // 查找原始供應商數據以保留完整信息
      const originalSupplier = suppliers.find(s => s.id === button.value) || {};
      
      return {
        id: button.value,
        name: button.label,
        type: originalSupplier.type || '其他',
        contact: originalSupplier.contact || '',
        address: originalSupplier.address || ''
      };
    });
    
    // 更新狀態並保存到localStorage
    setSuppliers(updatedSuppliers);
    saveToStorage(STORAGE_KEYS.FEED_SUPPLIERS, updatedSuppliers);
    message.success('供應商列表已更新');
  };
  
  // 飼料購買表格列定義
  const purchaseColumns = [
    {
      title: '批次編號',
      dataIndex: 'batchNumber',
      key: 'batchNumber',
    },
    {
      title: '購買日期',
      dataIndex: 'purchaseDate',
      key: 'purchaseDate',
    },
    {
      title: '飼料類型',
      dataIndex: 'feedType',
      key: 'feedType',
    },
    {
      title: '數量 (kg)',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (text) => `${text} kg`,
    },
    {
      title: '供應商',
      dataIndex: 'supplier',
      key: 'supplier',
    },
    {
      title: '單價 (NT$/kg)',
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
  
  // 飼料使用表格列定義
  const usageColumns = [
    {
      title: '使用日期',
      dataIndex: 'usageDate',
      key: 'usageDate',
    },
    {
      title: '飼料批次',
      dataIndex: 'batchNumber',
      key: 'batchNumber',
    },
    {
      title: '雞隻批次',
      dataIndex: 'chickenBatch',
      key: 'chickenBatch',
    },
    {
      title: '飼料類型',
      dataIndex: 'feedType',
      key: 'feedType',
    },
    {
      title: '使用量 (kg)',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (text) => `${text} kg`,
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
  
  // 計算總庫存量
  const totalStock = purchaseRecords.reduce((sum, record) => sum + record.quantity, 0) - 
                     usageRecords.reduce((sum, record) => sum + record.quantity, 0);
  
  // 計算總花費
  const totalCost = purchaseRecords.reduce((sum, record) => sum + record.totalAmount, 0);
  
  return (
    <div>
      <Title level={2}>飼料管理</Title>
      
      <Card title="供應商資訊" className="supplier-info-card" style={{ marginBottom: 16 }}>
        <Row gutter={16} align="middle">
          <Col span={24}>
            <div style={{ marginBottom: 16 }}>
              <EditableButtonGroup
                title="選擇供應商"
                buttons={suppliers.map(supplier => ({
                  id: supplier.id,
                  label: supplier.name,
                  value: supplier.id,
                  icon: <UserOutlined />
                }))}
                onSelect={handleSupplierSelect}
                onChange={handleSuppliersChange}
                selectedValue={selectedSupplier?.id}
              />
            </div>
          </Col>
          
          {selectedSupplier && (
            <Col span={24}>
              <Card size="small" title="供應商詳細資訊" extra={(
                <Button 
                  type="link" 
                  icon={<EditOutlined />} 
                  onClick={() => showSupplierModal(selectedSupplier)}
                >
                  編輯
                </Button>
              )}>
                <Row gutter={16}>
                  <Col span={12}>
                    <p><strong>名稱：</strong> {selectedSupplier.name}</p>
                    <p><strong>類型：</strong> {selectedSupplier.type}</p>
                  </Col>
                  <Col span={12}>
                    <p><strong>聯絡方式：</strong> {selectedSupplier.contact}</p>
                    <p><strong>地址：</strong> {selectedSupplier.address}</p>
                  </Col>
                </Row>
              </Card>
            </Col>
          )}
        </Row>
        
        {/* 供應商編輯模態框 */}
        <Modal
          title={editingSupplier ? "編輯供應商資訊" : "新增供應商"}
          open={isSupplierModalVisible}
          onOk={handleSupplierSubmit}
          onCancel={() => setIsSupplierModalVisible(false)}
          destroyOnClose={true}
        >
          <Form
            form={supplierForm}
            layout="vertical"
          >
            <Form.Item
              name="name"
              label="供應商名稱"
              rules={[{ required: true, message: '請輸入供應商名稱' }]}
            >
              <Input placeholder="請輸入供應商名稱" />
            </Form.Item>
            
            <Form.Item
              name="type"
              label="供應商類型"
              rules={[{ required: true, message: '請選擇供應商類型' }]}
            >
              <Select placeholder="請選擇供應商類型">
                {supplierTypes.map(option => (
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
      
      {/* 統計卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic 
              title="總購買量" 
              value={purchaseRecords.reduce((sum, record) => sum + record.quantity, 0)} 
              prefix={<ShoppingCartOutlined />} 
              suffix="kg" 
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic 
              title="總使用量" 
              value={usageRecords.reduce((sum, record) => sum + record.quantity, 0)} 
              prefix={<AreaChartOutlined />} 
              suffix="kg" 
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic 
              title="目前庫存量" 
              value={totalStock} 
              prefix={<ShoppingCartOutlined style={{ color: '#52c41a' }} />} 
              suffix="kg" 
            />
          </Card>
        </Col>
      </Row>
      
      <Tabs defaultActiveKey="1">
        <TabPane tab="飼料購買記錄" key="1">
          <Card title="新增飼料購買記錄" className="data-entry-form">
            <Form
              form={purchaseForm}
              layout="vertical"
              onFinish={handlePurchaseSubmit}
              initialValues={{
                purchaseDate: currentDate,
                feedType: '成長期飼料',
                quantity: 500,
                supplier: '農友飼料行',
                unitPrice: 15,
                batchNumber: `F${dayjs().format('YYYYMMDD')}`,
              }}
            >
              <Row gutter={16}>
                <Col xs={24} sm={12} md={6}>
                  <Form.Item name="purchaseDate" label="購買日期" rules={[{ required: true }]}>
                    <DatePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Form.Item name="batchNumber" label="批次編號" rules={[{ required: true }]}>
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              
              <Divider orientation="left">飼料類型</Divider>
              
              <Row gutter={16}>
                <Col span={24}>
                  <EditableButtonGroup
                    buttons={feedTypes}
                    onSelect={(value) => handleFeedTypeSelect(value, purchaseForm)}
                    onChange={handleFeedTypesChange}
                    selectedValue={purchaseForm.getFieldValue('feedType')}
                    title="飼料類型"
                  />
                </Col>
                
                <Col xs={24} sm={12}>
                  <Form.Item name="feedType" label="飼料類型" rules={[{ required: true }]}>
                    <Select>
                      {feedTypes.map(option => (
                        <Option key={option.value} value={option.value}>
                          {option.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                
                <Col xs={24} sm={12}>
                  <Form.Item name="quantity" label="數量 (kg)" rules={[{ required: true }]}>
                    <InputNumber min={1} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>
              
              <Divider orientation="left">價格資訊</Divider>
              
              <Row gutter={16}>
                
                <Col xs={24} sm={12}>
                  <Form.Item name="supplier" label="供應商" rules={[{ required: true, message: '請選擇供應商' }]}>
                    <Input disabled placeholder="請先在供應商資訊區塊選擇供應商" />
                  </Form.Item>
                </Col>
                
                <Col xs={24} sm={12}>
                  <Form.Item name="unitPrice" label="單價 (NT$/kg)" rules={[{ required: true }]}>
                    <InputNumber min={0} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>
              
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item name="notes" label="備註">
                    <Input.TextArea rows={3} placeholder="輸入任何關於此批飼料的備註..." />
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
          
          <Card title="飼料購買歷史記錄" style={{ marginTop: 16 }}>
            <Table 
              columns={purchaseColumns} 
              dataSource={purchaseRecords} 
              rowKey="id" 
              pagination={{ pageSize: 5 }}
              className="data-table"
            />
          </Card>
        </TabPane>
        
        <TabPane tab="飼料使用記錄" key="2">
          <Card title="新增飼料使用記錄" className="data-entry-form">
            <Form
              form={usageForm}
              layout="vertical"
              onFinish={handleUsageSubmit}
              initialValues={{
                usageDate: currentDate,
                feedType: '成長期飼料',
                quantity: 50,
                batchNumber: purchaseRecords.length > 0 ? purchaseRecords[0].batchNumber : '',
                chickenBatch: batchOptions.length > 0 ? batchOptions[0].value : '',
              }}
            >
              <Row gutter={16}>
                <Col xs={24} sm={12} md={6}>
                  <Form.Item name="usageDate" label="使用日期" rules={[{ required: true }]}>
                    <DatePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Form.Item name="batchNumber" label="飼料批次" rules={[{ required: true }]}>
                    <Select>
                      {purchaseRecords.map(record => (
                        <Option key={record.batchNumber} value={record.batchNumber}>
                          {record.batchNumber} ({record.feedType})
                        </Option>
                      ))}
                    </Select>
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
              
              <Divider orientation="left">飼料類型與使用量</Divider>
              
              <Row gutter={16}>
                <Col span={24}>
                  <EditableButtonGroup
                    buttons={feedTypes}
                    onSelect={(value) => handleFeedTypeSelect(value, usageForm)}
                    onChange={handleFeedTypesChange}
                    selectedValue={usageForm.getFieldValue('feedType')}
                    title="飼料類型"
                  />
                </Col>
                
                <Col xs={24} sm={12}>
                  <Form.Item name="feedType" label="飼料類型" rules={[{ required: true }]}>
                    <Select>
                      {feedTypes.map(option => (
                        <Option key={option.value} value={option.value}>
                          {option.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                
                <Col xs={24} sm={12}>
                  <Form.Item name="quantity" label="使用量 (kg)" rules={[{ required: true }]}>
                    <InputNumber min={1} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>
              
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item name="notes" label="備註">
                    <Input.TextArea rows={3} placeholder="輸入任何關於飼料使用的備註..." />
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
          
          <Card title="飼料使用歷史記錄" style={{ marginTop: 16 }}>
            <Table 
              columns={usageColumns} 
              dataSource={usageRecords} 
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

export default FeedManagement;