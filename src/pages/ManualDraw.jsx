import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { pots } from '../data/teams';
import { db } from '../firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

function ManualDraw({ user, showMessage }) {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [targetTeam, setTargetTeam] = useState(null);
  const [selectedOpponents, setSelectedOpponents] = useState({
    1: [],
    2: [],
    3: [],
    4: []
  });

  useEffect(() => {
    const saved = localStorage.getItem('kura_target_team');
    if (saved) {
      setTargetTeam(JSON.parse(saved));
    } else {
      navigate(`/select-target/${roomId}`);
    }
  }, [roomId, navigate]);

  const handleSelectTeam = (potIndex, team) => {
    if (targetTeam?.id === team.id) return; // Cannot play against itself

    // Same country rule
    if (team.country === targetTeam?.country) {
      showMessage(`${team.name} aynı ülkeden (${team.country}), rakip olamaz!`, 'error');
      return;
    }

    const currentPotSelections = selectedOpponents[potIndex];
    const isAlreadySelected = currentPotSelections.find(t => t.id === team.id);

    if (isAlreadySelected) {
      // Remove it
      setSelectedOpponents(prev => ({
        ...prev,
        [potIndex]: prev[potIndex].filter(t => t.id !== team.id)
      }));
    } else {
      // Add it if less than 2
      if (currentPotSelections.length >= 2) {
        showMessage(`${potIndex}. Torbadan en fazla 2 takım seçebilirsiniz.`, 'error');
        return;
      }
      setSelectedOpponents(prev => ({
        ...prev,
        [potIndex]: [...prev[potIndex], team]
      }));
    }
  };

  const isSelectionComplete = () => {
    return Object.values(selectedOpponents).every(potSelections => potSelections.length === 2);
  };

  const handleSavePrediction = async () => {
    if (!isSelectionComplete()) {
      showMessage('Lütfen her torbadan 2 takım seçin!', 'error');
      return;
    }

    const allSelections = [
      ...selectedOpponents[1],
      ...selectedOpponents[2],
      ...selectedOpponents[3],
      ...selectedOpponents[4]
    ];

    const username = user?.username || 'Bilinmeyen';

    const prediction = {
      targetTeam,
      opponents: allSelections,
      createdAt: serverTimestamp()
    };
    
    try {
      await setDoc(doc(db, "rooms", roomId, "predictions", username), prediction);
      navigate(`/results/${roomId}`);
    } catch (error) {
      console.error(error);
      showMessage('Tahmin kaydedilirken hata oluştu. Firebase ayarlarını kontrol edin.', 'error');
    }
  };

  if (!targetTeam) return <div>Yükleniyor...</div>;

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
        maxWidth: '1200px', 
        width: '100%', 
        background: '#1e293b', 
        border: '1px solid rgba(255,255,255,0.05)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
        padding: '40px',
        borderRadius: '16px',
        marginTop: '60px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '1.8rem', color: '#ffffff', letterSpacing: '1px', marginBottom: '8px' }}>MANUEL KURA ÇEKİMİ: {targetTeam.name}</h2>
          <p style={{ color: '#94a3b8', fontSize: '1rem', fontWeight: 400 }}>Her torbadan tam olarak 2 rakip seçin.</p>
        </div>
      
        <div className="pot-container">
          {[1, 2, 3, 4].map(potNum => (
            <div key={potNum} className="pot">
              <div className="pot-header">{potNum}. TORBA ({selectedOpponents[potNum].length}/2)</div>
              <div className="team-list">
                {pots[potNum].map(team => {
                  const isSelected = selectedOpponents[potNum].find(t => t.id === team.id);
                  const isSelf = targetTeam.id === team.id;
                  const sameCountry = team.country === targetTeam.country && !isSelf;
                  const isDisabled = isSelf || sameCountry;
                  
                  return (
                    <div 
                      key={team.id}
                      className={`team-item ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
                      onClick={() => {
                        if (!isDisabled) handleSelectTeam(potNum, team);
                      }}
                      title={sameCountry ? `Aynı ülke (${team.country})` : ''}
                    >
                      {team.logo && <img src={team.logo} alt={team.name} className="team-logo" />}
                      <span>{team.name}</span>
                      {sameCountry && <span style={{ fontSize: '0.65rem', color: '#ef4444', marginLeft: '4px' }}>({team.country})</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '40px', textAlign: 'center' }}>
          <button 
            onClick={handleSavePrediction} 
            disabled={!isSelectionComplete()}
            style={{ 
              width: '100%', 
              maxWidth: '400px',
              padding: '16px', 
              fontSize: '1.1rem', 
              letterSpacing: '1px', 
              border: 'none', 
              borderRadius: '8px', 
              boxShadow: 'none',
              background: isSelectionComplete() ? '#10b981' : '#475569',
              color: 'white',
              cursor: isSelectionComplete() ? 'pointer' : 'not-allowed'
            }}
          >
            TAHMİNİ KAYDET
          </button>
        </div>
      </div>
    </div>
  );
}

export default ManualDraw;
