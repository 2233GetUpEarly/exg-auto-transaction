(function(){

    const DEBUG = /-dev|-debug|-beta/i.test(GM_info.script.version);

    window.eatwi = window.eatwi || {};
    window.eatwi.DEBUG = DEBUG;
})();