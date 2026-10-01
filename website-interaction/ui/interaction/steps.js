(function(){


    // ========== 包装步骤函数，使其读取 UI 输入框的值 ==========
    // 采用包装模式，保留原始函数，避免覆盖丢失
    function patchStepFunctions()
    {
        if (!window.eatwi.global.trigger)
        {
            if (window.eatwi.DEBUG)
            {
                console.error('触发器 trigger 未定义');
            }
            return false;
        }
        
        const steps = window.eatwi.global.trigger.getSteps();
        
        // 保存原始函数引用（如果还没保存过）
        if (!window.eatwi.global.ui._originalSellTradingCoinFill)
        {
            window.eatwi.global.ui._originalSellTradingCoinFill = steps['卖交易币填入交易币和积分'];
        }
        if (!window.eatwi.global.ui._originalSellTradingCoinFillPassword)
        {
            window.eatwi.global.ui._originalSellTradingCoinFillPassword = steps['卖交易币填入密码'];
        }
        if (!window.eatwi.global.ui._originalTradingCoinMarketDataFunc)
        {
            window.eatwi.global.ui._originalTradingCoinMarketDataFunc = steps['买交易币市场交易信息导入变量'];
        }
        if (!window.eatwi.global.ui._originalTradingCoinMarketInfoFunc)
        {
            window.eatwi.global.ui._originalTradingCoinMarketInfoFunc = steps['买交易币市场交易信息2'];
        }
        
        // 包装：卖交易币填入交易币和积分：
        // 1. 从 UI 读取参数后调用原始函数
        // 2. 从队列读取参数后调用原始函数
        steps['卖交易币填入交易币和积分'] = async function()
        {
            // 执行的流程类型：1. Immediately 2. QueueImport
            var params = null;
            var fromName = null;
            if (eatwi.global.executionProcessType == 'Immediately')
            {
                params = window.eatwi.global.ui.tradingCoinForm;
                fromName = 'UI';
            }
            else
            {
                params = eatwi.global.queue.front();
                if (eatwi.global.queue.isEmpty() == true || params == undefined)
                {
                    eatwi.global.ui.logger.addLog('❌ 队列为空', true);
                    return;
                }
                fromName = '队列';
            }
            const tradingCoin = params.tradingCoin;
            const points = params.points;
            
            eatwi.global.ui.logger.addLog(`📝 从${fromName}读取参数: 交易币=${tradingCoin}, 积分单价=${points}`);
            if (eatwi.DEBUG)
            {
                console.log(`✅ 步骤 卖交易币填入交易币和积分(${tradingCoin}, ${points}) 执行`);
            }
            
            const originalFn = window.eatwi.global.ui._originalSellTradingCoinFill;
            if (originalFn)
            {
                // 调用原始函数，传入从 UI 读取的参数
                await originalFn(tradingCoin, points);
            }
            else
            {
                eatwi.global.ui.logger.addLog('❌ 原始函数 卖交易币填入交易币和积分 不存在', true);
            }
        };
        
        // 包装：卖交易币填入密码 - 从 UI 读取密码后调用原始函数
        steps['卖交易币填入密码'] = async function()
        {
            let password = eatwi.button.获取密码();
            
            eatwi.global.ui.logger.addLog(`🔐 读取密码: 已填 (长度 ${password.length})`);
            if (eatwi.DEBUG)
            {
                console.log(`✅ 步骤 卖交易币填入密码(${'*'.repeat(password.length)}) 执行`);
            }
            
            const originalFn = window.eatwi.global.ui._originalSellTradingCoinFillPassword;
            if (originalFn)
            {
                // 调用原始函数，传入从 UI 读取的密码
                await originalFn(password);
            }
            else
            {
                eatwi.global.ui.logger.addLog('❌ 原始函数 卖交易币填入密码 不存在', true);
            }
        };

        // 包装：卖买交易币市场导入变量 - 从变量读取数据后调用原始函数
        steps['买交易币市场交易信息导入变量'] = async function()
        {
            if (eatwi.DEBUG)
            {
                console.log(`✅ 步骤 买交易币市场交易信息导入变量包装函数 执行`);
            }
            if (!window.eatwi.global.tradingCoinMarketData)
            {
                window.eatwi.global.tradingCoinMarketData = {};
            }
            const originalFn = window.eatwi.global.ui._originalTradingCoinMarketDataFunc;
            if (originalFn)
            {
                // 调用原始函数，传入的数据
                await originalFn(window.eatwi.global.tradingCoinMarketData);
            }
            else
            {
                eatwi.global.ui.logger.addLog('❌ 原始函数 买交易币市场交易信息导入变量 不存在', true);
            }
        };

        // 包装：卖买交易币市场信息2 - 从变量读取数据后调用原始函数
        steps['买交易币市场交易信息2'] = async function()
        {
            if (eatwi.DEBUG)
            {
                console.log(`✅ 步骤 买交易币市场交易信息2包装函数 执行`);
            }
            
            const originalFn = window.eatwi.global.ui._originalTradingCoinMarketInfoFunc;
            if (originalFn)
            {
                // 调用原始函数，传入保存的数据
                await originalFn(window.eatwi.global.tradingCoinMarketData);
            }
            else
            {
                eatwi.global.ui.logger.addLog('❌ 原始函数 买买交易币市场交易信息2 不存在', true);
            }
        };
        
        // 可选：提供一个恢复原始函数的方法
        window.eatwi.global.ui.restoreOriginalSteps = function()
        {
            if (window.eatwi.global.ui._originalSellTradingCoinFill)
            {
                steps['卖交易币填入交易币和积分'] = window.eatwi.global.ui._originalSellTradingCoinFill;
            }
            if (window.eatwi.global.ui._originalSellTradingCoinFillPassword)
            {
                steps['卖交易币填入密码'] = window.eatwi.global.ui._originalSellTradingCoinFillPassword;
            }
            if (window.eatwi.global.ui._originalTradingCoinMarketDataFunc)
            {
                steps['买交易币市场交易信息导入变量'] = window.eatwi.global.ui._originalTradingCoinMarketDataFunc;
            }
            if (window.eatwi.global.ui._originalTradingCoinMarketInfoFunc)
            {
                steps['买交易币市场交易信息2'] = window.eatwi.global.ui._originalTradingCoinMarketInfoFunc;
            }
            eatwi.global.ui.logger.addLog('🔁 已恢复原始步骤函数');
        };

        // 包装：卖积分填入积分和交易币
        if (!window.eatwi.global.ui._originalSellPointsFill && steps['卖积分填入积分和交易币'])
        {
            window.eatwi.global.ui._originalSellPointsFill = steps['卖积分填入积分和交易币'];
        }
        // 包装：卖积分填入密码
        if (!window.eatwi.global.ui._originalSellPointsFillPassword && steps['卖积分填入密码'])
        {
            window.eatwi.global.ui._originalSellPointsFillPassword = steps['卖积分填入密码'];
        }
        if (!window.eatwi.global.ui._originalPointsMarketDataFunc)
        {
            window.eatwi.global.ui._originalPointsMarketDataFunc = steps['买积分市场交易信息导入变量'];
        }
        if (!window.eatwi.global.ui._originalPointsMarketInfoFunc)
        {
            window.eatwi.global.ui._originalPointsMarketInfoFunc = steps['买积分市场交易信息2'];
        }

        if (steps['卖积分填入积分和交易币'])
        {
            steps['卖积分填入积分和交易币'] = async function()
            {
                // 执行的流程类型：1. Immediately 2. QueueImport
                var params = null;
                var fromName = null;
                if (eatwi.global.executionProcessType == 'Immediately')
                {
                    params = window.eatwi.global.ui.pointsForm;
                    fromName = 'UI';
                }
                else
                {
                    params = eatwi.global.queue.front();
                    if (eatwi.global.queue.isEmpty() == true || params == undefined)
                    {
                        eatwi.global.ui.logger.addLog('❌ 队列为空', true);
                        return;
                    }
                    fromName = '队列';
                }
                const tradingCoin = params.tradingCoin;
                const points = params.points;
                
                eatwi.global.ui.logger.addLog(`📝 从${fromName}读取积分参数: 积分数量=${points}, 交易币单价=${tradingCoin}`);
                
                const originalFn = window.eatwi.global.ui._originalSellPointsFill;
                if (originalFn)
                {
                    await originalFn(points, tradingCoin);
                }
                else
                {
                    eatwi.global.ui.logger.addLog('❌ 原始步骤函数 卖积分填入积分和交易币 不存在', true);
                }
            };
        }

        if (steps['卖积分填入密码'])
        {
            steps['卖积分填入密码'] = async function()
            {
                var password = eatwi.button.获取密码();
                
                eatwi.global.ui.logger.addLog(`🔐 读取密码: 已填 (长度 ${password.length})`);
                
                const originalFn = window.eatwi.global.ui._originalSellPointsFillPassword;
                if (originalFn)
                {
                    await originalFn(password);
                }
                else
                {
                    eatwi.global.ui.logger.addLog('❌ 原始步骤函数 卖积分填入密码 不存在', true);
                }
            };
        }

        // 包装：买积分市场导入变量 - 从变量读取数据后调用原始函数
        steps['买积分市场交易信息导入变量'] = async function()
        {
            if (eatwi.DEBUG)
            {
                console.log(`✅ 步骤 买积分市场交易信息导入变量包装函数 执行`);
            }
            const originalFn = window.eatwi.global.ui._originalPointsMarketDataFunc;
            if (originalFn)
            {
                // 调用原始函数，传入的数据
                await originalFn(window.eatwi.global.pointsMarketData);
            }
            else
            {
                eatwi.global.ui.logger.addLog('❌ 原始函数 买积分市场交易信息导入变量 不存在', true);
            }
        };

        // 包装：买积分市场信息2 - 从变量读取数据后调用原始函数
        steps['买积分市场交易信息2'] = async function()
        {
            if (eatwi.DEBUG)
            {
                console.log(`✅ 步骤 买积分市场交易信息2包装函数 执行`);
            }
            
            const originalFn = window.eatwi.global.ui._originalPointsMarketInfoFunc;
            if (originalFn)
            {
                // 调用原始函数，传入保存的数据
                await originalFn(window.eatwi.global.pointsMarketData);
            }
            else
            {
                eatwi.global.ui.logger.addLog('❌ 原始函数 买积分市场交易信息2 不存在', true);
            }
        };
        
        if (eatwi.DEBUG)
        {
            console.log('已包装交易币步骤函数（从UI读取参数，原始函数已保留）');
        }
        return true;
    }

    patchStepFunctions();
})();