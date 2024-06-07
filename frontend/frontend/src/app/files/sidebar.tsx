'use client'
import styles from './sidebar.module.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {

    const currentPath = usePathname();
    
    function logoutUser() {
        localStorage.clear();
        window.location.replace('http://localhost:3000/')
    }

    const links = [
        {
            path: '/files',
            caption: 'Browse'
        },
        {
            path: '/files/add',
            caption: 'Add'
        },
        {
            path: '/files/enrich',
            caption: 'Encrich'
        },
    ]

    const linkItems = links.map((link, i) => {
        return(
            <li key={i}>
                <Link
                    className={link.path === currentPath ? `${styles.navLink} ${styles.current}` : styles.navLink}
                    href={link.path}
                >{link.caption}
                </Link>
            </li>
        )
    })
    
    return (
        <div className={styles.sidebar}>
            <nav className={styles.navigation}>
                <ul>
                    {linkItems}
                    <li>
                        <button onClick={logoutUser} className={styles.navLink}>
                            Logout
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    )
}
