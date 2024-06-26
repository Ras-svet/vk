/**
 * Компонент NewsCard отображает карточку новости с возможностью загрузки и отображения комментариев.
 *
 * @component
 * @example
 * // Пример использования:
 * import NewsCard from './NewsCard';
 * // Использование в JSX:
 * <NewsCard
 *   story={storyObject}
 *   addLike={addLikeFunction}
 *   deleteLike={deleteLikeFunction}
 *   likedStories={likedStoriesArray}
 * />
 *
 * @param {Object} props - Свойства компонента NewsCard.
 * @param {Object} props.story - Объект с данными новости, включая id, title, url, time, by, score и, опционально, kids (массив id комментариев).
 * @param {Function} props.addLike - Функция для добавления лайка к новости (принимает storyId в качестве аргумента).
 * @param {Function} props.deleteLike - Функция для удаления лайка из новости (принимает storyId в качестве аргумента).
 * @param {string[]} props.likedStories - Массив идентификаторов новостей, которые отмечены как понравившиеся.
 * @returns {JSX.Element} JSX элемент компонента NewsCard.
 */
import React, { useState, useEffect, useRef } from 'react';
import styles from './NewsCard.module.css';
import CommentComponent from '../Comment/CommentComponent';

interface NewsCardProps {
  story: {
    id: number;
    title: string;
    url: string;
    time: number;
    by: string;
    score: number;
    kids?: number[]; // Массив id комментариев
  };
  addLike: (storyId: string) => void;
  deleteLike: (storyId: string) => void;
  likedStories: string[];
}

interface Comment {
  id: number;
  by: string;
  text: string;
  kids?: Comment[];
}

const NewsCard: React.FC<NewsCardProps> = ({ story, addLike, deleteLike, likedStories }) => {
  const [showComments, setShowComments] = useState(false); // Состояние для отображения комментариев
  const [comments, setComments] = useState<Comment[]>([]); // Состояние для хранения загруженных комментариев
  const [loadedCommentsCount, setLoadedCommentsCount] = useState(0); // Состояние для хранения количества загруженных комментариев
  const [scrollPosition, setScrollPosition] = useState(0); // Состояние для хранения позиции скролла
  const commentsRef = useRef<HTMLDivElement>(null); // Референс для контейнера комментариев
  const [isLiked, setIsLiked] = useState(likedStories.includes(String(story.id))); // Состояние для отслеживания лайка

  useEffect(() => {
    /**
     * Функция для загрузки комментариев по идентификаторам из массива kids объекта story.
     * Вызывается при изменении состояния showComments, story.kids и loadedCommentsCount.
     */
    const fetchComments = async () => {
      if (story.kids && story.kids.length > 0) {
        try {
          const promises = story.kids
            .slice(0, loadedCommentsCount + 1)
            .map((id) =>
              fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then((response) =>
                response.json(),
              ),
            );
          const results = await Promise.all(promises);
          setComments(results);
        } catch (error) {
          console.error('Error fetching comments:', error);
        }
      }
    };

    if (showComments) {
      fetchComments();
    }
  }, [showComments, story.kids, loadedCommentsCount]);

  /**
   * Обработчик клика для отображения комментариев.
   * Сохраняет текущую позицию скролла, устанавливает флаг showComments в true и загружает первые 2 комментария.
   */
  const handleShowComments = () => {
    setScrollPosition(window.scrollY); // Сохраняем текущую позицию скролла
    setShowComments(true);
    setLoadedCommentsCount(2); // Загрузить первые 2 комментария
  };

  /**
   * Обработчик клика для загрузки дополнительных комментариев.
   * Увеличивает количество загруженных комментариев на 2.
   */
  const handleLoadMoreComments = () => {
    setLoadedCommentsCount((prevCount) => prevCount + 2); // Загрузить следующие 2 комментария
  };

  /**
   * Обработчик клика для скрытия комментариев.
   * Сбрасывает количество загруженных комментариев и восстанавливает позицию скролла.
   */
  const handleHideComments = () => {
    setShowComments(false);
    setLoadedCommentsCount(0); // Сбросить количество загруженных комментариев
    // Восстанавливаем позицию скролла после сворачивания
    window.scrollTo({ top: scrollPosition, behavior: 'smooth' });
  };

  /**
   * Обработчик клика для лайка новости.
   * Если новость уже была лайкнута, удаляет лайк; в противном случае, добавляет лайк.
   */
  const handleLike = () => {
    if (isLiked) {
      setIsLiked(false);
      deleteLike(String(story.id));
    } else {
      setIsLiked(true);
      addLike(String(story.id));
    }
  };

  // Эффект для обновления состояния isLiked при изменении массива likedStories или идентификатора story.id
  useEffect(() => {
    setIsLiked(likedStories.includes(String(story.id)));
  }, [likedStories, story.id]);

  return (
    <li className={`${styles.card} ${showComments ? styles.fullRow : ''}`}>
      <a className={styles.title} href={story.url} target="_blank" rel="noopener noreferrer">
        {story.title}
      </a>
      <p className={styles.text}>
        Дата публикации: {new Date(story.time * 1000).toLocaleDateString()}{' '}
        {new Date(story.time * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </p>
      <p className={styles.text}>Автор: {story.by}</p>
      <p className={styles.text}>Голоса: {story.score}</p>
      {!showComments && (
        <div className={styles.action}>
          <button className={styles.commentsButton} onClick={handleShowComments}>
            Показать комментарии
          </button>
          <button
            className={isLiked ? styles.likedButton : styles.likeButton}
            onClick={handleLike}
          ></button>
        </div>
      )}
      {showComments && (
        <div ref={commentsRef} className={styles.comments}>
          <h3 className={styles.commentsTitle}>Комментарии:</h3>
          <ul className={styles.commentsList}>
            {comments.length > 0 ? (
              comments.map((comment) => <CommentComponent key={comment.id} comment={comment} />)
            ) : (
              <p className={styles.noComments}>Нет комментариев</p>
            )}
          </ul>
          {comments.length > loadedCommentsCount && (
            <button className={styles.loadMoreButton} onClick={handleLoadMoreComments}>
              Загрузить еще
            </button>
          )}
          <button className={styles.hideCommentsButton} onClick={handleHideComments}>
            Свернуть
          </button>
        </div>
      )}
    </li>
  );
};

export default NewsCard;
