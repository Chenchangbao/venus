import 'jquery/dist/jquery';
import 'babel-polyfill';
import 'angular';
import 'ui-router';

import dubheComponent from "component/snCommon";

import appConfiguration from 'config/config';
import appRouter from 'config/router';
import business from 'business/business';

import {
  permission,
  uiPermission
} from 'angular-permission';

import permissionFn from 'business/permission/permission'

import "business/style/uxc.less";

let app;

if ('test' === ENVIRONMENT) {
  app = angular.module('app', ['ui.router', dubheComponent.name]);
} else {
  app = angular.module('app', ['ui.router', permission, uiPermission, 'ui.router.state.events', 'ngSanitize', 'angularFileUpload', dubheComponent.name]);

  // 如果是工程开发，请使用注释掉的部分。打包production工程时，mock不会生效
  // if(ENVIRONMENT == 'development'){
  //   Mock.mockjax(app);
  // }
  // 本项目为纯粹前端项目，数据直接由mockData.js提供，所以需要mock一直生效
  Mock.mockjax(app);
}

appConfiguration(app);
appRouter(app);
business(app);

app.run(['PermPermissionStore', 'PermRoleStore', '$rootScope', '$q', permissionFn])

// app.run(['$state', '$rootScope',
//   function ($state, $rootScope) {
//   }
// ]);

export default app;