import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Settings from './pages/Settings';
import NoPage from './pages/NoPage';

import 'bootstrap/dist/css/bootstrap.min.css';
import './css/styles.css';


export default function App() {

  return (
      <div className='main'>
        <BrowserRouter>
          <Header />
          <div className='main-container'>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/*" element={<NoPage />} />
            </Routes>
          </div>
        </BrowserRouter>
      </div>
  );
}
