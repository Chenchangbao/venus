// 基础组件部分，一般都需要加载
import angular from 'angular';
import core from './core';
import http from './httpServer/httpServer';
import modal from './modal/modal';

// 功能组件部分，根据需要确认是否加载
// common 自带组件，这些组件包含在dubhe-core核心代码包内
import breadcrumb from './breadcrumb';
import datePicker from './dateRangePicker/dateRangePicker';
import dropdown from './dropdown/dropdown';
import menu from './menu/menu';
import pager from './pager/pager';
import tabs from './tabs/tabs';
import tooltip from './tooltip/tooltip';

// 非常用组件，这些组件是非常用组件，dubhe-core默认不包含这些组件，
// 如需使用，可以通过snpm进行依赖安装
// import contextmenu from 'sn-dubhe-component-contextmenu';
import draggable from '@suning/dubhe-component-draggable';
import echarts from '@suning/dubhe-component-echarts';
// import inputMask from 'sn-dubhe-component-inputMask';
// import markdown from 'sn-dubhe-component-markdown';
// import preview from 'sn-dubhe-component-preview';
// import progress from 'sn-dubhe-component-progress';
// import 'sn-dubhe-component-progress/lib/progress/progress.less';
import step from '@suning/dubhe-component-step';
import '@suning/dubhe-component-step/lib/step/step.less';
import select2 from '@suning/dubhe-component-select2';
// import tree from 'sn-dubhe-component-tree';
// import message from 'sn-dubhe-component-message'
// import alert from 'sn-dubhe-component-alert';

let app = angular.module("sn.dubhe.component", []);

INCLUDE_ALL_MODULES(
    [
        core,
        http,
        modal,

        breadcrumb,
        datePicker,
        dropdown,
        menu,
        pager,
        tabs,
        tooltip,
        // contextmenu,
        draggable,
        // echarts,
        // inputMask,
        // markdown,
        // preview,
        // progress,
        select2,
        step,
        // tree,
        // message,
        // alert
    ],
    app);

export default app;