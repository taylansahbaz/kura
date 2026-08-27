import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { allTeams } from '../data/teams';
import uclLogo from '../assets/ucl-logo.png';
import { db } from '../firebase';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

function Home({ user, saveUser, showMessage }) {
  const [username, setUsername] = useState(user?.username || '');
  const [roomCode, setRoomCode] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const joinCode = searchParams.get('join');
    if (joinCode) {
      setRoomCode(joinCode);
      showMessage("Odaya katılmak için kullanıcı adı girin.", "info");
    }
  }, [searchParams, showMessage]);

  const handleCreateRoom = async () => {
    if (!username.trim()) return showMessage("Kullanıcı adı giriniz", "error");
    const newRoomId = Math.random().toString(36).substring(2, 8).toUpperCase();

    try {
      await setDoc(doc(db, "rooms", newRoomId), {
        createdAt: serverTimestamp(),
        host: username
      });
      saveUser({ username });
      navigate(`/room/${newRoomId}`);
    } catch (error) {
      console.error(error);
      showMessage("Oda oluşturulurken hata oluştu. Firebase ayarlarını kontrol edin.", "error");
    }
  };

  const handleJoinRoom = async () => {
    if (!username.trim()) return showMessage("Kullanıcı adı giriniz", "error");
    if (!roomCode.trim()) return showMessage("Oda kodu giriniz", "error");

    try {
      const roomRef = doc(db, "rooms", roomCode.toUpperCase());
      const roomSnap = await getDoc(roomRef);

      if (roomSnap.exists()) {
        saveUser({ username });
        navigate(`/room/${roomCode.toUpperCase()}`);
      } else {
        showMessage("Böyle bir oda bulunamadı. Kodu kontrol edin.", "error");
      }
    } catch (error) {
      console.error(error);
      showMessage("Odaya bağlanırken hata oluştu.", "error");
    }
  };

  // Split teams: 16 left, 16 right
  const leftTeams = allTeams.slice(0, 16);
  const rightTeams = allTeams.slice(16, 32);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', position: 'relative' }}>

      {/* Background Split Effect with Logos */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', zIndex: -1, pointerEvents: 'none' }}>

        {/* Left Side - 4x4 grid */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to right, rgba(15, 23, 42, 0.1), rgba(15, 23, 42, 0.9))', zIndex: 1 }}></div>
          <div className="bg-logo-grid">
            {leftTeams.map(team => (
              <img key={team.id} src={team.logo} alt="" style={{ width: '80px', height: '80px', objectFit: 'contain', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.6))' }} />
            ))}
          </div>
        </div>

        {/* Right Side - 4x4 grid */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to left, rgba(15, 23, 42, 0.1), rgba(15, 23, 42, 0.9))', zIndex: 1 }}></div>
          <div className="bg-logo-grid">
            {rightTeams.map(team => (
              <img key={team.id} src={team.logo} alt="" style={{ width: '80px', height: '80px', objectFit: 'contain', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.6))' }} />
            ))}
          </div>
        </div>

      </div>

      {/* Main Content Card */}
      <div className="box" style={{
        maxWidth: '500px',
        width: '100%',
        background: 'rgba(30, 41, 59, 0.85)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
        padding: '50px 40px',
        borderRadius: '24px',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ display: 'inline-block', padding: '15px', background: 'rgba(255,255,255,0.03)', borderRadius: '20px', marginBottom: '24px', boxShadow: 'inset 0 0 20px rgba(255,255,255,0.02)' }}>
            <img src={uclLogo} alt="Champions League Logo" style={{ height: '110px', objectFit: 'contain', filter: 'drop-shadow(0 4px 15px rgba(0,0,0,0.5))' }} />
          </div>
          <h1 style={{ fontSize: '1.8rem', color: '#f8fafc', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 800 }}>Kura Simülasyonu</h1>
          <p style={{ color: '#94a3b8', fontSize: '1rem', fontWeight: 400 }}>Arkadaşlarınla kura tahminleri yap!</p>
        </div>

        <div style={{ marginBottom: '32px' }}>
          <label className="label" style={{ color: '#cbd5e1', fontSize: '0.85rem', letterSpacing: '1px', textTransform: 'uppercase' }}>KULLANICI ADI</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ padding: '16px', fontSize: '1.1rem', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '12px' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '20px', flexDirection: 'column' }}>

          <button onClick={handleCreateRoom} style={{ width: '100%', background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', color: 'white', padding: '16px', fontSize: '1.1rem', letterSpacing: '1px', border: 'none', borderRadius: '12px', boxShadow: '0 4px 15px rgba(2, 132, 199, 0.4)', textTransform: 'uppercase', fontWeight: 'bold' }}>
            YENİ ODA KUR
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '8px 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.2))' }}></div>
            <span style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '1px' }}>VEYA KATIL</span>
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to left, transparent, rgba(255,255,255,0.2))' }}></div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <input
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              placeholder="Oda Kodu"
              style={{ marginBottom: 0, flex: 2, background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.1)', padding: '16px', color: 'white', borderRadius: '12px', textTransform: 'uppercase' }}
            />
            <button onClick={handleJoinRoom} style={{ flex: 1, background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', color: 'white', padding: '16px', fontSize: '1.1rem', letterSpacing: '1px', border: 'none', borderRadius: '12px', boxShadow: '0 4px 15px rgba(5, 150, 105, 0.4)', textTransform: 'uppercase', fontWeight: 'bold' }}>
              KATIL
            </button>
          </div>

          <button onClick={() => {
            if (!roomCode.trim()) return showMessage("Lütfen bir oda kodu giriniz", "error");
            navigate(`/results/${roomCode.toUpperCase()}`);
          }} style={{ width: '100%', marginTop: '16px', background: 'transparent', padding: '16px', fontSize: '1.1rem', letterSpacing: '1px', border: '1px solid #3b82f6', borderRadius: '12px', cursor: 'pointer', color: '#3b82f6', fontWeight: 'bold', textTransform: 'uppercase' }}>
            📊 ODANIN SONUÇLARI GÖR
          </button>

        </div>
      </div>
    </div>
  );
}

export default Home;
