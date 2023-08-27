## 前端工程化

### 1. TypeScript 工程化开发

- 前端工程化就是通过流程规范化、标准化提升团队协作效率
- 通过组件化、模块化提升代码质量
- 使用构建工具、自动化工具提升开发效率
- 编译 => 打包(合并) => 压缩 => 代码检查 => 测试 => 持续集成

### 2.初始化项目

```js
mkdir react-self
cd react-self
npm init
package name: (react-self)
version: (1.0.0)
description: TypeScript工程化开发
entry point: (index.js)
test command:
git repository: https://github.com/shdulu/react-self
keywords: typescript,react
author: shdulu
license: (ISC) MIT
```

### 3.git 规范和 changelog

#### 3.1 良好的 git commit 好处

可以加快 code review 的流程
可以根据 git commit 的元数据生成 changelog
可以让其它开发者知道修改的原因

#### 3.2 良好的 commit

- commitizen 是一个格式化 commit message 的工具
- validate-commit-msg 用于检查项目的 Commit message 是否符合格式
- conventional-changelog-cli 可以从 git metadata 生成变更日志
- 统一团队的 git commit 标准
- 可以使用 angular 的 git commit 日志作为基本规范
  - 提交的类型限制为 feat、fix、docs、style、refactor、perf、test、chore、revert 等
  - 提交信息分为两部分，标题(首字母不大写，末尾不要加标点)、主体内容(描述修改内容)
- 日志提交友好的类型选择提示 使用 commitize 工具
- 不符合要求格式的日志拒绝提交 的保障机制
  - 需要使用 validate-commit-msg 工具
- 统一 changelog 文档信息生成
  - 使用 conventional-changelog-cli 工具

```js
cnpm i commitizen  validate-commit-msg conventional-changelog-cli -D
commitizen init cz-conventional-changelog --save --save-exact
git cz
```

#### 3.3 .gitignore

```js
node_modules.vscode;
dist;
```

#### 3.4 提交的格式

```js
<type>(<scope>):<subject/>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

- 代表某次提交的类型，比如是修复 bug 还是增加 feature
- 表示作用域，比如一个页面或一个组件
- 主题 ，概述本次提交的内容
- 详细的影响内容
- 修复的 bug 和 issue 链接

| 类型     | 含义                                                  |
| -------- | ----------------------------------------------------- |
| feat     | 新增 feature                                          |
| fix      | 修复 bug                                              |
| docs     | 仅仅修改了文档，比如 README、CHANGELOG、CONTRIBUTE 等 |
| style    | 仅仅修改了空格、格式缩进、偏好等信息，不改变代码逻辑  |
| refactor | 代码重构，没有新增功能或修复 bug                      |
| perf     | 优化相关，提升了性能和体验                            |
| test     | 测试用例，包括单元测试和集成测试                      |
| chore    | 改变构建流程，或者添加了依赖库和工具                  |
| revert   | 回滚到上一个版本                                      |
| ci CI    | 配置，脚本文件等更新                                  |

#### 3.4 husky

- validate-commit-msg 可以来检查我们的 commit 规范
- husky 可以把 validate-commit-msg 作为一个 githook 来验证提交消息

`cnpm i husky  validate-commit-msg --save-dev`

```js
 "husky": {
    "hooks": {
      "commit-msg": "validate-commit-msg"
    }
  }
```

#### 3.5 生成 CHANGELOG.md

- conventional-changelog-cli 默认推荐的 commit 标准是来自 angular 项目
- 参数-i CHANGELOG.md 表示从 CHANGELOG.md 读取 changelog
- 参数 -s 表示读写 CHANGELOG.md 为同一文件
- 参数 -r 表示生成 changelog 所需要使用的 release 版本数量，默认为 1，全部则是 0

`cnpm i conventional-changelog-cli -D`

```js
"scripts": {
    "changelogs": "conventional-changelog -p angular -i CHANGELOG.md -s -r 0"
}
```
