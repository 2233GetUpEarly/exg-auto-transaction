(function(){

    const style = document.createElement('style');
    style.textContent = eatwi.global.ui.style;
    document.head.appendChild(style);

    eatwi.util.appendHTML('浮动窗口HTML', 'body', eatwi.global.ui.floatingWindow);
    eatwi.util.appendHTML('浮动窗口拉伸手柄', '#dp-main-container', eatwi.global.ui.dpResizeHandle);
    eatwi.util.appendHTML('浮动窗口标题栏', '#dp-main-container', eatwi.global.ui.dpTitleBar);
    eatwi.util.appendHTML('浮动窗口内容', '#dp-main-container', eatwi.global.ui.dpContent);
    eatwi.util.appendHTML('浮动窗口日志信息区', '#dp-content', eatwi.global.ui.dpLog);

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

    // 监听真正变化（最可靠）
    function bindUpdateWithObserver()
    {
        const targetNode = document.getElementById('divMenuPath');
        if (targetNode)
        {
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
    eatwi.util.appendHTML('浮动窗口路径信息区', '#dp-content', eatwi.global.ui.dpMenuPath);

    eatwi.util.appendHTML('浮动窗口选择流程区', '#dp-content', eatwi.global.ui.dpFlowSelect);
    eatwi.util.appendHTML('浮动窗口选择流程执行区', '#dp-content', eatwi.global.ui.dpButton);



    eatwi.util.appendHTML('浮动窗口队列信息区', '#dp-content', eatwi.global.ui.dpQueuePanel);
    const titleQueuePanel = document.getElementById('title-queue-panel');
    titleQueuePanel.addEventListener('click', 
    () => eatwi.util.togglePanel(
        'queue-panel',
        'title-queue-panel',
        '📋 队列流程 ▼',
        '📋 队列流程 ▶'
    ));

    const refreshQueueButton = document.getElementById('refresh-queue-button');
    refreshQueueButton.addEventListener('click', 
    () => {
        // 前端显示
        var queueTablePanel = document.getElementById('queue-table-body');
        var queueTableInnerHTML = '';
        if (eatwi.global.queue.getItems().length <= 0)
        {
            queueTableInnerHTML += '空';
        }

        for (var i = 0; i < eatwi.global.queue.getItems().length; ++i)
        {
            queueTableInnerHTML += `<tr><td id="dqi-${i}">${i}</td>`;

            var contentString = eatwi.global.queue.getItems()[i].flowName + ' | ';
            if (eatwi.global.queue.getItems()[i].flowName == '卖交易币流程' || eatwi.global.queue.getItems()[i].flowName == '卖积分流程')
            {
                contentString += eatwi.global.queue.getItems()[i].points + ' | ';
                contentString += eatwi.global.queue.getItems()[i].tradingCoin;
            }
            queueTableInnerHTML += `<td>${contentString}</td>`;

            queueTableInnerHTML += `<td><button class="queueDeleteBtn">❌️</button></td></tr>`;
        }
        queueTablePanel.innerHTML = queueTableInnerHTML;
    });

    const queueTableBody = document.getElementById('queue-table-body');
    // 删除行的函数，并删除对应的数组元素
    queueTableBody.addEventListener('click', function(e)
    {
        // 检查点击的目标是否是带有 .queueDeleteBtn 类的按钮
        if (e.target.classList.contains('queueDeleteBtn'))
        {
            // 找到按钮所在的行 (tr)
            const row = e.target.closest('tr');
            
            // 通过第一列 td 的 id 获取类型和下标 (推荐)
            const firstTd = row.cells[0];
            const cellId = firstTd.id;
            
            // 解析 id 获取类型和下标
            let type = null;
            let index = null;
            
            if (cellId && cellId.includes('-'))
            {
                const parts = cellId.split('-');
                type = parts[0];     // 'rps' 或 'rtcs'
                index = parseInt(parts[1], 10); // 下标数字
            }

            // 删除数组元素
            if (type && index !== null)
            {
                if (type === 'dqi')
                {
                    eatwi.global.queue.pop(index);
                    if (eatwi.DEBUG)
                    {
                        console.log('删除 dqi 数组元素下标:', index);
                    }
                }
                else
                {
                    if (eatwi.DEBUG)
                    {
                        console.log(`未找到此类型 ${type} 数组元素下标:`, index);
                    }
                }
            }
            // 删除该行
            row.remove();
            // 更新队列，不然下标对应不上
            refreshQueueButton.click();
        }
    });

    eatwi.util.appendHTML('浮动窗口交易币信息区', '#dp-content', eatwi.global.ui.dpTradingParams);
    const titleInputTradingPanel = document.getElementById('title-input-trading-panel');
    titleInputTradingPanel.addEventListener('click', 
    () => eatwi.util.togglePanel(
        'input-trading-panel',
        'title-input-trading-panel',
        '💰 卖交易币参数 ▼',
        '💰 卖交易币参数 ▶'
    ));

    eatwi.util.appendHTML('浮动窗口交易币交易信息区', '#dp-content', eatwi.global.ui.dpTradingCoinMarket);
    const titleTradingCoinMarketPanel = document.getElementById('title-trading-coin-market-panel');
    titleTradingCoinMarketPanel.addEventListener('click', 
    () => eatwi.util.togglePanel(
        'trading-coin-market-panel',
        'title-trading-coin-market-panel',
        '💰 交易币交易市场 ▼',
        '💰 交易币交易市场 ▶'
    ));

    eatwi.util.appendHTML('浮动窗口交易币交易信息区-正在出售的交易币展示', '#trading-coin-market-panel', eatwi.global.ui.dpTradingCoinMarketCurrentSale);
    eatwi.util.appendHTML('浮动窗口交易币交易信息区-前20次交易币的交易信息', '#trading-coin-market-panel', eatwi.global.ui.dpTradingCoinMarketCurrentInfo);
    eatwi.util.appendHTML('浮动窗口积分交易信息区-前10天交易币的交易信息', '#trading-coin-market-panel', eatwi.global.ui.dpTradingCoinMarketDateInfo);

    eatwi.util.appendHTML('浮动窗口积分信息区', '#dp-content', eatwi.global.ui.dpPointsParams);
    const titleInputPointsPanel = document.getElementById('title-input-points-panel');
    titleInputPointsPanel.addEventListener('click', 
    () => eatwi.util.togglePanel(
        'input-points-panel',
        'title-input-points-panel',
        '💎 卖积分参数 ▼',
        '💎 卖积分参数 ▶'
    ));

    eatwi.util.appendHTML('浮动窗口积分交易信息区', '#dp-content', eatwi.global.ui.dpPointsMarket);
    const titleInputMarketPanel = document.getElementById('title-points-market-panel');
    titleInputMarketPanel.addEventListener('click', 
    () => eatwi.util.togglePanel(
        'points-market-panel',
        'title-points-market-panel',
        '💎 积分交易市场 ▼',
        '💎 积分交易市场 ▶'
    ));

    eatwi.util.appendHTML('浮动窗口积分交易信息区-正在出售的积分展示', '#points-market-panel', eatwi.global.ui.dpPointsMarketCurrentSale);
    eatwi.util.appendHTML('浮动窗口积分交易信息区-前20次积分的交易信息', '#points-market-panel', eatwi.global.ui.dpPointsMarketCurrentInfo);
    eatwi.util.appendHTML('浮动窗口积分交易信息区-前10天积分的交易信息', '#points-market-panel', eatwi.global.ui.dpPointsMarketDateInfo);
})();
