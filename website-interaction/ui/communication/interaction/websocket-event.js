(function(){


    // ============ 事件绑定 ============
    // 发送信息
    const sendButton = document.getElementById('eatwi-communication-send');
    sendButton.addEventListener('click', () => {
        const inputBox = document.getElementById('eatwi-communication-input');
        const text = inputBox.value.trim();
        if (text)
        {
            send(text);
            inputBox.value = '';
        }
    })

    const linkButton = document.getElementById('eatwi-communication-link');
    linkButton.addEventListener('click', () => {
        eatwi.global.websocket.connect();
    });
})();