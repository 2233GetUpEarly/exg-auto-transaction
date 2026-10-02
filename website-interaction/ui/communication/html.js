(function(){

    const mainContainer = `
        <div id="eatwi-communication-main-container">
        </div>
    `;

    const log = `
        <div>
            <div>📝 执行日志</div>
            <div id="eatwi-communication-log"></div>
        </div>
    `;

    const websocketServer = `
        <div>
            <div id="eatwi-communication-header">
                <span><span id="eatwi-communication-status"></span>本地 WS</span>
            </div>
            <div>
                <input id="eatwi-communication-input" type="text" placeholder="输入消息，点击按钮发送..." />
                <div>
                    <button class="eatwi-communication-btn" id="eatwi-communication-send">发送</button>
                    <button class="eatwi-communication-btn" id="eatwi-communication-link">连接</button>
                </div>
            </div>    
        </div>
    `;

    window.eatwi = window.eatwi || {};
    window.eatwi.global = window.eatwi.global || {};
    window.eatwi.global.ui = window.eatwi.global.ui || {};
    window.eatwi.global.ui.communication = window.eatwi.global.ui.communication || {};

    window.eatwi.global.ui.communication.mainContainer = mainContainer;
    window.eatwi.global.ui.communication.log = log;
    window.eatwi.global.ui.communication.websocketServer = websocketServer;
})();