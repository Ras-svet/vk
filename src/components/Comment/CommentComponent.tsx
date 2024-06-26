/**
 * Компонент CommentComponent отображает отдельный комментарий и его дочерние комментарии, если они есть.
 * Поддерживает кнопку "ещё" для раскрытия полного текста комментария.
 *
 * @component
 * @param {Object} props - Свойства компонента CommentComponent.
 * @param {Comment} props.comment - Объект комментария с полями id, by, text и опциональным массивом дочерних комментариев kids.
 * @returns {JSX.Element} JSX элемент компонента CommentComponent.
 */
import React, { useState, useEffect } from 'react';
import styles from './Comment.module.css';

interface Comment {
  id: number;
  by: string;
  text: string;
  kids?: Comment[]; // Массив идентификаторов дочерних комментариев
}

interface CommentComponentProps {
  comment: Comment;
}

const CommentComponent: React.FC<CommentComponentProps> = ({ comment }) => {
  const [childComments, setChildComments] = useState<Comment[]>([]);
  const [isMore, setIsMore] = useState(false);
  const [text, setText] = useState('ещё');

  useEffect(() => {
    const fetchChildComments = async () => {
      if (comment.kids && comment.kids.length > 0) {
        try {
          const promises = comment.kids.map((id) =>
            fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then((response) =>
              response.json(),
            ),
          );
          const results = await Promise.all(promises);
          setChildComments(results);
        } catch (error) {
          console.error('Error fetching child comments:', error);
        }
      }
    };

    fetchChildComments();
  }, [comment.kids]);

  /**
   * Обработчик для кнопки "ещё", управляет состоянием раскрытия текста комментария.
   */
  function handleMore() {
    if (!isMore) {
      setIsMore(true);
      setText('скрыть');
    } else {
      setIsMore(false);
      setText('ещё');
    }
  }

  return (
    <li key={comment.id} className={styles.comment}>
      <p className={styles.commentAuthor}>Автор: {comment.by}</p>
      <p className={styles.commentText}>
        <span className={`${isMore ? '' : styles.commentShortText}`}>{comment.text}</span>
        {comment.text?.length > 285 && (
          <span className={styles.showExpand} onClick={handleMore}>
            {text}
          </span>
        )}
      </p>
      <ul className={styles.commentsList}>
        {childComments.length > 0 &&
          childComments.map((childComment) => (
            <>
              <p className={styles.text}>В ответ {comment.by}:</p>
              <CommentComponent key={childComment.id} comment={childComment} />
            </>
          ))}
      </ul>
    </li>
  );
};

export default CommentComponent;
