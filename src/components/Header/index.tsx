import styles from './styles.module.scss';

import format from 'date-fns/format';
import ptBR from 'date-fns/locale/pt-BR';
import Link from 'next/link';

export function Header() {

    const DateCurrent = format(new Date(), 'EEEEEE , d MMMM', {
        locale: ptBR,
    })

    return (
        <header className={styles.headerContainer}>
            <Link href='/'>
                <a >
                    <img src="/logo.svg" alt="podcast" />
                </a>
            </Link>
            <p> O Melhor pra você ouvar! </p>

            <span> {DateCurrent} </span>
        </header>
    )
}