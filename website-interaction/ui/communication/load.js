(function(){

    const style = document.createElement('style');
    style.textContent = eatwi.global.ui.communication.style;
    document.head.appendChild(style);

    // 标签栏样式
    const tabBarStyle = {
        display: 'flex',
        gap: '6px',
        padding: '10px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        flexShrink: '0',
    };

    eatwi.global.uiSlot.register({
        id: 'communication-control-panel',
        title: '通信',
        icon: '📡',
        style: tabBarStyle,
        mount(container)
        {
            const panel = document.createElement('div');
            panel.id = 'eatwi-communication-control-panel';
            container.appendChild(panel);
        }
    });

    eatwi.util.appendHTML('通信面板区', '#eatwi-communication-control-panel', eatwi.global.ui.communication.mainContainer, eatwi.DEBUG);
    eatwi.util.appendHTML('通信日志区', '#eatwi-communication-main-container', eatwi.global.ui.communication.log, eatwi.DEBUG);
    eatwi.util.appendHTML('通信选择流程框区', '#eatwi-communication-main-container', eatwi.global.ui.communication.flowSelect, eatwi.DEBUG);
    eatwi.util.appendHTML('通信执行区', '#eatwi-communication-main-container', eatwi.global.ui.communication.button, eatwi.DEBUG);
    eatwi.util.appendHTML('通信发送区', '#eatwi-communication-main-container', eatwi.global.ui.communication.websocketServer, eatwi.DEBUG);

})();