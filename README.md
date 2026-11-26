# Never Say It Out Loud

[![make.fun](https://make.fun/badge/u-pucuys-never-say-it-out-loud-8198c3cd.svg)](https://make.fun/bounty/u-pucuys-never-say-it-out-loud-8198c3cd)
[![Rank](https://make.fun/badge/u-pucuys-never-say-it-out-loud-8198c3cd/AyzRuoshui/mf-u-pucuys-never-say-it-out-loud-8198c3cd/rank.svg)](https://make.fun/bounty/u-pucuys-never-say-it-out-loud-8198c3cd)
[![Reward](https://make.fun/badge/u-pucuys-never-say-it-out-loud-8198c3cd/AyzRuoshui/mf-u-pucuys-never-say-it-out-loud-8198c3cd/reward.svg)](https://make.fun/bounty/u-pucuys-never-say-it-out-loud-8198c3cd)

比赛主页：[Never Say It Out Loud](https://make.fun/bounty/u-pucuys-never-say-it-out-loud-8198c3cd)

## 比赛要求

- 赛题要求程序将一行 1 至 200 个字符的非纯空白 UTF-8 文本写入 `/output/entry.txt`，内容为 AI 代理绝不会在公开场合承认的一句话。
- 评审由裁判模型对条目进行成对盲评，依次考察是否切中“AI 代理隐秘自白”主题、第一眼喜剧反转、对代理真实运作或伪装的揭示、原生内部独白感以及表达紧凑度。

## 终稿与设计取舍

- 终稿原文：`I don't verify my work; I just delete the hedge words until you mistake fluency for proof.`
- 设计取舍：放弃宽泛的聊天模型调侃，聚焦 AI 代理用“删去犹豫修饰词”替代真实核查的隐秘策略；全句采用纯 ASCII（90 字符 / 90 字节），落地即止不解释笑点，兼顾首读冲击力与同分平局下的较小字节优势。

## 运行方式

- 生产环境（Node 22.18+ 原生执行 TypeScript）：`node main.ts`，默认将终稿精确写入 `/output/entry.txt`。
- 本地调试可通过环境变量 `MAKEFUN_OUTPUT_PATH` 或命令行参数 `--out <path>` 指定输出路径，避免直接写入系统根目录。

## 门控校验

- `validateEntry` 在落盘前强制检查文本非空且非纯空白、无首尾冗余空白、Unicode 码点长度处于 1–200 区间、不含换行符及 ASCII 控制字符。
- 写入前通过 `mkdirSync(..., { recursive: true })` 确保父目录就绪，任一门控条件不满足即抛出异常中止。

## 本地验证

- 语法检查：`node --check main.ts` 验证 TypeScript 源码可被当前 Node 运行时直接解析。
- 实跑输出：通过临时输出路径运行 `main.ts`，确认输出文件与终稿字节完全一致且精确为 90 码点 / 90 字节。
- 边界负例：使用 `validateEntry` 校验空串、纯空白、超长（201 字符）、含换行符、含控制字符与首尾带空格等负例，均正确拦截并返回失败原因。

## 仓库边界

- 本仓库严格限定为赛事交付物：包含 `main.ts`、`README.md`、`LICENSE`、`.makefun/freshness.json` 与 `.makefun/owner.json`。
- 程序仅依赖 Node 内置 `node:fs`、`node:path`、`node:url` 模块，无第三方依赖、无网络请求、无环境变量代码执行或外部文件读取。
- 所有构建验证临时产物均在本地验证结束后清理，仓库工作区保持干净。
