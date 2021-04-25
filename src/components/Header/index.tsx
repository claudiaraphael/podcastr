import format from 'date-fns/format'
import ptBR from 'date-fns/locale/pt-BR'
import { useTheme } from '../../contexts/ThemeContext';

import styles from './styles.module.scss';

const Header: React.FC = () => {
  const { currentTheme, toggleTheme } = useTheme();

  const currentDate = format(new Date(), 'EEEEEE, d MMMM', {
    locale: ptBR
  });

  return (
    <header className={styles.headerContainer}>
      <img 
        src="/logo.svg"
        alt="Podcastr"
        className={styles.logo}
      />
      <img 
        src="/logo2.svg"
        alt="Podcastr"
        className={styles.logoMobile}
      />

      <p>O melhor para você ouvir, sempre</p>

      <span>{currentDate}</span>

      <button
        type="button"
        className={styles.theme}
        onClick={toggleTheme}
      >
        {currentTheme === 'dark' ? (
          <img 
            src="/light.svg"
            alt="Light Mode"
          />
        ) : (
          <img 
            src="/dark.svg"
            alt="Dark Mode"
          />
        )}
      </button>
    </header>
  );
}

export default Header;