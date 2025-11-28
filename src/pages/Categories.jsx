import { Link } from 'react-router-dom';
import './Categories.css';

function Categories() {
  const categories = [
    {
      name: 'Pokojové rostliny',
      slug: 'indoor',
      description: 'Rostliny vhodné do interiéru',
      icon: '🏠',
      filter: 'indoor=1',
    },
    {
      name: 'Jedlé rostliny',
      slug: 'edible',
      description: 'Rostliny s jedlými částmi',
      icon: '🥗',
      filter: 'edible=1',
    },
    {
      name: 'Jedovaté rostliny',
      slug: 'poisonous',
      description: 'Rostliny jedovaté pro člověka',
      icon: '⚠️',
      filter: 'poisonous_to_humans=1',
    },
    {
      name: 'Všechny rostliny',
      slug: 'all',
      description: 'Kompletní seznam rostlin',
      icon: '🌍',
      filter: '',
    },
  ];

  return (
    <div className="categories-page">
      <div className="hero">
        <h1>Lexikon Rostlin</h1>
        <p>Objevte svět rostlin - od pokojových až po jedlé druhy</p>
      </div>

      <div className="categories-container">
        <h2>Kategorie rostlin</h2>
        <div className="categories-grid">
          {categories.map((category) => (
            <Link
              to={`/category/${category.slug}`}
              key={category.slug}
              className="category-card"
              state={{ filter: category.filter }}
            >
              <div className="category-icon">{category.icon}</div>
              <h3>{category.name}</h3>
              <p>{category.description}</p>
              <span className="category-arrow">→</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Categories;
