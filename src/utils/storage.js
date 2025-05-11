/**
 * 本地存儲工具類
 * 用於在頁面間保存和恢復數據
 */

// 保存數據到localStorage
export const saveToStorage = (key, data) => {
  try {
    const jsonData = JSON.stringify(data);
    localStorage.setItem(key, jsonData);
    return true;
  } catch (error) {
    console.error('保存數據失敗:', error);
    return false;
  }
};

// 從localStorage獲取數據
export const getFromStorage = (key, defaultValue = null) => {
  try {
    const jsonData = localStorage.getItem(key);
    if (jsonData === null) return defaultValue;
    return JSON.parse(jsonData);
  } catch (error) {
    console.error('獲取數據失敗:', error);
    return defaultValue;
  }
};

// 從localStorage刪除數據
export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('刪除數據失敗:', error);
    return false;
  }
};

// 清空所有localStorage數據
export const clearStorage = () => {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('清空數據失敗:', error);
    return false;
  }
};

// 存儲鍵常量
export const STORAGE_KEYS = {
  // 日常記錄相關
  DAILY_RECORDS: 'chicken_farm_daily_records',
  WEATHER_OPTIONS: 'chicken_farm_weather_options',
  HEALTH_OPTIONS: 'chicken_farm_health_options',
  ENVIRONMENT_OPTIONS: 'chicken_farm_environment_options',
  CUSTOMERS: 'chicken_farm_customers',
  SELECTED_CUSTOMER: 'chicken_farm_selected_customer',
  
  // 雞隻管理相關
  CHICKEN_RECORDS: 'chicken_farm_chicken_records',
  DEATH_RECORDS: 'chicken_farm_death_records',
  CHICKEN_BREEDS: 'chicken_farm_chicken_breeds',
  SUPPLIERS: 'chicken_farm_suppliers',
  DEATH_REASONS: 'chicken_farm_death_reasons',
  
  // 飼料管理相關
  FEED_TYPES: 'chicken_farm_feed_types',
  FEED_SUPPLIERS: 'chicken_farm_feed_suppliers',
  SUPPLIER_TYPES: 'chicken_farm_supplier_types',
  
  // 出售/淘汰管理相關
  SALES_CUSTOMERS: 'chicken_farm_sales_customers',
  CULLING_REASONS: 'chicken_farm_culling_reasons',
  SALES_RECORDS: 'chicken_farm_sales_records',
  CULLING_RECORDS: 'chicken_farm_culling_records',
  
  // 藥品/疫苗管理相關
  MEDICINE_RECORDS: 'chicken_farm_medicine_records',
  VACCINE_RECORDS: 'chicken_farm_vaccine_records',
  MEDICINE_TYPES: 'chicken_farm_medicine_types',
  VACCINE_TYPES: 'chicken_farm_vaccine_types',
  MEDICINE_SUPPLIERS: 'chicken_farm_medicine_suppliers',
  USAGE_METHODS: 'chicken_farm_usage_methods',
};