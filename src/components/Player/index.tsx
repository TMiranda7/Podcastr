import styles from './styles.module.scss';
import { useState,useContext, useEffect, useRef } from 'react';
import { PlayContext } from '../../contexts/PlayContext';
import Image from 'next/image';
import Slider from 'rc-slider';

import 'rc-slider/assets/index.css'
import { ConvertDate } from '../../utils/ConvertDateTime';


export function Player() {
    const { listEpisode, currentEp, playing, looping , shuffleing , tooglePlay , nextPlay, previousPlay, toogleLoop , toogleShuffle } = useContext(PlayContext);
    const episode = listEpisode[currentEp];
    const [progress,setProgress] = useState(0);
    const refPlay = useRef<HTMLAudioElement>(null);   // O USO PARA ACESSAR QULQUER COMPONENT NATIVO

    useEffect(() => {
        if (!refPlay.current) {
            return;
        }

        if (playing) {
            refPlay.current.play();
        } else {
            refPlay.current.pause();
        }
    })

    const alterProgress = () => {
        refPlay.current.currentTime = 0 ;

        refPlay.current.addEventListener('timeupdate' , () => {
            setProgress(Math.floor(refPlay.current.currentTime));
        })
    }

     const changeTimeEpisode = (amount: number)  => {
         refPlay.current.currentTime = amount;
        setProgress(progress)
    }

    return (
        <div className={styles.playerContainer}>
            <header>
                <img src="/playing.svg" alt="Tocando!" />
                <strong>Ovando agora {episode?.title} </strong>
            </header>

            { episode ? (                       // operador pra saber se tem ep ou nn 
                <div className={styles.playingEp}>
                    <Image width={592} height={592} src={episode.thumbnail} objectFit='cover' />
                    <strong> {episode.title} </strong>
                    <span> {episode.members} </span>
                </div>
            ) : (
                <div className={styles.emptyPlay}>
                    <strong> Selecione alguma coisa pra Ouvar! </strong>
                </div>
            )
            }

            <footer className={!episode ? styles.empty : ''}>
                <div className={styles.progress}>
                <span >{ConvertDate(progress)}</span>
                    <div className={styles.slider}>
                        {episode ? (
                            <Slider
                                max={episode.duration}
                                value={progress}
                                onChange={ changeTimeEpisode }
                                trackStyle={{ backgroundColor: '#04d361' }}
                                railStyle={{ backgroundColor: '#9f75ff' }}
                                handleStyle={{ borderColor: '#04d361', borderWidth: 4 }} />
                        ) : (
                            <div className={styles.emptyslider} />
                        )}

                    </div>
                    <span >{ConvertDate(episode?.duration ?? 0)}</span>
                </div>

                {episode && (
                    <audio src={episode.url} autoPlay ref={refPlay} onLoadedMetadata={alterProgress} loop={looping} onPlay={() => tooglePlay} ></audio>
                )}

                <div className={styles.buttons}>
                    <button type="button" disabled={!episode} className={shuffleing?styles.isActive:''} onClick={toogleShuffle} >
                        <img src="/shuffle.svg" alt="embaralhar" />
                    </button>
                    <button type="button" disabled={!episode} onClick={ previousPlay}>
                        <img src="/play-previous.svg" alt="voltar" />
                    </button>
                    <button type="button" className={styles.playButton} disabled={!episode} onClick={tooglePlay} >
                        {playing ? (<img src="/pause.svg" alt="pause" />) : (<img src="/play.svg" alt="play" />)}
                    </button>
                    <button type="button" disabled={!episode} onClick={  nextPlay }>
                        <img src="/play-next.svg" alt="passar" />
                    </button>
                    <button type="button" disabled={!episode} onClick={toogleLoop} className={looping? styles.isActive : ''} >
                        <img src="/repeat.svg" alt="repetir" />
                    </button>
                </div>
            </footer>
        </div>
    )
}