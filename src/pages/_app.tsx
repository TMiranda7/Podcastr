import { useState } from 'react';

import { Header } from "../components/Header";
import { Player } from "../components/Player";
import {  PlayContextProvider } from '../contexts/PlayContext';

import '../style/global.scss';
import styles from '../style/app.module.scss';

function MyApp({ Component, pageProps }) {
  //  usei a 'useState' para poder alterar os valores do parametro!!  //
  return (
    <PlayContextProvider>
      <div className={styles.wrapper}>
        <main>
          <Header />
          <Component {...pageProps} />
        </main>
        <Player />
      </div>
    </PlayContextProvider>
  )
}

export default MyApp
