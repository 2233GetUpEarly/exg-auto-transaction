(function(){

    // 创建浮动面板
    const floatingWindow = `
        <div id="darkrp-control-panel">
            <div id="dp-main-container">
            </div>
        <div>
    `;

    const dpResizeHandle = `
        <!-- 拉伸手柄（右下角） -->
        <div id="dp-resize-handle"></div>
    `;

    const dpTitleBar = `
        <!-- 标题栏 -->
        <div id="dp-title-bar">
            <span style="font-weight: 500;">🎮 EXG 游戏菜单控制台</span>
            <div style="display: flex; gap: ${eatwi.global.ui.isMobile ? '16px' : '8px'}">
                <button id="dp-minimize">−</button>
                <button id="dp-close">✕</button>
            </div>
        </div>
    `;

    const dpContent = `
        <!-- 可滚动内容区 -->
        <div id="dp-content">
        </div>
    `;

    const dpLog = `
        <!-- 日志区 -->
        <div>
            <div style="color: #aaa; font-size: ${eatwi.global.ui.isMobile ? '12px' : '11px'}; margin-bottom: 6px;">📝 执行日志</div>
            <div id="dp-log"></div>
        </div>
    `;

    const dpMenuPath = `
        <div>
            <span>路径:</span>
            <span id="dpMenuPath"></span>
        </div>
    `;

    const dpFlowSelect = `
        <!-- 流程选择 -->
        <div style="margin-bottom: ${eatwi.global.ui.isMobile ? '16px' : '12px'}">
            <select id="dp-flow-select">
                <option value="">-- 选择流程 --</option>
            </select>
        </div>
    `;

    const dpButton = `
        <!-- 按钮区 -->
        <div style="display: flex; gap: ${eatwi.global.ui.isMobile ? '12px' : '8px'}; margin-bottom: ${eatwi.global.ui.isMobile ? '16px' : '12px'}">
            <button id="dp-run">▶ 执行流程</button>
            <button id="dp-enqueue"> 导入队列</button>
            <button id="dp-queue">📋 执行队列</button>
        </div>
    `;

    const dpQueuePanel = `
        <!-- ========== 队列面板区 ========== -->
        <div id="dp-queue-panel">
            <div id="title-queue-panel">
                📋 队列流程 ▶
            </div>
            <div style="width: 50%;">
            <button id="refresh-queue-button" class="btn-red">刷新队列</button>
            </div>
            
            <div id="queue-panel" style="display: none">
                <table border="0.5">
                    <thead>
                        <tr><th>编号</th><th>数据</th><th>操作</th></tr>
                    </thead>
                    <tbody id="queue-table-body">
                    </tbody>
                </table>
            </div>
        </div>
    `;

    const dpTradingParams = `
        <!-- ========== 交易币参数输入区 ========== -->
        <div id="dp-trading-params">
            <div id="title-input-trading-panel">
                💰 卖交易币参数 ▶
            </div>
            
            <div id="input-trading-panel" style="display: none">
            <!-- 交易币数量 -->
            <div style="margin-bottom: 12px;">
                <label style="display: block; color: #ccc; font-size: ${eatwi.global.ui.isMobile ? '12px' : '11px'}; margin-bottom: 4px;">
                    📊 交易币数量
                </label>
                <input type="number" id="dp-trading-coin" placeholder="例: 100" value="100" step="1">
                <div style="color: #888; font-size: 10px; margin-top: 4px;">填入你要出售的交易币数量</div>
            </div>
            
            <!-- 积分价格 -->
            <div style="margin-bottom: 12px;">
                <label style="display: block; color: #ccc; font-size: ${eatwi.global.ui.isMobile ? '12px' : '11px'}; margin-bottom: 4px;">
                    💎 积分数量
                </label>
                <input type="number" id="dp-points-price" placeholder="例: 500" value="500" step="1">
                <div style="color: #888; font-size: 10px; margin-top: 4px;">填入要多少积分才能买你的交易币</div>
            </div>
            <span id="enqueue-input-trading">买交易币参数输入到队列</span>
            </div>
                
            <!-- 显示当前值状态 -->
            <div style="
                margin-top: 10px; 
                padding: 6px 8px; 
                background: #1a1a28; 
                border-radius: 6px; 
                font-size: 11px; 
                color: #aaa;
                word-break: break-all;
            ">
                交易币:<span id="dp-trading-coin-display">10</span>
                | 积分:<span id="dp-points-price-display">1000</span>
                | 比例:<span id="dp-points-to-trading-coin-display1">?</span>
            </div>
        </div>
    `;

    const dpTradingCoinMarket = `
        <!-- ========== 交易币市场区 ========== -->
        <div id="dp-trading-coin-market">
            <div id="title-trading-coin-market-panel">
                💰 交易币交易市场 ▶
            </div>
            
            <div id="trading-coin-market-panel" style="display: none">
                <!-- 模块化插入 -->
            </div>
        </div>
    `;

    const dpTradingCoinMarketCurrentSale = `
        <!-- 正在出售的交易币展示 -->
        <div>正在出售的交易币：</div>
        <div id="trading-coin-market-current-sale" style="margin-bottom: 12px;">
        </div>
    `;

    const dpTradingCoinMarketCurrentInfo = `
        <!-- 已经出售的前20次交易信息 -->
        <div>已经出售的前20次交易信息：</div>
        <div id="trading-coin-market-current-info" style="margin-bottom: 12px;">
        </div>
    `;

    const dpTradingCoinMarketDateInfo = `
        <!-- 已经出售的前10天交易币交易信息 -->
        <div>已经出售的前10天交易币交易信息：</div>
        <div id="trading-coin-market-date-info" style="margin-bottom: 12px;">
        </div>
    `;

    const dpPointsParams = `
        <!-- ========== 积分参数输入区 ========== -->
        <div id="dp-points-params">
            <div id="title-input-points-panel">
                💎 卖积分参数 ▶
            </div>
            
            <div id="input-points-panel" style="display: none">
            <!-- 积分数量 -->
            <div style="margin-bottom: 12px;">
                <label style="display: block; color: #ccc; font-size: ${eatwi.global.ui.isMobile ? '12px' : '11px'}; margin-bottom: 4px;">
                    📊 积分数量
                </label>
                <input type="number" id="dp-points-amount" placeholder="例: 1000" value="1000" step="1">
                <div style="color: #888; font-size: 10px; margin-top: 4px;">填入你要出售的积分数量</div>
            </div>
            
            <!-- 交易币单价 -->
            <div style="margin-bottom: 12px;">
                <label style="display: block; color: #ccc; font-size: ${eatwi.global.ui.isMobile ? '12px' : '11px'}; margin-bottom: 4px;">
                    🪙 交易币数量
                </label>
                <input type="number" id="dp-tradingcoin-price" placeholder="例: 10" value="10" step="1">
                <div style="color: #888; font-size: 10px; margin-top: 4px;">填入要多少交易币才能买你的积分</div>
            </div>
            <span id="enqueue-input-points">买积分参数输入到队列</span>
            </div>
            
            <!-- 显示当前值状态 -->
            <div style="
                margin-top: 10px; 
                padding: 6px 8px; 
                background: #1a1a28; 
                border-radius: 6px; 
                font-size: 11px; 
                color: #aaa;
                word-break: break-all;
            ">
                积分:<span id="dp-points-amount-display">1000</span> 
                | 交易币:<span id="dp-tradingcoin-price-display">10</span> 
                | 比例:<span id="dp-points-to-trading-coin-display2">?</span>
            </div>
        </div>
    `;

    const dpPointsMarket = `
        <!-- ========== 积分市场区 ========== -->
        <div id="dp-points-market">
            <div id="title-points-market-panel">
                💎 积分交易市场 ▶
            </div>
            
            <div id="points-market-panel" style="display: none">
                <!-- 模块化插入 -->
            </div>
        </div>
    `;

    const dpPointsMarketCurrentSale = `
        <!-- 正在出售的积分展示 -->
        <div>正在出售的积分：</div>
        <div id="points-market-current-sale" style="margin-bottom: 12px;">
        </div>
    `;

    const dpPointsMarketCurrentInfo = `
        <!-- 已经出售的前20次交易信息 -->
        <div>已经出售的前20次交易信息：</div>
        <div id="points-market-current-info" style="margin-bottom: 12px;">
        </div>
    `;

    const dpPointsMarketDateInfo = `
        <!-- 已经出售的前10天积分交易信息 -->
        <div>已经出售的前10天积分交易信息：</div>
        <div id="points-market-date-info" style="margin-bottom: 12px;">
        </div>
    `;

    window.eatwi = window.eatwi || {};
    window.eatwi.global = window.eatwi.global || {};
    window.eatwi.global.ui = window.eatwi.global.ui || {};

    window.eatwi.global.ui.floatingWindow = floatingWindow;
    window.eatwi.global.ui.dpResizeHandle = dpResizeHandle;
    window.eatwi.global.ui.dpTitleBar = dpTitleBar;
    window.eatwi.global.ui.dpContent = dpContent;
    window.eatwi.global.ui.dpLog = dpLog;
    window.eatwi.global.ui.dpMenuPath = dpMenuPath;
    window.eatwi.global.ui.dpFlowSelect = dpFlowSelect;
    window.eatwi.global.ui.dpButton = dpButton;
    window.eatwi.global.ui.dpQueuePanel = dpQueuePanel;
    window.eatwi.global.ui.dpTradingParams = dpTradingParams;
    window.eatwi.global.ui.dpTradingCoinMarket = dpTradingCoinMarket;
    window.eatwi.global.ui.dpTradingCoinMarketCurrentSale = dpTradingCoinMarketCurrentSale;
    window.eatwi.global.ui.dpTradingCoinMarketCurrentInfo = dpTradingCoinMarketCurrentInfo;
    window.eatwi.global.ui.dpTradingCoinMarketDateInfo = dpTradingCoinMarketDateInfo;
    window.eatwi.global.ui.dpPointsParams = dpPointsParams;
    window.eatwi.global.ui.dpPointsMarket = dpPointsMarket;
    window.eatwi.global.ui.dpPointsMarketCurrentSale = dpPointsMarketCurrentSale;
    window.eatwi.global.ui.dpPointsMarketCurrentInfo = dpPointsMarketCurrentInfo;
    window.eatwi.global.ui.dpPointsMarketDateInfo = dpPointsMarketDateInfo;
})();