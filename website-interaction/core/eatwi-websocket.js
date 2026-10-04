(function(){
    // ============ 配置 ============
    const WS_URL = 'ws://127.0.0.1:54321';
    const RECONNECT_DELAY = 3000;   // 断线重连间隔（毫秒）
    const HEARTBEAT_INTERVAL = 30000; // 心跳间隔（毫秒）

    class EatwiWebSocket
    {
        constructor()
        {
            this.#ws = null;
        }

        // ============ 发送 ============
        send(data)
        {
            if (!this.#ws || this.#ws.readyState !== WebSocket.OPEN)
            {
                if (eatwi.DEBUG)
                {
                    console.error('未连接，无法发送');
                }
                return false;
            }
            try
            {
                const text = typeof data === 'string' ? data : JSON.stringify(data);
                this.#ws.send(text);
                if (eatwi.DEBUG)
                {
                    console.log(`→ ${text}`);
                }
                return true;
            }
            catch (e)
            {
                if (eatwi.DEBUG)
                {
                    console.error(`发送失败: ${e.message}`);
                }
                return false;
            }
        }

        startHeartbeat()
        {
            this.stopHeartbeat();
            this.#heartbeatTimer = setInterval(() => {
                if (this.#ws && this.#ws.readyState === WebSocket.OPEN)
                {
                    this.#ws.send(JSON.stringify({
                        type: 'heartbeat',
                        url: location.href,
                        time: Date.now()
                    }));
                }
            }, HEARTBEAT_INTERVAL);
        }

        stopHeartbeat()
        {
            if (this.#heartbeatTimer)
            {
                clearInterval(this.#heartbeatTimer);
                this.#heartbeatTimer = null;
            }
        }

        scheduleReconnect()
        {
            // 客户端手动重连即可
            // if (this.#reconnectTimer) return;
            // this.#reconnectTimer = setTimeout(() => {
            //     this.#reconnectTimer = null;
            //     this.connect();
            // }, RECONNECT_DELAY);
        }

        // ============ WebSocket 连接 ============
        connect()
        {
            if (this.#ws && (this.#ws.readyState === WebSocket.OPEN || this.#ws.readyState === WebSocket.CONNECTING))
            {
                return;
            }

            if (eatwi.DEBUG)
            {
                console.log(`正在连接 ${WS_URL} ...`);
            }
            this.#ws = new WebSocket(WS_URL);

            this.#ws.onopen = () => {
                if (eatwi.DEBUG)
                {
                    console.log('已连接', 'recv');
                }
                this.startHeartbeat();
            };

            this.#ws.onmessage = (event) => {
                if (eatwi.DEBUG)
                {
                    console.log(`← ${event.data}`, 'recv');
                }
            };

            this.#ws.onerror = () => {
                if (eatwi.DEBUG)
                {
                    console.error('连接出错');
                }
            };

            this.#ws.onclose = (event) => {
                if (eatwi.DEBUG)
                {
                    console.error(`连接关闭 (code=${event.code})`);
                }
                this.stopHeartbeat();
                this.#ws = null;
                if (!this.#manualClose)
                {
                    this.scheduleReconnect();
                }
            };
        }

    // ============ 状态 ============
        #ws = null;
        #reconnectTimer = null;
        #heartbeatTimer = null;
        #manualClose = null;
    }

    window.eatwi = window.eatwi || {};
    window.eatwi.EatwiWebSocket = EatwiWebSocket;
})();
