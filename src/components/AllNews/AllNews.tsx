import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './AllNews.module.css';
import List from '../List/List';

interface AllNewsProps {
  addLike: (storyId: string) => void;
  deleteLike: (storyId: string) => void;
  likedStories: string[];
}

/**
 * Компонент для отображения списка новостей с возможностью выбора категории и пагинацией.
 *
 * @component
 * @example
 * // Пример использования компонента:
 * <AllNews
 *   addLike={addLikeFunction}
 *   deleteLike={deleteLikeFunction}
 *   likedStories={likedStoriesArray}
 * />
 *
 * @param {AllNewsProps} props - Пропсы компонента.
 * @returns {JSX.Element} Элемент списка новостей с управляющими элементами.
 */
const AllNews: React.FC<AllNewsProps> = ({ addLike, deleteLike, likedStories }) => {
  const [stories, setStories] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();
  const params = useParams<{ category: string; page: string }>();
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Функция для загрузки списка новостей по указанной категории и странице.
   *
   * @param {string} category - Категория новостей (beststories, newstories, topstories).
   * @param {number} pageNumber - Номер страницы новостей.
   * @returns {void}
   */
  const fetchStories = async (category: string, pageNumber: number) => {
    try {
      const response = await fetch(`https://hacker-news.firebaseio.com/v0/${category}.json`);
      if (!response.ok) {
        throw new Error('Failed to fetch stories');
      }
      const storyIds = await response.json();
      const startIdx = (pageNumber - 1) * 30;
      const endIdx = startIdx + 30;
      const currentStories = storyIds.slice(startIdx, endIdx);

      const storyPromises = currentStories.map(async (storyId: number) => {
        const storyResponse = await fetch(
          `https://hacker-news.firebaseio.com/v0/item/${storyId}.json`,
        );
        return storyResponse.json();
      });
      const storiesData = await Promise.all(storyPromises);

      setStories(storiesData);
      setTotalPages(Math.ceil(storyIds.length / 30));
      setCurrentPage(pageNumber);
    } catch (error) {
      console.error(`Error fetching ${category} stories:`, error);
    }
  };

  useEffect(() => {
    if (params.category && params.page) {
      const category = params.category;
      const page = parseInt(params.page, 10) || 1;

      intervalIdRef.current = setInterval(() => {
        fetchStories(category, page);
      }, 30000);

      fetchStories(category, page);
    }

    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }
    };
  }, [params.category, params.page]);

  /**
   * Обработчик ручного обновления списка новостей.
   *
   * @returns {void}
   */
  const handleManualUpdate = () => {
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }
    setStories([]);
    fetchStories(params.category || 'beststories', 1);
    navigate(`/${params.category || 'beststories'}/1`);
  };

  /**
   * Обработчик изменения выбранной категории новостей.
   *
   * @param {React.ChangeEvent<HTMLSelectElement>} event - Событие изменения значения выпадающего списка.
   * @returns {void}
   */
  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setStories([]);
    navigate(`/${event.target.value}/1`);
  };

  /**
   * Обработчик изменения страницы новостей.
   *
   * @param {number} newPage - Новый номер страницы.
   * @returns {void}
   */
  const handlePageChange = (newPage: number) => {
    setStories([]);
    navigate(`/${params.category}/${newPage}`);
  };

  return (
    <>
      <div className={styles.action}>
        <div>
          <label className={styles.label} htmlFor="categorySelect">
            Выбери категорию новостей:
          </label>
          <select
            className={styles.select}
            id="categorySelect"
            value={params.category}
            onChange={handleCategoryChange}
          >
            <option value="beststories">Лучшие новости</option>
            <option value="newstories">Свежие новости</option>
            <option value="topstories">Топовые новости</option>
          </select>
        </div>
        <button className={styles.button} onClick={handleManualUpdate}>
          Обновить список новостей
        </button>
      </div>
      <List
        stories={stories}
        addLike={addLike}
        deleteLike={deleteLike}
        likedStories={likedStories}
      />
      <div className={styles.pagination}>
        <button
          className={styles.button}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <span>&larr;</span>
        </button>
        <span className={styles.text}>
          {currentPage} / {totalPages}
        </span>
        <button
          className={styles.button}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <span>&rarr;</span>
        </button>
      </div>
    </>
  );
};

export default AllNews;
