(function(){

    var trigger = eatwi.global.trigger;

    trigger.step('登录', async function()
    {
        eatwi.button.登录();
        if (eatwi.DEBUG)
        {
            console.log('步骤 登录() 执行完毕，开始等待');
        }
        await eatwi.util.stepPause(1500, 2000, 2);
    });

    trigger.step('离线登录', async function()
    {
        eatwi.button.离线登录();
        if (eatwi.DEBUG)
        {
            console.log('步骤 离线登录() 执行完毕，开始等待');
        }
        await eatwi.util.stepPause(1000, 1500, 2);
    });

    trigger.step('弹窗确定', async function()
    {
        eatwi.button.弹窗确定();
        if (eatwi.DEBUG)
        {
            console.log('步骤 弹窗确定() 执行完毕，开始等待');
        }
        await eatwi.util.stepPause(3000, 6000, 3);
    });

    trigger.step('积分商城', async function()
    {
        eatwi.button.积分商城();
        if (eatwi.DEBUG)
        {
            console.log('步骤 积分商城() 执行完毕，开始等待');
        }
        await eatwi.util.stepPause(3000, 6000, 3);
    });

    trigger.step('交易市场', async function()
    {
        eatwi.button.交易市场();
        if (eatwi.DEBUG)
        {
            console.log('步骤 交易市场() 执行完毕，开始等待');
        }
        await eatwi.util.stepPause(2000, 4000, 2);
    });

    trigger.step('上架我的', async function()
    {
        eatwi.button.上架我的();
        if (eatwi.DEBUG)
        {
            console.log('步骤 上架我的() 执行完毕，开始等待');
        }
        await eatwi.util.stepPause(2000, 4000, 2);
    });

    trigger.step('返回上次界面', async function()
    {
        eatwi.button.返回上次界面();
        if (eatwi.DEBUG)
        {
            console.log('步骤 返回上次界面() 执行完毕，开始等待');
        }
        await eatwi.util.stepPause(1000, 2000, 2);
    });

    // ------------------ 买交易币操作部分 -----------------------

    trigger.step('买交易币', async function()
    {
        eatwi.button.买交易币();
        if (eatwi.DEBUG)
        {
            console.log('步骤 买交易币() 执行完毕，开始等待');
        }
        await eatwi.util.stepPause(2000, 6000, 3);
    });

    trigger.step('卖交易币', async function()
    {
        eatwi.button.卖交易币();
        if (eatwi.DEBUG)
        {
            console.log('步骤 卖交易币() 执行完毕，开始等待');
        }
        await eatwi.util.stepPause(2000, 4000, 2);
    });

    trigger.step('卖交易币填入交易币和积分', async function(tradingCoin, points)
    {
        eatwi.button.卖交易币填入交易币和积分(tradingCoin, points);
        if (eatwi.DEBUG)
        {
            console.log('步骤 卖交易币填入交易币和积分() 执行完毕，开始等待');
        }
        await eatwi.util.stepPause(4000, 6000, 4);
    });

    trigger.step('卖交易币提交', async function()
    {
        eatwi.button.卖交易币提交();
        if (eatwi.DEBUG)
        {
            console.log('步骤 卖交易币提交() 执行完毕，开始等待');
        }
        await eatwi.util.stepPause(2000, 4000, 2);
    });

    trigger.step('卖交易币确认上架', async function()
    {
        eatwi.button.卖交易币确认上架();
        if (eatwi.DEBUG)
        {
            console.log('步骤 卖交易币确认上架() 执行完毕，开始等待');
        }
        await eatwi.util.stepPause(2000, 4000, 2);
    });

    trigger.step('卖交易币填入密码', async function(password)
    {
        eatwi.button.卖交易币填入密码(password);
        if (eatwi.DEBUG)
        {
            console.log('步骤 卖交易币填入密码() 执行完毕，开始等待');
        }
        await eatwi.util.stepPause(2000, 4000, 2);
    });

    trigger.step('卖交易币弹窗提交', async function()
    {
        eatwi.button.卖交易币弹窗提交();
        if (eatwi.DEBUG)
        {
            console.log('步骤 卖交易币弹窗提交() 执行完毕，开始等待');
        }
        await eatwi.util.stepPause(4000, 6000, 4);
    });

    trigger.step('卖交易币通知成功弹窗关闭', async function()
    {
        eatwi.button.卖交易币通知成功弹窗关闭();
        if (eatwi.DEBUG)
        {
            console.log('步骤 卖交易币通知成功弹窗关闭() 执行完毕，开始等待');
        }
        await eatwi.util.stepPause(2000, 4000, 2);
    });

    trigger.step('买交易币市场正在出售信息', async function()
    {
        eatwi.button.买交易币市场正在出售信息();
        if (eatwi.DEBUG)
        {
            console.log('步骤 买交易币市场正在出售信息() 执行完毕，开始等待');
        }
        await eatwi.util.stepPause(1000, 2000, 2);
    });

    trigger.step('买交易币市场交易信息', async function()
    {
        await eatwi.button.买交易币市场交易信息();
        if (eatwi.DEBUG)
        {
            console.log('步骤 买交易币市场交易信息() 执行完毕，开始等待');
        }
        await eatwi.util.stepPause(1000, 2000, 2);
    });

    trigger.step('买交易币市场交易信息2', async function(tradingCoinMarketData)
    {
        eatwi.button.买交易币市场交易信息2(tradingCoinMarketData);
        if (eatwi.DEBUG)
        {
            console.log('步骤 买交易币市场交易信息2() 执行完毕，开始等待');
        }
        await eatwi.util.stepPause(1000, 2000, 2);
    });

    trigger.step('买交易币市场交易信息导入文件', async function()
    {
        await eatwi.button.买交易币市场交易信息导入文件();
        if (eatwi.DEBUG)
        {
            console.log('步骤 买交易币市场交易信息导入文件() 执行完毕，开始等待');
        }
        await eatwi.util.stepPause(1000, 2000, 2);
    });

    trigger.step('买交易币市场交易信息导入变量', async function(tradingCoinMarketData)
    {
        eatwi.button.买交易币市场交易信息导入变量(tradingCoinMarketData);
        if (eatwi.DEBUG)
        {
            console.log('步骤 买交易币市场交易信息导入变量() 执行完毕，开始等待');
        }
        await eatwi.util.stepPause(1000, 2000, 2);
    });

    // --------------------- 买积分操作部分 -------------------

    trigger.step('买积分', async function()
    {
        eatwi.button.买积分();
        if (eatwi.DEBUG)
        {
            console.log('步骤 买积分() 执行完毕，开始等待');
        }
        await eatwi.util.stepPause(2000, 6000, 3);
    });

    trigger.step('卖积分', async function()
    {
        eatwi.button.卖积分();
        if (eatwi.DEBUG)
        {
            console.log('步骤 卖积分() 执行完毕，开始等待');
        }
        await eatwi.util.stepPause(2000, 4000, 2);
    });

    trigger.step('卖积分填入积分和交易币', async function(points, tradingCoin)
    {
        eatwi.button.卖积分填入积分和交易币(points, tradingCoin);
        if (eatwi.DEBUG)
        {
            console.log('步骤 卖积分填入积分和交易币() 执行完毕，开始等待');
        }
        await eatwi.util.stepPause(4000, 6000, 4);
    });

    trigger.step('卖积分提交', async function()
    {
        eatwi.button.卖积分提交();
        if (eatwi.DEBUG)
        {
            console.log('步骤 卖积分提交() 执行完毕，开始等待');
        }
        await eatwi.util.stepPause(2000, 4000, 2);
    });

    trigger.step('卖积分确认上架', async function()
    {
        eatwi.button.卖积分确认上架();
        if (eatwi.DEBUG)
        {
            console.log('步骤 卖积分确认上架() 执行完毕，开始等待');
        }
        await eatwi.util.stepPause(2000, 4000, 2);
    });

    trigger.step('卖积分填入密码', async function(password)
    {
        eatwi.button.卖积分填入密码(password);
        if (eatwi.DEBUG)
        {
            console.log('步骤 卖积分填入密码() 执行完毕，开始等待');
        }
        await eatwi.util.stepPause(2000, 4000, 2);
    });

    trigger.step('卖积分弹窗提交', async function()
    {
        eatwi.button.卖积分弹窗提交();
        if (eatwi.DEBUG)
        {
            console.log('步骤 卖积分弹窗提交() 执行完毕，开始等待');
        }
        await eatwi.util.stepPause(4000, 6000, 4);
    });

    trigger.step('卖积分通知成功弹窗关闭', async function()
    {
        eatwi.button.卖积分通知成功弹窗关闭();
        if (eatwi.DEBUG)
        {
            console.log('步骤 卖交易币通知成功弹窗关闭() 执行完毕，开始等待');
        }
        await eatwi.util.stepPause(2000, 4000, 2);
    });

    trigger.step('买积分市场正在出售信息', async function()
    {
        eatwi.button.买积分市场正在出售信息();
        if (eatwi.DEBUG)
        {
            console.log('步骤 买积分市场正在出售信息() 执行完毕，开始等待');
        }
        await eatwi.util.stepPause(1000, 2000, 2);
    });

    trigger.step('买积分市场交易信息', async function()
    {
        await eatwi.button.买积分市场交易信息();
        if (eatwi.DEBUG)
        {
            console.log('步骤 买积分市场交易信息() 执行完毕，开始等待');
        }
        await eatwi.util.stepPause(1000, 2000, 2);
    });

    trigger.step('买积分市场交易信息2', async function(pointsMarketData)
    {
        eatwi.button.买积分市场交易信息2(pointsMarketData);
        if (eatwi.DEBUG)
        {
            console.log('步骤 买积分市场交易信息2() 执行完毕，开始等待');
        }
        await eatwi.util.stepPause(1000, 2000, 2);
    });

    trigger.step('买积分市场交易信息导入文件', async function()
    {
        await eatwi.button.买积分市场交易信息导入文件();
        if (eatwi.DEBUG)
        {
            console.log('步骤 买积分市场交易信息导入文件() 执行完毕，开始等待');
        }
        await eatwi.util.stepPause(1000, 2000, 2);
    });

    trigger.step('买积分市场交易信息导入变量', async function(pointsMarketData)
    {
        eatwi.button.买积分市场交易信息导入变量(pointsMarketData);
        if (eatwi.DEBUG)
        {
            console.log('步骤 买积分市场交易信息导入变量() 执行完毕，开始等待');
        }
        await eatwi.util.stepPause(1000, 2000, 2);
    });

    // ----------------- 验证码处理 ------------------

    trigger.step('验证码窗口探测并解析处理', async function()
    {
        const message = document.querySelectorAll("请输入验证码");
        if (message == null)
        {
            if (eatwi.DEBUG)
            {
                console.log("未检测到验证码相关信息");
            }
            return;
        }

        if (eatwi.DEBUG)
        {
            console.log("检测到验证码，尝试处理");
        }

        const ans = await eatwi.util.captchaAnalysis('img[src*="base64"]');
        if (ans.success == false)
        {
            if (eatwi.DEBUG)
            {
                console.log("验证码解析失败");
            }
            return;
        }

        if (eatwi.DEBUG)
        {
            console.log('验证码解析成功，开始等待');
        }
        await eatwi.util.stepPause(6000, 10000, 5);

        eatwi.button.验证码输入框填入内容(ans.result);
        if (eatwi.DEBUG)
        {
            console.log('步骤 验证码输入框填入内容() 执行完毕，开始等待');
        }
        await eatwi.util.stepPause(2000, 4000, 2);

        eatwi.button.验证码弹窗确认();
        if (eatwi.DEBUG)
        {
            console.log('步骤 验证码弹窗确认() 执行完毕，开始等待');
        }
        await eatwi.util.stepPause(6000, 10000, 5);
    });
})();
