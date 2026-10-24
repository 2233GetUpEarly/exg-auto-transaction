(function(){

    const { UISlot } = window.eatwi;
    
    const uiSlotPanelID = 'eatwi-ui-slot-panel';
    const uiSlotButtonID = 'eatwi-ui-slot-button';

    // 面板样式
    const panelStyle = {
        position: 'fixed',
        right: '20px',
        bottom: '90px',
        width: '700px',
        maxHeight: '80vh',
        display: 'flex',
        background: 'rgba(24, 26, 42, 0.96)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '14px',
        boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
        backdropFilter: 'blur(10px)',
        zIndex: 999999,
        flexDirection: 'column',
    };

    // 悬浮按钮样式
    const buttonStyle = {
        position: 'fixed',
        right: '20px',
        bottom: '20px',
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg,#667eea,#764ba2)',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '22px',
        cursor: 'pointer',
        userSelect: 'none',
        boxShadow: '0 6px 20px rgba(102,126,234,0.45)',
        transition: 'transform .15s ease, box-shadow .15s ease',
        zIndex: 999999,
    };

    // 标签栏样式
    const tabBarStyle = {
        display: 'flex',
        gap: '6px',
        padding: '10px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        flexShrink: '0',
    };

    window.eatwi.global.uiSlot = new UISlot(
        false,
        uiSlotPanelID, 
        uiSlotButtonID, 
        '⚙️', 
        panelStyle, 
        buttonStyle, 
        tabBarStyle
    );

})();