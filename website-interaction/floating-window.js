
(function() {
    'use strict';

    // 获取元素
    const panel = document.getElementById('darkrp-control-panel');
    const mainDiv = document.getElementById('dp-main-container');
    const titleBar = document.getElementById('dp-title-bar');
    const closeBtn = document.getElementById('dp-close');
    const minimizeBtn = document.getElementById('dp-minimize');
    const contentDiv = document.getElementById('dp-content');
    const flowSelect = document.getElementById('dp-flow-select');
    const runBtn = document.getElementById('dp-run');
    const enqueueBtn = document.getElementById('dp-enqueue');
    const queueBtn = document.getElementById('dp-queue');
    const logDiv = document.getElementById('dp-log');
    const stepButtonsDiv = document.getElementById('dp-step-buttons');
    const resizeHandle = document.getElementById('dp-resize-handle');
    
    // 输入框元素 - 交易币
    const tradingCoinInput = document.getElementById('dp-trading-coin');
    const pointsPriceInput = document.getElementById('dp-points-price');
    const tradingCoinDisplay = document.getElementById('dp-trading-coin-display');
    const pointsPriceDisplay = document.getElementById('dp-points-price-display');
    const pointsToTradingCoinDisplay1 = document.getElementById('dp-points-to-trading-coin-display1');

    // 交易币区入队列
   const enqueueInputTrading = document.getElementById('enqueue-input-trading');
    enqueueInputTrading.addEventListener(
        'click',
        () => { 
            eatwi.global.queue.enqueue({
                flowName: '卖交易币流程',
                points: pointsPriceInput.value,
                tradingCoin: tradingCoinInput.value
            });
            addLog(`✅ 导入队列：卖交易币流程->交易币：${tradingCoinInput.value}->积分：${pointsPriceInput.value}`);
        }
    );

    // 输入框元素 - 积分
    const pointsAmountInput = document.getElementById('dp-points-amount');
    const tradingcoinPriceInput = document.getElementById('dp-tradingcoin-price');
    const pointsAmountDisplay = document.getElementById('dp-points-amount-display');
    const tradingcoinPriceDisplay = document.getElementById('dp-tradingcoin-price-display');
    const pointsToTradingCoinDisplay2 = document.getElementById('dp-points-to-trading-coin-display2');

    // 积分区入队列
    const enqueueInputPoints = document.getElementById('enqueue-input-points');
    enqueueInputPoints.addEventListener(
        'click',
        () => { 
            eatwi.global.queue.enqueue({
            flowName: '卖积分流程',
            points: pointsAmountInput.value,
            tradingCoin: tradingcoinPriceInput.value
            });

            addLog(`✅ 导入队列：卖积分流程->积分：${pointsAmountInput.value}->交易币：${tradingcoinPriceInput.value}`);
        }
    );

    // 日志函数
    function addLog(msg, isError = false)
    {
        const logEntry = document.createElement('div');
        logEntry.textContent = `> ${new Date().toLocaleTimeString()} ${msg}`;
        logEntry.style.color = isError ? '#f66' : '#8f8';
        logEntry.style.marginBottom = '4px';
        logEntry.style.fontSize = eatwi.global.ui.isMobile ? '12px' : '11px';
        logDiv.appendChild(logEntry);
        logDiv.scrollTop = logDiv.scrollHeight;
        console.log(msg);
    }

    // 更新显示和全局存储
    function updateTradingParams()
    {
        const tradingCoin = tradingCoinInput.value;
        const points = pointsPriceInput.value;
        const pointsToTradingCoin = points / tradingCoin;
        
        // 更新显示
        tradingCoinDisplay.textContent = tradingCoin || '0';
        pointsPriceDisplay.textContent = points || '0';
        pointsToTradingCoinDisplay1.textContent = pointsToTradingCoin || '0';
        
        // 更新全局存储
        window.eatwi.global.ui.tradingCoinForm = {
            tradingCoin: tradingCoin || '0',
            points: points || '0',
            pointsToTradingCoin: pointsToTradingCoin || '0',
        };
        
        // 可选：在控制台输出更新日志（调试用）
        // console.log('📝 UI参数已更新:', window.eatwi.global.ui.tradingCoinForm);
    }
    
    // 监听输入框变化
    tradingCoinInput.addEventListener('input', updateTradingParams);
    pointsPriceInput.addEventListener('input', updateTradingParams);
    
    // 初始化一次
    updateTradingParams();

    // 更新卖积分参数显示和全局存储
    function updatePointsParams()
    {
        const pointsAmount = pointsAmountInput.value;
        const tradingcoinPrice = tradingcoinPriceInput.value;
        const pointsToTradingCoin = pointsAmount / tradingcoinPrice;
        
        // 更新显示
        pointsAmountDisplay.textContent = pointsAmount || '0';
        tradingcoinPriceDisplay.textContent = tradingcoinPrice || '0';
        pointsToTradingCoinDisplay2.textContent = pointsToTradingCoin || '0';
        
        // 更新全局存储
        window.eatwi.global.ui.pointsForm = {
            points: pointsAmount || '0',
            tradingCoin: tradingcoinPrice || '0',
            pointsToTradingCoin: pointsToTradingCoin || '0',
        };
    }

    // 监听卖积分输入框变化
    pointsAmountInput.addEventListener('input', updatePointsParams);
    tradingcoinPriceInput.addEventListener('input', updatePointsParams);

    // 初始化卖积分参数
    updatePointsParams();

    // ========== 包装步骤函数，使其读取 UI 输入框的值 ==========
    // 采用包装模式，保留原始函数，避免覆盖丢失
    function patchStepFunctions()
    {
        if (!window.eatwi.global.trigger)
        {
            if (window.eatwi.DEBUG)
            {
                console.error('触发器 trigger 未定义');
            }
            return false;
        }
        
        const steps = window.eatwi.global.trigger.getSteps();
        
        // 保存原始函数引用（如果还没保存过）
        if (!window.eatwi.global.ui._originalSellTradingCoinFill) {
            window.eatwi.global.ui._originalSellTradingCoinFill = steps['卖交易币填入交易币和积分'];
        }
        if (!window.eatwi.global.ui._originalSellTradingCoinFillPassword) {
            window.eatwi.global.ui._originalSellTradingCoinFillPassword = steps['卖交易币填入密码'];
        }
        if (!window.eatwi.global.ui._originalTradingCoinMarketDataFunc)
        {
            window.eatwi.global.ui._originalTradingCoinMarketDataFunc = steps['买交易币市场交易信息导入变量'];
        }
        if (!window.eatwi.global.ui._originalTradingCoinMarketInfoFunc)
        {
            window.eatwi.global.ui._originalTradingCoinMarketInfoFunc = steps['买交易币市场交易信息2'];
        }
        
        // 包装：卖交易币填入交易币和积分：
        // 1. 从 UI 读取参数后调用原始函数
        // 2. 从队列读取参数后调用原始函数
        steps['卖交易币填入交易币和积分'] = async function()
        {
            // const params = window.eatwi.global.ui.tradingCoinForm;
            // const tradingCoin = params.tradingCoin;
            // const points = params.points;

            // 执行的流程类型：1. Immediately 2. QueueImport
            var params = null;
            var fromName = null;
            if (eatwi.global.executionProcessType == 'Immediately')
            {
                params = window.eatwi.global.ui.tradingCoinForm;
                fromName = 'UI';
            }
            else
            {
                params = eatwi.global.queue.front();
                if (eatwi.global.queue.isEmpty() == true || params == undefined)
                {
                    addLog('❌ 队列为空', true);
                    return;
                }
                fromName = '队列';
            }
            const tradingCoin = params.tradingCoin;
            const points = params.points;
            
            addLog(`📝 从${fromName}读取参数: 交易币=${tradingCoin}, 积分单价=${points}`);
            console.log(`✅ 步骤 卖交易币填入交易币和积分(${tradingCoin}, ${points}) 执行`);
            
            const originalFn = window.eatwi.global.ui._originalSellTradingCoinFill;
            if (originalFn)
            {
                // 调用原始函数，传入从 UI 读取的参数
                await originalFn(tradingCoin, points);
            }
            else
            {
                addLog('❌ 原始函数 卖交易币填入交易币和积分 不存在', true);
            }
        };
        
        // 包装：卖交易币填入密码 - 从 UI 读取密码后调用原始函数
        steps['卖交易币填入密码'] = async function()
        {
            // const password = window.eatwi.global.ui.tradingCoinForm.password;
            let password = eatwi.button.获取密码();
            
            // addLog(`🔐 从UI读取密码: 已填 (长度 ${password.length})`);
            addLog(`🔐 读取密码: 已填 (长度 ${password.length})`);
            console.log(`✅ 步骤 卖交易币填入密码(${'*'.repeat(password.length)}) 执行`);
            
            const originalFn = window.eatwi.global.ui._originalSellTradingCoinFillPassword;
            if (originalFn)
            {
                // 调用原始函数，传入从 UI 读取的密码
                await originalFn(password);
            }
            else
            {
                addLog('❌ 原始函数 卖交易币填入密码 不存在', true);
            }
        };

        // 包装：卖买交易币市场导入变量 - 从变量读取数据后调用原始函数
        steps['买交易币市场交易信息导入变量'] = async function()
        {
            console.log(`✅ 步骤 买交易币市场交易信息导入变量包装函数 执行`);
            if (!window.eatwi.global.tradingCoinMarketData)
            {
               window.eatwi.global.tradingCoinMarketData = {};
            }
            const originalFn = window.eatwi.global.ui._originalTradingCoinMarketDataFunc;
            if (originalFn)
            {
                // 调用原始函数，传入的数据
                await originalFn(window.eatwi.global.tradingCoinMarketData);
            }
            else
            {
                addLog('❌ 原始函数 买交易币市场交易信息导入变量 不存在', true);
            }
        };

        // 包装：卖买交易币市场信息2 - 从变量读取数据后调用原始函数
        steps['买交易币市场交易信息2'] = async function()
        {
            console.log(`✅ 步骤 买交易币市场交易信息2包装函数 执行`);
            
            const originalFn = window.eatwi.global.ui._originalTradingCoinMarketInfoFunc;
            if (originalFn)
            {
                // 调用原始函数，传入保存的数据
                await originalFn(window.eatwi.global.tradingCoinMarketData);
            }
            else
            {
                addLog('❌ 原始函数 买买交易币市场交易信息2 不存在', true);
            }
        };
        
        // 可选：提供一个恢复原始函数的方法
        window.eatwi.global.ui.restoreOriginalSteps = function() {
            if (window.eatwi.global.ui._originalSellTradingCoinFill) {
                steps['卖交易币填入交易币和积分'] = window.eatwi.global.ui._originalSellTradingCoinFill;
            }
            if (window.eatwi.global.ui._originalSellTradingCoinFillPassword) {
                steps['卖交易币填入密码'] = window.eatwi.global.ui._originalSellTradingCoinFillPassword;
            }
            if (window.eatwi.global.ui._originalTradingCoinMarketDataFunc)
            {
                steps['买交易币市场交易信息导入变量'] = window.eatwi.global.ui._originalTradingCoinMarketDataFunc;
            }
            if (window.eatwi.global.ui._originalTradingCoinMarketInfoFunc)
            {
                steps['买交易币市场交易信息2'] = window.eatwi.global.ui._originalTradingCoinMarketInfoFunc;
            }
            addLog('🔁 已恢复原始步骤函数');
        };

        // 包装：卖积分填入积分和交易币
        if (!window.eatwi.global.ui._originalSellPointsFill && steps['卖积分填入积分和交易币']) {
            window.eatwi.global.ui._originalSellPointsFill = steps['卖积分填入积分和交易币'];
        }
        // 包装：卖积分填入密码
        if (!window.eatwi.global.ui._originalSellPointsFillPassword && steps['卖积分填入密码'])
        {
            window.eatwi.global.ui._originalSellPointsFillPassword = steps['卖积分填入密码'];
        }
        if (!window.eatwi.global.ui._originalPointsMarketDataFunc)
        {
            window.eatwi.global.ui._originalPointsMarketDataFunc = steps['买积分市场交易信息导入变量'];
        }
        if (!window.eatwi.global.ui._originalPointsMarketInfoFunc)
        {
            window.eatwi.global.ui._originalPointsMarketInfoFunc = steps['买积分市场交易信息2'];
        }

        if (steps['卖积分填入积分和交易币'])
        {
            steps['卖积分填入积分和交易币'] = async function()
            {
                // const params = window.eatwi.global.ui.pointsForm;
                // const points = params.points;
                // const tradingCoin = params.tradingCoin;

                // 执行的流程类型：1. Immediately 2. QueueImport
                var params = null;
                var fromName = null;
                if (eatwi.global.executionProcessType == 'Immediately')
                {
                    params = window.eatwi.global.ui.pointsForm;
                    fromName = 'UI';
                }
                else
                {
                    params = eatwi.global.queue.front();
                    if (eatwi.global.queue.isEmpty() == true || params == undefined)
                    {
                        addLog('❌ 队列为空', true);
                        return;
                    }
                    fromName = '队列';
                }
                const tradingCoin = params.tradingCoin;
                const points = params.points;
                
                addLog(`📝 从${fromName}读取积分参数: 积分数量=${points}, 交易币单价=${tradingCoin}`);
                
                const originalFn = window.eatwi.global.ui._originalSellPointsFill;
                if (originalFn)
                {
                    await originalFn(points, tradingCoin);
                }
                else
                {
                    addLog('❌ 原始步骤函数 卖积分填入积分和交易币 不存在', true);
                }
            };
        }


        if (steps['卖积分填入密码'])
        {
            steps['卖积分填入密码'] = async function()
            {
                // const password = window.eatwi.global.ui.pointsForm.password;
                var password = eatwi.button.获取密码();
                
                addLog(`🔐 读取密码: 已填 (长度 ${password.length})`);
                
                const originalFn = window.eatwi.global.ui._originalSellPointsFillPassword;
                if (originalFn)
                {
                    await originalFn(password);
                }
                else
                {
                    addLog('❌ 原始步骤函数 卖积分填入密码 不存在', true);
                }
            };
        }

        // 包装：买积分市场导入变量 - 从变量读取数据后调用原始函数
        steps['买积分市场交易信息导入变量'] = async function()
        {
            console.log(`✅ 步骤 买积分市场交易信息导入变量包装函数 执行`);
            const originalFn = window.eatwi.global.ui._originalPointsMarketDataFunc;
            if (originalFn)
            {
                // 调用原始函数，传入的数据
                await originalFn(window.eatwi.global.pointsMarketData);
            }
            else
            {
                addLog('❌ 原始函数 买积分市场交易信息导入变量 不存在', true);
            }
        };

        // 包装：买积分市场信息2 - 从变量读取数据后调用原始函数
        steps['买积分市场交易信息2'] = async function()
        {
            console.log(`✅ 步骤 买积分市场交易信息2包装函数 执行`);
            
            const originalFn = window.eatwi.global.ui._originalPointsMarketInfoFunc;
            if (originalFn)
            {
                // 调用原始函数，传入保存的数据
                await originalFn(window.eatwi.global.pointsMarketData);
            }
            else
            {
                addLog('❌ 原始函数 买积分市场交易信息2 不存在', true);
            }
        };
        
        addLog('🔧 已包装交易币步骤函数（从UI读取参数，原始函数已保留）');
        return true;
    }

    // 动态加载流程选项
    function loadFlowOptions()
    {
        if (!window.eatwi || !window.eatwi.global || !window.eatwi.global.trigger)
        {
            console.error('动态加载流程选项失败');
            return false;
        }
        
        const flows = window.eatwi.global.trigger.getFlows();
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
        if (!window.eatwi.global.trigger)
        {
            if (window.eatwi.DEBUG)
            {
                console.error('window.eatwi.global.trigger 未加载');
            }
            return;
        }
        
        const steps = window.eatwi.global.trigger.getSteps();
        const stepNames = Object.keys(steps);
        const displaySteps = stepNames.slice(0, 12);
        
        stepButtonsDiv.innerHTML = '';
        displaySteps.forEach(stepName => {
            const btn = document.createElement('button');
            btn.textContent = stepName;
            btn.setAttribute('data-step', stepName);
            btn.style.cssText = `
                padding: ${eatwi.global.ui.isMobile ? '10px 14px' : '6px 12px'};
                background: #3a3a4a;
                color: #fff;
                border: none;
                border-radius: ${eatwi.global.ui.isMobile ? '8px' : '4px'};
                cursor: pointer;
                font-size: ${eatwi.global.ui.isMobile ? '14px' : '11px'};
                touch-action: manipulation;
                min-height: ${eatwi.global.ui.isMobile ? '44px' : 'auto'};
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
                padding: ${eatwi.global.ui.isMobile ? '10px 14px' : '6px 12px'};
                background: #555;
                color: #fff;
                border: none;
                border-radius: ${eatwi.global.ui.isMobile ? '8px' : '4px'};
                cursor: pointer;
                font-size: ${eatwi.global.ui.isMobile ? '14px' : '11px'};
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
        if (!window.eatwi.global.trigger)
        {
            addLog('❌ global.trigger 未加载', true);
            if (window.eatwi.DEBUG)
            {
                console.error('executeStep() 获取 window.eatwi.global.trigger 失败');
            }
            return;
        }
        
        const stepFn = window.eatwi.global.trigger._steps[stepName];
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
    if (eatwi.global.ui.isMobile) {
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
        if (eatwi.global.ui.isMobile) {
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
        
        if (!window.eatwi.global.trigger)
        {
            addLog('❌ eatwi.global.trigger 未加载', true);
            return;
        }

        if (window.eatwi.global.processIsExecuting == true)
        {
            addLog('❌ 正在执行流程，请等待', true);
            return;
        }
        window.eatwi.global.processIsExecuting = true;
        window.eatwi.global.executionProcessType = 'Immediately';
        
        // 执行前确保步骤函数已被 patch
        patchStepFunctions();
        
        // 显示当前参数
        addLog(`📋 当前参数: 交易币=${window.eatwi.global.ui.tradingCoinForm.tradingCoin}, 积分=${window.eatwi.global.ui.tradingCoinForm.points}, 密码已填`);
        
        addLog(`🚀 开始执行流程: ${flowName}`);
        try
        {
            await window.eatwi.global.trigger.run(flowName);
            addLog(`✅ 流程执行完成: ${flowName}`);
        }
        catch(e)
        {
            addLog(`❌ 执行出错: ${e.message}`, true);
        }

        window.eatwi.global.processIsExecuting = false;
    });

    // 将流程入队列
    enqueueBtn.addEventListener('click', () => {
        const flowName = flowSelect.value;
        if (!flowName) {
            addLog('请先选择一个流程', true);
            return;
        }
        
        if (!window.eatwi.global.trigger) {
            addLog('❌ eatwi.global.trigger 未加载', true);
            return;
        }

        if (flowSelect.value == '卖交易币流程')
        {
            enqueueInputTrading.click();

        }
        else if (flowSelect.value == '卖积分流程')
        {
            enqueueInputPoints.click();
        }
        else
        {
            eatwi.global.queue.enqueue({
                flowName: flowSelect.value,
            });
            addLog(`✅ 导入队列：${flowName}`);
        }
    });
    
    // 执行队列
    queueBtn.addEventListener('click', async () => {
        if (window.eatwi.global.queue.size() <= 0)
        {
            addLog('❌ 队列为空', true);
            return;
        }
        
        if (!window.eatwi || !window.eatwi.global.trigger) {
            addLog('❌ eatwi.global.trigger 未加载', true);
            return;
        }

        if (window.eatwi.global.processIsExecuting == true)
        {
            addLog('❌ 正在执行流程，请等待', true);
            return;
        }
        window.eatwi.global.processIsExecuting = true;
        window.eatwi.global.executionProcessType = 'QueueImport';
        
        // 执行前确保步骤函数已被 patch
        patchStepFunctions();
        
        // 显示当前参数
        addLog(`📋 当前参数: 交易币=${window.eatwi.global.ui.tradingCoinForm.tradingCoin}, 积分=${window.eatwi.global.ui.tradingCoinForm.points}, 密码已填`);
        try
        {
            var count = 0;
            while (eatwi.global.queue.size() > 0)
            {
                const queueEl = eatwi.global.queue.front();
                await window.eatwi.global.trigger.run(queueEl.flowName);
                addLog(`✅ 队列流程 ${queueEl.flowName} 已处理完毕`);
                ++count;
                eatwi.global.queue.dequeue();
            }
            addLog(`✅ 队列所有流程已处理完毕，执行流程的个数 ${count}`);
        }
        catch(e)
        {
            addLog(`❌ 执行出错: ${e.message}`, true);
        }

        window.eatwi.global.processIsExecuting = false;
    });

    // 等待 darkrp 加载并更新UI
    let checkCount = 0;
    function checkAndUpdate() {
        if (window.eatwi.global && window.eatwi.global.trigger) {
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