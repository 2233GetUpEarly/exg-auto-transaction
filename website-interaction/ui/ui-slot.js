/* ui-slot.js
 * 通用插槽 UI 框架
 *
 * 功能：
 *  - 统一的悬浮按钮 + 面板
 *  - 每个模块通过 register({ id, title, icon, mount }) 注册一个标签页
 *  - 面板自动根据注册的模块生成标签栏和内容区
 *  - 面板样式统一，模块只管在自己的容器里画 UI
 */

(function() {

    class UISlot
    {
        constructor(lazyLoading, panelID, buttonID, textContent, panelStyle, buttonStyle, tabBarStyle)
        {
            this.#lazyLoading = lazyLoading;
            this.#panelID = panelID;
            this.#buttonID = buttonID;

            /* ============================================================
            * 创建按钮和面板骨架
            * ============================================================ */
            // 悬浮按钮
            this.#button = document.createElement('div');
            this.#button.id = this.#buttonID;
            this.setButton(textContent, buttonStyle);
            this.#button.onclick = () => this.toggle();
            document.body.appendChild(this.#button);

            // 面板
            this.#panel = document.createElement('div');
            this.setPanel(panelStyle)
            this.#panel.id = this.#panelID;

            // 标签栏
            this.#tabBar = document.createElement('div');
            this.setTabBar(tabBarStyle)
            this.#panel.appendChild(this.#tabBar);

            // 内容区
            this.#pageContainer = document.createElement('div');
            this.#panel.appendChild(this.#pageContainer);

            document.body.appendChild(this.#panel);
        }

        setTabBar(style)
        {
            Object.assign(this.#tabBar.style, style);
        }

        setButton(textContent, style)
        {
            this.#button.textContent = textContent;
            Object.assign(this.#button.style, style);
        }

        setPanel(style)
        {
            Object.assign(this.#panel.style, style);
        }

        register(mod)
        {
            if (!mod || !mod.id || !mod.style || typeof mod.mount !== 'function')
            {
                if (eatwi.DEBUG)
                {
                    console.warn('[UISlot] register 参数不合法:', mod);
                }
                return;
            }

            // 标签按钮
            const tabBtn = document.createElement('button');
            tabBtn.textContent = (mod.icon || '') + ' ' + (mod.title || mod.id);
            Object.assign(tabBtn.style, mod.style);

            // 页面容器
            const pageEl = document.createElement('div');
            pageEl.style.display = 'none';

            tabBtn.onclick = () => this.activate(mod.id);

            this.#tabBar.appendChild(tabBtn);
            this.#pageContainer.appendChild(pageEl);

            const entry = {
                id: mod.id,
                title: mod.title || mod.id,
                icon: mod.icon || '',
                mount: mod.mount,
                style: mod.style,
                container: pageEl,
                tabBtn: tabBtn,
                pageEl: pageEl,
                mounted: this.#lazyLoading
            };
            this.#modules.push(entry);
            if (this.#lazyLoading === false)
            {
                mod.mount(pageEl);
            }

            // 默认激活第一个
            if (!this.#activeId) this.activate(mod.id);

            return entry;
        }

        /* ============================================================
        * 激活某个标签
        * ============================================================ */
        activate(id)
        {
            const target = this.#modules.find(function (m) { return m.id === id; });
            if (!target) return;

            this.#activeId = id;

            this.#modules.forEach(function (m)
            {
                const active = (m.id === id);
                m.pageEl.style.display = active ? 'block' : 'none';
                m.tabBtn.style.background = active
                    ? 'linear-gradient(135deg,#667eea,#764ba2)'
                    : 'rgba(255,255,255,.12)';
                m.tabBtn.style.fontWeight = active ? 'bold' : 'normal';
            });

            // 懒挂载
            if (!target.mounted)
            {
                try
                {
                    target.mount(target.container);
                    target.mounted = true;
                }
                catch (e)
                {
                    if (eatwi.DEBUG)
                    {
                        console.error('[UISlot] mount 出错:', e);
                    }
                    target.container.innerHTML =
                        '<div style="color:#f88;font-size:12px;">模块加载失败: ' + e.message + '</div>';
                }
            }
        }

        /* ============================================================
        * 开关
        * ============================================================ */
        open()
        {
            this.#panel.style.display = 'block';
        }

        close()
        {
            if (this.#panel)
            {
                this.#panel.style.display = 'none';
            }
        }

        toggle()
        {
            if (this.#panel)
            {
                const hidden = (this.#panel.style.display === 'none' || this.#panel.style.display === '');
                this.#panel.style.display = hidden ? 'block' : 'none';
            }
        }

        getModules()
        { 
            return this.#modules.slice();
        }

        #button = null;
        #panel = null;
        #tabBar = null;
        #pageContainer = null;
        #activeId = null;

        #buttonID = null;
        #panelID = null;
        #lazyLoading = true;

        #modules = [];
    }

    window.eatwi = window.eatwi || {};
    window.eatwi.UISlot = UISlot;
})();