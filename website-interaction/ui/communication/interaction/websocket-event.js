(function(){


    // ============ 事件绑定 ============

    const linkButton = document.getElementById('eatwi-communication-link');
    linkButton.addEventListener('click', () => {
        eatwi.global.websocket.connect();
    });
})();