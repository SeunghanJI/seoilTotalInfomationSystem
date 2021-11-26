import './App.css';

import Nav from './components/Nav';
import NotFound from './pages/NotFound';

import { ROUTES } from './routes';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';

import { Layout } from 'antd';

const { Header, Footer, Content } = Layout;

function App() {
  const [isLogin, setIsLogin] = useState(false);

  const loginCallBack = (isLoggedStatus) => {
    setIsLogin(isLoggedStatus);
  };

  return (
    <BrowserRouter>
      <div className="App">
        <Layout style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
          <Header
            theme="light"
            style={{
              padding: '0px 20px',
              width: '100%',
              background: '#fff',
            }}
          >
            <Nav></Nav>
          </Header>
          <Content style={{ width: '80%', margin: '0 auto' }}>
            <Routes>
              {ROUTES.map((route) => {
                return (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={
                      <route.component
                        loginCallBack={loginCallBack}
                        isLogin={isLogin}
                      />
                    }
                  ></Route>
                );
              })}
              <Route path="*" element={<NotFound />}></Route>
            </Routes>
          </Content>
          <Footer style={{ marginTop: '48px' }}></Footer>
        </Layout>
      </div>
    </BrowserRouter>
  );
}

export default App;
