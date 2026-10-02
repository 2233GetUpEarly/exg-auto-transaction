(function(){
    // ============ 配置 ============
    const WS_URL = 'ws://127.0.0.1:54321';
    const RECONNECT_DELAY = 3000;   // 断线重连间隔（毫秒）
    const HEARTBEAT_INTERVAL = 30000; // 心跳间隔（毫秒）

    // ============ 状态 ============
    let ws = null;
    let reconnectTimer = null;
    let heartbeatTimer = null;
    let manualClose = true;

    // ============ WebSocket 连接 ============
    function connect()
    {
        if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING))
        {
            return;
        }

        window.eatwi.global.ui.communication.addLog(`正在连接 ${WS_URL} ...`);
        ws = new WebSocket(WS_URL);

        ws.onopen = () => {
            window.eatwi.global.ui.communication.addLog('已连接', 'recv');
            startHeartbeat();
        };

        ws.onmessage = (event) => {
            window.eatwi.global.ui.communication.addLog(`← ${event.data}`, 'recv');
        };

        ws.onerror = () => {
            window.eatwi.global.ui.communication.addLog('连接出错', 'err');
        };

        ws.onclose = (event) => {
            window.eatwi.global.ui.communication.addLog(`连接关闭 (code=${event.code})`, 'err');
            stopHeartbeat();
            ws = null;
            if (!manualClose)
            {
                scheduleReconnect();
            }
        };
    }

    function scheduleReconnect()
    {
        if (reconnectTimer) return;
        reconnectTimer = setTimeout(() => {
            reconnectTimer = null;
            connect();
        }, RECONNECT_DELAY);
    }

    function startHeartbeat()
    {
        stopHeartbeat();
        heartbeatTimer = setInterval(() => {
            if (ws && ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({
                    type: 'heartbeat',
                    url: location.href,
                    time: Date.now()
                }));
            }
        }, HEARTBEAT_INTERVAL);
    }

    function stopHeartbeat()
    {
        if (heartbeatTimer)
        {
            clearInterval(heartbeatTimer);
            heartbeatTimer = null;
        }
    }

    // ============ 发送 ============
    function send(data)
    {
        if (!ws || ws.readyState !== WebSocket.OPEN)
        {
            window.eatwi.global.ui.communication.addLog('未连接，无法发送', 'err');
            return false;
        }
        try
        {
            const text = typeof data === 'string' ? data : JSON.stringify(data);
            ws.send(text);
            window.eatwi.global.ui.communication.addLog(`→ ${text}`, 'sent');
            return true;
        }
        catch (e)
        {
            window.eatwi.global.ui.communication.addLog(`发送失败: ${e.message}`, 'err');
            return false;
        }
    }

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
        connect();
    });
})();
