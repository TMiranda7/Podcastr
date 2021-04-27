import { parseISO } from 'date-fns';
import format from 'date-fns/format';
import ptBR from 'date-fns/locale/pt-BR';
import { GetStaticProps } from 'next';
import { ConvertDate } from '../utils/ConvertDateTime';
import { api } from '../services/api';
import styles from '../style/app.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import { useContext } from 'react';
import { PlayContext } from '../contexts/PlayContext';

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

type ListEpisodes = {
  latestEpisodes: Episode[];
  allEpisodes: Episode[];
}


export default function Home({ latestEpisodes, allEpisodes }: ListEpisodes) {

  const { alternate,listedPlay } = useContext(PlayContext);

  const ListEpisode = [...latestEpisodes , ...allEpisodes];

  return (
    <div className={styles.homePageContainer}>
      <head>
        <title>Home | PodCastr</title>
      </head>
      <section className={styles.latestEpisodes}>
        <h2>Ultimos Lançamentos</h2>
        <ul>
          {latestEpisodes.map( (res,index) => {
            return (
              <li key={res.id}>
                <Image width={192} height={192} src={res.thumbnail} alt="img Ep" objectFit="cover" />
                <div className={styles.detailEpisode}>
                  <Link href={`/episode/${res.id}`}>
                    <a >{res.title}</a>
                  </Link>                  
                  <p>{res.members}</p>
                  <span>{res.publishedAt}</span>
                  <span>{res.durationString}</span>
                </div>
                <button type="button" onClick={() => listedPlay( ListEpisode , index ) } >
                  <img src='/play-green.svg' alt="tocar ep" />
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      <section className={styles.allEpisodes}>
        <h2>Ova Também...</h2>

        <table cellSpacing={0}>
          <thead>
            <th></th>
            <th>PodCast</th>
            <th>Integrantes</th>
            <th>Data</th>
            <th>Duração</th>
            <th></th>
          </thead>
          <tbody>
            {allEpisodes.map( (ep,index)  => {
              return (
                <tr key={ep.id}>
                  <td style={{width:100}}> 
                    <Image src={ep.thumbnail} height={120} width={120} objectFit="cover" alt={ep.title} /> 
                  </td>
                  <td> 
                     <Link href={`episode/${ep.id}`}>
                     <a> {ep.title} </a> 
                     </Link>
                    </td>
                  <td>{ep.members}</td>
                  <td style={{width:100}}>{ep.publishedAt}</td>
                  <td>{ep.durationString}</td>
                  <td>
                    <button type="button" onClick={ ()=> listedPlay( ListEpisode , index + latestEpisodes.length)  } >
                      <img src="/play-green.svg" alt="tocar agora" />
                    </button>
                  </td>
                </tr>
              )
            })
            }
          </tbody>
        </table>
      </section>
    </div>
  )
}
//somente em produção  ssg

export const getStaticProps: GetStaticProps = async () => {

  const { data } = await api.get('/episodes', {
    params: {
      _limited: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  })

  const episodes = data.map(ep => {
    return {
      id: ep.id,
      title: ep.title,
      members: ep.members,
      publishedAt: format(parseISO(ep.published_at), 'd MMM yy', { locale: ptBR }),
      thumbnail: ep.thumbnail,
      description: ep.description,
      url: ep.file.url,
      duration: Number(ep.file.duration),
      durationString: ConvertDate(Number(ep.file.duration))
    }
  })

  const latestEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.legth);

  return {
    props: {
      latestEpisodes,
      allEpisodes
    },
    revalidate: 60 * 60 * 4
  }

}

// ambiente de DEV 
/*
export function async getServerSideProps(){
  const response = await fetch('http://localhost:3334/episodes');
  const data = await response.json();

  return{
    props:{
      episodes : data,
    },
}
*/