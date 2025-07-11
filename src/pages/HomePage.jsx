import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import MainProjectCard from '../components/MainProjectCard';
import styles from './HomePage.module.css';
import Footer from '../components/Footer';

export default function HomePage() {
  const navigate = useNavigate();
  const [randomProject, setRandomProject] = useState(null);

  const handleShowMore = () => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/projects');
    } else {
      navigate('/auth');
    }
  };

  useEffect(() => {
    fetch('http://localhost:8000/projects/get/all/projects')
      .then(res => {
        if (!res.ok) throw new Error('Помилка при отриманні проєктів');
        return res.json();
      })
      .then(data => {
        if (data.length === 0) return;
        const randomIndex = Math.floor(Math.random() * data.length);
        setRandomProject(data[randomIndex]);
      })
      .catch(err => {
        console.error('Помилка завантаження випадкового проєкту:', err);
      });
  }, []);

  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <div>
      <Header />
      <main>
        <div className='container'>
          <div className={styles['welcome-section']}>
            <div className={styles['welcome-text']}>
              <h1>Ласкаво просимо до нашої платформи проєктів!</h1>
              <p>
                Тут ви можете переглядати актуальні ініціативи, слідкувати за їх прогресом і
                долучатися до найцікавіших ідей. Обирайте проєкт, і станьте частиною цього проєкту уже сьогодні!
              </p>
              <div style={{ textAlign: 'center' }}>
                <button className={styles['primary-btn']} onClick={handleShowMore}>
                  Показати ще...
                </button>
              </div>
            </div>

            <div className={styles['main-card']}>
              {randomProject && (
                <MainProjectCard
                  title={randomProject.title}
                  category={randomProject.category}
                  description={randomProject.description}
                  onClick={() => {
                    setSelectedProject(randomProject);
                    setShowModal(true);
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </main>
      {showModal && selectedProject && (
        <div className={styles.backdrop}>
          <div className={styles.modal}>
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
      <Footer />
    </div>
  );
}
