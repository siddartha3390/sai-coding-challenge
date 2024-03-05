import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ArtworkList from './ArtworkList';
import ArtworkDetail from './ArtworkDetail';

const App: React.FC = () => {
 return (
    <Router>
      <Routes>
        <Route path="/" element={<ArtworkList />} />
        <Route path="/artwork/:id" element={<ArtworkDetail />} />
      </Routes>
    </Router>
 );
};

export default App;
