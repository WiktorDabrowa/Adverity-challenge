'use client'
import styles from '../register/page.module.css';
import React, { useState } from 'react';
import { makeRequest } from '@/utils/requests';
import Loader from '@/utils/loader';
import Link from 'next/link';

export default function Login() {
    const [formState, setFormState] = useState({
        username: '',
        password: '',
    });
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    function updateState(e: React.ChangeEvent) {
        const changedInput = e.target as HTMLInputElement;
        const field = changedInput.name;
        setFormState({
            ...formState,
            [field]: changedInput.value
        })
    }
    
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const is_valid = validateInput();
        if (!is_valid) {return}
        sendData();
    }
    
    function validateInput() {
        if (formState.username === '') {
            setError('Username cannot be empty');
            setFormState({username:'', password:''});
            return false
        } else if (formState.password.length < 8) {
            setError('Password must be at least 8 charecters long');
            setFormState({username:'', password:''});
            return false
        } else {
            setError('')
            return true
        }
    }

    async function sendData() {
        const response = await makeRequest({
            method: 'POST',
            url: 'token/',
            data: {
                username: formState.username,
                password: formState.password
            }
        }, setIsLoading)
        console.log(response)
        if (response.status === 'ok') {
            switch (response.response_status) {
                case 200 :
                    localStorage.setItem("access-token", JSON.stringify(response.data.access))
                    localStorage.setItem("refresh-token", JSON.stringify(response.data.refresh))
                    window.location.replace('http://localhost:3000/files')
                case 401 :
                    setError('Invalid credentials!');
                    setFormState({
                        username: '',
                        password: '',
                    })
            }
        } else {
            console.log(response.err)
            setError("Unexpected error occured, please try again")
            setIsLoading(false);
        }
    }
                    
    return(
        <main className={styles.main}>
            {isLoading && <Loader />}
            <div className={styles.formContainer}>
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <label>Username</label>
                    <input value={formState.username} onChange={updateState} name='username' type='text'></input>
                    <label>Password</label>
                    <input value={formState.password} onChange={updateState} name='password' type='password'></input>
                    <input type='submit' value='Login'/>
                </form>
                {error && <small className={styles.error}>Error: {error}</small>}
                <br/>
                <small>
                    Not a user? Go to <Link className={styles.link} href='/register'>register page</Link>
                </small>
            </div>
        </main>
    )
}