import { useEffect, useState } from 'react';
import Header from '../components/Header';
import ProjectCard from '../components/ProjectCard';
import styles from './DonatePage.module.css';

export default function ProjectPage() {
  const [cards, setCards] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Усі');

  const cardsPerPage = 6;

  useEffect(() => {
    fetch('http://localhost:8000/projects/get/all/projects')
      .then(res => {
        if (!res.ok) throw new Error('Помилка при отриманні проєктів');
        return res.json();
      })
      .then(data => {
        const projectsWithProgress = data.map(project => ({
          ...project,
          progress: Math.min(
            100,
            Math.round((project.current_amount / project.goal_amount) * 100)
          ),
        }));
        setCards(projectsWithProgress);
      })
      .catch(err => console.error('Помилка при отриманні проєктів з API:', err));
  }, []);

  const categories = ['Усі', ...new Set(cards.map(card => card.category).filter(Boolean))];

  const filteredCards = cards.filter(card => {
    const matchesSearch = card.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Усі' || card.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = filteredCards.slice(indexOfFirstCard, indexOfLastCard);
  const totalPages = Math.ceil(filteredCards.length / cardsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <div>
      <main className={styles.projectMain}>
        <div className={styles.head}>
          <div>
            <Header />
          </div>
        </div>
        {/* Панель фільтрів */}
        <div className={styles.filterPanel}>
          <input
            type="text"
            placeholder="Пошук проєкту..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={styles.categorySelect}
          >
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Проєкти */}
        <div className={styles.project}>
          {currentCards.length > 0 ? (
            currentCards.map((card, index) => (
              <ProjectCard
                key={card.id || index}
                title={card.title}
                category={card.category}
                goal_amount={card.goal_amount}
                onClick={() => {
                  setSelectedProject(card);
                  setShowModal(true);
                }}
              />
            ))
          ) : (
            <div className={styles.noResults}>Картки не знайдено</div>
          )}
        </div>

        {/* Пагінація */}
        <div className={styles.pagination}>
          {[...Array(totalPages)].map((_, page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page + 1)}
              className={`${styles.pageButton} ${currentPage === page + 1 ? styles.active : ''}`}
            >
              {page + 1}
            </button>
          ))}
        </div>
      </main>
      {showModal && selectedProject && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalContent}>
            <button className={styles.closeBtn} onClick={() => setShowModal(false)}>×</button>
            <h2>{selectedProject.title}</h2>
            <p><strong>Категорія:</strong> {selectedProject.category}</p>
            <p><strong>Опис:</strong> {selectedProject.description}</p>
            <p><strong>Ціль:</strong> {selectedProject.goal_amount} грн</p>
            <p><strong>IBAN:</strong> {selectedProject.iban_details}</p>
            <p><strong>Власник:</strong> {selectedProject.owner}</p>
            <p><strong>До:</strong> {selectedProject.end_date}</p>
          </div>
        </div>
      )}

    </div>
  );
}

