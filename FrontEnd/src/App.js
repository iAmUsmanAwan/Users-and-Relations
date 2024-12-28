// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserForm from './components/UserForm';
import Relationships from './components/Relationships';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<UserForm />} />
                <Route path="/relationships" element={<Relationships />} />
            </Routes>
        </Router>
    );
};

export default App;
