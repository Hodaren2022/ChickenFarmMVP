import React, { useState, useRef, useEffect } from 'react';
import { Button, Modal, Form, Input, message, Popconfirm, Tooltip } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, MenuOutlined } from '@ant-design/icons';

/**
 * 可編輯按鈕組
 * @param {Array} buttons - 按鈕數據數組，每個按鈕包含 {id, label, value, icon} 屬性
 * @param {Function} onSelect - 按鈕選擇回調函數
 * @param {Function} onChange - 按鈕數據變更回調函數
 * @param {String} selectedValue - 當前選中的按鈕值
 * @param {String} title - 按鈕組標題
 */
const EditableButtonGroup = ({ buttons, onSelect, onChange, selectedValue, title }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingButton, setEditingButton] = useState(null);
  const [form] = Form.useForm();
  const [localButtons, setLocalButtons] = useState([...buttons]);
  const [draggedItem, setDraggedItem] = useState(null);
  const dragItemRef = useRef(null);
  const dragOverItemRef = useRef(null);
  
  // 當外部buttons變更時，更新本地狀態
  useEffect(() => {
    setLocalButtons([...buttons]);
  }, [buttons]);

  // 切換編輯模式
  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  // 打開編輯按鈕模態框
  const showEditModal = (button = null) => {
    setEditingButton(button);
    form.resetFields();
    
    if (button) {
      form.setFieldsValue({
        label: button.label,
        value: button.value
      });
    }
    
    setIsModalVisible(true);
  };

  // 處理按鈕表單提交
  const handleButtonSubmit = () => {
    form.validateFields().then(values => {
      let updatedButtons;
      
      if (editingButton) {
        // 更新現有按鈕
        updatedButtons = buttons.map(item => 
          item.id === editingButton.id ? { ...item, ...values } : item
        );
        message.success('按鈕已更新');
      } else {
        // 添加新按鈕
        const newButton = {
          ...values,
          id: Date.now()
        };
        updatedButtons = [...buttons, newButton];
        message.success('新按鈕已添加');
      }
      
      // 調用父組件的變更回調
      if (onChange) {
        onChange(updatedButtons);
      }
      
      setIsModalVisible(false);
    }).catch(error => {
      console.error('表單驗證失敗:', error);
    });
  };
  
  // 處理刪除按鈕
  const handleDeleteButton = (buttonId) => {
    const updatedButtons = localButtons.filter(item => item.id !== buttonId);
    setLocalButtons(updatedButtons);
    if (onChange) {
      onChange(updatedButtons);
    }
    message.success('按鈕已刪除');
  };
  
  // 拖拽開始
  const handleDragStart = (e, index) => {
    e.stopPropagation();
    dragItemRef.current = index;
    e.dataTransfer.effectAllowed = 'move';
    
    // 使用setTimeout確保樣式變更在拖拽開始後應用
    setTimeout(() => {
      setDraggedItem(localButtons[index]);
    }, 0);
  };
  
  // 拖拽結束
  const handleDragEnd = (e) => {
    e.stopPropagation();
    dragItemRef.current = null;
    dragOverItemRef.current = null;
    setDraggedItem(null);
  };
  
  // 拖拽經過
  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    if (dragItemRef.current !== null && dragItemRef.current !== index) {
      dragOverItemRef.current = index;
      e.dataTransfer.dropEffect = 'move';
      
      // 強制重新渲染以顯示拖拽目標的視覺反饋
      setLocalButtons([...localButtons]);
    }
  };
  
  // 放置處理
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const draggedItemIndex = dragItemRef.current;
    const targetIndex = dragOverItemRef.current;
    
    if (draggedItemIndex === null || targetIndex === null || draggedItemIndex === targetIndex) {
      return;
    }
    
    const newItems = [...localButtons];
    const draggedItem = newItems[draggedItemIndex];
    
    // 從數組中移除拖拽項
    newItems.splice(draggedItemIndex, 1);
    // 在目標位置插入拖拽項
    newItems.splice(targetIndex, 0, draggedItem);
    
    setLocalButtons(newItems);
    
    // 確保更新到父組件
    if (onChange) {
      onChange(newItems);
    }
    
    // 重置拖拽狀態
    dragItemRef.current = null;
    dragOverItemRef.current = null;
    setDraggedItem(null);
    
    message.success('按鈕順序已更新');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        {title && <h4 style={{ margin: 0 }}>{title}</h4>}
        <Button 
          type="link" 
          icon={<EditOutlined />} 
          onClick={toggleEditMode}
        >
          {isEditMode ? '完成編輯' : '編輯按鈕'}
        </Button>
      </div>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {localButtons.map((button, index) => (
          <div 
            key={button.id} 
            style={{ 
              display: 'inline-block', 
              marginBottom: '8px', 
              marginRight: '8px',
              cursor: isEditMode ? 'move' : 'pointer',
              opacity: draggedItem && draggedItem.id === button.id ? 0.5 : 1,
              border: dragOverItemRef.current === index ? '2px dashed #1890ff' : '2px solid transparent',
              padding: '2px',
              borderRadius: '4px',
              transition: 'all 0.2s',
              background: dragOverItemRef.current === index ? '#f0f8ff' : 'transparent'
            }}
            draggable={isEditMode}
            onDragStart={(e) => handleDragStart(e, index)}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={handleDrop}
            onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); }}
          >
            <div 
              style={{ 
                display: 'flex', 
                alignItems: 'center',
                padding: '4px',
                backgroundColor: isEditMode ? '#f9f9f9' : 'transparent',
                borderRadius: '4px'
              }}
            >
              {isEditMode && (
                <Tooltip title="拖動排序">
                  <MenuOutlined 
                    style={{ 
                      marginRight: '8px', 
                      cursor: 'move',
                      color: '#1890ff',
                      fontSize: '16px'
                    }} 
                  />
                </Tooltip>
              )}
              <Button 
                onClick={() => isEditMode ? showEditModal(button) : onSelect(button.value)}
                type={selectedValue === button.value && !isEditMode ? 'primary' : 'default'}
                icon={button.icon}
              >
                {button.label}
              </Button>
              {isEditMode && (
                <Popconfirm
                  title="確定要刪除此按鈕嗎？"
                  onConfirm={() => handleDeleteButton(button.id)}
                  okText="確定"
                  cancelText="取消"
                >
                  <Button 
                    danger 
                    type="text" 
                    icon={<DeleteOutlined />} 
                    style={{ marginLeft: '4px' }}
                  />
                </Popconfirm>
              )}
            </div>
          </div>
        ))}
        {isEditMode && (
          <Button 
            type="dashed" 
            icon={<PlusOutlined />} 
            onClick={() => showEditModal()}
            style={{ marginBottom: '8px' }}
          >
            新增
          </Button>
        )}
      </div>
      
      {/* 按鈕編輯模態框 */}
      <Modal
        title={editingButton ? "編輯按鈕" : "新增按鈕"}
        open={isModalVisible}
        onOk={handleButtonSubmit}
        onCancel={() => setIsModalVisible(false)}
        destroyOnClose={true}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="label"
            label="按鈕文字"
            rules={[{ required: true, message: '請輸入按鈕文字' }]}
          >
            <Input placeholder="請輸入按鈕文字" />
          </Form.Item>
          
          <Form.Item
            name="value"
            label="按鈕值"
            rules={[{ required: true, message: '請輸入按鈕值' }]}
          >
            <Input placeholder="請輸入按鈕值" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default EditableButtonGroup;