/**
 * Компонент App является основным контейнером приложения, управляющим маршрутизацией и состоянием избранных новостей.
 *
 * @component
 * @returns {JSX.Element} JSX элемент компонента App.
 */
import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import NewsList from '../AllNews/AllNews';
import styles from './App.module.css';
import Header from '../Header/Header';
import FavoriteNews from '../FavoriteNews/FavoriteNews';

const App: React.FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [likedStories, setLikedStories] = useState<string[]>(() => {
    const storedStories = localStorage.getItem('likedStories');
    return storedStories ? JSON.parse(storedStories) : [];
  });

  /**
   * Функция добавления новости в избранное.
   *
   * @param {string} storyId - Идентификатор новости.
   */
  const addLike = (storyId: string) => {
    const updatedLikedStories = [storyId, ...likedStories];
    setLikedStories(updatedLikedStories);
    localStorage.setItem('likedStories', JSON.stringify(updatedLikedStories));
    alert('Новость добавлена в избранное!');
  };

  /**
   * Функция удаления новости из избранного.
   *
   * @param {string} storyId - Идентификатор новости.
   */
  const deleteLike = (storyId: string) => {
    const updatedLikedStories = likedStories.filter((id) => id !== storyId);
    setLikedStories(updatedLikedStories);
    localStorage.setItem('likedStories', JSON.stringify(updatedLikedStories));
    alert('Новость удалена из избранного!');
  };

  useEffect(() => {
    if (pathname === '/') {
      navigate('/beststories/1');
    } // Перенаправляем на beststories/1 при первой загрузке
  }, [pathname]);

  return (
    <div className={styles.body}>
      <div className={styles.page}>
        <Routes>
          <Route
            path="/:category/:page"
            element={
              <>
                <Header />
                <main className={styles.content}>
                  <NewsList likedStories={likedStories} addLike={addLike} deleteLike={deleteLike} />
                </main>
              </>
            }
          />
          <Route
            path="/favorites"
            element={
              <>
                <Header />
                <main>
                  <FavoriteNews
                    likedStories={likedStories}
                    addLike={addLike}
                    deleteLike={deleteLike}
                  />
                </main>
              </>
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default App;
