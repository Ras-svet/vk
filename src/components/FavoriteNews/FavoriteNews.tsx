/**
 * Компонент FavoriteNews отображает список избранных новостей пользователя.
 * Если у пользователя нет избранных новостей, отображается соответствующее сообщение.
 *
 * @component
 * @param {Object} props - Свойства компонента FavoriteNews.
 * @param {Function} props.addLike - Функция для добавления лайка к новости.
 * @param {Function} props.deleteLike - Функция для удаления лайка у новости.
 * @param {string[]} props.likedStories - Массив идентификаторов избранных новостей.
 * @returns {JSX.Element} JSX элемент компонента FavoriteNews.
 */
import React, { useState, useEffect } from 'react';
import List from '../List/List';
import styles from './FavoriteNews.module.css';

interface FavoriteNewsProps {
  addLike: (storyId: string) => void;
  deleteLike: (storyId: string) => void;
  likedStories: string[];
}

const FavoriteNews: React.FC<FavoriteNewsProps> = ({ addLike, deleteLike, likedStories }) => {
  const [stories, setStories] = useState<any[]>([]);

  useEffect(() => {
    // Функция для загрузки карточек из likedStories
    const fetchLikedStories = async () => {
      try {
        if (likedStories) {
          const likedStoryIds: string[] = likedStories;

          // Загружаем детали каждой понравившейся новости
          const storyPromises = likedStoryIds.map(async (storyId) => {
            const response = await fetch(
              `https://hacker-news.firebaseio.com/v0/item/${storyId}.json`,
            );
            if (!response.ok) {
              throw new Error('Failed to fetch story details');
            }
            return response.json();
          });

          const likedStoriesData = await Promise.all(storyPromises);
          setStories(likedStoriesData);
        }
      } catch (error) {
        console.error('Error fetching liked stories:', error);
      }
    };

    fetchLikedStories(); // Вызываем функцию загрузки при монтировании компонента
  }, [likedStories]);

  return (
    <>
      {likedStories.length > 0 ? (
        <List
          stories={stories}
          addLike={addLike}
          deleteLike={deleteLike}
          likedStories={likedStories}
        />
      ) : (
        <p className={styles.text}>У вас пока нет избранных новостей</p>
      )}
    </>
  );
};

export default FavoriteNews;
