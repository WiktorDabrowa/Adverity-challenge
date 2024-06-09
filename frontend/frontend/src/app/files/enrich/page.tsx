'use client'
import { FileData } from '../page';
import styles from './page.module.css';
import React, { useEffect, useState } from 'react';
import { makeRequest } from '@/utils/requests';
import Loader from '@/utils/loader';
import { setDefaultResultOrder } from 'dns';

type EnrichFormState = {
    newFileName: string,
    selectedFile: string,
    endpoint: string,
    localKeyName: string,
    foreignKeyName: string,
}

export default function enrichFile() {

    const [userFiles, setUserFiles] = useState<FileData>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [availableLocalKeys, setAvailableLocalKeys] = useState<Array<string>>([]);
    const [foreignResourceKeys, setForeignResourceKeys] = useState<Array<string> | undefined>()
    const [error, setError] = useState<string | undefined>();
    const [formState, setFormState] = useState<EnrichFormState>({
        newFileName: '',
        selectedFile: '',
        endpoint: '',
        localKeyName: '',
        foreignKeyName: ''
    })

    useEffect(() => {
        const fetchData = async () => {
            const response = await makeRequest({
                method: 'GET',
                url: 'files/',
            }, setIsLoading)
            if (response.status === 'ok') {
                setUserFiles(response.data)
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const response = await makeRequest({
                method: 'GET',
                url: `files/${formState.selectedFile}/`
            }, setIsLoading)
            if (response.status === 'ok') {
                setAvailableLocalKeys(response.data.titles)
            } else {
                console.log("Failed to fetch available keys")
                setError('Unexpected error happened, please try again')
            }
        }
        formState.selectedFile !== '' && fetchData();
    }, [formState.selectedFile])

    const fileOptions = userFiles.map((file) => {
        return <option key={file.id} value={file.id}>{file.name}</option>
    })

    const keyOptions = availableLocalKeys.map((key, i) => {
        return <option key={i} value={key}>{key}</option>
    })

    const foreignResourceKeyOptions = foreignResourceKeys?.map((key, i) => {
        return <option key={i} value={key}>{key}</option>
    })

    async function loadForeignResouce(e: React.FormEvent) {
        e.preventDefault();
        try {
            const response = await fetch(formState.endpoint);
            const data = await response.json();
            if (data[0] instanceof Object) {
                setForeignResourceKeys(Object.keys(data[0]));
            } else {
                setError('Foreign resource in an unexpected format. please select different resource')
            }
        } catch(err) {
            setError('Error fetching foreign resource! Please double check the specified URL')
        }
    }

    function handleChange(e: React.ChangeEvent) {
        const target = e.target as HTMLInputElement
        setFormState({
            ...formState,
            [target.name]: target.value
        })
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (validateFormData()){
            sendData();
        }   
    }

    function validateFormData() {
        if (formState.newFileName.includes('/')) {
            setError('File name cannot contain "/"!');
            return false;
        }
        if (formState.selectedFile === undefined ) {
            setError('Please select a file to enrich!');
            return false;
        }
        if (formState.endpoint === '') {
            setError('Endpoint cannot be empty!');
            return false;
        }
        if (formState.localKeyName === '') {
            setError('Please select a key from the selected file!');
            return false;
        }
        if (formState.foreignKeyName === '') {
            setError('Please select a key to join by from the foreign resource!');
            return false
        }
        return true
    }

    async function sendData() {
        try {
            const data = new FormData();
            data.append('file', formState.selectedFile);
            data.append('endpoint', formState.endpoint);
            data.append('localKey', formState.localKeyName);
            data.append('foreignKey', formState.foreignKeyName);
            data.append('newFileName', formState.newFileName);
            const response = await makeRequest({
                method: 'POST',
                url: 'files/enrich',
                data: data,
            }, setIsLoading)
            if (response.response_status !== 201) {
                setError(response.data)
            } else {
                window.location.replace('http://localhost:3000/files')
            }
        } catch (err) {
            console.log('Unexpected error happened:')
            console.log(err)
            setError('Unexpected Error happened!')
        }
    }

    return(
        <div className={styles.formContainer}>
            {isLoading && <Loader />}
            <form onSubmit={handleSubmit} className={styles.enrichForm}>
                <h2>Enrich File</h2>
                <div className={styles.userFileSelector}>
                    <label>Select the file you want to enrich</label>
                    <select
                        className={`${styles.input} ${styles.selectInput}`}
                        onChange={handleChange}
                        value={formState.selectedFile}
                        name='selectedFile'
                    >
                        {fileOptions}
                    </select>
                    <label>Select Key from the file</label>
                    <select
                        disabled={formState.selectedFile === undefined}
                        className={`${styles.input} ${styles.selectInput}`}
                        onChange={handleChange}
                        value={formState.localKeyName}
                        name='localKeyName'>
                        {keyOptions}
                    </select>
                </div>
                <div className={styles.foreignResourceSelector}>
                    <label>Provide an endpoint to fetch data from</label>
                    <input
                        placeholder="Resource endpoint"
                        className={`${styles.input}`} 
                        value={formState.endpoint}
                        name='endpoint'
                        onChange={handleChange}
                        type='text'>
                    </input>
                    <button 
                        onClick={loadForeignResouce}
                        className={styles.loadResourcesBtn}    
                    >Load resource
                    </button>
                    <label>Select Key from foreign resource</label>
                    <select
                        disabled = {!foreignResourceKeys}
                        className={`${styles.input} ${styles.selectInput}`}
                        name='foreignKeyName'
                        onChange={handleChange}
                        value={formState.foreignKeyName}
                    >
                        {foreignResourceKeyOptions}
                    </select>
                </div>
                <label>Select a new name for the file</label>
                <input
                    placeholder='New file name'
                    className={`${styles.input}`} 
                    type='text'
                    name='newFileName'
                    value={formState.newFileName}
                    onChange={handleChange}
                ></input>
                <input
                    className={`${styles.input}`} 
                    disabled={
                        formState.selectedFile === '' ||
                        formState.localKeyName === '' ||
                        formState.foreignKeyName === '' ||
                        formState.endpoint === '' || 
                        formState.newFileName === ''
                    }
                    type='submit'
                    value='Enrich File' />
                {error && <small className={styles.error}>{error}</small>}
            </form>
        </div>
    )
}
