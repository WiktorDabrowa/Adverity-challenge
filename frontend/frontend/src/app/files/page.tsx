'use client'
import { makeRequest } from "@/utils/requests";
import { useEffect, useState } from "react";
import FileList from "./filetable";

export type FileData = Array<{id: Number, name: string}>

export default function Files() {

    const [data, setData] = useState<FileData>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            const response = await makeRequest({
                method: 'GET',
                url: 'files/',
            }, setIsLoading)
            if (response.status === 'ok') {
                console.log(response.data)
                setData(response.data)
            } else if (response.status === 'stale_token') {
                window.location.replace('http://localhost:3000/login')
                // setIsLoading(false)
                // console.log('An error occured during data fetching:')
                // console.log(response)
            }
        }
        fetchData();
    }, []);

    return (
            <FileList data={data} isLoading={isLoading} />
    )
}
