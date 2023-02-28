// 检测是否登录
(async function(){
    const resp = await API.profile();
    // console.log(resp);
    const user = resp.data

    if(!user){
        alert('未登录或登录已过期，请重新登录')
        location.href = './login.html';
        return
    }
// 存放要用的dom节点
    const doms = {
        aside:{
            nickname: $('#nickname'),
            loginId: $('#loginId')
        },
        close: $('.close'),
        msgContainer:$('.msg-container'),
        chatContainer:$('.chat-container'),
        txtMsg: $('#txtMsg'),
        messageContainer: $('.msg-container'),
    }
// 注销事件
    doms.close.onclick = function(){
        API.logout()
        location.href = './login.html'
    }

// 加载历史记录
    await loadHistory();
    async function loadHistory(){ 
        const resp = await API.getHistory();
        for (const item of resp.data) {
            addChat(item)
        }
        scrollBottom();
    }

// 设置用户信息
    function setUserInfo() {
        doms.aside.nickname.innerText = user.nickname;
        //为什么不能用innerHTML
        // 防止html注入（注入攻击）
        
        doms.aside.loginId.innerText = user.loginId;
    }
    setUserInfo()

// 根据消息对象，将其添加到页面中
    function addChat(chatInfo){
        const div = $$$('div');
        div.classList.add('chat-item');
        if(chatInfo.from){
            div.classList.add('me');
        }
        const img = $$$('img');
        img.className = 'chat-avatar';
        img.src = chatInfo.from ? './asset/avatar.png' : './asset/robot-avatar.jpg'

        const content = $$$('div');
        content.className = 'chat-content';
        content.innerText = chatInfo.content

        const date = $$$('div');
        date.className = 'chat-date';
        date.innerText = formatDate(chatInfo.createdAt);

        div.appendChild(img);
        div.appendChild(content);
        div.appendChild(date);

        doms.chatContainer.appendChild(div);

    }

    function scrollBottom(){
        doms.chatContainer.scrollTop = doms.chatContainer.scrollHeight;
    }

    function formatDate(timestamp) {
        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hour = date.getHours().toString().padStart(2, '0');
        const minute = date.getMinutes().toString().padStart(2, '0');
        const second = date.getSeconds().toString().padStart(2, '0');
    
        return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
      }

    // 发送信息
    async function sendChat() {
        const content = doms.txtMsg.value.trim(); 
        if(!content){
            return
        }

        addChat({
            from: user.loginId,
            to: null,
            content,
            createdAt: Date.now(),
        })
        doms.txtMsg.value = ''
        scrollBottom()
        API.sendChat(content)
        .then(resp => {
            addChat({
                from: null,
                to: user.loginId,
                ...resp.data
            })
        })
        .then(() => {scrollBottom()});

    } 
    // 不是按钮的点击事件，是表单的提交事件
    doms.messageContainer.onsubmit = function(e) {
        e.preventDefault();
        sendChat()
    }
})();


//   改一下

