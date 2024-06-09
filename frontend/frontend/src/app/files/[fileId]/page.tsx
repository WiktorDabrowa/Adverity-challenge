'use client'
import { useState, useEffect } from "react";
import { makeRequest } from "@/utils/requests";
import Loader from "@/utils/loader";
import styles from './page.module.css';


type FileData = {titles: Array<string>, rows: Array<Array<string|Number>>, name: string}

export default function FilePreview({params}: {params: {fileId: string}}) {

    const [file, setFile] = useState<FileData>();
    const [isLoading, setIsLoading] = useState<boolean>(true)

    useEffect(() => {
        const fetchData = async () => {
            const response = await makeRequest({
                method: 'GET',
                url: `files/${params.fileId}/`,
            }, setIsLoading)
            if (response.status === 'ok') {
                console.log(response.data)
                setFile(response.data)
            }
        }
        fetchData();
    }, []);

    const fieldTitles = file?.titles.map((title) => {
        return <th className={styles.titleCell}>{title}</th>
    })

    const dataRows = file?.rows.map((row) => {
        const dataCells = row.map((data) => {
            return(
                <td className={styles.dataCell}>
                    {data.toString()}
                </td>
            )
        })

        return(
            <tr className={styles.dataRow}>
                {dataCells}
            </tr>
        )
    })
    console.log(file)

    return(
        <div className={styles.container}>
            <h2>{file?.name || 'File name will be here any second now...'}</h2>
            <div className={styles.tableWrapper}>
                {isLoading && <Loader />}
                <table className={styles.fileTable}>
                    <thead className={styles.tableHead}>
                        <tr className={styles.fieldTitles}>
                            {fieldTitles}
                        </tr>
                    </thead>
                    <tbody className={styles.tableBody}>
                        {dataRows}
                    </tbody>
                </table>    
            </div>
        </div>
    )
}
