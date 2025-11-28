import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import './PlantDetail.css';

function PlantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plant, setPlant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_KEY = import.meta.env.VITE_PERENUAL_API_KEY;

  useEffect(() => {
    const fetchPlantDetail = async () => {
      try {
        setLoading(true);

        const startTime = Date.now();
        const url = `https://perenual.com/api/species/details/${id}?key=${API_KEY}`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error('Nepodařilo se načíst detail rostliny');
        }

        const data = await response.json();

        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, 3000 - elapsedTime);

        await new Promise((resolve) => setTimeout(resolve, remainingTime));

        setPlant(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlantDetail();
  }, [id, API_KEY]);

  // Helper funkce pro kontrolu, zda existují data
  const hasValue = (value) => {
    if (value === null || value === undefined) return false;
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'string') return value.trim() !== '';
    return true;
  };

  if (loading) {
    return (
      <div className="plant-detail">
        <div className="loading">
          <ClipLoader color="#4a7c2c" size={60} />
          <p>Načítám detail rostliny...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="plant-detail">
        <div className="error">Chyba: {error}</div>
        <button onClick={() => navigate(-1)} className="back-button">
          ← Zpět
        </button>
      </div>
    );
  }

  if (!plant) {
    return (
      <div className="plant-detail">
        <div className="error">Rostlina nebyla nalezena</div>
        <button onClick={() => navigate(-1)} className="back-button">
          ← Zpět
        </button>
      </div>
    );
  }

  const scientificName = Array.isArray(plant.scientific_name)
    ? plant.scientific_name[0]
    : plant.scientific_name || 'Neznámý vědecký název';

  return (
    <div className="plant-detail">
      <div className="detail-container">
        <button onClick={() => navigate(-1)} className="back-button">
          ← Zpět
        </button>

        <div className="detail-header">
          <div className="detail-image">
            {plant.default_image?.original_url ? (
              <img
                src={plant.default_image.original_url}
                alt={plant.common_name || 'Rostlina'}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.querySelector(
                    '.no-image-large',
                  ).style.display = 'flex';
                }}
              />
            ) : null}
            <div
              className="no-image-large"
              style={{
                display: plant.default_image?.original_url ? 'none' : 'flex',
              }}
            >
              🌿
            </div>
          </div>

          <div className="detail-info">
            <h1>{plant.common_name || 'Bez názvu'}</h1>
            <p className="scientific-name">Also Known As · {scientificName}</p>

            {hasValue(plant.description) && (
              <p className="plant-description">{plant.description}</p>
            )}

            <div className="info-tags">
              {hasValue(plant.cycle) && (
                <span className="tag">
                  <span className="tag-icon">🔄</span>
                  <strong>Cycle:</strong> {plant.cycle}
                </span>
              )}
              {plant.hardiness?.min && plant.hardiness?.max && (
                <span className="tag">
                  <span className="tag-icon">❄️</span>
                  <strong>Hardiness Zone:</strong> {plant.hardiness.min}-
                  {plant.hardiness.max}
                </span>
              )}
              {hasValue(plant.growth_rate) && (
                <span className="tag">
                  <span className="tag-icon">📈</span>
                  <strong>Growth Rate:</strong> {plant.growth_rate}
                </span>
              )}
              {hasValue(plant.watering) && (
                <span className="tag">
                  <span className="tag-icon">💧</span>
                  <strong>Watering:</strong> {plant.watering}
                </span>
              )}
              {hasValue(plant.sunlight) && (
                <span className="tag">
                  <span className="tag-icon">☀️</span>
                  <strong>Sun:</strong> {plant.sunlight[0]}
                </span>
              )}
              {hasValue(plant.care_level) && (
                <span className="tag">
                  <span className="tag-icon">🎯</span>
                  <strong>Care Level:</strong> {plant.care_level}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="detail-content">
          {/* Základní informace */}
          {(hasValue(plant.type) ||
            hasValue(plant.dimension) ||
            hasValue(plant.attracts) ||
            hasValue(plant.propagation)) && (
            <div className="info-section">
              <h2>Základní informace</h2>
              <div className="info-grid">
                {hasValue(plant.type) && (
                  <div className="info-item">
                    <strong>Typ:</strong>
                    <span>{plant.type}</span>
                  </div>
                )}
                {hasValue(plant.dimension) && (
                  <div className="info-item">
                    <strong>Rozměry:</strong>
                    <span>{plant.dimension}</span>
                  </div>
                )}
                {hasValue(plant.attracts) && (
                  <div className="info-item">
                    <strong>Přitahuje:</strong>
                    <span>{plant.attracts.join(', ')}</span>
                  </div>
                )}
                {hasValue(plant.propagation) && (
                  <div className="info-item">
                    <strong>Rozmnožování:</strong>
                    <span>{plant.propagation.join(', ')}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Zalévání */}
          {hasValue(plant.watering) && (
            <div className="info-section">
              <h2>💧 Watering</h2>
              <div className="detail-text">
                <p>
                  {plant.common_name || 'This plant'} should be watered{' '}
                  {plant.watering.toLowerCase()}.
                </p>
              </div>
            </div>
          )}

          {/* Světlo */}
          {hasValue(plant.sunlight) && (
            <div className="info-section">
              <h2>☀️ Sunlight</h2>
              <div className="detail-text">
                <p>
                  {plant.common_name || 'This plant'} requires{' '}
                  {plant.sunlight.join(', ').toLowerCase()} sunlight.
                </p>
              </div>
            </div>
          )}

          {/* Prořezávání */}
          {hasValue(plant.pruning_month) && (
            <div className="info-section">
              <h2>✂️ Pruning</h2>
              <div className="detail-text">
                <p>
                  {plant.common_name || 'This plant'} should be pruned{' '}
                  {plant.pruning_count
                    ? `${plant.pruning_count.amount} ${plant.pruning_count.interval}`
                    : 'regularly'}
                  , ideally in {plant.pruning_month.join(', ')}.
                </p>
              </div>
            </div>
          )}

          {/* Půda */}
          {hasValue(plant.soil) && (
            <div className="info-section">
              <h2>🌱 Půda</h2>
              <div className="detail-text">
                <p>
                  <strong>Doporučené typy půdy:</strong> {plant.soil.join(', ')}
                </p>
              </div>
            </div>
          )}

          {/*Škůdci */}
          {(hasValue(plant.pest_susceptibility) ||
            hasValue(plant.disease_susceptibility)) && (
            <div className="info-section">
              <h2>🐛 Škůdci a nemoci</h2>
              <div className="detail-text">
                {hasValue(plant.pest_susceptibility) && (
                  <p>
                    <strong>Náchylnost na škůdce:</strong>{' '}
                    {plant.pest_susceptibility.join(', ')}
                  </p>
                )}
                {hasValue(plant.disease_susceptibility) && (
                  <p>
                    <strong>Náchylnost na nemoci:</strong>{' '}
                    {plant.disease_susceptibility.join(', ')}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Varování */}
          {(plant.poisonous_to_humans === 1 ||
            plant.poisonous_to_pets === 1 ||
            plant.edible_leaf === 1 ||
            plant.edible_fruit === 1) && (
            <div className="info-section">
              <h2>⚠️ Důležité informace</h2>
              <div className="warnings">
                {plant.poisonous_to_humans === 1 && (
                  <div className="warning-item danger">
                    <span>⚠️</span>
                    <strong>Pozor!</strong> Tato rostlina je jedovatá pro
                    člověka
                  </div>
                )}
                {plant.poisonous_to_pets === 1 && (
                  <div className="warning-item danger">
                    <span>🐾</span>
                    <strong>Pozor!</strong> Tato rostlina je jedovatá pro domácí
                    mazlíčky
                  </div>
                )}
                {plant.edible_leaf === 1 && (
                  <div className="warning-item success">
                    <span>🥗</span>
                    <strong>Jedlé listy</strong>
                  </div>
                )}
                {plant.edible_fruit === 1 && (
                  <div className="warning-item success">
                    <span>🍎</span>
                    <strong>Jedlé ovoce</strong>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PlantDetail;
