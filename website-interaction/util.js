
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
    },

    sleepMillisecondAndIntervalDisplay: async function(millisecond, interval, isInSeconds = true)
    {
        let unitString = " ms";
        let unit = 1;
        if (isInSeconds == true)
        {
            unit = 1000;
            unitString = " s";
        }

        let sumTime = 0;
        const line = millisecond / interval;
        for (let i = 0; i < line; ++i)
        {
            await this.sleepMillisecond(interval);
            sumTime += interval;
            console.log("⏰️总休眠：" + millisecond / unit + unitString + "，已休眠：" + sumTime / unit + unitString);
        }
        console.log("⏰️休眠完毕");
    },

    randomRangeInteger: function(min, max)
    {
        return Math.floor(Math.random() * (max - min + 1) + min);
    },

    stepPause: async function(minMillisecond, maxMillisecond, notificationCount)
    {
        const random = this.randomRangeInteger(minMillisecond, maxMillisecond);
        const interval = random / notificationCount;
        await this.sleepMillisecondAndIntervalDisplay(random, interval);
    },

    findAndFill: function(text, value)
    {
        var tempInput;
        try
        {
            tempInput = document.querySelector(text);
        }
        catch(e)
        {
            return false;
        }
        if (tempInput == null)
        {
            return false;
        }

        var tempSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
        if (tempSetter == null)
        {
            return false;
        }

        tempSetter.call(tempInput, value);
        tempInput.dispatchEvent(new Event("input", { bubbles: true }));
        return true;
    }
};


