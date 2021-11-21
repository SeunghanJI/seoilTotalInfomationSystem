import './App.css';
import Nav from './components/Nav';

import { ROUTES } from './routes';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Nav></Nav>
        <section>
          <Routes>
            {ROUTES.map((route) => {
              return (
                <Route
                  key={route.path}
                  path={route.path}
                  element={<route.component />}
                ></Route>
              );
            })}
            {/* <Route component={NotFound} /> */}
          </Routes>
        </section>
      </div>
    </BrowserRouter>
  );
}

export default App;
