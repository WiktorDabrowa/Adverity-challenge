'use client'
import { makeRequest } from "@/utils/requests";
import React, { useState } from "react";
import Loader from "@/utils/loader";
import styles from "./page.module.css";

export default function AddFile() {

    const [file, setFile] = useState<File | undefined>();
    const [name, setName] = useState<string>('')
    const [error, setError] = useState<string | undefined>('')
    const [isLoading, setIsLoading] = useState(false)

    function validateState() {
        if (name === '') {
            setError('File name cannot be empty')
            return false
        }
        if (name.includes('/')) {
            setError('File name cannot contain "/", please provide another name')
            return false
        }
        if (file === undefined) {
            setError('Please specify a file');
            return false
        } else {
            return true
        }
    }
 
    function handleFileChange(e: React.FormEvent) {
        const target = e.target as HTMLInputElement & {
            files: FileList
        }
        setFile(target.files[0])
    }

    function handleNameChange(e: React.ChangeEvent) {
        const target = e.target as HTMLInputElement
        setName(target.value);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (validateState()) {
            sendData();
        }
    }

    async function sendData() {
        try {
            if (typeof file === 'undefined') return;
            const formData = new FormData();
            formData.append('file', file);
            formData.append('name', name)
            const response = await makeRequest({
                method: 'POST',
                url: 'files/',
                data: formData
            }, setIsLoading)
            if (response.status === 'ok') {
                if (response.response_status === 201) {
                    window.location.replace('http://localhost:3000/files');
                } else {
                    setError(response.data);
                }
            } else {
                console.log("Unexpected error occured:")
                console.log(response);
                setError('Unexpected error occured, please try again')
            }
            console.log(response)
            
        } catch(err) {
            setError('An Error occured, please try again');
            setFile(undefined);
            setName('');
        }
    }

    return(
        <div className={styles.addFileFormContainer}>
            {isLoading && <Loader />}
            <form className={styles.addFileForm} onSubmit={handleSubmit}>
                <h2>Add new CSV File</h2>    
                <label>Provide file name</label>
                <input onChange={handleNameChange} type="text" placeholder="File Name" value={name}></input>
                <label>Select file</label>
                <input onChange={handleFileChange} type='file' accept='.csv'></input>
                {error && <small className={styles.error}>{error}</small>}
                <input type='submit' value='Submit File'></input>
            </form>
        </div>
    )
}
