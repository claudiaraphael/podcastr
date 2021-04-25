import { GetStaticProps } from 'next';
import Image from 'next/image';
import Head from 'next/head';
import Link from 'next/link';
import { parseISO, format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import api from '../services/api';

import {  usePlayer } from '../contexts/PlayerContext';

import { convertDurationToTimeString } from '../utils/convertDurationToTimeString';

import styles from '../styles/home.module.scss';

type Episode = {
  id: string;
  title: string;
  thumbnail: string;
  members: string;
  publishedAt: string;
  duration: number;
  durationAsString: string;
  url: string;
}

type HomeProps = {
  allEpisodes: Episode[];
  latestEpisodes: Episode[];
}

const Home: React.FC<HomeProps> = ({ allEpisodes, latestEpisodes }) => {
  const {
    playList,
    episodes: episodeList,
    currentEpisodeIndex,
  } = usePlayer();

  const episode = episodeList[currentEpisodeIndex];

  const episodes = [...latestEpisodes, ...allEpisodes];

  return (
    <div className={`${styles.homepage} ${episode ? styles.hasEpisode : ''}`}>
      <Head>
        <title>Home | Podcastr</title>
      </Head>
      <section className={styles.latestEpisodes}>
        <h2>Últimos lançamentos</h2>

        <ul>
          {latestEpisodes.map((episode, index) => {
            return (
              <li key={episode.id}>
                <Image
                  width={192}
                  height={192}
                  src={episode.thumbnail}
                  alt={episode.title}
                  objectFit="cover"
                />

                <div className={styles.episodeDetails}>
                  <Link href={`/episodes/${episode.id}`}>
                    <a>{episode.title}</a>
                  </Link>
                  <p>{episode.members}</p>
                  <span>{episode.publishedAt}</span>
                  <span>{episode.durationAsString}</span>
                </div>

                <button type="button" onClick={() => playList(episodes, index)}>
                  <img src="/play-green.svg" alt="play" />
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      <section className={styles.allEpisodes}>
          <h2>Todos episódios</h2>

          <ul>
            <li className={styles.header}>
              <span className={styles.thumbnail}></span>
              <span className={styles.title}>Podcast</span>
              <span className={styles.member}>Integrantes</span>
              <span className={styles.date}>Data</span>
              <span className={styles.duration}></span>
              <span className={styles.action}></span>
            </li>
            {allEpisodes.map((episode, index) => (
              <li key={episode.id}>
                <div className={styles.thumbnail}>
                  <Image
                    width={120}
                    height={120}
                    src={episode.thumbnail}
                    alt={episode.title}
                    objectFit="cover"
                  />
                </div>
                <div className={styles.title}>
                  <Link href={`/episodes/${episode.id}`}>
                    <a>{episode.title}</a>
                  </Link>
                </div>
                <span className={styles.member}>
                  {episode.members}
                </span>
                <span className={styles.date}>
                  {episode.publishedAt}
                </span>
                <span className={styles.duration}>
                  {episode.durationAsString}
                </span>
                <span className={styles.action}>
                  <button
                    type="button"
                    onClick={() => playList(episodes, index + latestEpisodes.length)}
                  >
                    <img src="/play-green.svg" alt="play" />
                  </button>
                </span>
              </li>
            ))}
          </ul>
      </section>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get('episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc',
    },
  });

  const episodes = data.map(episode => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', {
        locale: ptBR
      }),
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(
        Number(episode.file.duration),
      ),
      url: episode.file.url,
    }
  });

  const latestEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length);

  return {
    props: {
      allEpisodes,
      latestEpisodes
    },
    revalidate: 60 * 60 * 8
  }
}

export default Home;
