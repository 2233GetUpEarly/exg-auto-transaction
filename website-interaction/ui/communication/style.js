(function(){

    const style = `

        #eatwi-communication-control-panel
        {
            display: 'inline-block';   
            width: 'fit-content';      
            height: 'auto';            
        }

        #eatwi-communication-log
        {
            height: 120px;
            overflow-y: auto;
            background: #111;
            border: 1px solid #333;
            padding: 4px;
            margin-bottom: 8px;
            white-space: pre-wrap;
            word-break: break-all;
            font-size: 11px;
        }

        #eatwi-communication-header
        {
            padding: 8px 12px;
            background: #1a1a1a;
            cursor: move;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-weight: bold;
        }

        #eatwi-communication-input
        {
            width: 100%;
            box-sizing: border-box;
            background: #222;
            color: #eee;
            border: 1px solid #444;
            border-radius: 4px;
            padding: 4px 6px;
            font-family: inherit;
            font-size: 12px;
            margin-bottom: 6px;
        }

        .eatwi-communication-btn
        {
            background: #333;
            color: #eee;
            border: 1px solid #555;
            border-radius: 4px;
            padding: 4px 10px;
            cursor: pointer;
            font-size: 12px;
            margin-right: 6px;
        }
    `;

    window.eatwi = window.eatwi || {};
    window.eatwi.global = window.eatwi.global || {};
    window.eatwi.global.ui = window.eatwi.global.ui || {};
    window.eatwi.global.ui.communication = window.eatwi.global.ui.communication || {};

    window.eatwi.global.ui.communication.style = style;
})();