import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { allTeams } from '../data/teams';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';

function Results({ user }) {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [predictions, setPredictions] = useState([]);
  const [expandedUser, setExpandedUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "rooms", roomId, "predictions"), (snapshot) => {
      const fetched = [];
      snapshot.forEach(doc => {
        fetched.push({ username: doc.id, ...doc.data() });
      });
      setPredictions(fetched);
    }, (error) => {
      console.error(error);
    });
    return () => unsubscribe();
  }, [roomId]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', padding: '20px' }}>
      
      {/* Back Button */}
      <div style={{ width: '100%', maxWidth: '900px', marginBottom: '20px' }}>
        <button 
          onClick={() => navigate(`/room/${roomId}`)} 
          style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <span>&#8592;</span> ODAYA DÖN
        </button>
      </div>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px', maxWidth: '900px', width: '100%' }}>
        <h1 style={{ fontSize: '1.8rem', color: '#f8fafc', letterSpacing: '2px', marginBottom: '8px' }}>TAHMİN SONUÇLARI</h1>
        <p style={{ color: '#64748b', fontSize: '0.95rem' }}>ODA: {roomId} • {predictions.length} tahmin yapıldı</p>
      </div>

      {/* Predictions List */}
      <div style={{ maxWidth: '900px', width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {predictions.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: 'rgba(30, 41, 59, 0.8)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Henüz kimse tahmin yapmadı.</p>
            <button 
              onClick={() => navigate(`/select-target/${roomId}`)}
              style={{ marginTop: '20px', background: '#3b82f6', padding: '12px 30px', borderRadius: '8px', border: 'none', cursor: 'pointer', color: 'white', fontWeight: 'bold' }}
            >
              TAHMİN YAP
            </button>
          </div>
        )}

        {predictions.map((pred, index) => {
          const isExpanded = expandedUser === pred.username;
          const isMe = pred.username === user?.username;
          const targetTeam = pred.targetTeam;
          
          return (
            <div 
              key={pred.username}
              style={{ 
                background: isMe ? 'rgba(15, 23, 42, 0.95)' : 'rgba(30, 41, 59, 0.95)',
                border: isMe ? '2px solid rgba(56, 189, 248, 0.5)' : '1px solid rgba(255,255,255,0.1)',
                borderRadius: '16px',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                boxShadow: isMe ? '0 0 20px rgba(56, 189, 248, 0.15)' : '0 4px 6px rgba(0,0,0,0.3)'
              }}
            >
              {/* User Header - Clickable */}
              <div 
                onClick={() => setExpandedUser(isExpanded ? null : pred.username)}
                style={{ 
                  padding: '20px 24px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '16px',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
              >
                {/* Rank */}
                <div style={{ 
                  width: '36px', height: '36px', 
                  borderRadius: '50%', 
                  background: index === 0 ? '#d4a017' : index === 1 ? '#94a3b8' : index === 2 ? '#cd7f32' : '#334155',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 'bold', fontSize: '0.9rem', flexShrink: 0,
                  color: index < 3 ? '#0f172a' : '#94a3b8'
                }}>
                  {index + 1}
                </div>

                {/* Team Logo */}
                {targetTeam?.logo && (
                  <img src={targetTeam.logo} alt="" style={{ width: '40px', height: '40px', objectFit: 'contain', flexShrink: 0 }} />
                )}

                {/* Username & Team */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#f8fafc' }}>
                    {pred.username} {isMe && <span style={{ fontSize: '0.75rem', color: '#38bdf8', marginLeft: '8px' }}>(SEN)</span>}
                  </div>
                  <div style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '2px' }}>
                    {targetTeam?.name || 'Bilinmeyen'} için tahmin
                    {pred.type === 'random' && <span style={{ color: '#d4a017', marginLeft: '8px' }}>🎲 Rastgele</span>}
                  </div>
                </div>

                {/* Expand Arrow */}
                <span style={{ color: '#64748b', fontSize: '1.2rem', transition: 'transform 0.3s', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                  ▼
                </span>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div style={{ 
                  padding: '0 24px 24px', 
                  borderTop: '1px solid rgba(255,255,255,0.05)',
                  animation: 'slideDown 0.3s ease'
                }}>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '16px 0 12px', letterSpacing: '1px' }}>SEÇİLEN RAKİPLER:</p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                    {(pred.opponents || []).map((opp, i) => (
                      <div key={opp.id || i} style={{ 
                        background: 'rgba(15, 23, 42, 0.6)', 
                        borderRadius: '12px', 
                        padding: '16px 8px',
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        gap: '8px',
                        border: '1px solid rgba(255,255,255,0.05)'
                      }}>
                        {opp.logo && <img src={opp.logo} alt={opp.name} style={{ width: '36px', height: '36px', objectFit: 'contain' }} />}
                        <span style={{ fontSize: '0.75rem', color: '#cbd5e1', textAlign: 'center', fontWeight: 600 }}>{opp.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Actions */}
      <div style={{ display: 'flex', gap: '16px', marginTop: '40px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button 
          onClick={() => navigate(`/select-target/${roomId}`)}
          style={{ background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', padding: '14px 30px', borderRadius: '12px', border: 'none', cursor: 'pointer', color: 'white', fontWeight: 'bold', letterSpacing: '1px', boxShadow: '0 4px 15px rgba(2, 132, 199, 0.4)' }}
        >
          YENİ TAHMİN YAP
        </button>
        <button 
          onClick={() => navigate('/')}
          style={{ background: 'rgba(255,255,255,0.1)', padding: '14px 30px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', color: '#94a3b8', fontWeight: 'bold' }}
        >
          ANA SAYFAYA DÖN
        </button>
      </div>

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; max-height: 0; }
          to { opacity: 1; max-height: 500px; }
        }
      `}</style>
    </div>
  );
}

export default Results;
