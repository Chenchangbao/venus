angular.module('sncd').filter('envTypeFilter', function () {
    var versStatus = {
        "019": "集成测试",
        "020": "预生产",
        "021": "生产",
        "171": "本地测试"
    };

    return function (state) {
        return versStatus[state];
    };
});

angular.module('sncd').filter('configNameFilter', function () {
    var versStatus = {
        "019": "SIT",
        "020": "PRE",
        "021": "PRD"
    };

    return function (state) {
        return versStatus[state];
    };
});

angular.module('sncd').filter('envTypeNameFilter', function () {
    var versStatus = {
        "019": "SIT设置",
        "020": "PRE设置",
        "021": "PRD设置"
    };

    return function (state) {
        return versStatus[state];
    };
});
angular.module('sncd').filter('deployStatusFilter', function () {
    var deployStatus = {
        "145": "发布单结束",
        "132": "待发布",
        "144": "应用发布中"
    };

    return function (state) {
        return deployStatus[state];
    };
});

angular.module('sncd').filter('deployFlagFilter', function () {
    var deployFlag = {
        "150": "发布成功",
        "151": "发布失败",
        "152": "发布终止"
    };

    return function (state) {
        return deployFlag[state];
    };
});

angular.module('sncd').filter('versionStatusFilter', function () {
    var versStatus = {
        "059": "开发中",
        "060": "已封版",
        "063": "已合并",
        "178": "已废弃",
        "061": "PRE封版",
        "062": "PRD封版",
        "0591": '测试中'

    };

    return function (state) {
        return versStatus[state];
    };
});
angular.module('sncd').filter('roleFilter', function () {
    var versStatus = {
        "7009": "创建版本",
        "7010": "类似创建",
        "7011": "封版",
        "7012": "解版",
        "7016": "版本管理(分支废弃、回合、合并、权限管理)",
        "7018": "版本发布权限管理",
        "7019": "交付流程配置",
        "7021": "发布权限",
        "7022": "静态发布权限",
        "7001": "打包权限",
        "7002": "执行编译"

    };

    return function (state) {
        return versStatus[state];
    };
});
angular.module('sncd').filter('sysStatusFilter', function () {
    var versStatus = {
        "102": "运行中",
        "296": "未启用"
    };

    return function (state) {
        return versStatus[state];
    };
});

angular.module('sncd').filter('packageFilter', function () {
    var packageStatus = {
        "163": "应用发布包",
        "164": "静态发布包"
    };

    return function (state) {
        return packageStatus[state];
    };
});

angular.module('sncd').filter('packageUseFilter', function () {

    var packageUseStatus = {
        "183": "前台",
        "184": "后台",
        "298": "中台"
    };

    return function (state) {
        return packageUseStatus[state];
    };
});


angular.module('sncd').filter('buildFlagFilter', function () {

    var buildFlag = {
        "W": "打包中...",
        "Y": "成功",
        "N": "失败"
    };

    return function (state) {
        return buildFlag[state];
    };
});

angular.module('sncd')
    .filter('quaTrendFilter', function () {
        var quaTrend = {
            0: "↑",
            1: "↓",
            2: "←→",
            "0": "↑",
            "1": "↓",
            "2": "←→",
            "null": "尚未构建"
        };

        return function (state) {
            return quaTrend[state];
        };
    });

angular.module('sncd')
    .filter('developRoleFilter', function () {
        var developRole = {
            "037": "管理",
            "038": "产品",
            "039": "开发",
            "040": "测试",
            "041": "其他"

        };

        return function (state) {
            return developRole[state];
        };
    });

