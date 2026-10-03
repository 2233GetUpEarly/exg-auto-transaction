(function(){

    // 流程选择框加载
    const flowSelect = document.getElementById('eatwi-communication-flow-select');
    const runBtn = document.getElementById('eatwi-communication-flow-run');

    // 执行流程（增强版，执行前先注入）
    runBtn.addEventListener('click', async () => {
        const flowName = flowSelect.value;
        if (!flowName)
        {
            eatwi.global.ui.communication.addLog('请先选择一个流程', true);
            return;
        }
        
        if (!window.eatwi.global.communicationTrigger)
        {
            eatwi.global.ui.communication.addLog('❌ eatwi.global.communicationTrigger 未加载', true);
            return;
        }

        if (window.eatwi.global.processIsExecuting == true)
        {
            eatwi.global.ui.communication.addLog('❌ 正在执行流程，请等待', true);
            return;
        }
        window.eatwi.global.processIsExecuting = true;
        window.eatwi.global.executionProcessType = 'Immediately';
        
        eatwi.global.ui.communication.addLog(`🚀 开始执行流程: ${flowName}`);
        try
        {
            await window.eatwi.global.communicationTrigger.run(flowName);
            eatwi.global.ui.communication.addLog(`✅ 流程执行完成: ${flowName}`);
        }
        catch(e)
        {
            eatwi.global.ui.communication.addLog(`❌ 执行出错: ${e.message}`, true);
        }

        window.eatwi.global.processIsExecuting = false;
    });

})();