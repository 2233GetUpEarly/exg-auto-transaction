// darkrp-tools.js
var button = (function() 
{
    'use strict';

    // 登录
    function 登录()
    {
        darkrp.util.findAndClick("#btnLogin");
    }

    // 离线登录
    function 离线登录()
    {
        darkrp.util.findAndClick("button.btn.btn-primary.bg-primary-subtle");
    }

    // 弹窗确定
    function 弹窗确定()
    {
        darkrp.util.findAndClick(".modal-dialog button.btn.btn-primary");
    }

    // 积分商城
    function 积分商城()
    {
        darkrp.util.findAndClick("i.bi.bi-bank.d-block.text-center.align-middle.mx-auto");
    }

    // 交易市场
    function 交易市场()
    {
        darkrp.util.findAndClick("i.bi.bi-buildings.d-block.text-center.align-middle.mx-auto");
    }

    // 上架我的
    function 上架我的()
    {
        darkrp.util.findAndClick("i.bi-database-up.d-block.text-center.align-middle.mx-auto");
    }

    // 返回上次界面
    function 返回上次界面()
    {
        var element = document.getElementById('btnGoLastLink');
        element.click();
    }

    // 直接获取登录时的密码
    function 获取密码()
    {
        var txtPassword = document.getElementById('txtPassword');
        return txtPassword.value;
    }

// --------------------- 买交易币按钮操作部分 -------------------

    // 买交易币
    function 买交易币()
    {
        darkrp.util.findAndClick("i.bi.bi-currency-bitcoin.d-block.text-center.align-middle.mx-auto");
    }

    // 卖交易币
    function 卖交易币()
    {
        darkrp.util.selectAndFindToClick("button.btn.btn-primary.bg-primary-subtle", '卖交易币');
    }

    // 卖交易币输入框交易币、积分填入
    function 卖交易币填入交易币和积分(tradingCoin, points)
    {
        darkrp.util.findAndFill("input[title=\"sell\"]", tradingCoin);
        darkrp.util.findAndFill("input[title=\"price\"]", points);
    }

    // 卖交易币提交
    function 卖交易币提交()
    {
        // darkrp.util.selectAndFindToClick("button.btn.btn-primary.bg-primary-subtle.mt-4", '提交');
        darkrp.util.findAndClick("button.btn.btn-primary.bg-primary-subtle.mt-4");
    }

    // 卖交易币确认上架
    function 卖交易币确认上架()
    {
        // darkrp.util.selectAndFindToClick("button.btn.btn-primary.bg-primary-subtle", '确认上架');
        darkrp.util.findAndClick("button.btn.btn-primary.bg-primary-subtle");
    }

    // 卖交易币填入密码
    function 卖交易币填入密码(password)
    {
        darkrp.util.findAndFill("input.form-control.my-1", password);
    }

    // 卖交易币弹窗提交
    function 卖交易币弹窗提交()
    {
        darkrp.util.findAndClick("div.modal-footer > button.btn.btn-primary");
    }

    // 卖交易币通知成功弹窗关闭
    function 卖交易币通知成功弹窗关闭()
    {
        darkrp.util.findAndClick("button.btn-close");
    }

    // 买交易币市场正在出售信息
    function 买交易币市场正在出售信息()
    {
        var saleInfo = document.querySelectorAll('button.btn.bg-primary-subtle');
        var textString = '';
        for (let i = 2; i < saleInfo.length; ++i)
        {
            textString += saleInfo[i].textContent + `<br/>`;
        }
        var tradingCoinMarketSale = document.getElementById('trading-coin-market-current-sale');
        tradingCoinMarketSale.innerHTML = textString;
    }

    // 买交易币市场交易信息
    async function 买交易币市场交易信息()
    {
        var tradingCoinMarketInfo = document.getElementById('trading-coin-market-current-info');
        var tempString = await darkrp.util.openAndReadDataForFile('交易币文字版数据');
        tempString = tempString.replace(/\r\n/g, '\n').replace(/\n/g, '<br/>');
        tradingCoinMarketInfo.innerHTML = tempString;

        var tradingCoinMarketDateInfo = document.getElementById('trading-coin-market-date-info');
        var tempString2 = await darkrp.util.openAndReadDataForFile('交易币按日期数据');
        // tempString2 = tempString2.replace(/\r\n/g, '\n').replace(/\n/g, '<br/>');
        var tempArr2 = tempString2.split('\r\n');
        tradingCoinMarketDateInfo.innerHTML = '';
        for (var i = 0; i < tempArr2.length && i < 10; ++i)
        {
            tradingCoinMarketDateInfo.innerHTML += tempArr2[i] + '<br/>';
        }
    }

    // 买交易币市场交易信息，从变量导入
    function 买交易币市场交易信息2(tradingCoinMarketData)
    {
        var tradingCoinMarketInfo = document.getElementById('trading-coin-market-current-info');
        // var tempString = await darkrp.util.openAndReadDataForFile('交易币文字版数据');
        var tempString = tradingCoinMarketData.Text;
        tempString = tempString.replace(/\r\n/g, '\n').replace(/\n/g, '<br/>');
        tradingCoinMarketInfo.innerHTML = tempString;

        var tradingCoinMarketDateInfo = document.getElementById('trading-coin-market-date-info');
        // var tempString2 = await darkrp.util.openAndReadDataForFile('交易币按日期数据');
        var tempString2 = tradingCoinMarketData.MoneyByDate;
        // tempString2 = tempString2.replace(/\r\n/g, '\n').replace(/\n/g, '<br/>');
        var tempArr2 = tempString2.split('\r\n');
        tradingCoinMarketDateInfo.innerHTML = '';
        for (var i = 0; i < tempArr2.length && i < 10; ++i)
        {
            tradingCoinMarketDateInfo.innerHTML += tempArr2[i] + '<br/>';
        }
    }

    async function 买交易币市场交易信息导入文件()
    {
        const el = document.getElementById('store-market-chart');
        const data = JSON.parse(el.getAttribute('data-data'));

        // 按日期数据：每日均价数组
        // 按成交数据：逐笔成交价数组
        // 文字版数据：原始文本字符串
        await darkrp.util.openAndWriteDataToFile('交易币文字版数据', data.Text);
        var DateString = '';
        for (var i = 0; i < data.MoneyByDates.length; ++i)
        {
            DateString += data.MoneyByDates[i].TimeStr + ' ';
            DateString += data.MoneyByDates[i].Price + '\r\n';
        }
        await darkrp.util.openAndWriteDataToFile('交易币按日期数据', DateString);
        var RecordsString = '';
        for (var i = 0; i < data.MoneyByRecords.length; ++i)
        {
            RecordsString += data.MoneyByRecords[i].TimeStr + ' ';
            RecordsString += data.MoneyByRecords[i].Price + '\r\n';
        }
        await darkrp.util.openAndWriteDataToFile('交易币按成交数据', RecordsString);
    }

    function 买交易币市场交易信息导入变量(tradingCoinMarketData)
    {
        const el = document.getElementById('store-market-chart');
        const data = JSON.parse(el.getAttribute('data-data'));

        // 按日期数据：每日均价数组
        // 按成交数据：逐笔成交价数组
        // 文字版数据：原始文本字符串
        tradingCoinMarketData.Text = data.Text;
        // await darkrp.util.openAndWriteDataToFile('交易币文字版数据', data.Text);
        var DateString = '';
        for (var i = 0; i < data.MoneyByDates.length; ++i)
        {
            DateString += data.MoneyByDates[i].TimeStr + ' ';
            DateString += data.MoneyByDates[i].Price + '\r\n';
        }
        tradingCoinMarketData.MoneyByDate = DateString;
        // await darkrp.util.openAndWriteDataToFile('交易币按日期数据', DateString);
        var RecordsString = '';
        for (var i = 0; i < data.MoneyByRecords.length; ++i)
        {
            RecordsString += data.MoneyByRecords[i].TimeStr + ' ';
            RecordsString += data.MoneyByRecords[i].Price + '\r\n';
        }
        tradingCoinMarketData.MoneyByRecord = RecordsString;
        // await darkrp.util.openAndWriteDataToFile('交易币按成交数据', RecordsString);
    }

// --------------------- 买积分按钮操作部分 -------------------

    // 买积分
    function 买积分()
    {
        darkrp.util.findAndClick("i.bi.bi-currency-dollar.d-block.text-center.align-middle.mx-auto");
    }

    // 卖积分
    function 卖积分()
    {
        darkrp.util.selectAndFindToClick("button.btn.btn-primary.bg-primary-subtle", '卖积分');
    }

    // 卖积分输入框交易币、积分填入
    function 卖积分填入积分和交易币(points, tradingCoin)
    {
        darkrp.util.findAndFill("input[title=\"sell\"]", points);
        darkrp.util.findAndFill("input[title=\"price\"]", tradingCoin);
    }

    // 卖积分提交
    function 卖积分提交()
    {
        // darkrp.util.selectAndFindToClick("button.btn.btn-primary.bg-primary-subtle.mt-4", '提交');
        darkrp.util.findAndClick("button.btn.btn-primary.bg-primary-subtle.mt-4");
    }

    // 卖积分确认上架
    function 卖积分确认上架()
    {
        // darkrp.util.selectAndFindToClick("button.btn.btn-primary.bg-primary-subtle", '确认上架');
        darkrp.util.findAndClick("button.btn.btn-primary.bg-primary-subtle");
    }

    // 卖积分填入密码
    function 卖积分填入密码(password)
    {
        darkrp.util.findAndFill("input.form-control.my-1", password);
    }

    // 卖积分弹窗提交
    function 卖积分弹窗提交()
    {
        darkrp.util.findAndClick("div.modal-footer > button.btn.btn-primary");
    }

    // 卖积分通知成功弹窗关闭
    function 卖积分通知成功弹窗关闭()
    {
        darkrp.util.findAndClick("button.btn-close");
    }

    // 买积分市场正在出售信息
    function 买积分市场正在出售信息()
    {
        var saleInfo = document.querySelectorAll('button.btn.bg-primary-subtle');
        var textString = '';
        for (let i = 2; i < saleInfo.length; ++i)
        {
            textString += saleInfo[i].textContent + `<br/>`;
        }
        var pointsMarketSale = document.getElementById('points-market-current-sale');
        pointsMarketSale.innerHTML = textString;
    }

    // 买积分市场交易信息
    async function 买积分市场交易信息()
    {
        var pointsMarketInfo = document.getElementById('points-market-current-info');
        var tempString1 = await darkrp.util.openAndReadDataForFile('积分文字版数据');
        tempString1 = tempString1.replace(/\r\n/g, '\n').replace(/\n/g, '<br/>');
        pointsMarketInfo.innerHTML = tempString1;

        var pointsMarketDateInfo = document.getElementById('points-market-date-info');
        var tempString2 = await darkrp.util.openAndReadDataForFile('积分按日期数据');
        // tempString2 = tempString2.replace(/\r\n/g, '\n').replace(/\n/g, '<br/>');
        var tempArr2 = tempString2.split('\r\n');
        pointsMarketDateInfo.innerHTML = '';
        for (var i = 0; i < tempArr2.length && i < 10; ++i)
        {
            pointsMarketDateInfo.innerHTML += tempArr2[i] + '<br/>';
        }
    }

    // 买积分市场交易信息，从变量导入
    function 买积分市场交易信息2(pointsMarketData)
    {
        var pointsMarketInfo = document.getElementById('points-market-current-info');
        var tempString = pointsMarketData.Text;
        tempString = tempString.replace(/\r\n/g, '\n').replace(/\n/g, '<br/>');
        pointsMarketInfo.innerHTML = tempString;

        var pointsMarketDateInfo = document.getElementById('points-market-date-info');
        var tempString2 = pointsMarketData.CoinByDate;
        // tempString2 = tempString2.replace(/\r\n/g, '\n').replace(/\n/g, '<br/>');
        var tempArr2 = tempString2.split('\r\n');
        pointsMarketDateInfo.innerHTML = '';
        for (var i = 0; i < tempArr2.length && i < 10; ++i)
        {
            pointsMarketDateInfo.innerHTML += tempArr2[i] + '<br/>';
        }
    }

    function 买积分市场交易信息导入变量(pointsMarketData)
    {
        const el = document.getElementById('store-market-chart');
        const data = JSON.parse(el.getAttribute('data-data'));

        // 按日期数据：每日均价数组
        // 按成交数据：逐笔成交价数组
        // 文字版数据：原始文本字符串
        pointsMarketData.Text = data.Text;
        var DateString = '';
        for (var i = 0; i < data.CoinByDates.length; ++i)
        {
            DateString += data.CoinByDates[i].TimeStr + ' ';
            DateString += data.CoinByDates[i].Price + '\r\n';
        }
        pointsMarketData.CoinByDate = DateString;
        var RecordsString = '';
        for (var i = 0; i < data.CoinByRecords.length; ++i)
        {
            RecordsString += data.CoinByRecords[i].TimeStr + ' ';
            RecordsString += data.CoinByRecords[i].Price + '\r\n';
        }
        pointsMarketData.CoinByRecord = RecordsString;
    }

    async function 买积分市场交易信息导入文件()
    {
        const el = document.getElementById('store-market-chart');
        const data = JSON.parse(el.getAttribute('data-data'));

        // 按日期数据：每日均价数组
        // 按成交数据：逐笔成交价数组
        // 文字版数据：原始文本字符串
        await darkrp.util.openAndWriteDataToFile('积分文字版数据', data.Text);
        var DateString = '';
        for (var i = 0; i < data.CoinByDates.length; ++i)
        {
            DateString += data.CoinByDates[i].TimeStr + ' ';
            DateString += data.CoinByDates[i].Price + '\r\n';
        }
        await darkrp.util.openAndWriteDataToFile('积分按日期数据', DateString);
        var RecordsString = '';
        for (var i = 0; i < data.CoinByRecords.length; ++i)
        {
            RecordsString += data.CoinByRecords[i].TimeStr + ' ';
            RecordsString += data.CoinByRecords[i].Price + '\r\n';
        }
        await darkrp.util.openAndWriteDataToFile('积分按成交数据', RecordsString);
    }

    // -------------------- 验证码相关 ----------------

    // 验证码输入框填入内容
    function 验证码输入框填入内容(text)
    {
        darkrp.util.findAndFill('input.form-control.my-1', text);
    }

    // 验证码弹窗确认
    function 验证码弹窗确认()
    {
        darkrp.util.findAndClick("div.modal-footer > button.btn.btn-primary");
    }
    
    // -------------------- 交易相关数据获取 ---------------------

    // ... 其他函数
    
    // ========== 暴露接口 ==========
    return {
        登录: 登录,
        离线登录: 离线登录,
        弹窗确定: 弹窗确定,
        积分商城: 积分商城,
        交易市场: 交易市场,
        上架我的: 上架我的,
        返回上次界面: 返回上次界面,
        获取密码: 获取密码,
        买交易币: 买交易币,
        卖交易币: 卖交易币,
        卖交易币填入交易币和积分: 卖交易币填入交易币和积分,
        卖交易币提交: 卖交易币提交,
        卖交易币确认上架: 卖交易币确认上架,
        卖交易币填入密码: 卖交易币填入密码,
        卖交易币弹窗提交: 卖交易币弹窗提交,
        卖交易币通知成功弹窗关闭: 卖交易币通知成功弹窗关闭,
        买交易币市场正在出售信息: 买交易币市场正在出售信息,
        买交易币市场交易信息: 买交易币市场交易信息,
        买交易币市场交易信息2: 买交易币市场交易信息2,
        买交易币市场交易信息导入文件: 买交易币市场交易信息导入文件,
        买交易币市场交易信息导入变量: 买交易币市场交易信息导入变量,
        买积分: 买积分,
        卖积分: 卖积分,
        卖积分填入积分和交易币: 卖积分填入积分和交易币,
        卖积分提交: 卖积分提交,
        卖积分确认上架: 卖积分确认上架,
        卖积分填入密码: 卖积分填入密码,
        卖积分弹窗提交: 卖积分弹窗提交,
        卖积分通知成功弹窗关闭: 卖积分通知成功弹窗关闭,
        买积分市场正在出售信息: 买积分市场正在出售信息,
        买积分市场交易信息: 买积分市场交易信息,
        买积分市场交易信息2: 买积分市场交易信息2,
        买积分市场交易信息导入文件: 买积分市场交易信息导入文件,
        买积分市场交易信息导入变量: 买积分市场交易信息导入变量,
        验证码输入框填入内容: 验证码输入框填入内容,
        验证码弹窗确认: 验证码弹窗确认
    };
})();