angular.module('sncd')
    .filter('developRoleNameFilter', function () {
        var developRoleName = {
            "042": "项目经理",
            "043": "技术经理",
            "044": "产品经理",
            "045": "技术总监",
            "046": "产品总监",
            "047": "开发工程师",
            "048": "测试工程师",
            "049": "架构师",
            "050": "测试经理",
            "051": "交互设计师",
            "052": "视觉设计师",
            "053": "前端开发工程师",
            "054": "系统管理员",
            "055": "产品顾问",
            "056": "EA架构师",
            "057": "界面架构师",
            "058": "运维工程师",
            "116": "产品负责人",
            "117": "技术负责人",
            "165": "平台支持人员",
            "232": "安全扫描员",
            "251": "附加审批人员",
            "256": "发布专员",
            "257": "静态发布专员",
            '261': "版本CMO",
            '260': '测试负责人',
            '299':'版本团队'
        };

        return function (state) {
            return developRoleName[state];
        };
    });



angular.module('sncd')
    .filter('devTechFilter', function () {
        var devTech = {
            "070": "Java",
            "071": "Java,C",
            "072": "Java,C++",
            "073": "PHP",
            "074": "ABAP",
            "075": "ios,Android",
            "JAVA_WEB": "JAVA WEB"
        };

        return function (state) {
            return devTech[state];
        };
    });


angular.module('sncd')
    .filter('mailTriggerFilter', function () {
        var devTech = {
            "280": "构建成功",
            "281": "构建失败"
        };


        return function (state) {
            return devTech[state];
        };
    });

angular.module('sncd')
    .filter('analysisExtFilter', function () {
        var devTech = {
            "282": "单元测试",
            "283": "依赖jar包安全分析"
        };


        return function (state) {
            return devTech[state];
        };
    });
    
angular.module('sncd')
    .filter('analysisFilter', function () {
        var devTech = {
        	"2799": "代码静态检查",
            "282": "单元测试",
            "283": "依赖jar包安全扫描",
            "300": "安全扫描检查",
            "302": "前端性能检测",
            "303": "蛙测"
        };
        return function (state) {
            return devTech[state];
        };
    });
    
    angular.module('sncd')
    .filter('greateLessFilter', function () {
        var devTech = {
            "1": ">=",
            "2": "<="
        };
        return function (state) {
            return devTech[state];
        };
    });
    
    angular.module('sncd')
    .filter('glReverseFilter', function () {
        var devTech = {
            "1": "<",
            "2": ">"
        };
        return function (state) {
            return devTech[state];
        };
    });
    
    
angular.module('sncd')
    .filter('analysisNameFilter', function () {
        var devTech = {
        		"2799": "代码静态检查",
                "282": "单元测试",
                "283": "依赖jar包安全扫描",
                "300": "安全扫描检查",
                "302": "前端性能检测",
                "303": "蛙测"
        };
        return function (state) {
            return devTech[state];
        };
    });

angular.module('sncd')
    .filter('buildFilter', function () {
        var build = {
            "0": "未构建",
            "1": "每小时一次",
            "3": "每三小时一次",
            "8": "每日三次",
            "24": "每日一次",
            "3600": "每一分钟一次",
            "-1" : "自定义"
        };

        return function (state) {
            return build[state];
        };
    });


angular.module('sncd')
    .filter('codereviewFilter', function () {
        var codereview = {
            "0": "不使用ReviewBoard评审",
            "1": "使用ReviewBoard评审"
        };

        return function (state) {
            return codereview[state];
        };
    });


angular.module('sncd')
    .filter('quaNumberFilter', function () {
        var quaNumber = {
            "": 0,
            "null": 0,
        };

        return function (state) {
            return quaNumber[state];
        };
    });



angular.module('sncd')
    .filter('mergeStatusFilter', function () {
        var mergeStatus = {
            "noStart": "未开始merge!",
            "finish": "已结束！",
            "0":"准备数据...",
            "tag": "请稍候，正在创建tag...",
            "1": "请稍候，正在checkout...",
            "2": "请稍候，正在merge文件...",
            "3": "请稍候，正在提交修改...",
            "5": "正在分发合并任务...",
            "6": "合并任务已经进入队列，正在执行中，请稍后..."
        };

        return function (state) {
            return mergeStatus[state];
        };
    })

