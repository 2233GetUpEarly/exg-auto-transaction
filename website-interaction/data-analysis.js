
window.darkrp.dataAnalysis = {
    resultsPointsSale: [],          // 存放积分销售分析结果的数组
    resultsTradingCoinSale: [],     // 存放交易币销售分析结果的数组

    pushPointsSale(element)   // 推入数据
    {    
        this.resultsPointsSale.push(element);
    },

    pushTradingCoinSale(element)   // 推入数据
    {    
        this.resultsTradingCoinSale.push(element);
    },

    popPointsSale(index)        // 检查数据不满足，删除
    {
        this.resultsPointsSale.splice(index, 1);
    },

    popTradingCoinSale(index)   // 检查数据不满足，删除
    {
        this.resultsTradingCoinSale.splice(index, 1);
    },

    deletePointsSale(index)
    {
        this.resultsPointsSale[index] = undefined;
    },

    deleteTradingCoinSale(index)
    {
        this.resultsTradingCoinSale[index] = undefined;
    },

    // 低成本覆盖出售策略
    lowCostCoverageSaleStrategy(target)
    {
        if (target.type == '正在出售的积分')
        {
            for (var i = 1; i <= 3; ++i)
            {
                this.pushPointsSale({
                    flowName: '卖积分流程',
                    points: target.points + i,
                    tradingCoin: target.tradingCoin
                });
            }
        }
        else if (target.type == '正在出售的交易币')
        {
            for (var i = 1; i <= 3; ++i)
            {
                this.pushTradingCoinSale({
                    flowName: '卖交易币流程',
                    points: target.points - i,
                    tradingCoin: target.tradingCoin
                });
            }
        }
        else
        {
            console.error("未找到分析类型");
        }
    },

    // 正常出售策略
    normalSalesAtrategy(target)
    {
        if (target.type == '正在出售的积分')
        {
            for (var i = 0; i < 3; ++i)
            {
                this.pushPointsSale({
                    flowName: '卖积分流程',
                    points: target.points + i * 50,
                    tradingCoin: target.tradingCoin
                });
            }
        }
        else if (target.type == '正在出售的交易币')
        {
            for (var i = 0; i < 3; ++i)
            {
                this.pushTradingCoinSale({
                    flowName: '卖交易币流程',
                    points: target.points - i * 50,
                    tradingCoin: target.tradingCoin
                });
            }
        }
        else
        {
            console.error("未找到分析类型");
        }
    },

    // 生成数据策略
    dataGenerationStrategy(TradingCoinDataArr, PointsDataArr)
    {
        var targetTradingCoin = 10;
        
        for (var i = 0; i < TradingCoinDataArr.length; ++i)
        {
            if (TradingCoinDataArr[i].tradingCoin != targetTradingCoin)
            {
                continue;
            }
            
            var target = TradingCoinDataArr[i];
            target.type = '正在出售的交易币';
            this.lowCostCoverageSaleStrategy(target);
            this.normalSalesAtrategy(target);
        }
        for (var i = 0; i < PointsDataArr.length; ++i)
        {
            if (PointsDataArr[i].tradingCoin != targetTradingCoin)
            {
                continue;
            }

            var target = PointsDataArr[i];
            target.type = '正在出售的积分';
            this.lowCostCoverageSaleStrategy(target);
            this.normalSalesAtrategy(target);
        }
    },

    // 数组排序策略
    resultsSaleSortAtrategy()
    {
        // 排序
        this.resultsPointsSale.sort((a, b) => 
        {
            if (a.tradingCoin !== b.tradingCoin)
            {
                return a.tradingCoin - b.tradingCoin;  // 先按交易币
            }
            return a.points - b.points;    // 比例相同时按积分
        });
        this.resultsTradingCoinSale.sort((a, b) => 
        {
            if (a.tradingCoin !== b.tradingCoin)
            {
                return a.tradingCoin - b.tradingCoin;  // 先按交易币
            }
            return a.points - b.points;    // 比例相同时按积分
        });
    },
    
    // 出售成本检查策略
    saleCostInspectionAtrategy()
    {
        if (this.resultsPointsSale.length <= 0 || this.resultsTradingCoinSale.length <= 0)
        {
            console.error('分析数组为空退出');
            return;
        }
        
        var lineDownSale = this.resultsPointsSale[0];
        var costPoints = lineDownSale.points * 1.05;

        for (var i = 0; i < this.resultsTradingCoinSale.length; ++i)
        {
            var current = this.resultsTradingCoinSale[i];
            var currentProfitPoints = current.points - 100;
            console.log (`积分出售成本：${costPoints} | 交易币出售利润：${currentProfitPoints}`)
            if (currentProfitPoints <= costPoints + 50)
            {
                this.popTradingCoinSale(i);
                --i;
            }
        }
    },

    // 当前可用资金检查策略
    currentAvailableFundsCheckStrategy()
    {

    },

    // 考虑市场每天平均销售检查策略
    DailyAverageSalesCheckStrategy()
    {

    },

    // 整体流程分析
    dataAnalysisOverallProcess(TradingCoinDataArr, PointsDataArr)
    {
        this.resultsPointsSale = [],          // 存放积分销售分析结果的数组
        this.resultsTradingCoinSale = [],     // 存放交易币销售分析结果的数组
        
        this.dataGenerationStrategy(TradingCoinDataArr, PointsDataArr);

        this.resultsSaleSortAtrategy();
        // 检查策略
        this.saleCostInspectionAtrategy();
        // currentAvailableFundsCheckStrategy();
    }
};

