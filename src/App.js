import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';

import PdfDrop from './pdfDrop';
import Evaluate from './evaluate'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PdfDrop />} />
        <Route path="/evaluate" element={<Evaluate />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;