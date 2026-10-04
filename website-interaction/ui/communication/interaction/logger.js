(function(){

    // 日志函数
    const logDiv = document.getElementById('eatwi-communication-log');
    const addLog = function(msg, isError = false)
    {
        const logEntry = document.createElement('div');
        logEntry.textContent = `> ${new Date().toLocaleTimeString()} ${msg}`;
        logEntry.style.color = isError ? '#f66' : '#8f8';
        logEntry.style.marginBottom = '4px';
        logEntry.style.fontSize = eatwi.global.ui.isMobile ? '12px' : '11px';
        logDiv.appendChild(logEntry);
        logDiv.scrollTop = logDiv.scrollHeight;
        if (eatwi.DEBUG)
        {
            console.log(msg);
        }
    }

    window.eatwi.global.ui.communication = window.eatwi.global.ui.communication || {};
    window.eatwi.global.ui.communication.addLog = addLog;
})();