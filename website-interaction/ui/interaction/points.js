(function(){

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

            eatwi.global.ui.logger.addLog(`✅ 导入队列：卖积分流程->积分：${pointsAmountInput.value}->交易币：${tradingcoinPriceInput.value}`);
        }
    );

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
})();