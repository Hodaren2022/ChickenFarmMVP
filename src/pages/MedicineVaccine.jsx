import React, { useState } from 'react';
import { 
  Typography, Form, DatePicker, Button, Input, Select, 
  Card, Row, Col, Table, Tabs, InputNumber, message,
  Statistic, Divider
} from 'antd';
import { 
  PlusOutlined, SaveOutlined, MedicineBoxOutlined,
  ExperimentOutlined, DollarOutlined
} from '@ant-design/icons';
import EditableButtonGroup from '../components/EditableButtonGroup';
import dayjs from 'dayjs';
import { saveToStorage, getFromStorage, STORAGE_KEYS } from '../utils/storage';

const { Title } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

const MedicineVaccine = () => {
  const [medicineForm] = Form.useForm();
  const [vaccineForm] = Form.useForm();
  const [medicineRecords, setMedicineRecords] = useState(getFromStorage(STORAGE_KEYS.MEDICINE_RECORDS, []));
  const [vaccineRecords, setVaccineRecords] = useState(getFromStorage(STORAGE_KEYS.VACCINE_RECORDS, []));
  
  // 自動設置當前日期
  const currentDate = dayjs();
  
  // 預設藥品類型選項，從localStorage獲取或使用默認值
  const [medicineTypes, setMedicineTypes] = useState(
    getFromStorage(STORAGE_KEYS.MEDICINE_TYPES, [
      { id: 1, label: '抗生素', value: '抗生素' },
      { id: 2, label: '驅蟲藥', value: '驅蟲藥' },
      { id: 3, label: '維他命', value: '維他命' },
      { id: 4, label: '消毒劑', value: '消毒劑' },
      { id: 5, label: '其他', value: '其他' }
    ])
  );
  
  // 預設疫苗類型選項，從localStorage獲取或使用默認值
  const [vaccineTypes, setVaccineTypes] = useState(
    getFromStorage(STORAGE_KEYS.VACCINE_TYPES, [
      { id: 1, label: '新城疫', value: '新城疫' },
      { id: 2, label: '禽流感', value: '禽流感' },
      { id: 3, label: '傳染性支氣管炎', value: '傳染性支氣管炎' },
      { id: 4, label: '傳染性法氏囊病', value: '傳染性法氏囊病' },
      { id: 5, label: '其他', value: '其他' }
    ])
  );
  
  // 預設供應商選項，從localStorage獲取或使用默認值
  const [suppliers, setSuppliers] = useState(
    getFromStorage(STORAGE_KEYS.MEDICINE_SUPPLIERS, [
      { id: 1, label: '農友獸醫診所', value: '農友獸醫診所' },
      { id: 2, label: '吉祥動物醫院', value: '吉祥動物醫院' },
      { id: 3, label: '永豐藥品', value: '永豐藥品' },
      { id: 4, label: '其他', value: '其他' }
    ])
  );
  
  // 預設批次選項 (從雞隻管理中獲取)
  const batchOptions = [
    { label: 'B20231125', value: 'B20231125' },
    { label: 'B20231110', value: 'B20231110' },
    { label: 'B20231001', value: 'B20231001' }
  ];
  
  // 預設使用方式選項，從localStorage獲取或使用默認值
  const [usageMethods, setUsageMethods] = useState(
    getFromStorage(STORAGE_KEYS.USAGE_METHODS, [
      { id: 1, label: '飲水添加', value: '飲水添加' },
      { id: 2, label: '飼料添加', value: '飼料添加' },
      { id: 3, label: '注射', value: '注射' },
      { id: 4, label: '噴霧', value: '噴霧' },
      { id: 5, label: '其他', value: '其他' }
    ])
  );
  
  // 初始化藥品表單數據
  const initMedicineForm = () => {
    medicineForm.setFieldsValue({
      useDate: currentDate,
      medicineType: '抗生素',
      medicineName: '',
      quantity: 1,
      usageMethod: '飲水添加',
      supplier: '農友獸醫診所',
      chickenBatch: batchOptions.length > 0 ? batchOptions[0].value : '',
    });
  };
  
  // 初始化疫苗表單數據
  const initVaccineForm = () => {
    vaccineForm.setFieldsValue({
      vaccinationDate: currentDate,
      vaccineType: '新城疫',
      vaccineName: '',
      quantity: 1,
      usageMethod: '注射',
      supplier: '農友獸醫診所',
      chickenBatch: batchOptions.length > 0 ? batchOptions[0].value : '',
    });
  };
  
  // 組件加載時初始化表單
  React.useEffect(() => {
    initMedicineForm();
    initVaccineForm();
  }, []);
  
  // 處理藥品表單提交
  const handleMedicineSubmit = (values) => {
    const newRecord = {
      ...values,
      useDate: values.useDate.format('YYYY-MM-DD'),
      id: Date.now(),
    };
    
    // 更新記錄並保存到localStorage
    const updatedRecords = [newRecord, ...medicineRecords];
    setMedicineRecords(updatedRecords);
    saveToStorage(STORAGE_KEYS.MEDICINE_RECORDS, updatedRecords);
    
    message.success('用藥記錄已保存');
    
    // 重置表單為當前時間和預設值
    initMedicineForm();
  };
  
  // 處理疫苗表單提交
  const handleVaccineSubmit = (values) => {
    const newRecord = {
      ...values,
      vaccinationDate: values.vaccinationDate.format('YYYY-MM-DD'),
      id: Date.now(),
    };
    
    // 更新記錄並保存到localStorage
    const updatedRecords = [newRecord, ...vaccineRecords];
    setVaccineRecords(updatedRecords);
    saveToStorage(STORAGE_KEYS.VACCINE_RECORDS, updatedRecords);
    
    message.success('疫苗接種記錄已保存');
    
    // 重置表單為當前時間和預設值
    initVaccineForm();
  };
  
  // 設置藥品類型快捷按鈕
  const handleMedicineTypeSelect = (medicineType) => {
    medicineForm.setFieldsValue({ medicineType });
  };
  
  // 處理藥品類型選項變更
  const handleMedicineTypesChange = (newOptions) => {
    setMedicineTypes(newOptions);
    saveToStorage(STORAGE_KEYS.MEDICINE_TYPES, newOptions);
  };
  
  // 設置疫苗類型快捷按鈕
  const handleVaccineTypeSelect = (vaccineType) => {
    vaccineForm.setFieldsValue({ vaccineType });
  };
  
  // 處理疫苗類型選項變更
  const handleVaccineTypesChange = (newOptions) => {
    setVaccineTypes(newOptions);
    saveToStorage(STORAGE_KEYS.VACCINE_TYPES, newOptions);
  };
  
  // 設置使用方式快捷按鈕 - 通用函數
  const handleUsageMethodSelect = (usageMethod, formInstance) => {
    formInstance.setFieldsValue({ usageMethod });
  };
  
  // 處理使用方式選項變更
  const handleUsageMethodsChange = (newOptions) => {
    setUsageMethods(newOptions);
    saveToStorage(STORAGE_KEYS.USAGE_METHODS, newOptions);
  };
  
  // 設置供應商快捷按鈕 - 通用函數
  const handleSupplierSelect = (supplier, formInstance) => {
    formInstance.setFieldsValue({ supplier });
  };
  
  // 處理供應商選項變更
  const handleSuppliersChange = (newOptions) => {
    setSuppliers(newOptions);
    saveToStorage(STORAGE_KEYS.MEDICINE_SUPPLIERS, newOptions);
  };
  
  // 藥品記錄表格列定義
  const medicineColumns = [
    {
      title: '使用日期',
      dataIndex: 'useDate',
      key: 'useDate',
    },
    {
      title: '藥品類型',
      dataIndex: 'medicineType',
      key: 'medicineType',
    },
    {
      title: '藥品名稱',
      dataIndex: 'medicineName',
      key: 'medicineName',
    },
    {
      title: '使用方式',
      dataIndex: 'usageMethod',
      key: 'usageMethod',
    },
    {
      title: '雞隻批次',
      dataIndex: 'chickenBatch',
      key: 'chickenBatch',
    },
    {
      title: '供應商',
      dataIndex: 'supplier',
      key: 'supplier',
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
  
  // 疫苗記錄表格列定義
  const vaccineColumns = [
    {
      title: '接種日期',
      dataIndex: 'vaccinationDate',
      key: 'vaccinationDate',
    },
    {
      title: '疫苗類型',
      dataIndex: 'vaccineType',
      key: 'vaccineType',
    },
    {
      title: '疫苗名稱',
      dataIndex: 'vaccineName',
      key: 'vaccineName',
    },
    {
      title: '接種方式',
      dataIndex: 'usageMethod',
      key: 'usageMethod',
    },
    {
      title: '雞隻批次',
      dataIndex: 'chickenBatch',
      key: 'chickenBatch',
    },
    {
      title: '供應商',
      dataIndex: 'supplier',
      key: 'supplier',
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
  
  return (
    <div>
      <Title level={2}>用藥與疫苗</Title>
      
      {/* 統計卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12}>
          <Card>
            <Statistic 
              title="用藥記錄總數" 
              value={medicineRecords.length} 
              prefix={<MedicineBoxOutlined />} 
              suffix="次" 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12}>
          <Card>
            <Statistic 
              title="疫苗接種總數" 
              value={vaccineRecords.length} 
              prefix={<ExperimentOutlined />} 
              suffix="次" 
            />
          </Card>
        </Col>
      </Row>
      
      <Tabs defaultActiveKey="1">
        <TabPane tab="用藥記錄" key="1">
          <Card title="新增用藥記錄" className="data-entry-form">
            <Form
              form={medicineForm}
              layout="vertical"
              onFinish={handleMedicineSubmit}
              initialValues={{
                useDate: currentDate,
                medicineType: '抗生素',
                medicineName: '',
                quantity: 1,
                usageMethod: '飲水添加',
                supplier: '農友獸醫診所',
                chickenBatch: batchOptions.length > 0 ? batchOptions[0].value : '',
              }}
            >
              <Row gutter={16}>
                <Col xs={24} sm={12} md={6}>
                  <Form.Item name="useDate" label="使用日期" rules={[{ required: true }]}>
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
              
              <Divider orientation="left">藥品資訊</Divider>
              
              <Row gutter={16}>
                <Col span={24}>
                  <EditableButtonGroup
                    buttons={medicineTypes}
                    onSelect={handleMedicineTypeSelect}
                    onChange={handleMedicineTypesChange}
                    selectedValue={medicineForm.getFieldValue('medicineType')}
                    title="藥品類型選項"
                  />
                </Col>
                
                <Col xs={24} sm={12}>
                  <Form.Item name="medicineType" label="藥品類型" rules={[{ required: true }]}>
                    <Select>
                      {medicineTypes.map(option => (
                        <Option key={option.value} value={option.value}>
                          {option.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                
                <Col xs={24} sm={12}>
                  <Form.Item name="medicineName" label="藥品名稱" rules={[{ required: true }]}>
                    <Input placeholder="輸入藥品名稱" />
                  </Form.Item>
                </Col>
              </Row>
              
              <Divider orientation="left">使用方式</Divider>
              
              <Row gutter={16}>
                <Col span={24}>
                  <EditableButtonGroup
                    buttons={usageMethods}
                    onSelect={(value) => handleUsageMethodSelect(value, medicineForm)}
                    onChange={handleUsageMethodsChange}
                    selectedValue={medicineForm.getFieldValue('usageMethod')}
                    title="使用方式選項"
                  />
                </Col>
                
                <Col xs={24} sm={12}>
                  <Form.Item name="usageMethod" label="使用方式" rules={[{ required: true }]}>
                    <Select>
                      {usageMethods.map(option => (
                        <Option key={option.value} value={option.value}>
                          {option.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                
                <Col xs={24} sm={12}>
                  <Form.Item name="quantity" label="使用量" rules={[{ required: true }]}>
                    <InputNumber min={0} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>
              
              <Divider orientation="left">供應商</Divider>
              
              <Row gutter={16}>
                <Col span={24}>
                  <EditableButtonGroup
                    buttons={suppliers}
                    onSelect={(value) => handleSupplierSelect(value, medicineForm)}
                    onChange={handleSuppliersChange}
                    selectedValue={medicineForm.getFieldValue('supplier')}
                    title="供應商選項"
                  />
                </Col>
                
                <Col xs={24} sm={12}>
                  <Form.Item name="supplier" label="供應商" rules={[{ required: true }]}>
                    <Select>
                      {suppliers.map(option => (
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
                    <Input.TextArea rows={3} placeholder="輸入任何關於用藥的備註..." />
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
          
          <Card title="用藥歷史記錄" style={{ marginTop: 16 }}>
            <Table 
              columns={medicineColumns} 
              dataSource={medicineRecords} 
              rowKey="id" 
              pagination={{ pageSize: 5 }}
              className="data-table"
            />
          </Card>
        </TabPane>
        
        <TabPane tab="疫苗接種" key="2">
          <Card title="新增疫苗接種記錄" className="data-entry-form">
            <Form
              form={vaccineForm}
              layout="vertical"
              onFinish={handleVaccineSubmit}
              initialValues={{
                vaccinationDate: currentDate,
                vaccineType: '新城疫',
                vaccineName: '',
                quantity: 1,
                usageMethod: '注射',
                supplier: '農友獸醫診所',
                chickenBatch: batchOptions.length > 0 ? batchOptions[0].value : '',
              }}
            >
              <Row gutter={16}>
                <Col xs={24} sm={12} md={6}>
                  <Form.Item name="vaccinationDate" label="接種日期" rules={[{ required: true }]}>
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
              
              <Divider orientation="left">疫苗資訊</Divider>
              
              <Row gutter={16}>
                <Col span={24}>
                  <EditableButtonGroup
                    buttons={vaccineTypes}
                    onSelect={handleVaccineTypeSelect}
                    onChange={handleVaccineTypesChange}
                    selectedValue={vaccineForm.getFieldValue('vaccineType')}
                    title="疫苗類型選項"
                  />
                </Col>
                
                <Col xs={24} sm={12}>
                  <Form.Item name="vaccineType" label="疫苗類型" rules={[{ required: true }]}>
                    <Select>
                      {vaccineTypes.map(option => (
                        <Option key={option.value} value={option.value}>
                          {option.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                
                <Col xs={24} sm={12}>
                  <Form.Item name="vaccineName" label="疫苗名稱" rules={[{ required: true }]}>
                    <Input placeholder="輸入疫苗名稱" />
                  </Form.Item>
                </Col>
              </Row>
              
              <Divider orientation="left">接種方式</Divider>
              
              <Row gutter={16}>
                <Col span={24}>
                  <EditableButtonGroup
                    buttons={usageMethods}
                    onSelect={(value) => handleUsageMethodSelect(value, vaccineForm)}
                    onChange={handleUsageMethodsChange}
                    selectedValue={vaccineForm.getFieldValue('usageMethod')}
                    title="接種方式選項"
                  />
                </Col>
                
                <Col xs={24} sm={12}>
                  <Form.Item name="usageMethod" label="接種方式" rules={[{ required: true }]}>
                    <Select>
                      {usageMethods.map(option => (
                        <Option key={option.value} value={option.value}>
                          {option.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                
                <Col xs={24} sm={12}>
                  <Form.Item name="quantity" label="使用量" rules={[{ required: true }]}>
                    <InputNumber min={0} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>
              
              <Divider orientation="left">供應商</Divider>
              
              <Row gutter={16}>
                <Col span={24}>
                  <EditableButtonGroup
                    buttons={suppliers}
                    onSelect={(value) => handleSupplierSelect(value, vaccineForm)}
                    onChange={handleSuppliersChange}
                    selectedValue={vaccineForm.getFieldValue('supplier')}
                    title="供應商選項"
                  />
                </Col>
                
                <Col xs={24} sm={12}>
                  <Form.Item name="supplier" label="供應商" rules={[{ required: true }]}>
                    <Select>
                      {suppliers.map(option => (
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
                    <Input.TextArea rows={3} placeholder="輸入任何關於疫苗接種的備註..." />
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
          
          <Card title="疫苗接種歷史記錄" style={{ marginTop: 16 }}>
            <Table 
              columns={vaccineColumns} 
              dataSource={vaccineRecords} 
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

export default MedicineVaccine;