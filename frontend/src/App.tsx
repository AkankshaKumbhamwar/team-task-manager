import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
// Import other components

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        {/* Other routes */}
      </Routes>
    </Router>
  );
}

export default App;