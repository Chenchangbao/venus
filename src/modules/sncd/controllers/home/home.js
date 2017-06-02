angular.module('sncd').controller('HomeCtrl', ['$scope', 'HomeService', 'VersionManageService', '$state', '$stateParams', '$interval', 'SystemService','DialogService','QuaService','$timeout',
    function ($scope, HomeService, VersionManageService, $state, $stateParams, $interval, SystemService, DialogService,QuaService,$timeout) {
        'use strict';

        var vm = $scope;
        var formData = $scope.formData = {},
            pager = vm.pager = {
                pageNumber: 1,
                totalCount: 0, //总条数
                pageSize: 5
            },
            //版本的所有状态
            statusList = vm.statusList = [
                { code: '', name: '全部' },
                { 'code': "059", 'name': "开发中" },
                { 'code': "060", 'name': "已封版" },
                //    		{'code': "063", 'name': "已合并"},
                //    		{'code': "178", 'name': "已废弃"},
                //    		{'code': "061", 'name': "PRE封版"},
                //    		{'code': "062", 'name': "PRD封版"},
                { code: "0591", name: '测试中' }
            ];
        vm.noticestyle = {
            "top": 15,
            "-webkit-transition": "1s",
            "-moz-transition": "1s",
            "transition": "1s"
        };
        vm.closeflag = false;
        var noticestyle = vm.noticestyle;
        var noticeLength = 0,
            num = 0;
        // var myChart1 = echarts.init(document.getElementById('pie1'));
        // var myChart2 = echarts.init(document.getElementById('pie2'));
        /////////////functions///////////////
        vm.showLog = function () {
            console.log("加载中。。。");
        }
        // 获取当前n个月
        function getDates(n) {

            formData.dates = [];

            /* for(var i = n - 1; i >= 0; i--){
                 var preDate = new Date((new Date()).getFullYear(), (new Date()).getMonth()-i);
                 formData.dates.push('' + preDate.getFullYear() + '年' + (preDate.getMonth() + 1) + '月');
             }*/
            for (var i = n - 1; i >= 0; i--) {
                var preDate = new Date((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate() - i);
                formData.dates.push('' + preDate.getFullYear() + '年' + (preDate.getMonth() + 1) + '月' + (preDate.getDate()) + '日');
            }

            return formData.dates;
        }

        function init() {

            $scope.selectedTab = 1;
            $scope.noData = false;
            $scope.noDynamic = false;
            //获取质量趋势
            qualityTrend();
            getNotifyLast();
            var params = {
                pageNumber: $scope.pager.pageNumber,
                pageSize: $scope.pager.pageSize
            };
            formData.selectedStatus = statusList[0];
            queryMyVersion($scope.pager.pageNumber);
            //获取系统权限
            // SystemService.hasPermissionMap({ sysId: '' }).then(function (result) {
            //     vm.hasPermissionMap = result.hasPermissionMap;//授权map
            // });
            //定时公告滑动
            changeNotice();
            //获取用户信息
            //getCustomerInfo(params);
            //获取关注系统
            //getSysBranchInfo(params);
            //获取我的动态
            getMyDynamicState();
            //阻碍原因
            getBlockerReason();
            //严重原因
            //getCriticalReason();


            //获取系统权限
            // SystemService.hasPermissionMap({ sysId: '' }).then(function (result) {
            //     $scope.hasPermissionMap = result.hasPermissionMap;//授权map
            // });

        }
        //轮播公告
        function changeNotice() {
            var timer = $interval(function () {
                if (num >= noticeLength) {
                    num = 0;
                }
                var newvalue = noticestyle.top - 40 * num;
                var newStyle = newvalue + "px";
                vm.noticestyle = {
                    "top": newStyle,
                    "-webkit-transition": "0.5s",
                    "-moz-transition": "0.5s",
                    "transition": "0.5s"
                };
                num++;
            }, 5000);
        }

        vm.close = function () {
            vm.closeflag = true;
        }

        function getNotifyLast() {
            HomeService.getNotifyLast().then(function (result) {
                console.log(result);
                vm.noticelist = result.notifyInfoBos;
                //vm.noticelist = ["1111111111","2222222222","3333333333"];
                noticeLength = vm.noticelist.length;
            });
        }

        // myChart1.on('click', function (params) {
        //     aler("hehe");
        // });



        function qualityTrend() {

            HomeService.getStatistics().then(function (result) {
                if (!result.systemNum) {
                    vm.nochart = true;
                    vm.processing = 0;
                    vm.waiting = 0;
                    vm.testing = 0;
                    vm.closed = 0;
                    vm.developing = 0;
                    vm.systemNum = 0;
                    vm.versionInuseNum = 0;
                    vm.option = {
                        series: [
                            {
                                type: 'pie',
                                radius: [40, 80],
                                center: [160, 150],
                                avoidLabelOverlap: false,
                                label: {
                                    normal: {
                                        show: false,
                                        position: 'center'
                                    },
                                    emphasis: {
                                        show: true,
                                        textStyle: {
                                            fontSize: '16',
                                            fontWeight: 'bold'
                                        }
                                    }
                                },
                                itemStyle: {
                                    normal: {
                                        label: {
                                            show: false
                                        },
                                        labelLine: {
                                            show: false
                                        }
                                    }
                                },
                                labelLine: {
                                    normal: {
                                        show: false
                                    }
                                },
                                data: [
                                    { value: 1, name: '运行中' },
                                    { value: 1, name: '未启用' }
                                ]
                            }
                        ]
                    };
                    vm.option2 = {
                        series: [
                            {
                                type: 'pie',
                                radius: [40, 80],
                                center: [160, 150],
                                avoidLabelOverlap: false,
                                label: {
                                    normal: {
                                        show: false,
                                        position: 'center'
                                    },
                                    emphasis: {
                                        show: true,
                                        textStyle: {
                                            fontSize: '16',
                                            fontWeight: 'bold'
                                        }
                                    }
                                },
                                itemStyle: {
                                    normal: {
                                        label: {
                                            show: false
                                        },
                                        labelLine: {
                                            show: false
                                        }
                                    }
                                },
                                labelLine: {
                                    normal: {
                                        show: false
                                    }
                                },
                                data: [
                                    {
                                        value: 1, name: '测试中', itemStyle: {
                                            normal: { color: '#93A2CB' }
                                        }
                                    },
                                    {
                                        value: 1, name: '开发中', itemStyle: {
                                            normal: { color: '#72BEAC' }
                                        }
                                    },
                                    {
                                        value: 1, name: '已封板', itemStyle: {
                                            normal: { color: '#E5B87C' }
                                        }
                                    }
                                ]
                            }
                        ]
                    };
                }
                vm.processing = result.systemStatusNums['102'];
                vm.waiting = result.systemStatusNums['296'];
                vm.testing = result.versionStatusNums['0591'];
                vm.closed = result.versionStatusNums['060'];
                vm.developing = result.versionStatusNums['059'];
                vm.systemNum = result.systemNum;
                vm.versionInuseNum = result.versionInuseNum;
                vm.option = {
                    eventHandles: {
                        click: function (param) {
                            if (param.name == "运行中") {
                                $state.go("SystemManage", {
                                    status: "102"
                                });
                            } else {
                                $state.go("SystemManage", {
                                    status: "296"
                                });
                            }
                        }
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{b}: <br/> {c} ({d}%)"
                    },
                    series: [
                        {
                            type: 'pie',
                            radius: [40, 80],
                            center: [160, 150],
                            avoidLabelOverlap: false,
                            label: {
                                normal: {
                                    show: false,
                                    position: 'center'
                                },
                                emphasis: {
                                    show: true,
                                    textStyle: {
                                        fontSize: '16',
                                        fontWeight: 'bold'
                                    }
                                }
                            },
                            itemStyle: {
                                    normal: {
                                        label: {
                                            show: false
                                        },
                                        labelLine: {
                                            show: false
                                        }
                                    }
                                },
                            labelLine: {
                                normal: {
                                    show: false
                                }
                            },
                            data: [
                                {
                                    value: result.systemStatusNums['102'], name: '运行中', itemStyle: {
                                        normal: { color: '#54BEE7' }
                                    }
                                },
                                {
                                    value: result.systemStatusNums['296'], name: '未启用', itemStyle: {
                                        normal: { color: '#CAD6DF' }
                                    }
                                }
                            ]
                        }
                    ]
                };
                vm.option2 = {
                    eventHandles: {
                        click: function (param) {
                            if (param.name == "测试中") {
                                $state.go("VersionProcess", {
                                    status: "0591"
                                });
                            } else if (param.name == "开发中") {
                                $state.go("VersionProcess", {
                                    status: "059"
                                });
                            } else {
                                $state.go("VersionProcess", {
                                    status: "060"
                                });
                            }
                        }
                    },

                    tooltip: {
                        trigger: 'item',
                        formatter: "{b}: <br/> {c} ({d}%)"
                    },
                    series: [
                        {
                            type: 'pie',
                            radius: [40, 80],
                            center: [160, 150],
                            avoidLabelOverlap: false,
                            label: {
                                normal: {
                                    show: false,
                                    position: 'center'
                                },
                                emphasis: {
                                    show: true,
                                    textStyle: {
                                        fontSize: '16',
                                        fontWeight: 'bold'
                                    }
                                }
                            },
                            itemStyle: {
                                    normal: {
                                        label: {
                                            show: false
                                        },
                                        labelLine: {
                                            show: false
                                        }
                                    }
                                },
                            labelLine: {
                                normal: {
                                    show: false
                                }
                            },
                            data: [
                                {
                                    value: result.versionStatusNums['0591'], name: '测试中', itemStyle: {
                                        normal: { color: '#93A2CB' }
                                    }
                                },
                                {
                                    value: result.versionStatusNums['059'], name: '开发中', itemStyle: {
                                        normal: { color: '#72BEAC' }
                                    }
                                },
                                {
                                    value: result.versionStatusNums['060'], name: '已封板', itemStyle: {
                                        normal: { color: '#E5B87C' }
                                    }
                                }
                            ]
                        }
                    ]
                };

            });
        }

        // 查询版本列表
        function queryMyVersion(pageNumber) {

            var params = {
                type: 1,
                pageNumber: pageNumber,
                pageSize: 5,
                sysId: $stateParams.sysId,
                keyword: $scope.keyword,
                versionStatus: (formData.selectedStatus || {}).code || ''
            };

            VersionManageService.getMyVersion(params).then(function (result) {
                $scope.pager.totalCount = result.totalDataCount;
                $scope.pager.pageNumber = result.pageNumber;
                //$scope.hasPermissionMap = result.hasPermissionMap;
                $scope.$broadcast('sn.controls.pager:toPage', $scope.pager.pageNumber);

                $scope.userId = result.userId;
                $scope.versList = result.datas;
                $scope.type = 1;
                $scope.operationBoMap = result.operationBoMap;
                $scope.sysId = $stateParams.sysId;
            });
        }
        
        function buildJobCheck(version,envType,index){
        	QuaService.packageQuaCheck({ sysId:version.sysId,versionId:version.branchId,envType:envType }).then(function (result) {
        		$scope.system=result.system;
        		$scope.sysType=$scope.system.sysType;
        		var vqTrendInfos=result.vqTrendInfos;
        		var codeReviewInfo=result.codeReviewInfo;
        		var sonarUrl =result.sonarUrl;
        		var buildEndTime=result.buildEndTime;
        		var buildId = result.buildId;
        		var newCodeLines=result.newCodeLines;
        		var qualityResult=result.qualityResult;
        		var jenkinsUrl=result.jenkinsUrl;
    			$scope.reviewResult=result.reviewResult;
    			$scope.checkResult=result.flag;
    			$scope.utPassedRate="";
    			$scope.newCoverage="";
    			if(vqTrendInfos.length>0){
        			for(var i=0;i<vqTrendInfos.length;i++){
        				if(vqTrendInfos[i].paramKey=="TEST_SUCCESS_DENSITY"){
        					$scope.utPassedRate=vqTrendInfos[i].paramValue;
        				}
        				if(vqTrendInfos[i].paramKey=="NEW_COVERAGE"){
        					$scope.newCoverage=vqTrendInfos[i].paramValue;
        				}
        			}
    			}
        		if (!result.flag) {
    				var buildStatus=result.buildStatus;
    		    		//弹出页面用户
    		    		DialogService.modal({
    		    			key:"package.packageQuaCheck",
    		    			url:"modules/sncd/templates/quality/package-qua-check.html",
    		    			accept:function(result){
    		    				var continuePack=result.continuePack;
    		    				if(continuePack==1){
    		    					//封板只提示
    		    					var systemGrade=$scope.system.systemGrade;
    		    					$timeout(function(){confirmFreezen(version,index);})
    		    					
    		    				}
    		    			}
    		    		},{
    		    			vqTrendInfos:vqTrendInfos,
    		    			reviewResult:$scope.reviewResult,
    		    			envType:envType,
    		    			systemGrade:$scope.system.systemGrade,
    		    			buildStatus:buildStatus,
        	    			sysName:$scope.system.sysName,
        	    			codeReviewInfo:codeReviewInfo,
        	    			sonarUrl:sonarUrl,
        	    			buildEndTime:buildEndTime,
        	    			branchId:version.branchId,
        	    			sysId:$scope.system.sysId,
        	    			buildId:buildId,
        	    			newCodeLines:newCodeLines,
        	    			qualityResult:qualityResult,
        	    			jenkinsUrl:jenkinsUrl,
        	    			sysCnname:$scope.system.sysCnname,
        	    			version:version.version,
        	    			type:"freezen"
    		    		});
    				 
    				} else {
    					//构建成功
    					confirmFreezen(version,index);
    				}
    		});
        }
        
        function confirmFreezen(version,index){
        	if(confirm("封版后所有人员将不能往SVN服务器提交代码\u000d确定要封版吗？")){
        		var params={
        				versionId:version.branchId,
        				sysId:version.sysId,
        				versionUrl:version.branchUrl
        		};
        		
        		VersionManageService.freezenVersion(params).then(function(result){
            		if(result.isFrezenSuc){
            			alert("封版成功!");
            			$scope.versList[index].status = '060';
            		}else{
            			alert("封版失败，请联系朱文静(11010068)!");
            		}
            	})
        	}
        }

        vm.search = function () {
            queryMyVersion(0);
        }

        //封板
        vm.freezen = function (version, index) {
            if (version.backMerged == '0') {
                alert("该分支尚未完成代码回合，无法封版。请联系技术负责人或分支技术经理，确认代码回合后，再进行封版操作。");
                return false;
            }

            
            buildJobCheck(version,"021",index);
        }

        //解版
        vm.unFreezen = function (version) {

            VersionManageService.isBranchHasUnFinishRequest({ versionId: version.branchId }).then(function (result) {
                if (result.isHas) {
                    alert("此分支有尚未结束的生产发布单【" + result.requestNo + "】，请与申请人【" + result.userName + "】联系,生产单关闭前，不能解版!");
                    return false;
                } else {//跳转解版页面
                    $state.go("UnfreezenVersion", { sysId: version.sysId, versionId: version.branchId, vtab: 'UnfreezenVersion' })
                }
            })
        }

        //确认已回合
        $scope.backMerged = function (version, index) {
            if (confirm("请确定已经线下完成该分支的代码回合工作。确认回合后，可对分支进行封版、打包及发布操作。")) {
                VersionManageService.backMergedVersion({ versionId: version.branchId }).then(function (result) {
                    if (result.flag) {
                        alert("确认回合成功!");
                        $scope.versList[index].backMerged = '1';
                    } else {
                        alert("确认回合失败，请联系朱文静(11010068)!");
                        return false;
                    }

                })
            }
        }

        //废弃
        $scope.abandonVersion=function (versionId){
            if(confirm("废弃后，系统将自动关闭该分支，收回分支写权限。确定废弃？")){
                VersionManageService.abandonVersion({versionId:versionId}).then(function (result){
                    if(result.flag){
                        alert("废弃成功!");
                        // $state.go("VersionFinish");
                            init();
                    }else{
                        alert("分支废弃失败，请确认分支路径是否正确，如有疑问，请联系朱文静(11010068)!");
                    }
                })
            }
        }
        /////////////////$scope functions/////////////////

        vm.statusFilter = function (status) {
            formData.selectedStatus = status;
            queryMyVersion(0);
        };
        ///////////////////Events//////////////////

        //分页
        vm.$on('sn.controls.pager:pageIndexChanged', function (evt, page) { // 分页操作
            evt.stopPropagation();
            pager.pageNumber = page.pageIndex + 1;
            queryMyVersion(pager.pageNumber);
        });


        function getCustomerInfo(params) {
            HomeService.getCustomerInfo(params).then(function (result) {
                $scope.userName = result.userName;
                $scope.role = result.role;
            });
        }

        // function getSysBranchInfo(params) {
        //     HomeService.getSysBranchInfo(params).then(function (result) {
        //         $scope.pager.totalCount = result.totalDataCount;
        //         $scope.pager.pageNumber = result.pageNumber;
        //         $scope.$broadcast('sn.controls.pager:toPage', $scope.pager.pageNumber);
        //         $scope.branchList = result.datas;
        //         if (result.datas == null) {
        //             $scope.noData = true;
        //         }
        //     });
        // }
        //  我的动态
        function getMyDynamicState(params) {

            var params = {
                pageNumber: 1,
                pageSize: 8
            };
            HomeService.getMyDynamicState(params).then(function (result) {
                $scope.dynamicState = result.datas;
                if (result.datas == null) {
                    $scope.noDynamic = true;
                }
                
                DialogService.modal({
                    key: "home.notification",
                    url: "modules/sncd/templates/home/notification.html"
                });
                
//                var msg="";
//                msg+="hi，各位亲！按照总部PMO及CTO办公室的要求，从2017年1月1日起，对发布流程及质量控制做如下要求：";
//                msg+="1、质量控制方面";
//        		msg+="1.1 所有一级系统均需要做单元测试，要求单侧案例执行成功率达到100%，新增代码单测覆盖率达到60%。（目前控制在cd进行编译打包发布的一级java类型系统）";
//        		msg+="1.2 所有代码提交均需要做代码评审，代码提交时，会同步提交记录到CD，评审人可以线下评审完在CD进行记录评审信息";
//    			msg+="2.发布流程方面";
//				msg+="2.1  所有的PRE环境及PRD环境发布必须走ITP审批后才能发布";
//				msg+="2.2  PRE 及PRD需要先行在CD进行自助构建打包，在ITP发布单提交流程选择相应的包走发布流程后自动发布";
//				msg+="2.3 其它非cd发布的，单在cd打包构建的流程不变";
//				msg+="3、1月1日前，相关质量控制数据均设置为0，对质量没有2017年1月1日起将调整质量控制条件，如你使用过程中有任何问题可以咨询 郭新伟(16072448)18551601875 陈军（10111065）18651663182";
//				msg+="相关质量标准要求可以咨询：吴宏志(16010558)13585108290";
//				msg+="相关操作步骤及帮助 请点击：";
//                AlertService.alert({
//                  title: '提示信息',
//                  content: msg
//                });
//                DialogService.modal({
//	    			key:"home.notification",
//	    			url:"modules/sncd/templates/home/notification.html",
//	    			accept:function(result){
//	    				
//	    			}
//	    		});
                
                
            });
        };



        function getBlockerReason() {
            var params = {
                severity: "BLOCKER"
            };
            //填充左图数据
            HomeService.getOption2(params).then(function (result) {
                var analysis = result.analysis;
                var arr = [];
                for (var i = 0, len = analysis.length; i < len; i++) {
                    arr.push(analysis[i].name);
                }
                if($scope.option2!=null){
                	$scope.option2.legend.data = arr;
                    $scope.option2.series[0].data = result.analysis;
                }
                if($scope.sonarUrl!=null){
                	$scope.sonarUrl = result.sonarUrl;
                }
                if($scope.blockerVList!=null){
                	$scope.blockerVList = result.analysis;
                }                
            });
        }

        // function getCriticalReason() {
        //     var params = {
        //         severity: "CRITICAL"
        //     };
        //     //填充右图数据
        //     HomeService.getOption3(params).then(function (result) {
        //         var analysis = result.analysis;
        //         var arr = [];
        //         var arrValue = [];
        //         for (var i = 0, len = analysis.length; i < len; i++) {
        //             arr.push(analysis[i].name);
        //             arrValue.push(analysis[i].value);
        //         }
        //         $scope.option3.legend.data = arr;

        //         $scope.option3.series[0].data = result.analysis;
        //         $scope.sonarUrl = result.sonarUrl;
        //         $scope.criticalVList = result.analysis;
        //         /* $scope.option3.xAxis[0].data=arr;
        //          $scope.option3.series[0].data = arrValue;*/
        //     });
        // }


        ////////////////$scope functions/////////////////



        $scope.dynamic = function (tabNo) {
            $state.go("Dynamic", {
                type: tabNo
            });
        };
        
        

        ///////////////////watches//////////////////////////////

        ///////////////////Events///////////////////

        // vm.$on('sn.controls.pager:pageIndexChanged', function (evt, page) { // 分页操作
        //     evt.stopPropagation();
        //     var params = {
        //         pageNumber: page.pageIndex + 1,
        //         pageSize: $scope.pager.pageSize
        //     };
        //     getSysBranchInfo(params);
        // });
        init();

        return vm;

    }
]);
