import { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import './CategoryDetail.css';

function CategoryDetail() {
  const { name } = useParams();
  const location = useLocation();
  const filter = location.state?.filter || '';
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const API_KEY = import.meta.env.VITE_PERENUAL_API_KEY;

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        setLoading(true);

        const startTime = Date.now();
        const url = `https://perenual.com/api/species-list?key=${API_KEY}&${filter}&page=${currentPage}`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error('Nepodařilo se načíst data');
        }

        const data = await response.json();

        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, 3000 - elapsedTime);

        await new Promise((resolve) => setTimeout(resolve, remainingTime));

        setPlants(data.data || []);
        setTotalPages(data.last_page || 1);
        setHasMore(data.to < data.total);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlants();
  }, [API_KEY, filter, currentPage]);

  const categoryNames = {
    indoor: 'Pokojové rostliny',
    edible: 'Jedlé rostliny',
    poisonous: 'Jedovaté rostliny',
    all: 'Všechny rostliny',
  };

  const handleNextPage = () => {
    if (hasMore && currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="category-detail">
        <div className="loading">
          <ClipLoader color="#4a7c2c" size={60} />
          <p>Načítám rostliny...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="category-detail">
        <div className="error">Chyba: {error}</div>
        <Link to="/" className="back-button">
          Zpět na kategorie
        </Link>
      </div>
    );
  }

  return (
    <div className="category-detail">
      <div className="category-header">
        <Link to="/" className="back-button">
          Zpět
        </Link>
        <h1>{categoryNames[name] || name}</h1>
        <p>
          Stránka {currentPage} z {totalPages}
        </p>
      </div>

      <div className="plants-grid">
        {plants.map((plant) => (
          <Link to={`/plant/${plant.id}`} key={plant.id} className="plant-card">
            <div className="plant-image">
              {plant.default_image?.thumbnail ? (
                <img
                  src={plant.default_image.thumbnail}
                  alt={plant.common_name}
                />
              ) : (
                <div className="no-image">🌿</div>
              )}
            </div>
            <div className="plant-info">
              <h3>{plant.common_name}</h3>
              <p className="scientific-name">{plant.scientific_name}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Navigace stránkování */}
      <div className="pagination">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="pagination-button"
        >
          ← Předchozí
        </button>

        <span className="pagination-info">
          Stránka {currentPage} z {totalPages}
        </span>

        <button
          onClick={handleNextPage}
          disabled={!hasMore || currentPage === totalPages}
          className="pagination-button"
        >
          Další →
        </button>
      </div>
    </div>
  );
}

export default CategoryDetail;
