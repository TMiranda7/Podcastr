//           ESSA CLASSE CARREGA CONFORME O EPISODIO  SELECIONADO    

import { parseISO } from 'date-fns';
import { GetStaticPaths, GetStaticProps } from 'next';
import { api } from '../../services/api';
import { ConvertDate } from '../../utils/ConvertDateTime';
import format from 'date-fns/format';
import ptBR from 'date-fns/locale/pt-BR';
import styles from './styles.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import { useContext } from 'react';
import { PlayContext } from '../../contexts/PlayContext';

interface Episode {
    id: string;
    title: string;
    members: string;
    publishedAt: Date;
    thumbnail: string;
    description: string;
    url: string;
    duration: Number
    durationString: string;
}

interface PropsEpisodes {
    episode: Episode;
}


export default function Episode({ episode }: PropsEpisodes) {

    const { alternate } = useContext(PlayContext);

    return (
        <div className={styles.episoedeContainer}>
            <head>
                <title> Home | {episode.title} </title>
            </head>
            <div className={styles.thumbnailContainer}>
                <Link href='/'>
                    <button type="button">
                        <img src="/arrow-left.svg" alt="Voltar" />
                    </button>
                </Link>
                <Image width={700} height={160} src={episode.thumbnail} objectFit='cover' />
                <button type="button" onClick={() => alternate(episode)}>
                    <img src="/play.svg" alt="Tocar" />
                </button>
            </div>
            <header>
                <h1>{episode.title}</h1>
                <span>{episode.members}</span>
                <span>{episode.publishedAt}</span>
                <span>{episode.durationString}</span>
            </header>
            <div className={styles.description} dangerouslySetInnerHTML={{ __html: episode.description }} />
        </div>
    )
}

export const getStaticPaths: GetStaticPaths = async () => { //  CARREGAR PAGINAS "ESTATICAS DINAMICAS" PARA APRESENTAR
    return {
        paths: [],
        fallback: 'blocking',
    }
}

export const getStaticProps: GetStaticProps = async (context) => { // CARREGAR INFORMAÇÕES DA API NESSE CASO , 1 POR VEZ
    const { slug } = context.params;
    const { data } = await api.get(`/episodes/${slug}`)
    const episode = {
        id: data.id,
        title: data.title,
        members: data.members,
        publishedAt: format(parseISO(data.published_at), 'd MMM yy', { locale: ptBR }),
        thumbnail: data.thumbnail,
        description: data.description,
        url: data.file.url,
        duration: Number(data.file.duration),
        durationString: ConvertDate(Number(data.file.duration))
    }

    return {
        props: {
            episode
        },
        revalidate: 60 * 60 * 24  // o dia 
    }
}