(function(){

    const style = `

        #darkrp-control-panel
        {
            display: block;
            width: 100%;
            height: auto;
        }

        #dp-main-container
        {
            position: relative;
            width: 100%;
            max-width: 100%;
            max-height: 70vh;
            min-width: 0;
            min-height: 0;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            background: #1e1e2f;
        }

        #dp-resize-handle
        {
            position: absolute;
            bottom: 0;
            right: 0;
            width: 20px;
            height: 20px;
            cursor: nw-resize;
            background: linear-gradient(135deg, transparent 50%, #5a5a7a 50%);
            border-bottom-right-radius: ${eatwi.global.ui.isMobile ? '16px' : '12px'};
            z-index: 10;
        }

        #dp-title-bar
        {
            background: #2a2a3a;
            color: #fff;
            padding: ${eatwi.global.ui.isMobile ? '14px 16px' : '10px 12px'};
            border-radius: ${eatwi.global.ui.isMobile ? '16px 16px 0 0' : '12px 12px 0 0'};
            display: flex;
            justify-content: space-between;
            align-items: center;
            touch-action: ${eatwi.global.ui.isMobile ? 'none' : 'auto'};
            ${eatwi.global.ui.isMobile ? 'min-height: 48px;' : ''}
            flex-shrink: 0;
        }

        #dp-minimize
        {
            background: none;
            border: none;
            color: #fff;
            cursor: pointer;
            font-size: ${eatwi.global.ui.isMobile ? '20px' : '16px'};
            padding: ${eatwi.global.ui.isMobile ? '8px 12px' : '4px 8px'};
            touch-action: manipulation;
        }

        #dp-close
        {
            background: none;
            border: none;
            color: #fff;
            cursor: pointer;
            font-size: ${eatwi.global.ui.isMobile ? '20px' : '16px'};
            padding: ${eatwi.global.ui.isMobile ? '8px 12px' : '4px 8px'};
            touch-action: manipulation;
        }

        #dp-content
        {
            padding: ${eatwi.global.ui.isMobile ? '14px' : '12px'}; 
            background: #2d2d3a; 
            overflow-y: auto;
            flex: 1;
        }

        #dp-log
        {
            background: #1e1e2f;
            height: ${eatwi.global.ui.isMobile ? '150px' : '120px'};
            overflow-y: auto;
            padding: ${eatwi.global.ui.isMobile ? '10px' : '8px'};
            border-radius: ${eatwi.global.ui.isMobile ? '10px' : '6px'};
            font-size: ${eatwi.global.ui.isMobile ? '12px' : '11px'};
            color: #0f0;
            font-family: 'Courier New', monospace;
            word-break: break-all;
            white-space: pre-wrap;
            padding: 10 10 10 10;
        }

        #dp-flow-select
        {
            width: 100%;
            padding: ${eatwi.global.ui.isMobile ? '12px' : '8px'};
            background: #1e1e2f;
            color: #fff;
            border: 1px solid #3a3a4a;
            border-radius: ${eatwi.global.ui.isMobile ? '10px' : '6px'};
            font-family: inherit;
            font-size: ${eatwi.global.ui.isMobile ? '16px' : '13px'};
            touch-action: manipulation;
        }

        #dp-run
        {
            flex: 1;
            padding: ${eatwi.global.ui.isMobile ? '12px' : '8px'};
            background: #4caf50;
            color: white;
            border: none;
            border-radius: ${eatwi.global.ui.isMobile ? '10px' : '6px'};
            cursor: pointer;
            font-family: inherit;
            font-size: ${eatwi.global.ui.isMobile ? '16px' : '13px'};
            font-weight: 500;
            touch-action: manipulation;
        }

        #dp-enqueue
        {
            flex: 1;
            padding: ${eatwi.global.ui.isMobile ? '12px' : '8px'};
            background: #2196f3;
            color: white;
            border: none;
            border-radius: ${eatwi.global.ui.isMobile ? '10px' : '6px'};
            cursor: pointer;
            font-family: inherit;
            font-size: ${eatwi.global.ui.isMobile ? '16px' : '13px'};
            font-weight: 500;
            touch-action: manipulation;
        }

        #dp-queue
        {
            flex: 1;
            padding: ${eatwi.global.ui.isMobile ? '12px' : '8px'};
            background: #ff3700;
            color: white;
            border: none;
            border-radius: ${eatwi.global.ui.isMobile ? '10px' : '6px'};
            cursor: pointer;
            font-family: inherit;
            font-size: ${eatwi.global.ui.isMobile ? '16px' : '13px'};
            font-weight: 500;
            touch-action: manipulation;
        }

        #dp-data-analysis-panel
        {
            margin-bottom: ${eatwi.global.ui.isMobile ? '16px' : '12px'};
            background: #252530;
            border-radius: ${eatwi.global.ui.isMobile ? '10px' : '8px'};
            padding: ${eatwi.global.ui.isMobile ? '12px' : '10px'};
            border-left: 3px solid #ff9800;
            display: flex; 
            flex-wrap: wrap;
        }

        #title-data-analysis-panel
        {
            width: 50%;
            cursor: pointer;
            background-color: #2d2d3a;
            color: #ff9800;
            font-size: ${eatwi.global.ui.isMobile ? '13px' : '12px'};
            margin-bottom: 10px;
            font-weight: 500;
        }

        #dp-queue-panel
        {
            margin-bottom: ${eatwi.global.ui.isMobile ? '16px' : '12px'};
            background: #252530;
            border-radius: ${eatwi.global.ui.isMobile ? '10px' : '8px'};
            padding: ${eatwi.global.ui.isMobile ? '12px' : '10px'};
            border-left: 3px solid #ff9800;
            display: flex; 
            flex-wrap: wrap;
        }

        #title-queue-panel
        {
            width: 50%;
            cursor: pointer;
            background-color: #2d2d3a;
            color: #ff9800;
            font-size: ${eatwi.global.ui.isMobile ? '13px' : '12px'};
            margin-bottom: 10px;
            font-weight: 500;
        }

        #dp-trading-params
        {
            margin-bottom: ${eatwi.global.ui.isMobile ? '16px' : '12px'};
            background: #252530;
            border-radius: ${eatwi.global.ui.isMobile ? '10px' : '8px'};
            padding: ${eatwi.global.ui.isMobile ? '12px' : '10px'};
            border-left: 3px solid #ff9800;
        }

        #title-input-trading-panel
        {
            cursor: pointer;
            background-color: #2d2d3a;
            color: #ff9800;
            font-size: ${eatwi.global.ui.isMobile ? '13px' : '12px'};
            margin-bottom: 10px;
            font-weight: 500;
        }

        #dp-trading-coin
        {
            width: 100%;
            padding: ${eatwi.global.ui.isMobile ? '12px' : '8px'};
            background: #1e1e2f;
            color: #fff;
            border: 1px solid #3a3a4a;
            border-radius: ${eatwi.global.ui.isMobile ? '8px' : '4px'};
            font-family: inherit;
            font-size: ${eatwi.global.ui.isMobile ? '14px' : '12px'};
            touch-action: manipulation;
            box-sizing: border-box;
        }

        #dp-points-price
        {
            width: 100%;
            padding: ${eatwi.global.ui.isMobile ? '12px' : '8px'};
            background: #1e1e2f;
            color: #fff;
            border: 1px solid #3a3a4a;
            border-radius: ${eatwi.global.ui.isMobile ? '8px' : '4px'};
            font-family: inherit;
            font-size: ${eatwi.global.ui.isMobile ? '14px' : '12px'};
            touch-action: manipulation;
            box-sizing: border-box;
        }

        #enqueue-input-trading
        {
            flex: 1;
            background: #ff3700;
            padding: 4px 4px; 
            color: white;
            border: none;
            border-radius: ${eatwi.global.ui.isMobile ? '10px' : '6px'};
            cursor: pointer;
            font-family: inherit;
            font-size: ${eatwi.global.ui.isMobile ? '16px' : '13px'};
            font-weight: 500;
            touch-action: manipulation;
        }

        #dp-trading-coin-market
        {
            margin-bottom: ${eatwi.global.ui.isMobile ? '16px' : '12px'};
            background: #252530;
            border-radius: ${eatwi.global.ui.isMobile ? '10px' : '8px'};
            padding: ${eatwi.global.ui.isMobile ? '12px' : '10px'};
            border-left: 3px solid #ff9800;
        }

        #title-trading-coin-market-panel
        {
            cursor: pointer;
            background-color: #2d2d3a;
            color: #ff9800;
            font-size: ${eatwi.global.ui.isMobile ? '13px' : '12px'};
            margin-bottom: 10px;
            font-weight: 500;
        }

        #dp-points-params
        {
            margin-bottom: ${eatwi.global.ui.isMobile ? '16px' : '12px'};
            background: #252530;
            border-radius: ${eatwi.global.ui.isMobile ? '10px' : '8px'};
            padding: ${eatwi.global.ui.isMobile ? '12px' : '10px'};
            border-left: 3px solid #4caf50;
        }

        #title-input-points-panel
        {
            cursor: pointer;
            background-color: #2d2d3a;
            color: #4caf50;
            font-size: ${eatwi.global.ui.isMobile ? '13px' : '12px'};
            margin-bottom: 10px;
            font-weight: 500;
        }

        #dp-points-amount
        {
            width: 100%;
            padding: ${eatwi.global.ui.isMobile ? '12px' : '8px'};
            background: #1e1e2f;
            color: #fff;
            border: 1px solid #3a3a4a;
            border-radius: ${eatwi.global.ui.isMobile ? '8px' : '4px'};
            font-family: inherit;
            font-size: ${eatwi.global.ui.isMobile ? '14px' : '12px'};
            touch-action: manipulation;
            box-sizing: border-box;
        }

        #dp-tradingcoin-price
        {
            width: 100%;
            padding: ${eatwi.global.ui.isMobile ? '12px' : '8px'};
            background: #1e1e2f;
            color: #fff;
            border: 1px solid #3a3a4a;
            border-radius: ${eatwi.global.ui.isMobile ? '8px' : '4px'};
            font-family: inherit;
            font-size: ${eatwi.global.ui.isMobile ? '14px' : '12px'};
            touch-action: manipulation;
            box-sizing: border-box;
        }

        #enqueue-input-points
        {
            flex: 1;
            background: #ff3700;
            padding: 4px 4px; 
            color: white;
            border: none;
            border-radius: ${eatwi.global.ui.isMobile ? '10px' : '6px'};
            cursor: pointer;
            font-family: inherit;
            font-size: ${eatwi.global.ui.isMobile ? '16px' : '13px'};
            font-weight: 500;
            touch-action: manipulation;
        }

        #dp-points-market
        {
            margin-bottom: ${eatwi.global.ui.isMobile ? '16px' : '12px'};
            background: #252530;
            border-radius: ${eatwi.global.ui.isMobile ? '10px' : '8px'};
            padding: ${eatwi.global.ui.isMobile ? '12px' : '10px'};
            border-left: 3px solid #4caf50;
        }

        #title-points-market-panel
        {
            cursor: pointer;
            background-color: #2d2d3a;
            color: #4caf50;
            font-size: ${eatwi.global.ui.isMobile ? '13px' : '12px'};
            margin-bottom: 10px;
            font-weight: 500;
        }

        #title-step-buttons
        {
            cursor: pointer;
            color: #aaa;
            font-size: ${eatwi.global.ui.isMobile ? '12px' : '11px'};
            margin-bottom: 8px;
        }

        #dp-step-buttons
        {
            display: none;
            flex-wrap: wrap;
            gap: ${eatwi.global.ui.isMobile ? '8px' : '6px'};
            max-height: ${eatwi.global.ui.isMobile ? '160px' : 'none'};
            overflow-y: ${eatwi.global.ui.isMobile ? 'auto' : 'visible'};
        }

        #refresh-queue-button
        {
            cursor: pointer;
            flex: 1;
            background: #ff3700;
            color: white;
            border: none;
            border-radius: ${eatwi.global.ui.isMobile ? '10px' : '6px'};
            font-size: ${eatwi.global.ui.isMobile ? '16px' : '13px'};
        }
    `;

    window.eatwi = window.eatwi || {};
    window.eatwi.global = window.eatwi.global || {};
    window.eatwi.global.ui = window.eatwi.global.ui || {};
    window.eatwi.global.ui.style = style;
})();