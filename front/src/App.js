import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import Settings from "./pages/Settings";
import NoPage from "./pages/NoPage";
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/styles.css";

const theme = extendTheme({
  colors: {
    green: { 600: "#84BD00", }
  },
  fonts: {
    body: "Courier New, monospace",
    heading: "Courier New, monospace",
  },
})


export default function App() {
  return (
    <ChakraProvider theme={theme}>
      <div className="main">
        <BrowserRouter>
          <NavBar />
          <div className="main-container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/*" element={<NoPage />} />
            </Routes>
          </div>
        </BrowserRouter>
      </div>
    </ChakraProvider>
  );
}
