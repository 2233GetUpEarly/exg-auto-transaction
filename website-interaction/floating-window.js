
(function() {
    'use strict';

    // 防止重复添加
    if (document.getElementById('darkrp-control-panel')) return;

    // 检测是否为移动端
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;

    // 初始化存储位置
    if (!window.darkrp) window.darkrp = {};
    if (!window.darkrp.ui) window.darkrp.ui = {};
    
    // 存储输入框的值（供步骤函数读取）
    window.darkrp.ui.tradingCoinForm = {
        tradingCoin: '',
        points: '',
        password: '',
        pointsToTradingCoin: '',
    };

    // 存储输入框的值 - 积分
    window.darkrp.ui.pointsForm = {
        points: '',      // 积分数量
        tradingCoin: '', // 交易币单价
        password: '',
        pointsToTradingCoin: '',
    };

    // 用于保存原始函数（包装模式）
    window.darkrp.ui._originalSellTradingCoinFill = null;
    window.darkrp.ui._originalSellTradingCoinFillPassword = null;

    // 用于保存原始函数（包装模式）- 积分
    window.darkrp.ui._originalSellPointsFill = null;
    window.darkrp.ui._originalSellPointsFillPassword = null;

    // 创建浮动面板
    const floatingWindow = `
        <div id="darkrp-control-panel">
            <div id="dp-main-container" style="
                bottom: ${isMobile ? '10px' : '40px'};
                right: ${isMobile ? '10px' : '20px'};
                left: ${isMobile ? '10px' : 'auto'};
                width: ${isMobile ? 'calc(100% - 20px)' : '600px'};
                max-width: ${isMobile ? 'none' : '80vw'};
                max-height: ${isMobile ? '90vh' : '80vh'};
                border-radius: ${isMobile ? '16px' : '12px'};
                font-size: ${isMobile ? '14px' : '14px'};
                position: fixed;
                min-width: 300px;
                min-height: 400px;
                background: #1e1e2f;
                box-shadow: 0 4px 20px rgba(0,0,0,0.4);
                z-index: 999999;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                transition: none;
                display: flex;
                flex-direction: column;
                overflow: hidden;
                resize: both;
            ">
            </div>
        <div>
    `;

    darkrp.util.appendHTML('浮动窗口HTML', 'body', floatingWindow);

    const dpResizeHandle = `
        <!-- 拉伸手柄（右下角） -->
        <div id="dp-resize-handle" style="
            position: absolute;
            bottom: 0;
            right: 0;
            width: 20px;
            height: 20px;
            cursor: nw-resize;
            background: linear-gradient(135deg, transparent 50%, #5a5a7a 50%);
            border-bottom-right-radius: ${isMobile ? '16px' : '12px'};
            z-index: 10;
        "></div>
    `;

    darkrp.util.appendHTML('浮动窗口拉伸手柄', '#dp-main-container', dpResizeHandle);

    const dpTitleBar = `
        <!-- 标题栏 -->
        <div id="dp-title-bar" style="
            background: #2a2a3a;
            color: #fff;
            padding: ${isMobile ? '14px 16px' : '10px 12px'};
            border-radius: ${isMobile ? '16px 16px 0 0' : '12px 12px 0 0'};
            display: flex;
            justify-content: space-between;
            align-items: center;
            touch-action: ${isMobile ? 'none' : 'auto'};
            ${isMobile ? 'min-height: 48px;' : ''}
            flex-shrink: 0;
        ">
            <span style="font-weight: 500;">🎮 EXG 游戏菜单控制台</span>
            <div style="display: flex; gap: ${isMobile ? '16px' : '8px'}">
                <button id="dp-minimize" style="
                    background: none;
                    border: none;
                    color: #fff;
                    cursor: pointer;
                    font-size: ${isMobile ? '20px' : '16px'};
                    padding: ${isMobile ? '8px 12px' : '4px 8px'};
                    touch-action: manipulation;
                ">−</button>
                <button id="dp-close" style="
                    background: none;
                    border: none;
                    color: #fff;
                    cursor: pointer;
                    font-size: ${isMobile ? '20px' : '16px'};
                    padding: ${isMobile ? '8px 12px' : '4px 8px'};
                    touch-action: manipulation;
                ">✕</button>
            </div>
        </div>
    `;

    darkrp.util.appendHTML('浮动窗口标题栏', '#dp-main-container', dpTitleBar);

    const dpContent = `
        <!-- 可滚动内容区 -->
        <div id="dp-content" style="
            padding: ${isMobile ? '14px' : '12px'}; 
            background: #2d2d3a; 
            overflow-y: auto;
            flex: 1;
        ">
        </div>
    `;
    
    darkrp.util.appendHTML('浮动窗口内容', '#dp-main-container', dpContent);
    
    const dpLog = `
        <!-- 日志区 -->
        <div>
            <div style="color: #aaa; font-size: ${isMobile ? '12px' : '11px'}; margin-bottom: 6px;">📝 执行日志</div>
            <div id="dp-log" style="
                background: #1e1e2f;
                height: ${isMobile ? '150px' : '120px'};
                overflow-y: auto;
                padding: ${isMobile ? '10px' : '8px'};
                border-radius: ${isMobile ? '10px' : '6px'};
                font-size: ${isMobile ? '12px' : '11px'};
                color: #0f0;
                font-family: 'Courier New', monospace;
                word-break: break-all;
                white-space: pre-wrap;
                padding: 10 10 10 10;
            "></div>
        </div>`;

    darkrp.util.appendHTML('浮动窗口日志信息区', '#dp-content', dpLog);

    // 操作路径
    const dpMenuPath = `
        <div>
            <span>路径:</span>
            <span id="dpMenuPath"></span>
        </div>
    `;

    // 更新菜单路径
    function updateMenuPath()
    {
        var getMenuPath = document.getElementById('divMenuPath');
        var floatingWindowMenuPath = document.getElementById('dpMenuPath');
        if (getMenuPath.children.length > 0) floatingWindowMenuPath.textContent = getMenuPath.children[0].textContent;
        for (var i = 1; i < getMenuPath.children.length; ++i)
        {
            floatingWindowMenuPath.textContent += " / " + getMenuPath.children[i].textContent;
        }
    }

    //document.addEventListener('click', updateMenuPath);
    // 监听真正变化（最可靠）
    function bindUpdateWithObserver() {
        const targetNode = document.getElementById('divMenuPath');
        if (targetNode) {
            const observer = new MutationObserver(updateMenuPath);
            observer.observe(targetNode, {
                childList: true,
                subtree: true,
                characterData: true
            });
        }
        // 首次执行一次
        updateMenuPath();
    }

    // 调用
    bindUpdateWithObserver();
    
    darkrp.util.appendHTML('浮动窗口路径信息区', '#dp-content', dpMenuPath);

    const dpFlowSelect = `
        <!-- 流程选择 -->
        <div style="margin-bottom: ${isMobile ? '16px' : '12px'}">
            <select id="dp-flow-select" style="
                width: 100%;
                padding: ${isMobile ? '12px' : '8px'};
                background: #1e1e2f;
                color: #fff;
                border: 1px solid #3a3a4a;
                border-radius: ${isMobile ? '10px' : '6px'};
                font-family: inherit;
                font-size: ${isMobile ? '16px' : '13px'};
                touch-action: manipulation;
            ">
                <option value="">-- 选择流程 --</option>
            </select>
        </div>`;

    darkrp.util.appendHTML('浮动窗口选择流程区', '#dp-content', dpFlowSelect);
        
    const dpButton = `
        <!-- 按钮区 -->
        <div style="display: flex; gap: ${isMobile ? '12px' : '8px'}; margin-bottom: ${isMobile ? '16px' : '12px'}">
            <button id="dp-run" style="
                flex: 1;
                padding: ${isMobile ? '12px' : '8px'};
                background: #4caf50;
                color: white;
                border: none;
                border-radius: ${isMobile ? '10px' : '6px'};
                cursor: pointer;
                font-family: inherit;
                font-size: ${isMobile ? '16px' : '13px'};
                font-weight: 500;
                touch-action: manipulation;
            ">▶ 执行流程</button>
            <button id="dp-list" style="
                flex: 1;
                padding: ${isMobile ? '12px' : '8px'};
                background: #2196f3;
                color: white;
                border: none;
                border-radius: ${isMobile ? '10px' : '6px'};
                cursor: pointer;
                font-family: inherit;
                font-size: ${isMobile ? '16px' : '13px'};
                font-weight: 500;
                touch-action: manipulation;
            ">📋 列表</button>
        </div>`;
    
    darkrp.util.appendHTML('浮动窗口选择流程执行区', '#dp-content', dpButton);
        
    const dpTradingParams = `
        <!-- ========== 交易币参数输入区 ========== -->
        <div id="dp-trading-params" style="
            margin-bottom: ${isMobile ? '16px' : '12px'};
            background: #252530;
            border-radius: ${isMobile ? '10px' : '8px'};
            padding: ${isMobile ? '12px' : '10px'};
            border-left: 3px solid #ff9800;
        ">
            <div style="color: #ff9800; font-size: ${isMobile ? '13px' : '12px'}; margin-bottom: 10px; font-weight: 500;">
                💰 卖交易币参数
            </div>
            
            <!-- 交易币数量 -->
            <div style="margin-bottom: 12px;">
                <label style="display: block; color: #ccc; font-size: ${isMobile ? '12px' : '11px'}; margin-bottom: 4px;">
                    📊 交易币数量 <span style="color: #ff9800;">(sell 输入框)</span>
                </label>
                <input type="number" id="dp-trading-coin" placeholder="例: 100" value="100" step="1" style="
                    width: 100%;
                    padding: ${isMobile ? '12px' : '8px'};
                    background: #1e1e2f;
                    color: #fff;
                    border: 1px solid #3a3a4a;
                    border-radius: ${isMobile ? '8px' : '4px'};
                    font-family: inherit;
                    font-size: ${isMobile ? '14px' : '12px'};
                    touch-action: manipulation;
                    box-sizing: border-box;
                ">
                <div style="color: #888; font-size: 10px; margin-top: 4px;">填入你要出售的交易币数量</div>
            </div>
            
            <!-- 积分价格 -->
            <div style="margin-bottom: 12px;">
                <label style="display: block; color: #ccc; font-size: ${isMobile ? '12px' : '11px'}; margin-bottom: 4px;">
                    💎 积分单价 <span style="color: #ff9800;">(price 输入框)</span>
                </label>
                <input type="number" id="dp-points-price" placeholder="例: 500" value="500" step="1" style="
                    width: 100%;
                    padding: ${isMobile ? '12px' : '8px'};
                    background: #1e1e2f;
                    color: #fff;
                    border: 1px solid #3a3a4a;
                    border-radius: ${isMobile ? '8px' : '4px'};
                    font-family: inherit;
                    font-size: ${isMobile ? '14px' : '12px'};
                    touch-action: manipulation;
                    box-sizing: border-box;
                ">
                <div style="color: #888; font-size: 10px; margin-top: 4px;">每个交易币要卖多少积分</div>
            </div>
            
            <!-- 交易密码 -->
            <div>
                <label style="display: block; color: #ccc; font-size: ${isMobile ? '12px' : '11px'}; margin-bottom: 4px;">
                    🔐 交易密码 <span style="color: #ff9800;">(密码输入框)</span>
                </label>
                <input type="password" id="dp-password" placeholder="输入交易密码" style="
                    width: 100%;
                    padding: ${isMobile ? '12px' : '8px'};
                    background: #1e1e2f;
                    color: #fff;
                    border: 1px solid #3a3a4a;
                    border-radius: ${isMobile ? '8px' : '4px'};
                    font-family: inherit;
                    font-size: ${isMobile ? '14px' : '12px'};
                    touch-action: manipulation;
                    box-sizing: border-box;
                ">
                <div style="color: #888; font-size: 10px; margin-top: 4px;">出售商品时需要的安全密码</div>
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
                📌 当前: 交易币=<span id="dp-trading-coin-display">100</span>
                | 积分=<span id="dp-points-price-display">500</span>
                | 比例=<span id="dp-points-to-trading-coin-display1">?</span>
                | 密码已填
            </div>
        </div>`;
    darkrp.util.appendHTML('浮动窗口交易币信息区', '#dp-content', dpTradingParams);

    const dpPointsParams = `
        <!-- ========== 积分参数输入区 ========== -->
        <div id="dp-points-params" style="
            margin-bottom: ${isMobile ? '16px' : '12px'};
            background: #252530;
            border-radius: ${isMobile ? '10px' : '8px'};
            padding: ${isMobile ? '12px' : '10px'};
            border-left: 3px solid #4caf50;
        ">
            <div style="color: #4caf50; font-size: ${isMobile ? '13px' : '12px'}; margin-bottom: 10px; font-weight: 500;">
                💎 卖积分参数
            </div>
            
            <!-- 积分数量 -->
            <div style="margin-bottom: 12px;">
                <label style="display: block; color: #ccc; font-size: ${isMobile ? '12px' : '11px'}; margin-bottom: 4px;">
                    📊 积分数量 <span style="color: #4caf50;">(sell 输入框)</span>
                </label>
                <input type="number" id="dp-points-amount" placeholder="例: 1000" value="1000" step="1" style="
                    width: 100%;
                    padding: ${isMobile ? '12px' : '8px'};
                    background: #1e1e2f;
                    color: #fff;
                    border: 1px solid #3a3a4a;
                    border-radius: ${isMobile ? '8px' : '4px'};
                    font-family: inherit;
                    font-size: ${isMobile ? '14px' : '12px'};
                    touch-action: manipulation;
                    box-sizing: border-box;
                ">
                <div style="color: #888; font-size: 10px; margin-top: 4px;">填入你要出售的积分数量</div>
            </div>
            
            <!-- 交易币单价 -->
            <div style="margin-bottom: 12px;">
                <label style="display: block; color: #ccc; font-size: ${isMobile ? '12px' : '11px'}; margin-bottom: 4px;">
                    🪙 交易币单价 <span style="color: #4caf50;">(price 输入框)</span>
                </label>
                <input type="number" id="dp-tradingcoin-price" placeholder="例: 10" value="10" step="1" style="
                    width: 100%;
                    padding: ${isMobile ? '12px' : '8px'};
                    background: #1e1e2f;
                    color: #fff;
                    border: 1px solid #3a3a4a;
                    border-radius: ${isMobile ? '8px' : '4px'};
                    font-family: inherit;
                    font-size: ${isMobile ? '14px' : '12px'};
                    touch-action: manipulation;
                    box-sizing: border-box;
                ">
                <div style="color: #888; font-size: 10px; margin-top: 4px;">每个积分要卖多少交易币</div>
            </div>
            
            <!-- 交易密码 -->
            <div>
                <label style="display: block; color: #ccc; font-size: ${isMobile ? '12px' : '11px'}; margin-bottom: 4px;">
                    🔐 交易密码 <span style="color: #4caf50;">(密码输入框)</span>
                </label>
                <input type="password" id="dp-points-password" placeholder="输入交易密码" style="
                    width: 100%;
                    padding: ${isMobile ? '12px' : '8px'};
                    background: #1e1e2f;
                    color: #fff;
                    border: 1px solid #3a3a4a;
                    border-radius: ${isMobile ? '8px' : '4px'};
                    font-family: inherit;
                    font-size: ${isMobile ? '14px' : '12px'};
                    touch-action: manipulation;
                    box-sizing: border-box;
                ">
                <div style="color: #888; font-size: 10px; margin-top: 4px;">出售积分时需要的安全密码</div>
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
                📌 当前: 积分=<span id="dp-points-amount-display">1000</span> 
                | 单价=<span id="dp-tradingcoin-price-display">10</span> 
                | 比例=<span id="dp-points-to-trading-coin-display2">?</span>
                | 密码已填
            </div>
        </div>`;
    darkrp.util.appendHTML('浮动窗口积分信息区', '#dp-content', dpPointsParams);

    const dpStep = `
        <!-- 快捷步骤区（滚动） -->
        <div style="margin-bottom: ${isMobile ? '16px' : '12px'}">
            <div style="color: #aaa; font-size: ${isMobile ? '12px' : '11px'}; margin-bottom: 8px;">⚡ 快捷步骤</div>
            <div id="dp-step-buttons" style="
                display: flex;
                flex-wrap: wrap;
                gap: ${isMobile ? '8px' : '6px'};
                max-height: ${isMobile ? '160px' : 'none'};
                overflow-y: ${isMobile ? 'auto' : 'visible'};
            "></div>
        </div>`;

    darkrp.util.appendHTML('浮动窗口快速步骤信息区', '#dp-content', dpStep);

    // 获取元素
    const panel = document.getElementById('darkrp-control-panel');
    const mainDiv = document.getElementById('dp-main-container');
    const titleBar = document.getElementById('dp-title-bar');
    const closeBtn = document.getElementById('dp-close');
    const minimizeBtn = document.getElementById('dp-minimize');
    const contentDiv = document.getElementById('dp-content');
    const flowSelect = document.getElementById('dp-flow-select');
    const runBtn = document.getElementById('dp-run');
    const listBtn = document.getElementById('dp-list');
    const logDiv = document.getElementById('dp-log');
    const stepButtonsDiv = document.getElementById('dp-step-buttons');
    const resizeHandle = document.getElementById('dp-resize-handle');
    
    // 输入框元素 - 交易币
    const tradingCoinInput = document.getElementById('dp-trading-coin');
    const pointsPriceInput = document.getElementById('dp-points-price');
    const passwordInput = document.getElementById('dp-password');
    const tradingCoinDisplay = document.getElementById('dp-trading-coin-display');
    const pointsPriceDisplay = document.getElementById('dp-points-price-display');
    const pointsToTradingCoinDisplay1 = document.getElementById('dp-points-to-trading-coin-display1');

    // 输入框元素 - 积分
    const pointsAmountInput = document.getElementById('dp-points-amount');
    const tradingcoinPriceInput = document.getElementById('dp-tradingcoin-price');
    const pointsPasswordInput = document.getElementById('dp-points-password');
    const pointsAmountDisplay = document.getElementById('dp-points-amount-display');
    const tradingcoinPriceDisplay = document.getElementById('dp-tradingcoin-price-display');
    const pointsToTradingCoinDisplay2 = document.getElementById('dp-points-to-trading-coin-display2');

    // 日志函数
    function addLog(msg, isError = false)
    {
        const logEntry = document.createElement('div');
        logEntry.textContent = `> ${new Date().toLocaleTimeString()} ${msg}`;
        logEntry.style.color = isError ? '#f66' : '#8f8';
        logEntry.style.marginBottom = '4px';
        logEntry.style.fontSize = isMobile ? '12px' : '11px';
        logDiv.appendChild(logEntry);
        logDiv.scrollTop = logDiv.scrollHeight;
        console.log(msg);
    }

    // 更新显示和全局存储
    function updateTradingParams()
    {
        const tradingCoin = tradingCoinInput.value;
        const points = pointsPriceInput.value;
        const password = passwordInput.value;
        const pointsToTradingCoin = points / tradingCoin;
        
        // 更新显示
        tradingCoinDisplay.textContent = tradingCoin || '0';
        pointsPriceDisplay.textContent = points || '0';
        pointsToTradingCoinDisplay1.textContent = pointsToTradingCoin || '0';
        
        // 更新全局存储
        window.darkrp.ui.tradingCoinForm = {
            tradingCoin: tradingCoin || '0',
            points: points || '0',
            password: password || '',
            pointsToTradingCoin: pointsToTradingCoin || '0',
        };
        
        // 可选：在控制台输出更新日志（调试用）
        // console.log('📝 UI参数已更新:', window.darkrp.ui.tradingCoinForm);
    }
    
    // 监听输入框变化
    tradingCoinInput.addEventListener('input', updateTradingParams);
    pointsPriceInput.addEventListener('input', updateTradingParams);
    passwordInput.addEventListener('input', updateTradingParams);
    
    // 初始化一次
    updateTradingParams();

    // 更新卖积分参数显示和全局存储
    function updatePointsParams()
    {
        const pointsAmount = pointsAmountInput.value;
        const tradingcoinPrice = tradingcoinPriceInput.value;
        const pointsPassword = pointsPasswordInput.value;
        const pointsToTradingCoin = pointsAmount / tradingcoinPrice;
        
        // 更新显示
        pointsAmountDisplay.textContent = pointsAmount || '0';
        tradingcoinPriceDisplay.textContent = tradingcoinPrice || '0';
        pointsToTradingCoinDisplay2.textContent = pointsToTradingCoin || '0';
        
        // 更新全局存储
        window.darkrp.ui.pointsForm = {
            points: pointsAmount || '0',
            tradingCoin: tradingcoinPrice || '0',
            password: pointsPassword || '',
            pointsToTradingCoin: pointsToTradingCoin || '0',
        };
    }

    // 监听卖积分输入框变化
    pointsAmountInput.addEventListener('input', updatePointsParams);
    tradingcoinPriceInput.addEventListener('input', updatePointsParams);
    pointsPasswordInput.addEventListener('input', updatePointsParams);

    // 初始化卖积分参数
    updatePointsParams();

    // ========== 包装步骤函数，使其读取 UI 输入框的值 ==========
    // 采用包装模式，保留原始函数，避免覆盖丢失
    function patchStepFunctions()
    {
        if (!window.darkrp || !window.darkrp.trigger || !window.darkrp.trigger._steps) {
            return false;
        }
        
        const steps = window.darkrp.trigger._steps;
        
        // 保存原始函数引用（如果还没保存过）
        if (!window.darkrp.ui._originalSellTradingCoinFill) {
            window.darkrp.ui._originalSellTradingCoinFill = steps['卖交易币填入交易币和积分'];
        }
        if (!window.darkrp.ui._originalSellTradingCoinFillPassword) {
            window.darkrp.ui._originalSellTradingCoinFillPassword = steps['卖交易币填入密码'];
        }
        
        // 包装：卖交易币填入交易币和积分 - 从 UI 读取参数后调用原始函数
        steps['卖交易币填入交易币和积分'] = async function() {
            const params = window.darkrp.ui.tradingCoinForm;
            const tradingCoin = params.tradingCoin;
            const points = params.points;
            
            addLog(`📝 从UI读取参数: 交易币=${tradingCoin}, 积分单价=${points}`);
            console.log(`✅ 步骤 卖交易币填入交易币和积分(${tradingCoin}, ${points}) 执行`);
            
            const originalFn = window.darkrp.ui._originalSellTradingCoinFill;
            if (originalFn) {
                // 调用原始函数，传入从 UI 读取的参数
                await originalFn(tradingCoin, points);
            } else {
                addLog('❌ 原始函数 卖交易币填入交易币和积分 不存在', true);
            }
        };
        
        // 包装：卖交易币填入密码 - 从 UI 读取密码后调用原始函数
        steps['卖交易币填入密码'] = async function() {
            const password = window.darkrp.ui.tradingCoinForm.password;
            
            addLog(`🔐 从UI读取密码: 已填 (长度 ${password.length})`);
            console.log(`✅ 步骤 卖交易币填入密码(${'*'.repeat(password.length)}) 执行`);
            
            const originalFn = window.darkrp.ui._originalSellTradingCoinFillPassword;
            if (originalFn) {
                // 调用原始函数，传入从 UI 读取的密码
                await originalFn(password);
            } else {
                addLog('❌ 原始函数 卖交易币填入密码 不存在', true);
            }
        };
        
        // 可选：提供一个恢复原始函数的方法
        window.darkrp.ui.restoreOriginalSteps = function() {
            if (window.darkrp.ui._originalSellTradingCoinFill) {
                steps['卖交易币填入交易币和积分'] = window.darkrp.ui._originalSellTradingCoinFill;
            }
            if (window.darkrp.ui._originalSellTradingCoinFillPassword) {
                steps['卖交易币填入密码'] = window.darkrp.ui._originalSellTradingCoinFillPassword;
            }
            addLog('🔁 已恢复原始步骤函数');
        };

        // 包装：卖积分填入积分和交易币
        if (!window.darkrp.ui._originalSellPointsFill && steps['卖积分填入积分和交易币']) {
            window.darkrp.ui._originalSellPointsFill = steps['卖积分填入积分和交易币'];
        }
        if (steps['卖积分填入积分和交易币']) {
            steps['卖积分填入积分和交易币'] = async function() {
                const params = window.darkrp.ui.pointsForm;
                const points = params.points;
                const tradingCoin = params.tradingCoin;
                
                addLog(`📝 从UI读取积分参数: 积分数量=${points}, 交易币单价=${tradingCoin}`);
                
                const originalFn = window.darkrp.ui._originalSellPointsFill;
                if (originalFn) {
                    await originalFn(points, tradingCoin);
                } else {
                    addLog('❌ 原始步骤函数 卖积分填入积分和交易币 不存在', true);
                }
            };
        }

        // 包装：卖积分填入密码
        if (!window.darkrp.ui._originalSellPointsFillPassword && steps['卖积分填入密码']) {
            window.darkrp.ui._originalSellPointsFillPassword = steps['卖积分填入密码'];
        }
        if (steps['卖积分填入密码']) {
            steps['卖积分填入密码'] = async function() {
                const password = window.darkrp.ui.pointsForm.password;
                
                addLog(`🔐 从UI读取积分密码: 已填 (长度 ${password.length})`);
                
                const originalFn = window.darkrp.ui._originalSellPointsFillPassword;
                if (originalFn) {
                    await originalFn(password);
                } else {
                    addLog('❌ 原始步骤函数 卖积分填入密码 不存在', true);
                }
            };
        }
        
        addLog('🔧 已包装交易币步骤函数（从UI读取参数，原始函数已保留）');
        return true;
    }

    // 动态加载流程选项
    function loadFlowOptions()
    {
        if (!window.darkrp || !window.darkrp.trigger || !window.darkrp.trigger._flows) return false;
        
        const flows = window.darkrp.trigger._flows;
        flowSelect.innerHTML = '<option value="">-- 选择流程 --</option>';
        Object.keys(flows).forEach(name => {
            const option = document.createElement('option');
            option.value = name;
            option.textContent = `${name} → ${flows[name].join(' → ')}`;
            flowSelect.appendChild(option);
        });
        return true;
    }

    // 动态加载快捷步骤按钮
    function loadStepButtons()
    {
        if (!window.darkrp || !window.darkrp.trigger || !window.darkrp.trigger._steps) return;
        
        const steps = window.darkrp.trigger._steps;
        const stepNames = Object.keys(steps);
        const displaySteps = stepNames.slice(0, 12);
        
        stepButtonsDiv.innerHTML = '';
        displaySteps.forEach(stepName => {
            const btn = document.createElement('button');
            btn.textContent = stepName;
            btn.setAttribute('data-step', stepName);
            btn.style.cssText = `
                padding: ${isMobile ? '10px 14px' : '6px 12px'};
                background: #3a3a4a;
                color: #fff;
                border: none;
                border-radius: ${isMobile ? '8px' : '4px'};
                cursor: pointer;
                font-size: ${isMobile ? '14px' : '11px'};
                touch-action: manipulation;
                min-height: ${isMobile ? '44px' : 'auto'};
            `;
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                await executeStep(stepName);
            });
            stepButtonsDiv.appendChild(btn);
        });
        
        if (stepNames.length > 12) {
            const moreBtn = document.createElement('button');
            moreBtn.textContent = `+${stepNames.length - 12}更多`;
            moreBtn.style.cssText = `
                padding: ${isMobile ? '10px 14px' : '6px 12px'};
                background: #555;
                color: #fff;
                border: none;
                border-radius: ${isMobile ? '8px' : '4px'};
                cursor: pointer;
                font-size: ${isMobile ? '14px' : '11px'};
                touch-action: manipulation;
            `;
            moreBtn.addEventListener('click', () => {
                addLog(`共 ${stepNames.length} 个步骤可用，可通过控制台调用`, false);
            });
            stepButtonsDiv.appendChild(moreBtn);
        }
    }

    // 执行单个步骤
    async function executeStep(stepName)
    {
        if (!window.darkrp || !window.darkrp.trigger) {
            addLog('❌ darkrp.trigger 未加载', true);
            return;
        }
        
        const stepFn = window.darkrp.trigger._steps[stepName];
        if (!stepFn) {
            addLog(`❌ 步骤不存在: ${stepName}`, true);
            return;
        }
        
        addLog(`▶ 执行步骤: ${stepName}`);
        try {
            await stepFn();
            addLog(`✅ 步骤完成: ${stepName}`);
        } catch(e) {
            addLog(`❌ 步骤出错: ${e.message}`, true);
        }
    }

    // 拖动功能
    let isDragging = false;
    let startX = 0, startY = 0;
    let startLeft = 0, startTop = 0;

    function onTouchStart(e)
    {
        if (!titleBar.contains(e.target)) return;
        if (e.target.tagName === 'BUTTON') return;
        
        e.preventDefault();
        isDragging = true;
        const touch = e.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;
        
        const rect = mainDiv.getBoundingClientRect();
        startLeft = rect.left;
        startTop = rect.top;
        
        mainDiv.style.left = startLeft + 'px';
        mainDiv.style.top = startTop + 'px';
        mainDiv.style.right = 'auto';
        mainDiv.style.bottom = 'auto';
    }

    function onTouchMove(e)
    {
        if (!isDragging) return;
        e.preventDefault();
        
        const touch = e.touches[0];
        let newLeft = startLeft + (touch.clientX - startX);
        let newTop = startTop + (touch.clientY - startY);
        
        newLeft = Math.min(window.innerWidth - mainDiv.offsetWidth, Math.max(0, newLeft));
        newTop = Math.min(window.innerHeight - mainDiv.offsetHeight, Math.max(0, newTop));
        
        mainDiv.style.left = newLeft + 'px';
        mainDiv.style.top = newTop + 'px';
    }

    function onTouchEnd(e)
    {
        isDragging = false;
    }

    // 鼠标拖动（PC端）
    let mouseDown = false;
    let mouseStartX = 0, mouseStartY = 0;
    let mouseStartLeft = 0, mouseStartTop = 0;

    function onMouseDown(e)
    {
        if (!titleBar.contains(e.target)) return;
        if (e.target.tagName === 'BUTTON') return;
        
        mouseDown = true;
        mouseStartX = e.clientX;
        mouseStartY = e.clientY;
        
        const rect = mainDiv.getBoundingClientRect();
        mouseStartLeft = rect.left;
        mouseStartTop = rect.top;
        
        mainDiv.style.left = mouseStartLeft + 'px';
        mainDiv.style.top = mouseStartTop + 'px';
        mainDiv.style.right = 'auto';
        mainDiv.style.bottom = 'auto';
        document.body.style.userSelect = 'none';
    }

    function onMouseMove(e) {
        if (!mouseDown) return;
        
        let newLeft = mouseStartLeft + (e.clientX - mouseStartX);
        let newTop = mouseStartTop + (e.clientY - mouseStartY);
        
        newLeft = Math.min(window.innerWidth - mainDiv.offsetWidth, Math.max(0, newLeft));
        newTop = Math.min(window.innerHeight - mainDiv.offsetHeight, Math.max(0, newTop));
        
        mainDiv.style.left = newLeft + 'px';
        mainDiv.style.top = newTop + 'px';
    }

    function onMouseUp() {
        mouseDown = false;
        document.body.style.userSelect = '';
    }

    // 注册拖动事件
    if (isMobile) {
        titleBar.addEventListener('touchstart', onTouchStart, { passive: false });
        titleBar.addEventListener('touchmove', onTouchMove, { passive: false });
        titleBar.addEventListener('touchend', onTouchEnd);
    } else {
        titleBar.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
    }

    // ========== 拉伸缩放功能 ==========
    let isResizing = false;
    let resizeStartX = 0, resizeStartY = 0;
    let resizeStartWidth = 0, resizeStartHeight = 0;
    let resizeStartLeft = 0, resizeStartTop = 0;
    
    function onResizeStart(e) {
        e.preventDefault();
        e.stopPropagation();
        isResizing = true;
        
        const clientX = e.clientX ?? (e.touches?.[0]?.clientX ?? 0);
        const clientY = e.clientY ?? (e.touches?.[0]?.clientY ?? 0);
        resizeStartX = clientX;
        resizeStartY = clientY;
        
        const rect = mainDiv.getBoundingClientRect();
        resizeStartWidth = rect.width;
        resizeStartHeight = rect.height;
        resizeStartLeft = rect.left;
        resizeStartTop = rect.top;
        
        document.body.style.userSelect = 'none';
    }
    
    function onResizeMove(e) {
        if (!isResizing) return;
        e.preventDefault();
        
        const clientX = e.clientX ?? (e.touches?.[0]?.clientX ?? 0);
        const clientY = e.clientY ?? (e.touches?.[0]?.clientY ?? 0);
        
        let deltaX = clientX - resizeStartX;
        let deltaY = clientY - resizeStartY;
        
        let newWidth = resizeStartWidth + deltaX;
        let newHeight = resizeStartHeight + deltaY;
        
        // 限制最小最大尺寸
        newWidth = Math.min(window.innerWidth - 20, Math.max(280, newWidth));
        newHeight = Math.min(window.innerHeight - 50, Math.max(350, newHeight));
        
        mainDiv.style.width = newWidth + 'px';
        mainDiv.style.height = newHeight + 'px';
        mainDiv.style.left = resizeStartLeft + 'px';
        mainDiv.style.top = resizeStartTop + 'px';
        mainDiv.style.right = 'auto';
        mainDiv.style.bottom = 'auto';
    }
    
    function onResizeEnd() {
        isResizing = false;
        document.body.style.userSelect = '';
    }
    
    // 注册拉伸事件
    if (resizeHandle) {
        if (isMobile) {
            resizeHandle.addEventListener('touchstart', onResizeStart, { passive: false });
            window.addEventListener('touchmove', onResizeMove, { passive: false });
            window.addEventListener('touchend', onResizeEnd);
        } else {
            resizeHandle.addEventListener('mousedown', onResizeStart);
            window.addEventListener('mousemove', onResizeMove);
            window.addEventListener('mouseup', onResizeEnd);
        }
    }

    // 关闭面板
    closeBtn.addEventListener('click', () => {
        panel.remove();
    });

    // 最小化/恢复
    let isMinimized = false;
    minimizeBtn.addEventListener('click', () => {
        isMinimized = !isMinimized;
        if (isMinimized) {
            contentDiv.style.display = 'none';
            minimizeBtn.textContent = '□';
            mainDiv.style.height = 'auto';
        } else {
            contentDiv.style.display = 'block';
            minimizeBtn.textContent = '−';
            // 恢复之前保存的尺寸或默认
            if (mainDiv.style.height === 'auto') {
                mainDiv.style.height = '500px';
            }
        }
    });

    // 执行流程（增强版，执行前先注入）
    runBtn.addEventListener('click', async () => {
        const flowName = flowSelect.value;
        if (!flowName) {
            addLog('请先选择一个流程', true);
            return;
        }
        
        if (!window.darkrp || !window.darkrp.trigger) {
            addLog('❌ darkrp.trigger 未加载', true);
            return;
        }
        
        // 执行前确保步骤函数已被 patch
        patchStepFunctions();
        
        // 显示当前参数
        addLog(`📋 当前参数: 交易币=${window.darkrp.ui.tradingCoinForm.tradingCoin}, 积分=${window.darkrp.ui.tradingCoinForm.points}, 密码已填`);
        
        addLog(`🚀 开始执行流程: ${flowName}`);
        try {
            await window.darkrp.trigger.run(flowName);
            addLog(`✅ 流程执行完成: ${flowName}`);
        } catch(e) {
            addLog(`❌ 执行出错: ${e.message}`, true);
        }
    });

    // 查看所有流程
    listBtn.addEventListener('click', () => {
        if (!window.darkrp || !window.darkrp.trigger) {
            addLog('❌ darkrp.trigger 未加载', true);
            return;
        }
        addLog('📋 可用流程列表:');
        const flows = window.darkrp.trigger._flows;
        Object.keys(flows).forEach(name => {
            addLog(`   • ${name} → ${flows[name].join(' → ')}`);
        });
        if (window.darkrp.trigger.list) {
            window.darkrp.trigger.list();
        }
    });

    // 等待 darkrp 加载并更新UI
    let checkCount = 0;
    function checkAndUpdate() {
        if (window.darkrp && window.darkrp.trigger) {
            addLog('✅ EXG 游戏菜单控制台 已就绪');
            loadFlowOptions();
            loadStepButtons();
            patchStepFunctions();  // 注入参数读取逻辑
            addLog('📌 请在"卖交易币参数"区域填写交易币数量、积分单价和密码');
            addLog('📌 请在"卖积分参数"区域填写积分数量、交易币单价和密码');
        } else if (checkCount < 30) {
            checkCount++;
            setTimeout(checkAndUpdate, 500);
        } else {
            addLog('⚠️ EXG 游戏菜单控制台未加载，请确保相关脚本已执行', true);
        }
    }
    
    checkAndUpdate();

    console.log('✅ EXG 游戏菜单控制台控制面板已添加（已适配手机端，支持拉伸，已集成交易币参数输入）');
})();