

1. 返回查找到的DOM树中字符串选择器的元素：`document.querySelector(selector)`

2. 对元素的 position 位置插入 HTML 内容：`insertAdjacentHTML(position, html)`

3. 获取唯一 ID 的元素：`document.getElementById('id名')`

4. 找到 HTML 中的元素的常用方法：

> | 方法 | 示例 | 说明 |
> | --- | --- | --- |
> | getElementById | document.getElementById('id名') | 最常用，ID唯一 |
> | querySelector | document.querySelector('.类名') | 灵活，用CSS选择器 |
> | getElementsByClassName | document.getElementsByClassName('类名')[0] | 返回数组，取第一个 |
> | querySelectorAll | document.querySelectorAll('div') | 返回所有匹配的 |

5. 找到元素后修改元素的文本内容：`element.textContent = '填入新内容'`

6. 为DOM元素绑定事件监听器，当元素触发事件执行指定的函数：`元素.addEventListener('事件类型', 指定的函数)`

7. 指向当前绑定事件的那个元素：`event.currentTarget`

8. 控制元素的显示/隐藏状态：`panel.style.display`

> 常用的值：
> 
> | 值 | 效果 |
> | --- | --- |
> | 'block' | 显示元素（恢复原来的块级样式） |
> | 'none' | 隐藏元素（从页面上消失，不占空间） |
> | 'inline' | 显示为内联元素 |
> | 'flex' | 显示为弹性盒子 |

9. 元素的成员 `innerHTML` 和 `textContent` 的核心区别：

> innerHTML → 内部有 HTML（解析标签）
>
> textContent → 只有 文本 内容（不解析）
> 
> 选择建议：
> 
> 只是改文字 → textContent（更快、更安全）
>
> 需要插入 HTML 标签 → innerHTML（注意防 XSS）

10. A 函数作为参数传入 B 函数，并固定 A 函数自己传入的参数的方法：

> | 方法 | 性能 | 推荐场景 |
> | --- | --- | --- |
> | 箭头函数 | ✅ 好 | 大多数情况 |
> | bind() | ✅ 好 | 需要固定 this 或参数 |
> | 高阶函数 | ✅ 好 | 需要预配置参数 |

11. 对字符串数据字符替换使用 replace 和 replaceAll 函数进行替换。

12. 将字符串按照指定的分隔符拆分成一个数组使用 split 函数。