var testData = (function() {

    function parseTradingCoinMarketCurrentSaleData(htmlElement)
    {
        // 获取元素内的HTML内容
        const content = htmlElement.innerHTML;
        
        // 按行分割
        const lines = content.split('<br>');
        
        const result = [];
        
        for (let line of lines)
        {
            // 跳过空行
            if (!line.trim()) continue;
            
            // 使用正则表达式匹配：积分 买 币数 个币 (比例)
            // 匹配模式：数字（积分） + "买" + 数字（币数） + "个币" + (数字（比例）)
            const match = line.match(/(\d+)\s*积分\s*买\s*(\d+)\s*个币\s*\((\d+)\)/);
            
            if (match)
            {
                result.push({
                    points: parseInt(match[1]),      // 积分
                    tradingCoin: parseInt(match[2]),        // 交易币数量
                    ratio: parseInt(match[3])         // 比例（每币所需积分的百分之一？）
                });
            }
        }
        
        return result;
    }

    function parsePointsMarketCurrentSaleData(htmlElement)
    {
        // 获取元素内的HTML内容
        const content = htmlElement.innerHTML;
        
        // 按行分割
        const lines = content.split('<br>');
        
        const result = [];
        
        for (let line of lines)
        {
            // 跳过空行
            if (!line.trim()) continue;
            
            // 使用正则表达式匹配：币数 买 积分  (比例)
            // 匹配模式：数字（币数） + "币" + "买" + 数字（积分） + "积分" + (数字（比例）)
            const match = line.match(/(\d+)\s*币\s*买\s*(\d+)\s*积分\s*\((\d+)\)/);
            
            if (match)
            {
                result.push({
                    tradingCoin: parseInt(match[1]),       // 交易币数量
                    points: parseInt(match[2]),      // 积分
                    ratio: parseInt(match[3])        // 比例
                });
            }
        }
        
        return result;
    }
    
    // 分析数据并导入表格
    const refreshDataAnalysisButton = document.getElementById('refresh-data-analysis-button');
    refreshDataAnalysisButton.addEventListener(
        'click', 
        () => {
            // 数据分析
            var tradingCoinMarketCurrentSale = document.getElementById('trading-coin-market-current-sale');
            var pointsMarketCurrentSale = document.getElementById('points-market-current-sale');

            var resultTradingCoinDataArr = parseTradingCoinMarketCurrentSaleData(tradingCoinMarketCurrentSale);
            var resultPointsDataArr = parsePointsMarketCurrentSaleData(pointsMarketCurrentSale);
            
            darkrp.dataAnalysis.dataAnalysisOverallProcess(resultTradingCoinDataArr, resultPointsDataArr);
            
            // 前端显示
            var dataAnalysisPanel = document.getElementById('data-analysis-table-body');
            var dataAnalysisInnerHTML = '';
            if (darkrp.dataAnalysis.resultsPointsSale.length <= 0)
            {
                dataAnalysisInnerHTML += '空';
            }

            for (var i = 0; i < darkrp.dataAnalysis.resultsPointsSale.length; ++i)
            {
                dataAnalysisInnerHTML += `<tr><td id="rps-${i}">${i}</td>`;

                var contentString = darkrp.dataAnalysis.resultsPointsSale[i].flowName + ' | ';
                contentString += darkrp.dataAnalysis.resultsPointsSale[i].points + ' | ';
                contentString += darkrp.dataAnalysis.resultsPointsSale[i].tradingCoin;
                dataAnalysisInnerHTML += `<td>${contentString}</td>`;

                dataAnalysisInnerHTML += `<td><button class="deleteBtn">❌️</button></td></tr>`;
            }
            for (var i = 0; i < darkrp.dataAnalysis.resultsTradingCoinSale.length; ++i)
            {
                dataAnalysisInnerHTML += `<tr><td id="rtcs-${i}">${i}</td>`;

                var contentString = darkrp.dataAnalysis.resultsTradingCoinSale[i].flowName + ' | ';
                contentString += darkrp.dataAnalysis.resultsTradingCoinSale[i].points + ' | ';
                contentString += darkrp.dataAnalysis.resultsTradingCoinSale[i].tradingCoin;
                dataAnalysisInnerHTML += `<td>${contentString}</td>`;

                dataAnalysisInnerHTML += `<td><button class="deleteBtn">❌️</button></td></tr>`;
            }
            dataAnalysisPanel.innerHTML = dataAnalysisInnerHTML;
        });
        
    const tbody = document.getElementById('data-analysis-table-body');
    // 删除行的函数，并删除对应的数组元素
    tbody.addEventListener('click', function(e)
    {
        // 检查点击的目标是否是带有 .deleteBtn 类的按钮
        if (e.target.classList.contains('deleteBtn'))
        {
            // 找到按钮所在的行 (tr)
            const row = e.target.closest('tr');
            
            // 通过第一列 td 的 id 获取类型和下标 (推荐)
            const firstTd = row.cells[0];
            const cellId = firstTd.id;
            
            // 解析 id 获取类型和下标
            let type = null;
            let index = null;
            
            if (cellId && cellId.includes('-'))
            {
                const parts = cellId.split('-');
                type = parts[0];     // 'rps' 或 'rtcs'
                index = parseInt(parts[1], 10); // 下标数字
            }

            // 删除数组元素
            if (type && index !== null)
            {
                if (type === 'rps')
                {
                    darkrp.dataAnalysis.deletePointsSale(index);
                    console.log('删除 rps 数组元素下标:', index);
                }
                else if (type === 'rtcs')
                {
                    darkrp.dataAnalysis.deleteTradingCoinSale(index);
                    console.log('删除 rtcs 数组元素下标:', index);
                }
            }
            // 删除该行
            row.remove();
        }
    });

    // 导入分析数据到队列中
    const dataAnalysisButton = document.getElementById('data-result-enqueue-button');
    dataAnalysisButton.addEventListener('click', () =>
    {
        if (darkrp.dataAnalysis.resultsPointsSale.length <= 0 || darkrp.dataAnalysis.resultsTradingCoinSale.length <= 0)
        {
            console.log('❌️ 数据数组为空');
            return;
        }
        
        var count = 0;
        for (var i = 0; i < darkrp.dataAnalysis.resultsPointsSale.length; ++i)
        {
            const el = darkrp.dataAnalysis.resultsPointsSale[i];
            if (el == undefined)
            {
                continue;
            }
            darkrp.queue.enqueue(el);
            ++count;
            console.log(`✅ 导入队列：卖积分流程->积分：${el.points}->交易币：${el.tradingCoin}`);
        }
        for (var i = 0; i < darkrp.dataAnalysis.resultsTradingCoinSale.length; ++i)
        {
            const el = darkrp.dataAnalysis.resultsTradingCoinSale[i];
            if (el == undefined)
            {
                continue;
            }
            darkrp.queue.enqueue(el);
            ++count;
            console.log(`✅ 导入队列：卖交易币流程->交易币：${el.tradingCoin}->积分：${el.points}`);
        }
        console.log(`✅ 分析数据导入队列成功，一共 ${count} 条数据`);
    });
})();

