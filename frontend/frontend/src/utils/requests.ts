const baseUrl: string = "http://localhost:8000/";


export function refreshToken() {
    try {
        const refreshToken: string | undefined = localStorage.getItem('refresh-token')?.replaceAll('\"','');
        fetch(baseUrl + 'token/refresh',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                accept: 'application/json',
            },
            body: JSON.stringify({'refresh': refreshToken})
        })
        .then(response => response.json())
        .then(data => {
            if (data.code === 'token_not_valid') {
                console.log("Refresh token invalid, redirecting to login page");
                localStorage.setItem("access-token", '');
                localStorage.setItem("refresh-token", '');
                window.location.replace('http://localhost:3000/login');
            } else {
                console.log('Refreshed access token')
                localStorage.setItem("access-token", JSON.stringify(data.access))
            }
        })
    } catch (error) {
        console.log('Unexpected error occured, redirecting to login page')
        console.log(error)
        window.location.replace('http://localhost:3000/login');
    }
}

export async function makeRequest({method, url, data=undefined, headers={}}: {method: string, url: string, data?: object, headers?: any}, setLoading: Function) {
    try {
        setLoading(true)
        const response = await fetch(baseUrl + url , {
            method: method,
            body: JSON.stringify(data),
            headers: {
                ...headers,
                Authorization: localStorage.getItem('access-token')
                    ? 'Bearer ' + localStorage.getItem('access-token')?.replaceAll('\"','')
                    : null,
                'Content-Type': 'application/json',
                accept: 'application/json'
            }, 
        })
        console.log("Response:")
        console.log(response)
        setLoading(false)
        const response_data = await response.json()
        if (response_data.code === 'token_not_valid') {
            refreshToken();
            makeRequest({method, url, data, headers}, setLoading)
        }
        return {status: "ok", response_status: response.status, data: response_data}
    } catch (error) {
        return {status:'nok', err: error}
    }
}

export async function validateToken() {
    let accessToken = localStorage.getItem("access-token");
    let refreshToken = localStorage.getItem("refresh-token");
    if (accessToken === null || refreshToken === null) {
        console.log('No tokens in localstorage, redirecting to login page')
        window.location.replace('http://localhost:3000/login')
    } else {
        
    }
}