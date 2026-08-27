import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Room from './pages/Room'
import SelectTarget from './pages/SelectTarget'
import ManualDraw from './pages/ManualDraw'
import RandomDraw from './pages/RandomDraw'
import Results from './pages/Results'

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('kura_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [message, setMessage] = useState(null);

  const showMessage = (msg, type = 'info') => {
    setMessage({ text: msg, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const saveUser = (userData) => {
    setUser(userData);
    localStorage.setItem('kura_user', JSON.stringify(userData));
  };

  return (
    <>
      {message && (
        <div style={{ position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', background: message.type === 'error' ? '#ef4444' : '#3b82f6', color: 'white', padding: '10px 20px', borderRadius: '30px', fontWeight: 'bold', zIndex: 9999, boxShadow: '0 4px 12px rgba(0,0,0,0.3)', transition: 'all 0.3s ease' }}>
          {message.text}
        </div>
      )}
      <div className="container">
        <Routes>
          <Route path="/" element={<Home user={user} saveUser={saveUser} showMessage={showMessage} />} />
          <Route path="/room/:roomId" element={<Room user={user} saveUser={saveUser} showMessage={showMessage} />} />
          <Route path="/select-target/:roomId" element={<SelectTarget user={user} showMessage={showMessage} />} />
          <Route path="/manual-draw/:roomId" element={<ManualDraw user={user} showMessage={showMessage} />} />
          <Route path="/random-draw/:roomId" element={<RandomDraw user={user} showMessage={showMessage} />} />
          <Route path="/results/:roomId" element={<Results user={user} showMessage={showMessage} />} />
        </Routes>
      </div>
    </>
  )
}

export default App
