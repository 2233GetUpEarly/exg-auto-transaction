
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
    },

    // 验证码解析
    captchaAnalysis: async function(text)
    {
        const captchaImg = document.querySelector(text);
        if (!captchaImg)
        {
            console.error('[验证码解析] 未找到验证码图片');
            return { success: false, error: '未找到验证码图片', result: null };
        }

        return await ddddocr.recognizeCaptchaByElement(captchaImg);
    },

    /**
     * 在指定元素内添加HTML内容
     * @param {string|HTMLElement} selector - CSS选择器或DOM元素
     * @param {string} html - 要添加的HTML内容
     * @param {string} position - 添加位置：'beforeend'(默认，内部末尾), 'afterbegin'(内部开头), 'beforebegin'(元素之前), 'afterend'(元素之后)
     * @returns {boolean} - 是否添加成功
     */
    appendHTML: function(name, selector, html, debug = true, position = 'beforeend')
    {
        try
        {
            const element = typeof selector === 'string' ? document.querySelector(selector) : selector;
            
            if (!element)
            {
                if (debug == true) console.error(`未找到元素: ${selector}`);
                return false;
            }
            
            element.insertAdjacentHTML(position, html);
            if (debug == true) console.log(`已添加到 ${element.tagName} HTML中，名称为: ${name}`);
            return true;
        }
        catch (error)
        {
            if (debug == true) console.error('添加HTML失败：', error);
            return false;
        }
    },

    togglePanel: function(panelContentID, panelTitleID, openText, closeText)
    {
        var panel = document.getElementById(panelContentID);
        var title = document.getElementById(panelTitleID);

        if (panel.style.display == 'none')
        {
            panel.style.display = 'block';
            title.textContent = openText;
        }
        else
        {
            panel.style.display = 'none';
            title.textContent = closeText;
        }
    },

    openAndWriteDataToFile: async function(filename, data)
    {
        // 获取 OPFS 根目录句柄
        const opfsRoot = await navigator.storage.getDirectory();
        // 获取（或创建）一个名为 filename 的文件句柄
        const fileHandle = await opfsRoot.getFileHandle(filename, { create: true });
        // 创建可写流
        const writable = await fileHandle.createWritable();
        // 写入内容
        await writable.write(data);
        // 关闭流，完成写入
        await writable.close();

        console.log(`写入数据成功，文件 ${filename}，数据长度 ${data.length}`);
    },

    openAndReadDataForFile: async function(filename)
    {
        // 获取 OPFS 根目录句柄
        const opfsRoot = await navigator.storage.getDirectory();
        // 获取（或创建）一个名为 filename 的文件句柄
        const fileHandle = await opfsRoot.getFileHandle(filename);
        const file = await fileHandle.getFile(); // 获取 File 对象
        const content = await file.text();       // 读取文本内容
        console.log(`读取数据成功，文件 ${filename}，数据长度 ${content.length}`);
        return content;
    }
};


