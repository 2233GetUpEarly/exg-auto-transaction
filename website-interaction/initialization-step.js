

var T = darkrp.trigger;

T.step('登录', async function()
{
    darkrp.button.登录();
    console.log('✅ 步骤执行：' + '登录' + '，等待 500 ms');
    await darkrp.util.sleepMillisecond(500);
});

T.step('离线登录', async function()
{
    darkrp.button.离线登录();
    console.log('✅ 步骤执行：' + '离线登录' + '，等待 1000 ms');
    await darkrp.util.sleepMillisecond(1000);
});

T.step('弹窗确定', async function()
{
    darkrp.button.弹窗确定();
    console.log('✅ 步骤执行：' + '弹窗确定' + '，等待 3000 ms');
    await darkrp.util.sleepMillisecond(3000);
});

T.step('积分商城', async function()
{
    darkrp.button.积分商城();
    console.log('✅ 步骤执行：' + '积分商城' + '，等待 800 ms');
    await darkrp.util.sleepMillisecond(800);
});

T.step('交易市场', async function()
{
    darkrp.button.交易市场();
    console.log('✅ 步骤执行：' + '交易市场' + '，等待 700 ms');
    await darkrp.util.sleepMillisecond(700);
});

// ------------------ 买交易币操作部分 -----------------------

T.step('买交易币', async function()
{
    darkrp.button.买交易币();
    console.log('✅ 步骤执行：' + '买交易币' + '，等待 500 ms');
    await darkrp.util.sleepMillisecond(500);
});

T.step('卖交易币', async function()
{
    darkrp.button.卖交易币();
    console.log('✅ 步骤执行：' + '卖交易币' + '，等待 1000 ms');
    await darkrp.util.sleepMillisecond(1000);
});

T.step('卖交易币提交', async function()
{
    darkrp.button.卖交易币提交();
    console.log('✅ 步骤执行：' + '卖交易币提交' + '，等待 1000 ms');
    await darkrp.util.sleepMillisecond(1000);
});

T.step('卖交易币确认上架', async function()
{
    darkrp.button.卖交易币确认上架();
    console.log('✅ 步骤执行：' + '卖交易币确认上架' + '，等待 2000 ms');
    await darkrp.util.sleepMillisecond(2000);
});

T.step('卖交易币弹窗提交', async function()
{
    darkrp.button.卖交易币弹窗提交();
    console.log('✅ 步骤执行：' + '卖交易币弹窗提交' + '，等待 2000 ms');
    await darkrp.util.sleepMillisecond(2000);
});

T.step('卖交易币通知成功弹窗关闭', async function()
{
    darkrp.button.卖交易币通知成功弹窗关闭();
    console.log('✅ 步骤执行：' + '卖交易币通知成功弹窗关闭' + '，等待 2000 ms');
    await darkrp.util.sleepMillisecond(2000);
});

// --------------------- 买积分操作部分 -------------------

T.step('买积分', async function()
{
    darkrp.button.买积分();
    console.log('✅ 步骤执行：' + '买积分' + '，等待 500 ms');
    await darkrp.util.sleepMillisecond(500);
});

T.step('卖积分', async function()
{
    darkrp.button.卖积分();
    console.log('✅ 步骤执行：' + '卖积分' + '，等待 1000 ms');
    await darkrp.util.sleepMillisecond(1000);
});

T.step('卖积分提交', async function()
{
    darkrp.button.卖积分提交();
    console.log('✅ 步骤执行：' + '卖积分提交' + '，等待 1000 ms');
    await darkrp.util.sleepMillisecond(1000);
});

T.step('卖积分确认上架', async function()
{
    darkrp.button.卖积分确认上架();
    console.log('✅ 步骤执行：' + '卖积分确认上架' + '，等待 2000 ms');
    await darkrp.util.sleepMillisecond(2000);
});

T.step('卖积分弹窗提交', async function()
{
    darkrp.button.卖积分弹窗提交();
    console.log('✅ 步骤执行：' + '卖积分弹窗提交' + '，等待 2000 ms');
    await darkrp.util.sleepMillisecond(2000);
});

T.step('卖积分通知成功弹窗关闭', async function()
{
    darkrp.button.卖积分通知成功弹窗关闭();
    console.log('✅ 步骤执行：' + '卖积分通知成功弹窗关闭' + '，等待 2000 ms');
    await darkrp.util.sleepMillisecond(2000);
});
