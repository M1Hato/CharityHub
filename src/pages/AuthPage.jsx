//повністю робоча реєстрація

import { useState, useEffect } from 'react';
import styles from './login-page.module.css';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    setName('');
    setEmail('');
    setPassword('');
    setErrors({});
  }, [isLogin]);

  const validate = () => {
    const newErrors = {};

    const allowedEmailDomains = [
      'gmail.com',
      'outlook.com',
      'ukr.net',
      'icloud.com',
      'yahoo.com',
    ];

    if (!email.trim()) {
      newErrors.email = 'Поле "Пошта" є обовʼязковим';
    } else {
      const regex = /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
      const match = email.match(regex);

      if (!match || !allowedEmailDomains.includes(match[1].toLowerCase())) {
        newErrors.email = 'Використовуйте пошту з перевіреного домену (наприклад, gmail.com)';
      }
    }

    if (!password.trim()) {
      newErrors.password = 'Поле "Пароль" є обовʼязковим';
    } else if (password.length < 6) {
      newErrors.password = 'Пароль має містити мінімум 6 символів';
    }

    if (!isLogin && !name.trim()) {
      newErrors.name = 'Поле "Імʼя" є обовʼязковим';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    if (isLogin) {
      // Логін
      const params = new URLSearchParams({
        email: email,
        password: password,
      });

      try {
        const response = await fetch(`http://localhost:8000/auth/login/email?${params.toString()}`, {
          method: "POST",
          headers: {
            "accept": "application/json",
          },
          credentials: "include",
          body: null,
        });

        const data = await response.json();

        if (!response.ok) {
          console.error("Помилка логіну:", data);
          setErrors({ form: data.detail || "Помилка при логіні" });
        } else {
          console.log("Успішний логін:", data);
          localStorage.setItem('id', data.id);
          localStorage.setItem("token", data.access_token);
          localStorage.setItem('user_email', data.email);

          // 🧠 Декодуємо токен та зберігаємо email
          const decoded = jwtDecode(data.access_token);
          const extractedEmail = decoded.sub || decoded.email;
          if (extractedEmail) {
            localStorage.setItem('user_email', extractedEmail);
          }
          //TEST
          window.location.href = "/";
        }
      } catch (error) {
        console.error("Помилка з'єднання при логіні:", error);
        setErrors({ form: "Помилка з'єднання з сервером" });
      }

    } else {
      // Реєстрація
      const params = new URLSearchParams({
        username: name,
        email: email,
        password: password,
      });

      try {
        const response = await fetch(`http://localhost:8000/auth/registration?${params.toString()}`, {
          method: "POST",
          headers: {
            "accept": "application/json",
          },
          credentials: "include",
          body: null,
        });

        const data = await response.json();

        if (!response.ok) {
          console.error("Помилка реєстрації:", data);
          setErrors({ form: data.detail || "Помилка при реєстрації" });
        } else {
          console.log("Успішна реєстрація:", data);

          try {
            const verificationParams = new URLSearchParams({ email: email.trim() });

            const verificationRes = await fetch(
              `http://localhost:8000/auth/profile/email/get/verification-code?${verificationParams.toString()}`,
              {
                method: "POST",
                headers: {
                  "accept": "application/json",
                },
                credentials: "include",
                body: "",
              }
            );

            if (!verificationRes.ok) {
              const err = await verificationRes.json();
              console.error("Помилка надсилання листа:", err);
            } else {
              console.log("Лист з кодом відправлено!");
            }
          } catch (error) {
            console.error("Помилка запиту підтвердження пошти:", error);
          }

          window.location.href = "/";
        }
      } catch (error) {
        console.error("Помилка з'єднання при реєстрації:", error);
        setErrors({ form: "Помилка з'єднання з сервером" });
      }
    }
  };

  const toggleMode = () => setIsLogin(prev => !prev);

  return (
    <div className={styles['auth-container']}>
      <div className={styles['login-cntr']}>
        <div className={styles['login-page']}>
          <div className={`${styles.container} ${isLogin ? '' : styles['register-mode']}`}>
            <div className={styles['auth-left']}>
              {isLogin ? (
                <>
                  <h2>ВХІД</h2>
                  <input
                    type="email"
                    placeholder="Пошта"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {errors.email && <span className={styles['error-text']}>{errors.email}</span>}

                  <input
                    type="password"
                    placeholder="Пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {errors.password && <span className={styles['error-text']}>{errors.password}</span>}

                  <a href="#">Забули пароль?</a>
                  <button className={styles['primary-btn']} onClick={handleSubmit}>Увійти</button>
                </>
              ) : (
                <>
                  <h2>РЕЄСТРАЦІЯ</h2>
                  <input
                    type="text"
                    placeholder="Ім'я"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  {errors.name && <span className={styles['error-text']}>{errors.name}</span>}

                  <input
                    type="email"
                    placeholder="Пошта"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {errors.email && <span className={styles['error-text']}>{errors.email}</span>}

                  <input
                    type="password"
                    placeholder="Пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {errors.password && <span className={styles['error-text']}>{errors.password}</span>}

                  <button className={styles['primary-btn']} onClick={handleSubmit}>Зареєструватись</button>
                </>
              )}
            </div>

            <div className={styles['auth-right']}>
              {isLogin ? (
                <>
                  <h2>Ласкаво просимо!</h2>
                  <p>Ще не маєш акаунту?</p>
                  <button className={styles['primary-btn']} onClick={toggleMode}>
                    Зареєструватись
                  </button>
                </>
              ) : (
                <>
                  <h2>Раді тебе бачити!</h2>
                  <p>Вже маєш акаунт?</p>
                  <button className={styles['primary-btn']} onClick={toggleMode}>
                    Увійти
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
