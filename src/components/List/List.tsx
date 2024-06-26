/**
 * Компонент List отображает список новостных статей с использованием компонентов NewsCard.
 *
 * @component
 * @example
 * // Пример использования:
 * import List from './List';
 * // Использование в JSX:
 * <List
 *   stories={storiesArray}
 *   addLike={addLikeFunction}
 *   deleteLike={deleteLikeFunction}
 *   likedStories={likedStoriesArray}
 * />
 *
 * @param {Object} props - Свойства компонента List.
 * @param {any[]} props.stories - Массив объектов новостей для отображения.
 * @param {Function} props.addLike - Функция для добавления лайка к новости (принимает storyId в качестве аргумента).
 * @param {Function} props.deleteLike - Функция для удаления лайка из новости (принимает storyId в качестве аргумента).
 * @param {string[]} props.likedStories - Массив идентификаторов новостей, которые отмечены как понравившиеся.
 * @returns {JSX.Element} JSX элемент компонента List.
 */
import React from 'react';
import styles from './List.module.css';
import NewsCard from '../NewsCard/NewsCard';

interface Props {
  stories: any[];
  addLike: (storyId: string) => void;
  deleteLike: (storyId: string) => void;
  likedStories: string[];
}

const List: React.FC<Props> = ({ stories, addLike, deleteLike, likedStories }) => {
  return (
    <ul className={styles.list}>
      {stories.map(
        (story) =>
          story && (
            <NewsCard
              key={story.id}
              story={story}
              addLike={addLike}
              deleteLike={deleteLike}
              likedStories={likedStories}
            />
          ),
      )}
    </ul>
  );
};

export default List;
