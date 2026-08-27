import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { pots, allTeams } from '../data/teams';
import { db } from '../firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

function RandomDraw({ user, showMessage }) {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [targetTeam, setTargetTeam] = useState(null);
  const [phase, setPhase] = useState('idle'); // idle, spinning, revealing, done
  const [currentSlot, setCurrentSlot] = useState(0); // which slot (0-7) is being revealed
  const [spinLogos, setSpinLogos] = useState([]); // logos cycling during spin
  const [results, setResults] = useState([]); // final 8 opponents
  const [revealedResults, setRevealedResults] = useState([]); // progressively revealed
  const spinInterval = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('kura_target_team');
    if (saved) {
      setTargetTeam(JSON.parse(saved));
    } else {
      navigate(`/select-target/${roomId}`);
    }
  }, [roomId, navigate]);

  const generateDraw = () => {
    if (!targetTeam) return;
    
    const opponents = [];
    
    // For each pot, pick 2 random teams (not same country, not self)
    [1, 2, 3, 4].forEach(potNum => {
      const available = pots[potNum].filter(t => 
        t.id !== targetTeam.id && t.country !== targetTeam.country
      );
      
      // Shuffle and pick 2
      const shuffled = [...available].sort(() => Math.random() - 0.5);
      opponents.push(shuffled[0], shuffled[1]);
    });

    return opponents;
  };

  const startDraw = () => {
    const drawn = generateDraw();
    if (!drawn) return;
    
    setResults(drawn);
    setRevealedResults([]);
    setPhase('spinning');
    setCurrentSlot(0);
    
    // Start revealing one by one
    revealSequence(drawn, 0);
  };

  const revealSequence = (drawn, slotIndex) => {
    if (slotIndex >= 8) {
      setPhase('done');
      return;
    }

    setCurrentSlot(slotIndex);
    
    // Spin animation: cycle through random logos fast
    let spinCount = 0;
    const maxSpins = 15 + Math.floor(Math.random() * 10);
    
    spinInterval.current = setInterval(() => {
      const randomTeam = allTeams[Math.floor(Math.random() * allTeams.length)];
      setSpinLogos(prev => {
        const copy = [...prev];
        copy[slotIndex] = randomTeam;
        return copy;
      });
      spinCount++;
      
      if (spinCount >= maxSpins) {
        clearInterval(spinInterval.current);
        
        // Reveal the actual result
        setSpinLogos(prev => {
          const copy = [...prev];
          copy[slotIndex] = drawn[slotIndex];
          return copy;
        });
        setRevealedResults(prev => [...prev, drawn[slotIndex]]);
        setPhase('revealing');
        
        // Next slot after delay
        setTimeout(() => {
          revealSequence(drawn, slotIndex + 1);
        }, 800);
      }
    }, 80);
  };

  const handleSave = async () => {
    const username = user?.username || 'Bilinmeyen';
    try {
      await setDoc(doc(db, "rooms", roomId, "predictions", `${username}_${targetTeam.id}`), {
        username,
        targetTeam,
        opponents: results,
        type: 'random',
        createdAt: serverTimestamp()
      });
      navigate(`/results/${roomId}`);
    } catch (error) {
      console.error(error);
      showMessage('Tahmin kaydedilirken hata oluştu.', 'error');
    }
  };

  useEffect(() => {
    return () => {
      if (spinInterval.current) clearInterval(spinInterval.current);
    };
  }, []);

  if (!targetTeam) return <div>Yükleniyor...</div>;

  const potLabels = ['1. TORBA', '1. TORBA', '2. TORBA', '2. TORBA', '3. TORBA', '3. TORBA', '4. TORBA', '4. TORBA'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', padding: '20px' }}>
      
      {/* Back Button */}
      <div style={{ width: '100%', maxWidth: '900px', marginBottom: '20px' }}>
        <button 
          onClick={() => navigate(-1)} 
          style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <span>&#8592;</span> GERİ
        </button>
      </div>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', marginBottom: '12px' }}>
          <img src={targetTeam.logo} alt={targetTeam.name} style={{ width: '60px', height: '60px', objectFit: 'contain' }} />
          <h1 style={{ fontSize: '1.8rem', color: '#f8fafc', letterSpacing: '2px' }}>RASTGELE KURA</h1>
        </div>
        <p style={{ color: '#94a3b8', fontSize: '1rem' }}>{targetTeam.name} için rastgele 8 rakip çekiliyor</p>
      </div>

      {/* Draw Grid */}
      <div className="random-draw-grid">
        {Array.from({ length: 8 }).map((_, i) => {
          const isRevealed = revealedResults[i];
          const isSpinning = phase === 'spinning' && currentSlot === i;
          const spinTeam = spinLogos[i];
          const team = isRevealed || (isSpinning ? spinTeam : null);

          return (
            <div 
              key={i}
              style={{
                background: isRevealed ? 'rgba(16, 185, 129, 0.1)' : 'rgba(30, 41, 59, 0.9)',
                border: isRevealed ? '2px solid rgba(16, 185, 129, 0.4)' : isSpinning ? '2px solid #38bdf8' : '1px solid rgba(255,255,255,0.1)',
                borderRadius: '16px',
                padding: '24px 16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '180px',
                transition: 'all 0.3s ease',
                boxShadow: isSpinning ? '0 0 20px rgba(56, 189, 248, 0.3)' : isRevealed ? '0 0 15px rgba(16, 185, 129, 0.2)' : 'none',
                animation: isSpinning ? 'pulse 0.5s ease infinite' : 'none',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Pot Label */}
              <div style={{ 
                position: 'absolute', top: '8px', left: '12px',
                fontSize: '0.7rem', color: '#64748b', fontWeight: 'bold', letterSpacing: '1px'
              }}>
                {potLabels[i]}
              </div>

              {team ? (
                <>
                  <img 
                    src={team.logo} 
                    alt={team.name}
                    style={{ 
                      width: '70px', height: '70px', objectFit: 'contain',
                      filter: isRevealed ? 'none' : 'brightness(1.2)',
                      transition: 'all 0.2s',
                      animation: isSpinning ? 'none' : isRevealed ? 'bounceIn 0.5s ease' : 'none'
                    }} 
                  />
                  <span style={{ 
                    marginTop: '12px', 
                    color: isRevealed ? '#10b981' : '#94a3b8', 
                    fontWeight: 'bold', 
                    fontSize: '0.85rem',
                    letterSpacing: '0.5px',
                    textAlign: 'center'
                  }}>
                    {team.name}
                  </span>
                </>
              ) : (
                <div style={{ 
                  width: '70px', height: '70px', 
                  borderRadius: '50%', 
                  background: 'rgba(255,255,255,0.03)', 
                  border: '2px dashed rgba(255,255,255,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.5rem', color: '#334155'
                }}>
                  ?
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {phase === 'idle' && (
          <button 
            onClick={startDraw}
            style={{ 
              background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
              padding: '18px 50px', 
              fontSize: '1.2rem', 
              letterSpacing: '2px',
              border: 'none', 
              borderRadius: '12px', 
              boxShadow: '0 4px 20px rgba(2, 132, 199, 0.5)',
              cursor: 'pointer',
              color: 'white',
              fontWeight: 'bold'
            }}
          >
            🎲 KURAYI ÇEK!
          </button>
        )}

        {phase === 'done' && (
          <>
            <button 
              onClick={handleSave}
              style={{ 
                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                padding: '16px 40px', 
                fontSize: '1.1rem', 
                letterSpacing: '1px',
                border: 'none', 
                borderRadius: '12px', 
                boxShadow: '0 4px 15px rgba(5, 150, 105, 0.4)',
                cursor: 'pointer',
                color: 'white',
                fontWeight: 'bold'
              }}
            >
              ✔ KURAYI KAYDET
            </button>
            <button 
              onClick={() => {
                setPhase('idle');
                setRevealedResults([]);
                setSpinLogos([]);
                setResults([]);
              }}
              style={{ 
                background: 'rgba(255,255,255,0.1)',
                padding: '16px 40px', 
                fontSize: '1.1rem',
                border: '1px solid rgba(255,255,255,0.2)', 
                borderRadius: '12px',
                cursor: 'pointer',
                color: '#94a3b8',
                fontWeight: 'bold'
              }}
            >
              🔄 TEKRAR ÇEK
            </button>
          </>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 20px rgba(56, 189, 248, 0.3); }
          50% { box-shadow: 0 0 30px rgba(56, 189, 248, 0.6); }
        }
        @keyframes bounceIn {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default RandomDraw;
