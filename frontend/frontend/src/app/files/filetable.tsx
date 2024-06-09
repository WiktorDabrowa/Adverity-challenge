'use client'
import { FileData } from './page'
import styles from './filelist.module.css';
import Link from 'next/link';
import Loader from '@/utils/loader';

export default function FileList({data, isLoading}: {data: FileData, isLoading: boolean}) {

    const fileRows = data.map((file, i) => {
        return(
            <li key={i} className={styles.fileRow}>
                <Link
                    href={`/files/${file.id}`}
                    className={styles.fileLink}
                    key={i}
                >
                <div className={styles.fileName}>{file.name}</div>
                </Link>
            </li>
        )
    })

    return (
        <div className={styles.fileList}>
            <div className={styles.titleRow}>
                File Browser
            </div>
            {isLoading && <Loader />}
            {fileRows}
        </div>
    )
}
