(function(){

    class FlowTrigger
    {
        // 注册步骤
        step(name, fn)
        {
            this.#steps[name] = fn;
            if (eatwi.DEBUG)
            {
                console.log('注册步骤：' + name);
            }
        }

        // 注册流程
        flow(name, stepNames)
        {
            this.#flows[name] = stepNames;
            if (eatwi.DEBUG)
            {
                console.log('注册流程：' + name + ' → ' + stepNames.join(' → '));
            }
        }

        async run(flowName)
        {
            var steps = this.#flows[flowName];
            if (!steps)
            {
                if (eatwi.DEBUG)
                {
                    console.log('流程不存在：' + flowName);
                }
                return;
            }
            
            if (eatwi.DEBUG)
            {
                console.log('开始执行：' + flowName);
            }
            for (var i = 0; i < steps.length; i++)
            {
                var stepName = steps[i];
                var fn = this.#steps[stepName];
                if (fn)
                {
                    if (eatwi.DEBUG)
                    {
                        console.log('  ▶ ' + stepName);
                    }
                    await fn();
                }
                else
                {
                    if (eatwi.DEBUG)
                    {
                        console.log('步骤不存在：' + stepName);
                    }
                }
            }

            if (eatwi.DEBUG)
            {
                console.log('流程结束：' + flowName);
            }
        }

        list()
        {
            if (eatwi.DEBUG)
            {
                console.log('可用流程：');
            }
            var self = this;
            if (eatwi.DEBUG)
            {
                Object.keys(this.#flows).forEach(function(name)
                {
                    console.log('  ' + name + ' → ' + self._flows[name].join(' → '));
                });
            }
        }

        getSteps()
        {
            return this.#steps;
        }

        getFlows()
        {
            return this.#flows;
        }

        #steps = {};    // 存放各个步骤函数
        #flows = {};    // 存放流程定义（步骤名数组）
    }

    window.eatwi = window.eatwi || {};
    window.eatwi.FlowTrigger = FlowTrigger;
})();
