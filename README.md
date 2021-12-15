# low code / no code 低代码或零代码平台

`只完成解析json scheme逻辑`

## 已全部重构，迁移至[luban](https://github.com/HiWayne/luban)

## 为什么要重构？

1. 项目用js编写，随着项目越来越复杂，缺少类型系统导致越来越不方便维护，也无法避免一些简单错误

2. 原来的设计采用：输入一颗树，从其中的namespace等信息推断出state和model的嵌套、依赖关系，从而建立3颗树（具体可看[注释](https://github.com/HiWayne/shekina/blob/master/src/core/compile/index.js)）。这样的设计可能会导致配置界面操作上的不清晰或者逻辑复杂，也让解析json的逻辑非常复杂耦合。新方案改为直接在输入解析核心前（即在配置平台）就是3颗树：视图树`vdomTree`、模型树`modelTree`、状态树`stateTree`

3. 项目分为解析核心、配置平台两个子项目更为合理，所以采用lerna为基础的monorepo，将它们分包为core、creation

4. 代码重新design，有了初步经历得以对旧的设计重新规整。对一些复杂配置的解析，比如api、pagination，使用自定义hooks对逻辑进行封装，将来其他组件扩展配置可以直接复用。

5. 需要增加组件分级，某些组件完整版的功能配置太过复杂，在复杂组件的基础上简化出『开箱即用』的简单组件更便于没有开发经验的人员使用或快速搭建，但缺点是简单组件定制性不如高级组件，尽管如此，分级依然是不可或缺的。
