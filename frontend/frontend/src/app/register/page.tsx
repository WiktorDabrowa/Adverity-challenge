'use client'
import styles from './page.module.css';
import React, { useState } from 'react';
import Loader from '@/utils/loader';
import Link from 'next/link';

export default function Register() {
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
        const success = await sendData();
        if (success) {
            window.location.replace('http://localhost:3000/login')
        }
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
        setIsLoading(true)
        try{
            const response = await fetch(
                'http://localhost:8000/users/register',
                {
                    method: 'POST',
                    body: JSON.stringify({
                        username: formState.username,
                        password: formState.password
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                        accept: 'application/json'
                    }
                }
            )
            setIsLoading(false)
            if (!response.ok) {
                const data = await response.json();
                console.log(data)
                const message = Object.values(data).join(',')
                setError(message);
                setFormState({username:'', password:''});
                return false
            } else {
                return true
            }
        } catch(error) {
            console.log(error)
            setIsLoading(false)
            setError('Unknown error occured')
            return false
        }
    }
                    
    return(
        <main className={styles.main}>
            {isLoading && <Loader />}
            <div className={styles.formContainer}>
                <h2>Create an User</h2>
                <form onSubmit={handleSubmit}>
                    <label>Username</label>
                    <input value={formState.username} onChange={updateState} name='username' type='text'></input>
                    <label>Password</label>
                    <input value={formState.password} onChange={updateState} name='password' type='password'></input>
                    <input type='submit' value='Register'/>
                </form>
                {error && <small className={styles.error}>Error: {error}</small>}
                <br/>
                <small>
                    Already a user? Go to <Link className={styles.link} href='/login'>login page</Link>
                </small>
            </div>
        </main>
    )
}