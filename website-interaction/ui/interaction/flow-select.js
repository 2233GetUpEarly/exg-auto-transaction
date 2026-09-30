(function(){
    
    const flowSelect = document.getElementById('dp-flow-select');
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

    loadFlowOptions();
})();