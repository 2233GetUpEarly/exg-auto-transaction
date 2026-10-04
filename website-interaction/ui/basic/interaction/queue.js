(function(){

    // 流程选择框加载
    {
        const flowSelect = document.getElementById('dp-flow-select');
        const runBtn = document.getElementById('dp-run');
        const enqueueBtn = document.getElementById('dp-enqueue');
        const queueBtn = document.getElementById('dp-queue');

        // 执行流程（增强版，执行前先注入）
        runBtn.addEventListener('click', async () => {
            const flowName = flowSelect.value;
            if (!flowName) {
                eatwi.global.ui.logger.addLog('请先选择一个流程', true);
                return;
            }
            
            if (!window.eatwi.global.trigger)
            {
                eatwi.global.ui.logger.addLog('❌ eatwi.global.trigger 未加载', true);
                return;
            }

            if (window.eatwi.global.processIsExecuting == true)
            {
                eatwi.global.ui.logger.addLog('❌ 正在执行流程，请等待', true);
                return;
            }
            window.eatwi.global.processIsExecuting = true;
            window.eatwi.global.executionProcessType = 'Immediately';
            
            // 显示当前参数
            eatwi.global.ui.logger.addLog(`📋 当前参数: 交易币=${window.eatwi.global.ui.tradingCoinForm.tradingCoin}, 积分=${window.eatwi.global.ui.tradingCoinForm.points}, 密码已填`);
            
            eatwi.global.ui.logger.addLog(`🚀 开始执行流程: ${flowName}`);
            try
            {
                await window.eatwi.global.trigger.run(flowName);
                eatwi.global.ui.logger.addLog(`✅ 流程执行完成: ${flowName}`);
            }
            catch(e)
            {
                eatwi.global.ui.logger.addLog(`❌ 执行出错: ${e.message}`, true);
            }

            window.eatwi.global.processIsExecuting = false;
        });

        // 将流程入队列
        enqueueBtn.addEventListener('click', () => {
            const flowName = flowSelect.value;
            if (!flowName) {
                eatwi.global.ui.logger.addLog('请先选择一个流程', true);
                return;
            }
            
            if (!window.eatwi.global.trigger) {
                eatwi.global.ui.logger.addLog('❌ eatwi.global.trigger 未加载', true);
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
                eatwi.global.ui.logger.addLog(`✅ 导入队列：${flowName}`);
            }
        });

        // 执行队列
        queueBtn.addEventListener('click', async () => {
            if (window.eatwi.global.queue.size() <= 0)
            {
                eatwi.global.ui.logger.addLog('❌ 队列为空', true);
                return;
            }
            
            if (!window.eatwi || !window.eatwi.global.trigger) {
                eatwi.global.ui.logger.addLog('❌ eatwi.global.trigger 未加载', true);
                return;
            }

            if (window.eatwi.global.processIsExecuting == true)
            {
                eatwi.global.ui.logger.addLog('❌ 正在执行流程，请等待', true);
                return;
            }
            window.eatwi.global.processIsExecuting = true;
            window.eatwi.global.executionProcessType = 'QueueImport';
            
            // 显示当前参数
            eatwi.global.ui.logger.addLog(`📋 当前参数: 交易币=${window.eatwi.global.ui.tradingCoinForm.tradingCoin}, 积分=${window.eatwi.global.ui.tradingCoinForm.points}, 密码已填`);
            try
            {
                var count = 0;
                while (eatwi.global.queue.size() > 0)
                {
                    const queueEl = eatwi.global.queue.front();
                    await window.eatwi.global.trigger.run(queueEl.flowName);
                    eatwi.global.ui.logger.addLog(`✅ 队列流程 ${queueEl.flowName} 已处理完毕`);
                    ++count;
                    eatwi.global.queue.dequeue();
                }
                eatwi.global.ui.logger.addLog(`✅ 队列所有流程已处理完毕，执行流程的个数 ${count}`);
            }
            catch(e)
            {
                eatwi.global.ui.logger.addLog(`❌ 执行出错: ${e.message}`, true);
            }

            window.eatwi.global.processIsExecuting = false;
        });
    }
})();