(function(){

    // 关闭面板
    const panel = document.getElementById('darkrp-control-panel');
    const closeBtn = document.getElementById('dp-close');
    closeBtn.addEventListener('click', () => {
        panel.remove();
    });

    // 获取元素
    const mainDiv = document.getElementById('dp-main-container');
    const titleBar = document.getElementById('dp-title-bar');
    const minimizeBtn = document.getElementById('dp-minimize');
    const contentDiv = document.getElementById('dp-content');
    const resizeHandle = document.getElementById('dp-resize-handle');

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
        if (!stepFn)
        {
            addLog(`❌ 步骤不存在: ${stepName}`, true);
            return;
        }
        
        addLog(`▶ 执行步骤: ${stepName}`);
        try
        {
            await stepFn();
            addLog(`✅ 步骤完成: ${stepName}`);
        }
        catch(e)
        {
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

    function onMouseMove(e)
    {
        if (!mouseDown) return;
        
        let newLeft = mouseStartLeft + (e.clientX - mouseStartX);
        let newTop = mouseStartTop + (e.clientY - mouseStartY);
        
        newLeft = Math.min(window.innerWidth - mainDiv.offsetWidth, Math.max(0, newLeft));
        newTop = Math.min(window.innerHeight - mainDiv.offsetHeight, Math.max(0, newTop));
        
        mainDiv.style.left = newLeft + 'px';
        mainDiv.style.top = newTop + 'px';
    }

    function onMouseUp()
    {
        mouseDown = false;
        document.body.style.userSelect = '';
    }

    // 注册拖动事件
    if (eatwi.global.ui.isMobile)
    {
        titleBar.addEventListener('touchstart', onTouchStart, { passive: false });
        titleBar.addEventListener('touchmove', onTouchMove, { passive: false });
        titleBar.addEventListener('touchend', onTouchEnd);
    }
    else
    {
        titleBar.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
    }

    // ========== 拉伸缩放功能 ==========
    let isResizing = false;
    let resizeStartX = 0, resizeStartY = 0;
    let resizeStartWidth = 0, resizeStartHeight = 0;
    let resizeStartLeft = 0, resizeStartTop = 0;
    
    function onResizeStart(e)
    {
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
    
    function onResizeMove(e)
    {
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
    
    function onResizeEnd()
    {
        isResizing = false;
        document.body.style.userSelect = '';
    }
    
    // 注册拉伸事件
    if (resizeHandle)
    {
        if (eatwi.global.ui.isMobile)
        {
            resizeHandle.addEventListener('touchstart', onResizeStart, { passive: false });
            window.addEventListener('touchmove', onResizeMove, { passive: false });
            window.addEventListener('touchend', onResizeEnd);
        }
        else
        {
            resizeHandle.addEventListener('mousedown', onResizeStart);
            window.addEventListener('mousemove', onResizeMove);
            window.addEventListener('mouseup', onResizeEnd);
        }
    }

    // 最小化/恢复
    let isMinimized = false;
    minimizeBtn.addEventListener('click', () => {
        isMinimized = !isMinimized;
        if (isMinimized)
        {
            contentDiv.style.display = 'none';
            minimizeBtn.textContent = '□';
            mainDiv.style.height = 'auto';
        }
        else
        {
            contentDiv.style.display = 'block';
            minimizeBtn.textContent = '−';
            // 恢复之前保存的尺寸或默认
            if (mainDiv.style.height === 'auto')
            {
                mainDiv.style.height = '500px';
            }
        }
    });
})();