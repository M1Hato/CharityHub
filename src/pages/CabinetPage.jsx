import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './cabinet.module.css';

import Header from '../components/Header';

export default function CabinetPage() {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [code, setCode] = useState('');
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDesc, setProjectDesc] = useState('');

  const [projectCategory, setProjectCategory] = useState('');
  const [goalAmount, setGoalAmount] = useState('');
  const [ibanDetails, setIbanDetails] = useState('');
  const [endDate, setEndDate] = useState('');
  const [projectOwner, setProjectOwner] = useState('');




  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('user_email');
  
    if (!token || !email) {
      navigate('/auth');
      return;
    }
  
    fetch(`http://localhost:8000/auth/get/user/${encodeURIComponent(email)}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        if (!res.ok) throw new Error('Помилка при отриманні даних');
        return res.json();
      })
      .then(data => {
        setUser({
          name: data.username,
          email: data.email,
          is_verified: data.is_verified,
        });
  
        // оновлюємо локальне сховище
        localStorage.setItem('user_name', data.username);
        localStorage.setItem('user_email', data.email);
      })
      .catch(err => {
        console.error(err);
        setMessage("Не вдалося завантажити профіль користувача.");
      });
  }, [navigate]);
  

  const handleConfirmCode = async () => {
    const token = localStorage.getItem('token');
    if (!token || !user?.email || !code) return;

    const params = new URLSearchParams({
      email: user.email,
      verification_code: code,
    });

    try {
      const res = await fetch(
        `http://localhost:8000/auth/profile/email/verification?${params.toString()}`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: null,
        },
      );

      if (!res.ok) throw await res.json();

      setMessage('Email підтверджено!');
      setShowVerifyModal(false);
      setUser((prev) => ({ ...prev, is_verified: true }));
    } catch (err) {
      console.error('Помилка верифікації:', err);
      setMessage('Код невірний або сталася помилка.');
    }
  };


  const handleCreateProject = async () => {
    const token = localStorage.getItem('token');

    if (
      !token ||
      !projectTitle ||
      !goalAmount ||
      !ibanDetails ||
      !endDate ||
      !projectCategory ||
      !projectOwner
    ) {
      setMessage("Заповніть усі поля.");
      return;
    }

    const params = new URLSearchParams({
      title: projectTitle,
      description: projectDesc,
      category: projectCategory,
      goal_amount: goalAmount,
      iban_details: ibanDetails,
      owner: projectOwner,
      end_date: endDate,
    });

    try {
      const res = await fetch(
        `http://localhost:8000/projects/create/project?${params.toString()}`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: null,
        }
      );

      if (!res.ok) throw await res.json();

      setMessage('Проєкт створено успішно!');
      setShowProjectModal(false);
    } catch (err) {
      console.error('Створення проєкту не вдалося:', err);
      setMessage('Помилка створення. Перевірте дані та спробуйте знову.');
    }
  };

  if (!user) return <p>Завантаження…</p>;

  return (
    <div>
      <Header />

      <div className={styles.usercontainer}>
        <h2 className={styles.huser}>Мій кабінет</h2>

        <div className={styles.profileBox}>
          <p><strong>Ім’я:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>

          <div className={styles.btnRow}>
            {/* кнопка бачиться лише якщо email НЕ підтверджено */}
            {!user.is_verified && (
              <button
                className={styles.primaryBtn}
                onClick={() => setShowVerifyModal(true)}
              >
                Підтвердити email
              </button>
            )}

            <button
              className={styles.secondaryBtn}
              onClick={() => setShowProjectModal(true)}
            >
              Додати проєкт
            </button>
          </div>

          {message && <p className={styles.statusMsg}>{message}</p>}
        </div>
      </div>

      {/* Модалка підтвердження email */}
      {showVerifyModal && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalBox}>
            <h2>Підтвердження email</h2>
            <input
              type="text"
              placeholder="Введіть код з пошти"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <div className={styles.modalButtons}>
              <button onClick={handleConfirmCode}>Підтвердити</button>
              <button onClick={() => setShowVerifyModal(false)}>Скасувати</button>
            </div>
          </div>
        </div>
      )}

      {/* Модалка створення проєкту */}
      {showProjectModal && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalBox}>
            <h2>Новий проєкт</h2>

            <input
              type="text"
              placeholder="Назва проєкту"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
            />

            <textarea
              placeholder="Опис (обов'язково)"
              value={projectDesc}
              onChange={(e) => setProjectDesc(e.target.value)}
            />

            <input
              type="text"
              placeholder="Категорія"
              value={projectCategory}
              onChange={(e) => setProjectCategory(e.target.value)}
            />

            <input
              type="number"
              placeholder="Цільова сума (грн)"
              value={goalAmount}
              onChange={(e) => setGoalAmount(e.target.value)}
            />

            <input
              type="text"
              placeholder="IBAN рахунок"
              value={ibanDetails}
              onChange={(e) => setIbanDetails(e.target.value)}
            />
            <input
              type="text"
              placeholder="Власник проєкту"
              value={projectOwner}
              onChange={(e) => setProjectOwner(e.target.value)}
            />


            <input
              type="date"
              placeholder="Дата завершення"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />

            <div className={styles.modalButtons}>
              <button onClick={handleCreateProject}>Створити</button>
              <button onClick={() => setShowProjectModal(false)}>Скасувати</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
