// darkrp-tools.js
(function() {

    'use strict';

    class Button
    {
        // 登录
        static 登录()
        {
            eatwi.util.findAndClick("#btnLogin");
        }

        // 离线登录
        static 离线登录()
        {
            eatwi.util.findAndClick("button.btn.btn-primary.bg-primary-subtle");
        }

        // 弹窗确定
        static 弹窗确定()
        {
            eatwi.util.findAndClick(".modal-dialog button.btn.btn-primary");
        }

        // 刷新主菜单信息显示
        static 刷新主菜单信息显示()
        {
            const a = document.querySelector('#divMenuPath a');
            a.click();
        }

        // 获取玩家当前交易币和积分信息
        static 获取玩家当前交易币和积分信息()
        {
            // 主界面上找
            let userMoney = null;
            let userCoin = null;
            let toContinue = true;
            const raw = document.getElementById('mdiv1')?.dataset.data;
            if (raw)
            {
                const { Money, Coin } = JSON.parse(raw);
                userMoney = Money;
                userCoin = Coin;
                toContinue = false;
            }

            if (!toContinue)
            {
                window.eatwi.global.userPoints = userMoney;
                window.eatwi.global.userTradingCoin = userCoin;
                return;
            }

            // 上架我的上找
            const targetP = document.querySelector('#divMenuBody p');
            if (targetP)
            {
                // innerText 会把 <br> 变成换行符
                const text = targetP.innerText;

                const moneyMatch = text.match(/你的积分[：:]\s*(\d+)/);
                const coinMatch  = text.match(/你的交易币[：:]\s*(\d+)/);

                userMoney = moneyMatch ? Number(moneyMatch[1]) : null;
                userCoin = coinMatch  ? Number(coinMatch[1])  : null;
                toContinue = false;
            }

            if (!toContinue)
            {
                window.eatwi.global.userPoints = userMoney;
                window.eatwi.global.userTradingCoin = userCoin;
                return;
            }

            //....
        }

        // 积分商城
        static 积分商城()
        {
            eatwi.util.findAndClick("i.bi.bi-bank.d-block.text-center.align-middle.mx-auto");
        }

        // 交易市场
        static 交易市场()
        {
            eatwi.util.findAndClick("i.bi.bi-buildings.d-block.text-center.align-middle.mx-auto");
        }

        // 上架我的
        static 上架我的()
        {
            eatwi.util.findAndClick("i.bi-database-up.d-block.text-center.align-middle.mx-auto");
        }

        // 返回上次界面
        static 返回上次界面()
        {
            var element = document.getElementById('btnGoLastLink');
            element.click();
        }

        // 直接获取登录时的密码
        static 获取密码()
        {
            var txtPassword = document.getElementById('txtPassword');
            return txtPassword.value;
        }

// --------------------- 买交易币按钮操作部分 -------------------

        // 买交易币
        static 买交易币()
        {
            eatwi.util.findAndClick("i.bi.bi-currency-bitcoin.d-block.text-center.align-middle.mx-auto");
        }

        // 卖交易币
        static 卖交易币()
        {
            eatwi.util.selectAndFindToClick("button.btn.btn-primary.bg-primary-subtle", '卖交易币');
        }

        // 卖交易币输入框交易币、积分填入
        static 卖交易币填入交易币和积分(tradingCoin, points)
        {
            eatwi.util.findAndFill("input[title=\"sell\"]", tradingCoin);
            eatwi.util.findAndFill("input[title=\"price\"]", points);
        }

        // 卖交易币提交
        static 卖交易币提交()
        {
            eatwi.util.findAndClick("button.btn.btn-primary.bg-primary-subtle.mt-4");
        }

        // 卖交易币确认上架
        static 卖交易币确认上架()
        {
            eatwi.util.findAndClick("button.btn.btn-primary.bg-primary-subtle");
        }

        // 卖交易币填入密码
        static 卖交易币填入密码(password)
        {
            eatwi.util.findAndFill("input.form-control.my-1", password);
        }

        // 卖交易币弹窗提交
        static 卖交易币弹窗提交()
        {
            eatwi.util.findAndClick("div.modal-footer > button.btn.btn-primary");
        }

        // 卖交易币通知成功弹窗关闭
        static 卖交易币通知成功弹窗关闭()
        {
            eatwi.util.findAndClick("button.btn-close");
        }

        // 买交易币市场正在出售信息
        static 买交易币市场正在出售信息()
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
        static async 买交易币市场交易信息()
        {
            var tradingCoinMarketInfo = document.getElementById('trading-coin-market-current-info');
            var tempString = await eatwi.util.openAndReadDataForFile('交易币文字版数据');
            tempString = tempString.replace(/\r\n/g, '\n').replace(/\n/g, '<br/>');
            tradingCoinMarketInfo.innerHTML = tempString;

            var tradingCoinMarketDateInfo = document.getElementById('trading-coin-market-date-info');
            var tempString2 = await eatwi.util.openAndReadDataForFile('交易币按日期数据');
            var tempArr2 = tempString2.split('\r\n');
            tradingCoinMarketDateInfo.innerHTML = '';
            for (var i = 0; i < tempArr2.length && i < 10; ++i)
            {
                tradingCoinMarketDateInfo.innerHTML += tempArr2[i] + '<br/>';
            }
        }

        // 买交易币市场交易信息，从变量导入
        static 买交易币市场交易信息2(tradingCoinMarketData)
        {
            var tradingCoinMarketInfo = document.getElementById('trading-coin-market-current-info');
            var tempString = tradingCoinMarketData.Text;
            tempString = tempString.replace(/\r\n/g, '\n').replace(/\n/g, '<br/>');
            tradingCoinMarketInfo.innerHTML = tempString;

            var tradingCoinMarketDateInfo = document.getElementById('trading-coin-market-date-info');
            var tempString2 = tradingCoinMarketData.MoneyByDate;
            var tempArr2 = tempString2.split('\r\n');
            tradingCoinMarketDateInfo.innerHTML = '';
            for (var i = 0; i < tempArr2.length && i < 10; ++i)
            {
                tradingCoinMarketDateInfo.innerHTML += tempArr2[i] + '<br/>';
            }
        }

        static async 买交易币市场交易信息导入文件()
        {
            const el = document.getElementById('store-market-chart');
            const data = JSON.parse(el.getAttribute('data-data'));

            // 按日期数据：每日均价数组
            // 按成交数据：逐笔成交价数组
            // 文字版数据：原始文本字符串
            await eatwi.util.openAndWriteDataToFile('交易币文字版数据', data.Text);
            var DateString = '';
            for (var i = 0; i < data.MoneyByDates.length; ++i)
            {
                DateString += data.MoneyByDates[i].TimeStr + ' ';
                DateString += data.MoneyByDates[i].Price + '\r\n';
            }
            await eatwi.util.openAndWriteDataToFile('交易币按日期数据', DateString);
            var RecordsString = '';
            for (var i = 0; i < data.MoneyByRecords.length; ++i)
            {
                RecordsString += data.MoneyByRecords[i].TimeStr + ' ';
                RecordsString += data.MoneyByRecords[i].Price + '\r\n';
            }
            await eatwi.util.openAndWriteDataToFile('交易币按成交数据', RecordsString);
        }

        static 买交易币市场交易信息导入变量(tradingCoinMarketData)
        {
            const el = document.getElementById('store-market-chart');
            const data = JSON.parse(el.getAttribute('data-data'));

            // 按日期数据：每日均价数组
            // 按成交数据：逐笔成交价数组
            // 文字版数据：原始文本字符串
            tradingCoinMarketData = tradingCoinMarketData || {}; 
            tradingCoinMarketData.Text = data.Text;
            var DateString = '';
            for (var i = 0; i < data.MoneyByDates.length; ++i)
            {
                DateString += data.MoneyByDates[i].TimeStr + ' ';
                DateString += data.MoneyByDates[i].Price + '\r\n';
            }
            tradingCoinMarketData.MoneyByDate = DateString;
            var RecordsString = '';
            for (var i = 0; i < data.MoneyByRecords.length; ++i)
            {
                RecordsString += data.MoneyByRecords[i].TimeStr + ' ';
                RecordsString += data.MoneyByRecords[i].Price + '\r\n';
            }
            tradingCoinMarketData.MoneyByRecord = RecordsString;
        }

// --------------------- 买积分按钮操作部分 -------------------

        // 买积分
        static 买积分()
        {
            eatwi.util.findAndClick("i.bi.bi-currency-dollar.d-block.text-center.align-middle.mx-auto");
        }

        // 卖积分
        static 卖积分()
        {
            eatwi.util.selectAndFindToClick("button.btn.btn-primary.bg-primary-subtle", '卖积分');
        }

        // 卖积分输入框交易币、积分填入
        static 卖积分填入积分和交易币(points, tradingCoin)
        {
            eatwi.util.findAndFill("input[title=\"sell\"]", points);
            eatwi.util.findAndFill("input[title=\"price\"]", tradingCoin);
        }

        // 卖积分提交
        static 卖积分提交()
        {
            eatwi.util.findAndClick("button.btn.btn-primary.bg-primary-subtle.mt-4");
        }

        // 卖积分确认上架
        static 卖积分确认上架()
        {
            eatwi.util.findAndClick("button.btn.btn-primary.bg-primary-subtle");
        }

        // 卖积分填入密码
        static 卖积分填入密码(password)
        {
            eatwi.util.findAndFill("input.form-control.my-1", password);
        }

        // 卖积分弹窗提交
        static 卖积分弹窗提交()
        {
            eatwi.util.findAndClick("div.modal-footer > button.btn.btn-primary");
        }

        // 卖积分通知成功弹窗关闭
        static 卖积分通知成功弹窗关闭()
        {
            eatwi.util.findAndClick("button.btn-close");
        }

        // 买积分市场正在出售信息
        static 买积分市场正在出售信息()
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
        static async 买积分市场交易信息()
        {
            var pointsMarketInfo = document.getElementById('points-market-current-info');
            var tempString1 = await eatwi.util.openAndReadDataForFile('积分文字版数据');
            tempString1 = tempString1.replace(/\r\n/g, '\n').replace(/\n/g, '<br/>');
            pointsMarketInfo.innerHTML = tempString1;

            var pointsMarketDateInfo = document.getElementById('points-market-date-info');
            var tempString2 = await eatwi.util.openAndReadDataForFile('积分按日期数据');
            var tempArr2 = tempString2.split('\r\n');
            pointsMarketDateInfo.innerHTML = '';
            for (var i = 0; i < tempArr2.length && i < 10; ++i)
            {
                pointsMarketDateInfo.innerHTML += tempArr2[i] + '<br/>';
            }
        }

        // 买积分市场交易信息，从变量导入
        static 买积分市场交易信息2(pointsMarketData)
        {
            var pointsMarketInfo = document.getElementById('points-market-current-info');
            var tempString = pointsMarketData.Text;
            tempString = tempString.replace(/\r\n/g, '\n').replace(/\n/g, '<br/>');
            pointsMarketInfo.innerHTML = tempString;

            var pointsMarketDateInfo = document.getElementById('points-market-date-info');
            var tempString2 = pointsMarketData.CoinByDate;
            var tempArr2 = tempString2.split('\r\n');
            pointsMarketDateInfo.innerHTML = '';
            for (var i = 0; i < tempArr2.length && i < 10; ++i)
            {
                pointsMarketDateInfo.innerHTML += tempArr2[i] + '<br/>';
            }
        }

        static 买积分市场交易信息导入变量(pointsMarketData)
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

        static async 买积分市场交易信息导入文件()
        {
            const el = document.getElementById('store-market-chart');
            const data = JSON.parse(el.getAttribute('data-data'));

            // 按日期数据：每日均价数组
            // 按成交数据：逐笔成交价数组
            // 文字版数据：原始文本字符串
            await eatwi.util.openAndWriteDataToFile('积分文字版数据', data.Text);
            var DateString = '';
            for (var i = 0; i < data.CoinByDates.length; ++i)
            {
                DateString += data.CoinByDates[i].TimeStr + ' ';
                DateString += data.CoinByDates[i].Price + '\r\n';
            }
            await eatwi.util.openAndWriteDataToFile('积分按日期数据', DateString);
            var RecordsString = '';
            for (var i = 0; i < data.CoinByRecords.length; ++i)
            {
                RecordsString += data.CoinByRecords[i].TimeStr + ' ';
                RecordsString += data.CoinByRecords[i].Price + '\r\n';
            }
            await eatwi.util.openAndWriteDataToFile('积分按成交数据', RecordsString);
        }

    // -------------------- 验证码相关 ----------------

        // 验证码输入框填入内容
        static 验证码输入框填入内容(text)
        {
            eatwi.util.findAndFill('input.form-control.my-1', text);
        }

        // 验证码弹窗确认
        static 验证码弹窗确认()
        {
            eatwi.util.findAndClick("div.modal-footer > button.btn.btn-primary");
        }
    }

    window.eatwi = window.eatwi || {};
    window.eatwi.button = Button;
})();