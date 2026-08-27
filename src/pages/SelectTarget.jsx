import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { allTeams, getRating } from '../data/teams';

function SelectTarget({ user, showMessage }) {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedTeam = allTeams[selectedIndex];
  const carouselRef = useRef(null);

  // Auto-scroll carousel to selected team
  useEffect(() => {
    if (carouselRef.current) {
      const item = carouselRef.current.children[selectedIndex];
      if (item) {
        item.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  const handlePrev = () => {
    setSelectedIndex(prev => (prev === 0 ? allTeams.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex(prev => (prev === allTeams.length - 1 ? 0 : prev + 1));
  };

  const handleRandomDraw = () => {
    if (!selectedTeam) return showMessage('Lütfen bir takım seçin!', 'error');
    localStorage.setItem('kura_target_team', JSON.stringify(selectedTeam));
    navigate(`/random-draw/${roomId}`);
  };

  const handleManualDraw = () => {
    if (!selectedTeam) return showMessage('Lütfen bir takım seçin!', 'error');
    localStorage.setItem('kura_target_team', JSON.stringify(selectedTeam));
    navigate(`/manual-draw/${roomId}`);
  };

  // PES-style rating color
  const ratingColor = (val) => {
    if (val >= 85) return '#d4a017';
    if (val >= 80) return '#c0c0c0';
    return '#cd7f32';
  };

  const statRow = (label, value) => {
    const rating = getRating(value);
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: '8px 0',
        borderBottom: '1px solid rgba(255,255,255,0.05)'
      }}>
        <span style={{ color: '#ccc', fontWeight: 'bold', fontSize: '0.95rem', letterSpacing: '1px' }}>
          {label} {value}
        </span>
        <span style={{ 
          color: ratingColor(value), 
          fontWeight: 900, 
          fontStyle: 'italic', 
          fontSize: '1.3rem',
          textShadow: `0 0 8px ${ratingColor(value)}40`
        }}>
          {rating}
        </span>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100vh' }}>
      
      {/* Top Bar */}
      <div style={{ padding: '20px', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <button 
          onClick={() => navigate(-1)} 
          style={{ position: 'absolute', left: '20px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', zIndex: 10 }}
        >
          <span>&#8592;</span> <span className="hide-on-mobile">GERİ</span>
        </button>
        <div style={{ textAlign: 'center', padding: '0 40px' }}>
          <h2 style={{ letterSpacing: '2px', color: '#cbd5e1', fontSize: '1.1rem', textTransform: 'uppercase', margin: 0 }}>KİME KURA ÇEKMEK İSTİYORSUN?</h2>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0 20px' }}>
        
        {/* PES Card */}
        <div className="pes-card" style={{ 
          background: 'rgba(20, 20, 20, 0.9)', 
          border: '1px solid #333', 
          boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
          borderRadius: '12px',
          overflow: 'hidden',
          position: 'relative'
        }}>
          
          {/* Left Arrow (Overlay) */}
          <button 
            onClick={handlePrev}
            style={{ 
              position: 'absolute',
              top: '50%',
              left: 0,
              transform: 'translateY(-50%)',
              background: 'rgba(0, 0, 0, 0.6)', 
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.1)', 
              borderLeft: 'none',
              width: '40px', height: '70px', 
              borderRadius: '0 12px 12px 0', 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', fontSize: '1.2rem', color: '#f8fafc',
              zIndex: 10
            }}
          >
            ◀
          </button>

          {/* Right Arrow (Overlay) */}
          <button 
            onClick={handleNext}
            style={{ 
              position: 'absolute',
              top: '50%',
              right: 0,
              transform: 'translateY(-50%)',
              background: 'rgba(0, 0, 0, 0.6)', 
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.1)', 
              borderRight: 'none',
              width: '40px', height: '70px', 
              borderRadius: '12px 0 0 12px', 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', fontSize: '1.2rem', color: '#f8fafc',
              zIndex: 10
            }}
          >
            ▶
          </button>

          {/* Header */}
          <div style={{ background: '#111', padding: '12px 20px', borderBottom: '2px solid #222', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#fff', fontWeight: 'bold', letterSpacing: '1px', fontSize: '0.9rem' }}>HOME</span>
            <span style={{ color: '#64748b', fontSize: '0.8rem' }}>{selectedTeam.country}</span>
          </div>

          {/* Logo & Name */}
          <div style={{ padding: '30px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <img src={selectedTeam.logo} alt={selectedTeam.name} style={{ height: '140px', objectFit: 'contain', filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.6))', marginBottom: '16px' }} />
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, letterSpacing: '1px', color: '#f8fafc' }}>{selectedTeam.name}</h2>
          </div>

          {/* Stats Grid - PES Style */}
          <div style={{ padding: '20px 30px', background: 'rgba(255,255,255,0.02)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 40px' }}>
              {statRow('OFF', selectedTeam.stats.off)}
              {statRow('DEF', selectedTeam.stats.def)}
              {statRow('TAC', selectedTeam.stats.tac)}
              {statRow('SPD', selectedTeam.stats.spd)}
              {statRow('TEC', selectedTeam.stats.tec)}
              {statRow('PHY', selectedTeam.stats.phy)}
            </div>
          </div>
        </div>

      </div>

      {/* Action Buttons */}
      <div className="action-buttons" style={{ display: 'flex', justifyContent: 'center', gap: '20px', padding: '20px' }}>
        <button onClick={handleRandomDraw} style={{ background: '#334155', borderRadius: '30px', padding: '12px 30px', border: '1px solid #475569' }}>
          🎲 RASTGELE
        </button>
        <button onClick={handleManualDraw} style={{ background: '#334155', borderRadius: '30px', padding: '12px 30px', border: '1px solid #475569' }}>
          ✔ SEÇ & DEVAM ET
        </button>
      </div>

      {/* Bottom Carousel */}
      <div 
        ref={carouselRef}
        style={{ 
          background: 'rgba(255,255,255,0.05)', 
          backdropFilter: 'blur(10px)',
          padding: '15px 0', 
          display: 'flex', 
          overflowX: 'auto', 
          gap: '8px', 
          paddingLeft: '30px', paddingRight: '30px', 
          borderTop: '2px solid rgba(255,255,255,0.1)',
          scrollbarWidth: 'none'
        }}
      >
        {allTeams.map((team, index) => (
          <div 
            key={team.id} 
            onClick={() => setSelectedIndex(index)}
            style={{ 
              minWidth: '80px', 
              height: '80px', 
              background: selectedIndex === index ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
              border: selectedIndex === index ? '2px solid #38bdf8' : '1px solid rgba(255,255,255,0.08)',
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
              opacity: selectedIndex === index ? 1 : 0.5,
              transition: 'all 0.15s ease',
              flexShrink: 0
            }}
          >
            <img src={team.logo} alt={team.name} style={{ width: '50px', height: '50px', objectFit: 'contain' }} />
          </div>
        ))}
      </div>
      
    </div>
  );
}

export default SelectTarget;
