import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, setDoc, onSnapshot, collection, serverTimestamp } from 'firebase/firestore';

function Room({ user, saveUser, showMessage }) {
  const { roomId } = useParams();
  const navigate = useNavigate();
  // Mock users for now
  const [users, setUsers] = useState([]);
  const [host, setHost] = useState(null);
  const [usernameInput, setUsernameInput] = useState('');

  useEffect(() => {
    let unsubscribe = null;

    const setupRoom = async () => {
      try {
        const roomRef = doc(db, "rooms", roomId);
        const roomSnap = await getDoc(roomRef);

        if (!roomSnap.exists()) {
          if (showMessage) showMessage("Oda bulunamadı", "error");
          navigate('/');
          return;
        }

        setHost(roomSnap.data().host);

        if (user) {
          // Add self to users subcollection
          await setDoc(doc(db, "rooms", roomId, "users", user.username), {
            joinedAt: serverTimestamp()
          });
        }

        // Listen for users
        unsubscribe = onSnapshot(collection(db, "rooms", roomId, "users"), (snapshot) => {
          const fetchedUsers = [];
          snapshot.forEach(doc => {
            fetchedUsers.push({ username: doc.id });
          });
          setUsers(fetchedUsers);
        });

      } catch (error) {
        console.error(error);
        if (showMessage) showMessage("Oda bağlantı hatası. Firebase ayarlarınızı kontrol edin.", "error");
      }
    };

    setupRoom();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user, roomId, navigate, showMessage]);

  const handleJoin = async () => {
    if (!usernameInput.trim()) {
      if (showMessage) showMessage("Lütfen bir kullanıcı adı giriniz", "error");
      return;
    }
    saveUser({ username: usernameInput.trim() });
  };

  if (!user) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
        <div className="box" style={{ maxWidth: '500px', width: '100%', background: '#1e293b', padding: '40px', borderRadius: '16px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)' }}>
          <h2 style={{ fontSize: '1.8rem', color: 'white', marginBottom: '10px' }}>{roomId} Odası</h2>
          <p style={{ color: '#94a3b8', marginBottom: '30px' }}>Arkadaşların seni bekliyor. Katılmak için bir ad belirle.</p>
          
          <div style={{ marginBottom: '20px', background: '#0f172a', padding: '20px', borderRadius: '12px', textAlign: 'left' }}>
            <h3 style={{ color: '#cbd5e1', marginBottom: '16px', fontSize: '0.9rem', letterSpacing: '1px' }}>ŞU AN ODADAKİLER ({users.length}):</h3>
            <ul style={{ listStyleType: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {users.map((u, i) => (
                <li key={i} style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{u.username}</span>
                  {host === u.username && <span style={{ background: '#3b82f6', color: 'white', fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>KURUCU</span>}
                </li>
              ))}
              {users.length === 0 && <li style={{ color: '#64748b', fontSize: '0.9rem' }}>Odada henüz kimse yok.</li>}
            </ul>
          </div>

          <input
            type="text"
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
            placeholder="Kullanıcı Adınız"
            style={{ width: '100%', padding: '16px', fontSize: '1.1rem', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '12px', marginBottom: '20px' }}
          />
          <button onClick={handleJoin} style={{ width: '100%', background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', color: 'white', padding: '16px', fontSize: '1.1rem', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', letterSpacing: '1px' }}>
            ODAYA KATIL
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', position: 'relative' }}>

      {/* Back Button */}
      <div style={{ position: 'absolute', top: 0, left: 0 }}>
        <button
          onClick={() => navigate(-1)}
          style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <span>&#8592;</span> GERİ
        </button>
      </div>

      <div className="box" style={{
        maxWidth: '800px',
        width: '100%',
        background: '#1e293b',
        border: '1px solid rgba(255,255,255,0.05)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
        padding: '40px',
        borderRadius: '16px',
        marginTop: '60px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ fontSize: '1.8rem', color: '#ffffff', letterSpacing: '1px', marginBottom: '8px' }}>ODA: {roomId}</h2>
          <p style={{ color: '#94a3b8', fontSize: '1rem', fontWeight: 400 }}>Arkadaşlarını davet etmek için bağlantıyı paylaş.</p>
        </div>

        {/* Copy Link Section */}
        <div className="copy-link-container" style={{ marginBottom: '30px', background: '#0f172a', padding: '16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', padding: '12px 16px', borderRadius: '8px', color: '#94a3b8', fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', border: '1px solid rgba(255,255,255,0.1)' }}>
            {window.location.origin}/room/{roomId}
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(`${window.location.origin}/room/${roomId}`);
              if (showMessage) showMessage("Bağlantı kopyalandı!", "info");
            }}
            style={{ background: '#3b82f6', padding: '12px 20px', borderRadius: '8px', border: 'none', whiteSpace: 'nowrap', fontWeight: 'bold', letterSpacing: '0.5px', cursor: 'pointer' }}
          >
            📋 KOPYALA
          </button>
        </div>

        <div style={{ marginBottom: '30px', background: '#0f172a', padding: '20px', borderRadius: '12px' }}>
          <h3 style={{ color: '#cbd5e1', marginBottom: '16px', fontSize: '1.1rem' }}>KATILIMCILAR ({users.length}):</h3>
          <ul style={{ listStyleType: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {users.map((u, i) => (
              <li key={i} style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: u.username === user?.username ? 'bold' : 'normal', color: 'white' }}>{u.username}</span>
                {host === u.username && <span style={{ background: '#3b82f6', color: 'white', fontSize: '0.75rem', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' }}>KURUCU</span>}
              </li>
            ))}
          </ul>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <button onClick={() => navigate(`/select-target/${roomId}`)} style={{ width: '100%', background: '#10b981', padding: '16px', fontSize: '1.1rem', letterSpacing: '1px', border: 'none', borderRadius: '8px', boxShadow: 'none', cursor: 'pointer', color: 'white', fontWeight: 'bold' }}>
            KURALARA BAŞLA!
          </button>

          <button onClick={() => navigate(`/results/${roomId}`)} style={{ width: '100%', background: 'transparent', padding: '16px', fontSize: '1.1rem', letterSpacing: '1px', border: '1px solid #3b82f6', borderRadius: '8px', boxShadow: 'none', cursor: 'pointer', color: '#3b82f6', fontWeight: 'bold' }}>
            📊 ODANIN SONUÇLARI GÖR
          </button>
        </div>
      </div>
    </div>
  );
}

export default Room;
