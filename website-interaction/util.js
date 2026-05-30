
// 如果已存在 window.darkrp 就保留，不存在就创建其空对象
window.darkrp = window.darkrp || {};

// 这里的 = 意思是对 window.darkrp 继续加一个属性 util（若 util 在此之前存在，这里就会覆盖）
window.darkrp.util = {

    // 休眠函数（毫秒）
    sleepMillisecond: async function(millisecond)
    {
        return new Promise(function(resolve) { setTimeout(resolve, millisecond); });
    },

    // 查找并点击
    findAndClick: function(text)
    {
        let el = document.querySelector(text);
        if (el == null)
        {
            return false;
        }

        el.click();
        return true;
    },

    selectAndFindToClick: function(parentSelector, text)
    {
        var el = document.querySelectorAll(parentSelector);
        for (var i = 0; i < el.length; ++i)
        {
            if (el[i].innerText.trim() === text)
            {
                el[i].click();
                return true;
            }
        }
        return false;
    }
};


