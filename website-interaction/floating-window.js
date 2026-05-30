(function() {
    'use strict';

    // 防止重复添加
    if (document.getElementById('darkrp-control-panel')) return;

    // 检测是否为移动端
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;

    // 创建浮动面板
    const panel = document.createElement('div');
    panel.id = 'darkrp-control-panel';
    panel.innerHTML = `
        <div style="
            position: fixed;
            bottom: ${isMobile ? '10px' : '20px'};
            right: ${isMobile ? '10px' : '20px'};
            left: ${isMobile ? '10px' : 'auto'};
            width: ${isMobile ? 'calc(100% - 20px)' : '360px'};
            max-width: ${isMobile ? 'none' : '90vw'};
            background: #1e1e2f;
            border-radius: ${isMobile ? '16px' : '12px'};
            box-shadow: 0 4px 20px rgba(0,0,0,0.4);
            z-index: 999999;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: ${isMobile ? '14px' : '13px'};
            transition: all 0.2s ease;
        ">
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
            ">
                <span style="font-weight: 500;">🎮 DarkRP 控制台</span>
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
            
            <!-- 内容区 -->
            <div id="dp-content" style="padding: ${isMobile ? '14px' : '12px'}; background: #2d2d3a; border-radius: 0 0 ${isMobile ? '16px' : '8px'} ${isMobile ? '16px' : '8px'};">
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
                </div>
                
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
                </div>
                
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
                </div>
                
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
                    "></div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(panel);

    // 获取元素
    const mainDiv = panel.querySelector('div:first-child');
    const titleBar = document.getElementById('dp-title-bar');
    const closeBtn = document.getElementById('dp-close');
    const minimizeBtn = document.getElementById('dp-minimize');
    const contentDiv = document.getElementById('dp-content');
    const flowSelect = document.getElementById('dp-flow-select');
    const runBtn = document.getElementById('dp-run');
    const listBtn = document.getElementById('dp-list');
    const logDiv = document.getElementById('dp-log');
    const stepButtonsDiv = document.getElementById('dp-step-buttons');

    // 日志函数
    function addLog(msg, isError = false) {
        const logEntry = document.createElement('div');
        logEntry.textContent = `> ${new Date().toLocaleTimeString()} ${msg}`;
        logEntry.style.color = isError ? '#f66' : '#8f8';
        logEntry.style.marginBottom = '4px';
        logEntry.style.fontSize = isMobile ? '12px' : '11px';
        logDiv.appendChild(logEntry);
        logDiv.scrollTop = logDiv.scrollHeight;
        console.log(msg);
    }

    // 动态加载流程选项
    function loadFlowOptions() {
        if (!window.darkrp || !window.darkrp.trigger || !window.darkrp.trigger._flows) return;
        
        const flows = window.darkrp.trigger._flows;
        flowSelect.innerHTML = '<option value="">-- 选择流程 --</option>';
        Object.keys(flows).forEach(name => {
            const option = document.createElement('option');
            option.value = name;
            option.textContent = `${name} → ${flows[name].join(' → ')}`;
            flowSelect.appendChild(option);
        });
    }

    // 动态加载快捷步骤按钮
    function loadStepButtons() {
        if (!window.darkrp || !window.darkrp.trigger || !window.darkrp.trigger._steps) return;
        
        const steps = window.darkrp.trigger._steps;
        const stepNames = Object.keys(steps);
        // 只显示前12个常用步骤，避免过多
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
    async function executeStep(stepName) {
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

    // 拖动功能（手机端适配）
    let isDragging = false;
    let startX = 0, startY = 0;
    let startLeft = 0, startTop = 0;

    function getPanelPosition() {
        const rect = mainDiv.getBoundingClientRect();
        let left = rect.left;
        let top = rect.top;
        // 如果使用了bottom/right定位，转换为left/top
        if (mainDiv.style.right !== 'auto' && mainDiv.style.left === 'auto') {
            left = window.innerWidth - rect.right;
        }
        if (mainDiv.style.bottom !== 'auto' && mainDiv.style.top === 'auto') {
            top = window.innerHeight - rect.bottom;
        }
        return { left, top };
    }

    function onTouchStart(e) {
        // 只允许标题栏拖动
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

    function onTouchMove(e) {
        if (!isDragging) return;
        e.preventDefault();
        
        const touch = e.touches[0];
        let newLeft = startLeft + (touch.clientX - startX);
        let newTop = startTop + (touch.clientY - startY);
        
        // 边界限制
        newLeft = Math.min(window.innerWidth - mainDiv.offsetWidth, Math.max(0, newLeft));
        newTop = Math.min(window.innerHeight - mainDiv.offsetHeight, Math.max(0, newTop));
        
        mainDiv.style.left = newLeft + 'px';
        mainDiv.style.top = newTop + 'px';
    }

    function onTouchEnd(e) {
        isDragging = false;
    }

    // 鼠标拖动（PC端）
    let mouseDown = false;
    let mouseStartX = 0, mouseStartY = 0;
    let mouseStartLeft = 0, mouseStartTop = 0;

    function onMouseDown(e) {
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
            mainDiv.style.width = 'auto';
        } else {
            contentDiv.style.display = 'block';
            minimizeBtn.textContent = '−';
            mainDiv.style.width = isMobile ? 'calc(100% - 20px)' : '360px';
        }
    });

    // 执行流程
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
            addLog('✅ DarkRP 已就绪');
            loadFlowOptions();
            loadStepButtons();
        } else if (checkCount < 30) {
            checkCount++;
            setTimeout(checkAndUpdate, 500);
        } else {
            addLog('⚠️ DarkRP 未加载，请确保相关脚本已执行', true);
        }
    }
    
    checkAndUpdate();

    console.log('✅ DarkRP 控制面板已添加（已适配手机端）');
})();