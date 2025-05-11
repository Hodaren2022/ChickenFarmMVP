import { useState, useEffect } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import { Layout, Menu, ConfigProvider, theme, Button } from 'antd'
import { 
  HomeOutlined, 
  CalendarOutlined, 
  DatabaseOutlined,
  MedicineBoxOutlined,
  ShoppingOutlined,
  BarChartOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined
} from '@ant-design/icons'

// 頁面組件
import Dashboard from './pages/Dashboard'
import DailyRecord from './pages/DailyRecord'
import ChickenManagement from './pages/ChickenManagement'
import FeedManagement from './pages/FeedManagement'
import MedicineVaccine from './pages/MedicineVaccine'
import SalesManagement from './pages/SalesManagement'
import CostSummary from './pages/CostSummary'

// 樣式
import './App.css'

const { Header, Content, Footer, Sider } = Layout

function App() {
  const [collapsed, setCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  
  // 監聽視窗大小變化，判斷是否為手機螢幕
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
      if (window.innerWidth <= 768) {
        setCollapsed(true)
      }
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => {
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#52c41a',
        },
      }}
    >
      <Layout style={{ minHeight: '100vh' }}>
        {isMobile && (
          <Button 
            type="primary" 
            onClick={() => setCollapsed(!collapsed)}
            style={{
              position: 'fixed',
              top: '10px',
              left: collapsed ? '10px' : '200px',
              zIndex: 1001,
              transition: 'all 0.2s'
            }}
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          />
        )}
        <Sider 
          collapsible={!isMobile} 
          collapsed={collapsed} 
          onCollapse={setCollapsed}
          breakpoint="lg"
          style={{ zIndex: 1000 }}
        >
          <div className="logo">土雞飼養記錄</div>
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
            <Menu.Item key="1" icon={<HomeOutlined />}>
              <Link to="/">首頁</Link>
            </Menu.Item>
            <Menu.Item key="2" icon={<CalendarOutlined />}>
              <Link to="/daily-record">日常記錄</Link>
            </Menu.Item>
            <Menu.Item key="3" icon={<DatabaseOutlined />}>
              <Link to="/chicken-management">雞隻管理</Link>
            </Menu.Item>
            <Menu.Item key="4" icon={<DatabaseOutlined />}>
              <Link to="/feed-management">飼料管理</Link>
            </Menu.Item>
            <Menu.Item key="5" icon={<MedicineBoxOutlined />}>
              <Link to="/medicine-vaccine">用藥與疫苗</Link>
            </Menu.Item>
            <Menu.Item key="6" icon={<ShoppingOutlined />}>
              <Link to="/sales-management">出售管理</Link>
            </Menu.Item>
            <Menu.Item key="7" icon={<BarChartOutlined />}>
              <Link to="/cost-summary">成本彙總</Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Header style={{ padding: 0, background: '#fff' }} />
          <Content style={{ margin: '0 16px' }}>
            <div style={{ padding: 24, minHeight: 360, background: '#fff', marginTop: 16 }}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/daily-record" element={<DailyRecord />} />
                <Route path="/chicken-management" element={<ChickenManagement />} />
                <Route path="/feed-management" element={<FeedManagement />} />
                <Route path="/medicine-vaccine" element={<MedicineVaccine />} />
                <Route path="/sales-management" element={<SalesManagement />} />
                <Route path="/cost-summary" element={<CostSummary />} />
              </Routes>
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            土雞飼養記錄系統 ©{new Date().getFullYear()}
          </Footer>
        </Layout>
      </Layout>
    </ConfigProvider>
  )
}

export default App