/**
 * Компонент Header представляет собой верхнюю панель навигации с логотипом и ссылками.
 *
 * @component
 * @example
 * // Пример использования:
 * import Header from './Header';
 * // Использование в JSX:
 * <Header />
 *
 * @returns {JSX.Element} JSX элемент компонента Header.
 */
import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Header.module.css';
import logo from '../../images/logo.svg';

/**
 * Компонент CustomNavLink представляет кастомизированную ссылку для использования в компоненте Header.
 *
 * @component
 * @param {Object} props - Свойства компонента CustomNavLink.
 * @param {string} props.to - URL-адрес, на который ведет ссылка.
 * @param {string} [props.className] - Дополнительный класс для стилизации ссылки.
 * @param {React.ReactNode} props.children - Внутреннее содержимое ссылки.
 * @returns {JSX.Element} JSX элемент компонента CustomNavLink.
 */
interface CustomNavLinkProps {
  to: string;
  className?: string;
  children: React.ReactNode;
}

const CustomNavLink: React.FC<CustomNavLinkProps> = ({ to, className, children }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [className, isActive ? styles.active : ''].filter(Boolean).join(' ')
      }
      end
    >
      {children}
    </NavLink>
  );
};

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>
        <img src={logo} className={styles.logo} alt="логотип" />
        .Мир
      </h1>
      <h2 className={styles.subtitle}>Оставайся Вконтакте с миром</h2>
      <nav className={styles.navbar}>
        <CustomNavLink to="/beststories/1" className={styles.navLink}>
          Все новости
        </CustomNavLink>
        <CustomNavLink to="/favorites" className={styles.navLink}>
          Избранное
        </CustomNavLink>
      </nav>
    </header>
  );
};

export default Header;
