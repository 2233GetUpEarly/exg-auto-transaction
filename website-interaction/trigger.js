

window.darkrp = window.darkrp || {};

// 触发器
window.darkrp.trigger = {
    _steps: {},      // 存放各个步骤函数
    _flows: {},      // 存放流程定义（步骤名数组）
    
    // 注册步骤
    step: function(name, fn)
    {
        this._steps[name] = fn;
        console.log('📦 注册步骤：' + name);
    },
    
    // 注册流程
    flow: function(name, stepNames)
    {
        this._flows[name] = stepNames;
        console.log('📋 注册流程：' + name + ' → ' + stepNames.join(' → '));
    },
    
    // 执行流程
    run: async function(flowName)
    {
        var steps = this._flows[flowName];
        if (!steps)
        {
            console.log('❌ 流程不存在：' + flowName);
            return;
        }
        
        console.log('🚀 开始执行：' + flowName);
        for (var i = 0; i < steps.length; i++)
        {
            var stepName = steps[i];
            var fn = this._steps[stepName];
            if (fn)
            {
                console.log('  ▶ ' + stepName);
                await fn();
            }
            else
            {
                console.log('  ⚠️ 步骤不存在：' + stepName);
            }
        }
        console.log('✅ 流程结束：' + flowName);
    },
    
    // 列出所有流程
    list: function()
    {
        console.log('可用流程：');
        var self = this;
        Object.keys(this._flows).forEach(function(name)
        {
            console.log('  ' + name + ' → ' + self._flows[name].join(' → '));
        });
    }
};