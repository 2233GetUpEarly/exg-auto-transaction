
## exg-auto-transaction

EXG 网页菜单自动出售积分和交易币，根据交易记录统计利润工具

分为两个小工具：

1. 网站交互：通过 Tampermonkey 在原网页显示，用于自动处理出售积分和交易币时输入价格，填密码等步骤。

2. 账本计算：在本地将交易数据输入终端或文件，统计匹配的交易记录并计算积分利润。

## 构建方法 

cmake 版本需要 3.15 或以上：

```bash
mkdir build
cd build
cmake ../
```

make 后生成的重要文件：

```bash
.
├── ledger-calculation
│   └── ledger_calculation
└── website-interaction
    └── website_interaction.js
```

ledger_calculation 可直接运行，website_interaction.js 需要上传到浏览器插件 Tampermonkey 中安装并打开 EXG 网页菜单才可以使用

## 基础使用介绍

ledger_calculation 有两种操作方式：

1. 直接运行，填入数据后输入 EOF 文件结束符，输出包含利润、匹配的记录、未匹配的记录

2. 终端运行加参数 "-f"，会从 input_data.txt 获取输入参数，未匹配记录输出到 overflow.txt，利润与匹配记录输出到 lc_record.txt

website_interaction.js 基本操作：

1. 选择流程能自动跳转或填入数据

2. 填入卖积分或卖交易币参数

3. 直接执行或导入队列一并执行

