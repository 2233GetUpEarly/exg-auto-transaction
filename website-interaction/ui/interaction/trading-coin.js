(function(){

    // 交易币区
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
            eatwi.global.ui.logger.addLog(`✅ 导入队列：卖交易币流程->交易币：${tradingCoinInput.value}->积分：${pointsPriceInput.value}`);
        }
    );

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
})();