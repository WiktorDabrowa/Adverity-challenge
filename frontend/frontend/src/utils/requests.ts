const baseUrl: string = "http://localhost:8000/";


async function refreshToken() {
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

export async function makeRequest(
    {method, url, data=undefined, headers={}}: {method: string, url: string, data?: FormData, headers?: any},
    setLoading: Function,
    verify:boolean=true
) {
    if (verify) {
        const tokensInLocalStorage = await validateToken();
        if (!tokensInLocalStorage) {
            window.location.replace('http://localhost:3000/login');
            return {status: 'nok', err: 'No tokens in storage, user needs to log in again', data:[]}
        }
    }
    try {
        setLoading(true)
        const response = await fetch(baseUrl + url , {
            method: method,
            body: data,
            headers: {
                ...headers,
                Authorization: localStorage.getItem('access-token')
                    ? 'Bearer ' + localStorage.getItem('access-token')?.replaceAll('\"','')
                    : null,
                accept: 'application/json'
            }, 
        })
        console.log("Response:")
        console.log(response)
        setLoading(false)
        const response_data = await response.json()
        if (response_data.code === 'token_not_valid') {
            console.log('token stale, attempting refresh...')
            refreshToken();
            console.log('Token refreshed. Attempting request again...')
            const response: any = await makeRequest({method, url, data, headers}, setLoading);
            return response
        }
        return {status: "ok", response_status: response.status, data: response_data}
    } catch (error) {
        return {status:'nok', err: error, data:[]}
    }
}

export async function validateToken() {
    let accessToken = localStorage.getItem("access-token");
    let refreshToken = localStorage.getItem("refresh-token");
    if (accessToken === null || refreshToken === null) {
        console.log('No tokens in localstorage, redirecting to login page')
        return false
    }
    return true
}