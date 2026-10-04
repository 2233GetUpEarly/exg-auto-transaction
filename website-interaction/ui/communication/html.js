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

    const flowSelect = `
        <!-- 流程选择 -->
        <div style="margin-bottom: ${eatwi.global.ui.isMobile ? '16px' : '12px'}">
            <select id="eatwi-communication-flow-select">
                <option value="">-- 选择流程 --</option>
            </select>
        </div>
    `;

    const button = `
        <!-- 按钮区 -->
        <div style="display: flex; gap: ${eatwi.global.ui.isMobile ? '12px' : '8px'}; margin-bottom: ${eatwi.global.ui.isMobile ? '16px' : '12px'}">
            <button id="eatwi-communication-flow-run">▶ 执行流程</button>
            <!-- <button id="dp-enqueue"> 导入队列</button> -->
            <!-- <button id="dp-queue">📋 执行队列</button> -->
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
    window.eatwi.global.ui.communication.flowSelect = flowSelect;
    window.eatwi.global.ui.communication.button = button;
    window.eatwi.global.ui.communication.websocketServer = websocketServer;
})();