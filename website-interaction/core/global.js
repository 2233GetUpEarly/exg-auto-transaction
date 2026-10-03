(function(){

    window.eatwi = window.eatwi || {};
    window.eatwi.global = window.eatwi.global || {};

    const { Queue } = window.eatwi;
    const { FlowTrigger } = window.eatwi;

    window.eatwi.global.queue = new Queue();
    window.eatwi.global.trigger = new FlowTrigger();

    // 是否正在执行流程
    window.eatwi.global.processIsExecuting = false;

    // 执行的流程类型：1. Immediately 2. QueueImport
    window.eatwi.global.executionProcessType = 'Immediately';

    // 初始化 UI
    window.eatwi.global.ui = {};

    // 存储输入框的值（供步骤函数读取）
    window.eatwi.global.ui.tradingCoinForm = {
        tradingCoin: '',
        points: '',
        pointsToTradingCoin: '',
    };

    // 存储输入框的值 - 积分
    window.eatwi.global.ui.pointsForm = {
        points: '',      // 积分数量
        tradingCoin: '', // 交易币单价
        pointsToTradingCoin: '',
    };

    // 存储买交易币市场交易信息
    window.eatwi.global.tradingCoinMarketData = {};
    // 存储买积分市场交易信息
    window.eatwi.global.pointsMarketData = {};

    // 玩家当前积分和交易币统计
    window.eatwi.global.userPoints = null;
    window.eatwi.global.userTradingCoin = null;

    // 用于保存原始函数（包装模式）
    window.eatwi.global.ui._originalSellTradingCoinFill = null;
    window.eatwi.global.ui._originalSellTradingCoinFillPassword = null;

    // 用于保存原始函数（包装模式）- 积分
    window.eatwi.global.ui._originalSellPointsFill = null;
    window.eatwi.global.ui._originalSellPointsFillPassword = null;

    // 用于保存买交易币市场导入变量原始函数
    window.eatwi.global.ui._originalTradingCoinMarketDataFunc = null;
    // 用于保存买交易币市场交易信息原始函数
    window.eatwi.global.ui._originalTradingCoinMarketInfoFunc = null;

    // 用于保存买积分市场导入变量原始函数
    window.eatwi.global.ui._originalPointsMarketDataFunc = null;
    // 用于保存买积分市场交易信息原始函数
    window.eatwi.global.ui._originalPointsMarketInfoFunc = null;

    // 检测是否为移动端
    window.eatwi.global.ui.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;

})();