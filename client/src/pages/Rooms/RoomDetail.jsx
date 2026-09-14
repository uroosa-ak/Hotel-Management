import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import PageHero from '../../components/template/PageHero';
import LegacyPageView from '../../components/template/LegacyPageView';
import roomService from '../../services/roomService';
import { useAuth } from '../../context/AuthContext';

const RoomDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const isMongoId = /^[0-9a-fA-F]{24}$/.test(id || '');

  const [room, setRoom] = useState(null);
  const [activeImage, setActiveImage] = useState(null);
  const [loading, setLoading] = useState(isMongoId);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isMongoId) return;

    let active = true;
    setLoading(true);
    setError('');

    roomService
      .getById(id)
      .then((data) => {
        if (!active) return;
        setRoom(data);
        setActiveImage(data?.images?.[0] || null);
      })
      .catch((err) => {
        if (active) setError(err?.message || 'This accommodation could not be found.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id, isMongoId]);

  // If it's a theme slug like /rooms/single-room, render Motela's rich room-detail page
  if (!isMongoId) {
    return <LegacyPageView name="room-detail" />;
  }

  if (loading) {
    return (
      <section className="motela-section">
        <div className="motela-empty">Loading accommodation…</div>
      </section>
    );
  }

  if (error || !room) {
    return (
      <section className="motela-section">
        <div className="motela-empty">
          <h2 className="motela-title">Accommodation not found</h2>
          <p className="motela-text" style={{ marginBottom: 22 }}>{error || 'This room is no longer listed.'}</p>
          <Link to="/rooms" className="motela-btn">Browse all rooms</Link>
        </div>
      </section>
    );
  }

  const price = room.price || room.pricePerNight || 0;
  const images = room.images?.length ? room.images : ['/images/rooms/room-01.jpg'];
  const currentImage = activeImage || images[0];

  return (
    <>
      <PageHero
        title={room.name}
        subtitle={`${room.type ? room.type.toUpperCase() : 'SUITE'} • ${room.capacity || 2} GUESTS`}
        image={images[0]}
      />

      <section className="motela-section">
        <div className="motela-container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 50, alignItems: 'start' }}>
            <div>
              <div style={{ marginBottom: 20 }}>
                <img
                  src={currentImage}
                  alt={room.name}
                  style={{ width: '100%', height: 440, objectFit: 'cover', display: 'block' }}
                />
              </div>

              {images.length > 1 && (
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  {images.map((src, i) => (
                    <button
                      key={src + i}
                      type="button"
                      onClick={() => setActiveImage(src)}
                      style={{
                        padding: 0,
                        border: currentImage === src ? '2px solid #c19c77' : '2px solid transparent',
                        cursor: 'pointer',
                        background: 'none',
                      }}
                    >
                      <img src={src} alt="" style={{ width: 90, height: 60, objectFit: 'cover', display: 'block' }} />
                    </button>
                  ))}
                </div>
              )}

              <div style={{ marginTop: 36 }}>
                <h3 className="motela-title" style={{ fontSize: 24, marginBottom: 14 }}>The accommodation</h3>
                <p className="motela-text">{room.description || 'Thoughtfully styled with natural textures, ambient lighting, and bespoke furnishings.'}</p>
              </div>

              {room.amenities?.length > 0 && (
                <div style={{ marginTop: 36 }}>
                  <h3 className="motela-title" style={{ fontSize: 24, marginBottom: 14 }}>Room features</h3>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
                    {room.amenities.map((item) => (
                      <li key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, color: '#555' }}>
                        <span style={{ color: '#c19c77', fontSize: 18 }}>•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <aside className="motela-panel" style={{ position: 'sticky', top: 30 }}>
              <p className="motela-eyebrow">Nightly rate</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 20 }}>
                <span className="motela-title" style={{ fontSize: 38 }}>${price}</span>
                <span className="motela-text" style={{ fontSize: 14 }}>/ night</span>
              </div>

              <div style={{ borderTop: '1px solid #eee', borderBottom: '1px solid #eee', padding: '16px 0', margin: '20px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14 }}>
                  <span className="motela-text">Occupancy</span>
                  <span style={{ fontWeight: 600 }}>Up to {room.capacity || 2} guests</span>
                </div>
                {room.bedType && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14 }}>
                    <span className="motela-text">Bedding</span>
                    <span style={{ fontWeight: 600 }}>{room.bedType}</span>
                  </div>
                )}
                {room.size && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                    <span className="motela-text">Room size</span>
                    <span style={{ fontWeight: 600 }}>{room.size} m²</span>
                  </div>
                )}
              </div>

              <button
                type="button"
                className="motela-btn"
                style={{ width: '100%', textAlign: 'center' }}
                onClick={() => {
                  if (isAuthenticated) {
                    navigate(`/booking?roomId=${room._id}`);
                  } else {
                    navigate('/login', { state: { from: { pathname: `/booking?roomId=${room._id}` } } });
                  }
                }}
              >
                Reserve this room
              </button>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
};

export default RoomDetail;
