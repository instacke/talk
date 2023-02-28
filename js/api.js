var API = (function(){  //self
    const BASE_URL = 'https://study.duyiedu.com'
    const TOKEN_KEY = 'token' //方便统一更改
    
    function get(path){
        const headers = {};
        const token = localStorage.getItem(TOKEN_KEY);
        if(token){
            headers.authorization = `Bearer ${token}`
        }
        return fetch(BASE_URL + path, { headers })
    }
    
    function post(path, bodyObj){
        const headers = {
            'Content-Type': 'application/json',
        };
        const token = localStorage.getItem(TOKEN_KEY);
        if(token){
            headers.authorization = `Bearer ${token}`
        }
        return fetch(BASE_URL + path, { headers, method:'POST', body: JSON.stringify(bodyObj) })
    }
    
    async function reg(userInfo){
    
        const resp = await post('/api/user/reg',userInfo)
        const result = await resp.json();
        return result
    }
    
    async function login(userInfo){
            
            const resp = await post('/api/user/login',userInfo);
            const result = await resp.json();
            if(result.code === 0){
                const token = resp.headers.get('authorization');
                localStorage.setItem(TOKEN_KEY, token)
            }
            return result;
        }
    
    
    async function exists(loginId){
        const resp = await get('/api/user/exists?loginId=' + loginId)
        return resp.json();
    }
    
    async function profile(){
        const resp = await get('/api/user/profile')
        return await resp.json();
    }
    
    async function sendChat(content){
        const resp = await post('/api/chat', {
            content
        });
        return await resp.json();
    }
    
    async function getHistory(){
        const resp = await get('/api/chat/history')
        return await resp.json()
    }
    
    function logout(){
        console.log('logout');
        localStorage.removeItem(TOKEN_KEY)
    }

    return {
        reg,
        login,
        logout,
        exists,
        sendChat,
        profile,
        getHistory,

    }
})()
