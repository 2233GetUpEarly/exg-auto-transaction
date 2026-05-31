

var T = darkrp.trigger;

T.step('登录', async function()
{
    darkrp.button.登录();
    console.log('✅ 步骤 登录() 执行完毕，开始等待');
    await darkrp.util.stepPause(1500, 2000, 2);
});

T.step('离线登录', async function()
{
    darkrp.button.离线登录();
    console.log('✅ 步骤 离线登录() 执行完毕，开始等待');
    await darkrp.util.stepPause(1000, 1500, 2);
});

T.step('弹窗确定', async function()
{
    darkrp.button.弹窗确定();
    console.log('✅ 步骤 弹窗确定() 执行完毕，开始等待');
    await darkrp.util.stepPause(4000, 10000, 5);
});

T.step('积分商城', async function()
{
    darkrp.button.积分商城();
    console.log('✅ 步骤 积分商城() 执行完毕，开始等待');
    await darkrp.util.stepPause(4000, 10000, 5);
});

T.step('交易市场', async function()
{
    darkrp.button.交易市场();
    console.log('✅ 步骤 交易市场() 执行完毕，开始等待');
    await darkrp.util.stepPause(4000, 10000, 5);
});

// ------------------ 买交易币操作部分 -----------------------

T.step('买交易币', async function()
{
    darkrp.button.买交易币();
    console.log('✅ 步骤 买交易币() 执行完毕，开始等待');
    await darkrp.util.stepPause(10000, 20000, 10);
});

T.step('卖交易币', async function()
{
    darkrp.button.卖交易币();
    console.log('✅ 步骤 卖交易币() 执行完毕，开始等待');
    await darkrp.util.stepPause(10000, 20000, 10);
});

T.step('卖交易币填入交易币和积分', async function(tradingCoin, points)
{
    darkrp.button.卖交易币填入交易币和积分(tradingCoin, points);
    console.log('✅ 步骤 卖交易币填入交易币和积分() 执行完毕，开始等待');
    await darkrp.util.stepPause(5000, 10000, 5);
});

T.step('卖交易币提交', async function()
{
    darkrp.button.卖交易币提交();
    console.log('✅ 步骤 卖交易币提交() 执行完毕，开始等待');
    await darkrp.util.stepPause(10000, 20000, 10);
});

T.step('卖交易币确认上架', async function()
{
    darkrp.button.卖交易币确认上架();
    console.log('✅ 步骤 卖交易币确认上架() 执行完毕，开始等待');
    await darkrp.util.stepPause(10000, 20000, 10);
});

T.step('卖交易币填入密码', async function(password)
{
    darkrp.button.卖交易币填入密码(password);
    console.log('✅ 步骤 卖交易币填入密码() 执行完毕，开始等待');
    await darkrp.util.stepPause(5000, 10000, 5);
});

T.step('卖交易币弹窗提交', async function()
{
    darkrp.button.卖交易币弹窗提交();
    console.log('✅ 步骤 卖交易币弹窗提交() 执行完毕，开始等待');
    await darkrp.util.stepPause(6000, 10000, 5);
});

T.step('卖交易币通知成功弹窗关闭', async function()
{
    darkrp.button.卖交易币通知成功弹窗关闭();
    console.log('✅ 步骤 卖交易币通知成功弹窗关闭() 执行完毕，开始等待');
    await darkrp.util.stepPause(6000, 10000, 5);
});

// --------------------- 买积分操作部分 -------------------

T.step('买积分', async function()
{
    darkrp.button.买积分();
    console.log('✅ 步骤 买积分() 执行完毕，开始等待');
    await darkrp.util.stepPause(10000, 20000, 10);
});

T.step('卖积分', async function()
{
    darkrp.button.卖积分();
    console.log('✅ 步骤 卖积分() 执行完毕，开始等待');
    await darkrp.util.stepPause(10000, 20000, 10);
});

T.step('卖积分填入积分和交易币', async function(points, tradingCoin)
{
    darkrp.button.卖积分填入积分和交易币(points, tradingCoin);
    console.log('✅ 步骤 卖积分填入积分和交易币() 执行完毕，开始等待');
    await darkrp.util.stepPause(5000, 10000, 5);
});

T.step('卖积分提交', async function()
{
    darkrp.button.卖积分提交();
    console.log('✅ 步骤 卖积分提交() 执行完毕，开始等待');
    await darkrp.util.stepPause(10000, 20000, 10);
});

T.step('卖积分确认上架', async function()
{
    darkrp.button.卖积分确认上架();
    console.log('✅ 步骤 卖积分确认上架() 执行完毕，开始等待');
    await darkrp.util.stepPause(10000, 20000, 10);
});

T.step('卖积分填入密码', async function(password)
{
    darkrp.button.卖积分填入密码(password);
    console.log('✅ 步骤 卖积分填入密码() 执行完毕，开始等待');
    await darkrp.util.stepPause(5000, 10000, 5);
});

T.step('卖积分弹窗提交', async function()
{
    darkrp.button.卖积分弹窗提交();
   console.log('✅ 步骤 卖积分弹窗提交() 执行完毕，开始等待');
    await darkrp.util.stepPause(6000, 10000, 5);
});

T.step('卖积分通知成功弹窗关闭', async function()
{
    darkrp.button.卖积分通知成功弹窗关闭();
   console.log('✅ 步骤 卖交易币通知成功弹窗关闭() 执行完毕，开始等待');
    await darkrp.util.stepPause(6000, 10000, 5);
});
