'use client'
import { makeRequest } from "@/utils/requests";
import { useEffect, useState } from "react";
import FileList from "./filetable";

export type FileData = Array<{id: number, name: string}>

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
            }
        }
        fetchData();
    }, []);

    return (
            <FileList data={data} isLoading={isLoading} />
    )
}
