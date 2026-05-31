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

    
    // ... 其他函数
    
    // ========== 暴露接口 ==========
    return {
        登录: 登录,
        离线登录: 离线登录,
        弹窗确定: 弹窗确定,
        积分商城: 积分商城,
        交易市场: 交易市场,
        买交易币: 买交易币,
        卖交易币: 卖交易币,
        卖交易币填入交易币和积分: 卖交易币填入交易币和积分,
        卖交易币提交: 卖交易币提交,
        卖交易币确认上架: 卖交易币确认上架,
        卖交易币填入密码: 卖交易币填入密码,
        卖交易币弹窗提交: 卖交易币弹窗提交,
        卖交易币通知成功弹窗关闭: 卖交易币通知成功弹窗关闭,
        买积分: 买积分,
        卖积分: 卖积分,
        卖积分提交: 卖积分提交,
        卖积分确认上架: 卖积分确认上架,
        卖积分弹窗提交: 卖积分弹窗提交,
        卖积分通知成功弹窗关闭: 卖积分通知成功弹窗关闭
    };
})();