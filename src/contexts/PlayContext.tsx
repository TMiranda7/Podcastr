//             CLASSE DE PLAYER
import {  createContext, ReactNode, useState } from 'react';

interface Episode {
    title: string;
    members: string;
    thumbnail: string;
    url: string;
    duration: number;
}

interface propEpisode{
    listEpisode: Episode[];
    currentEp: number;
    playing: boolean;
    looping: boolean;
    shuffleing: boolean;
    alternate : ( episode  ) => void;
    tooglePlay: () => void;
    nextPlay: () => void;
    previousPlay: () => void;
    listedPlay: ( list:any[], index:number) =>  void;
    toogleLoop: () => void;
    toogleShuffle: () => void;
} 

interface PropsPlay{
    children: ReactNode;
}

export const PlayContext = createContext( {} as propEpisode );

export const PlayContextProvider = ( {children} : PropsPlay ) =>{
    const [listEpisode, setListEpisode] = useState([]);
    const [currentEp, setCurrentEp] = useState(0);
    const [playing , setIsPlayng] = useState(false);
    const [ looping , setLooping ] = useState(false);
    const [ shuffleing , setShuffle ] = useState(false);
  
    function nextPlay(){
        if (listEpisode.length >= currentEp ){
            if (!shuffleing){
                setCurrentEp(currentEp + 1);
            }
            let nextRandonIndex = Math.floor(Math.random() + listEpisode.length);
            setCurrentEp(nextRandonIndex);
        }
    }

    function previousPlay(){
        if(currentEp > 0 ){
            setCurrentEp( currentEp - 1 );
        }
    }

    function alternate(episode) {
      setListEpisode([episode]);
      setCurrentEp(0);
      setIsPlayng(true);
    }
  
    const tooglePlay = () => {
      setIsPlayng(!playing)
    }

    const listedPlay = ( list: Episode[] , index: number ) => {
        setListEpisode(list);
        setCurrentEp(index);
        setIsPlayng(true);
    }

    const toogleLoop = () =>{
        setLooping(!looping);
    }

    const toogleShuffle = () =>{
        setShuffle(!shuffleing);
    }
    

    return(
        <PlayContext.Provider value={{alternate,tooglePlay,listEpisode,currentEp,playing,nextPlay,previousPlay , listedPlay , looping , toogleLoop , toogleShuffle , shuffleing }} >
            {children}
        </PlayContext.Provider>
    )
}