angular.module('sncd')
    .filter('msgFlagFilter', function () {
        var msgFlag = {
            "1": "merge成功！",
            "0": "merge失败！"
        };

        return function (state) {
            return msgFlag[state];
        };
    })


angular.module('sncd')
    .filter('devFwFilter', function () {
        var msgFlag = {
            "076": "SNF",
            "077": "SSH",
            "078": "SSH+SNF"
        };

        return function (state) {
            return msgFlag[state];
        };
    })


//Sonar代码质量分析设置
angular.module('sncd')
    .filter('frequencyRateFilter', function () {
        var msgFlag = {
            "8": "每日三次",
            "24": "每日一次",
            "3": "每3小时一次",
            "1": "每小时一次"
        };

        return function (state) {
            return msgFlag[state];
        };
    })

angular.module('sncd')
    .filter('buildResultFilter', function () {
        var buildResult = {
            "01": "代码未变化,构建成功",
            "02": "代码未变化，构建失败",
            "1": "代码有变化 构建成功",
            "2": "代码有变化，构建失败"
        };

        return function (state) {
            return buildResult[state];
        };
    });

angular.module('sncd')
    .filter('filterEmpty', function () {
        return function (list, value) {
            return value ? list : [];
        };
    });

angular.module('sncd')
    .filter('sysTypeFilter', function () {
        var sysType = {
            "0": "Java-snf",
            "1": "sap系统",
            "2": "独立业务组件",
            "3": "PC系统",
            "4": "C语言系统",
            "5": "安卓(android)",
            "6": "ios",
            "99":"其他"
        };

        return function (state) {
            return sysType[state];
        };
    });


angular.module('sncd')
    .filter('isdeployFilter', function () {
        return function (state) {
        	if(state==null || state==""){
        		return "否";
        	}else{
        		return "是";
        	} 
        };
    });

angular.module('sncd')
.filter('deployResultFilter', function () {
    var isresult = {
        "150": "部署成功",
        "151": "部署失败",
        "152": "部署终止"
    };

    return function (state) {
    	if(state==null || state==""){
    		return "未部署";
    	}else{
    		return isresult[state];
    	} 
    };

});

angular.module('sncd')
.filter('radioCheckOrNotFilter', function () {
    var radioCheck = {
        "0": "否",
        "1": "是"
    };

    return function (state) {
        return radioCheck[state];
    };
});

angular.module('sncd')
.filter('violationsFilter', function () {
    return function (state) {
    	if(state!=null && state!="" && state!="0" && state!=0){
    		return "↑";
    	}
    };
});


angular.module('sncd')
.filter('analysisTypeFilter', function () {
    var isresult = {
        "scts": "303",
        "unit": "282",
        "staticCheck": "2799",
        "security": "300"
    };

    return function (state) {
        return isresult[state];
    };
});


angular.module('sncd')
.filter('envFilter', function () {
    var isresult = {
        "sit": "019",
        "pre": "020",
        "prd": "021"
    };

    return function (state) {
        return isresult[state];
    };
});

angular.module('sncd')
.filter('dateFilter', function () {
    return function (state) {
    	if(state != null && state != ""){
    		return state.substring(0,10);
    	}
    };
});
angular.module('sncd')
.filter('testTypeFilter', function () {
    var isresult = {
        "caseType": "用例",
        "stepType": "执行步骤"
    };

    return function (state) {
        return isresult[state];
    };
});

angular.module('sncd')
.filter('buildStatusFilter', function () {
    var status = {
        "1": "进行中",
        "2": "分析成功",
        "3": "分析中",
        "4": "jenkins构建失败",
        "5": "sonar分析失败"
    };
    return function (state) {
        return status[state];
    };
});
angular.module('sncd')
.filter('svnCodeReviewResultFilter',function(){
	var status={
			"RED": "不通过",
			"GREEN": "通过",
			"YELLOW": "待评审"
	};
	return function(state){
		return status[state];
	}
});