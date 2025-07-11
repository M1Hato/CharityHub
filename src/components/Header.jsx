import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import '../App.css';

export default function Header() {
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setLoggedIn(!!token);
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:8000/auth/logout", {
        method: "DELETE",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        console.error("Помилка при виході:", await response.text());
      } else {
        console.log("Користувача вийдено успішно");
      }


      localStorage.removeItem("token");
      localStorage.removeItem("user_name");
      localStorage.removeItem("user_email");
      localStorage.removeItem("id");

      setLoggedIn(false);
      navigate("/");

    } catch (error) {
      console.error("Помилка запиту при виході:", error);
    }
  };

  const handleProtectedLinkClick = (e) => {
    const token = localStorage.getItem('token');
    if (!token) {
      e.preventDefault();
      navigate('/auth');
    }
  };



  return (
    <header className="header">
      <div className='container'>
        <div className='header-content'>
          <div className="logo">
            <Link to="/">CharityHub</Link>
          </div>

          <nav className="nav">
            <Link to="/projects" onClick={handleProtectedLinkClick}>Проєкти</Link>
          </nav>

          <div className="auth">
            {loggedIn ? (
              <>
                <Link to="/cabinet">Кабінет</Link>
                <button onClick={handleLogout} className="logout-button">Вийти</button>
              </>
            ) : (
              <Link to="/auth">Реєстрація / Вхід</Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

