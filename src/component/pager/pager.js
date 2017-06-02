import './pager.less';
import pagerTmpl from './pager.html';
import miniPagerTmpl from './miniPager.html';
import tinyPagerTmpl from './tinyPager.html';

export default app => {
    app.directive('snPager', ['$compile', function ($compile) {
        const REGEX = /\{page\}/g;

        const TYPE_DEFAULT = 'default',
            TYPE_MINI = 'mini',
            TYPE_TINY = 'tiny';
        // 默认分页配置项
        const DEFAULTS_DEFAULT = {
            'endPoint': 1, // 列表两端页码个数
            'adjacent': 1,             //相邻页码个数
            'showPrevNext': true,
            'showGoToPage': true,
            'hideIfEmpty': true,
            // 文字
            'textDots': '...',
            'textPrev': '',
            'textNext': '',
            'textTotalPages': '共{page}页', //{page}为占位符，代表总页数位置
            'textGoToPage': ', 到第{page}页', // {page}为占位符，代表跳转页输入框位置
            'textGoToPageBtn': '确定',
            //字体图标
            'iconDotsClass': '',
            'iconPrevClass': 'fu fu-left',
            'iconNextClass': 'fu fu-right',
            'iconGoToPageBtnClass': '',

            'ulClass': 'sn-pagination',
            'prevClass': 'prev',
            'nextClass': 'next',
            'dotsClass': 'dots disabled', //省略号的表现样式可能稍有不同，所以可以通过自定义样式来修改
            'infoClass': 'sn-pagination-info',
            'btnClass': 'btn btn-go',
            'disabledClass': 'disabled',
            'activeClass': 'active'
        };
        //小分页默认配置项
        const DEFAULTS_MINI = {
            'endPoint': 1,
            'adjacent': 1,
            'hideIfEmpty': true,
            // 文字
            'textDots': '...',
            'textPrev': '上一页',
            'textNext': '下一页',
            'textPage': '第{page}页',
            // 字体图标
            'iconDotsClass': '',
            'iconPrevClass': '',
            'iconNextClass': '',

            'ulClass': 'sn-pagination',
            'prevClass': 'prev',
            'nextClass': 'next',
            'dotsClass': 'dots disabled',
            'disabledClass': 'disabled',
            'activeClass': 'active'
        };
        //极简分页默认配置项
        const DEFAULTS_TINY = {
            'hideIfEmpty': true,
            // 文字
            'textPrev': '上一页',
            'textNext': '下一页',
            // 字体图标
            'iconPrevClass': '',
            'iconNextClass': '',

            'ulClass': 'sn-pagination',
            'prevClass': 'prev',
            'nextClass': 'next',
            'disabledClass': 'disabled',
            'activeClass': 'active'
        }
        return {
            restrict: 'EA',
            scope: {
                page: '=',  //当前页码
                pageSize: '=', //每页显示条目数
                total: '=', //总条目数
                pagerType: '@', //分页组件类型
                settings: '=', // 其他配置
                pagingAction: '&'  //分页动作
            },
            link: function (scope, element, attrs) {
                let options, _init, _validateScope, _renderPager, _addPrevNext, _addRange, _addDots,
                     _addBeginning, _addEnd, _validateTargetPage, _internalAction;

                _init = () => {
                    let pagerType, template, defaults;

                    pagerType = (scope.pagerType || TYPE_DEFAULT).toLowerCase();
                    switch (pagerType) {
                        case TYPE_MINI:
                            template = angular.element(miniPagerTmpl);
                            defaults = DEFAULTS_MINI;
                            break;
                        case TYPE_TINY:
                            template = angular.element(tinyPagerTmpl);
                            defaults = DEFAULTS_TINY;
                            break;
                        case TYPE_DEFAULT:
                        default:
                            pagerType = TYPE_DEFAULT;
                            template = angular.element(pagerTmpl);
                            defaults = DEFAULTS_DEFAULT;
                    }
                    options = angular.extend({}, defaults, scope.settings, {pagerType: pagerType});

                    options.adjacent = parseInt(options.adjacent, 10) || 1;
                    options.endPoint = parseInt(options.endPoint, 10) || 1;

                    options.adjacent = options.adjacent < 1 ? 1 : options.adjacent;
                    options.endPoint = options.endPoint < 1 ? 1 : options.endPoint;
                    
                    if (pagerType === TYPE_DEFAULT) {
                        // 用于存储分隔字符串结果，便于国际化
                        let textGoToPageArr;

                        // 跳转到第几页文本处理，便于国际化
                        if (!angular.isString(options.textGoToPage)) {
                            options.textGoToPage = '';
                        } 
                        textGoToPageArr = options.textGoToPage.split(REGEX);
                        scope.textGoToPageLeft = textGoToPageArr[0];
                        scope.textGoToPageRight = textGoToPageArr.length > 1 ? textGoToPageArr[1] : '';
                        //跳转按钮
                        scope.btnClass = options.btnClass;
                        scope.iconGoToPageBtnClass = options.iconGoToPageBtnClass;
                        scope.textGoToPageBtn = options.textGoToPageBtn;

                        if (!angular.isString(options.textTotalPages)) {
                            options.textTotalPages = '';
                        }

                        scope.infoClass = options.infoClass;

                        // 跳页
                        scope.goToPage = function () {
                            _validateTargetPage();
                            _internalAction(scope.targetPage);
                        };
                    } else if (pagerType == TYPE_MINI) {
                        if (!angular.isString(options.textPage)) {
                            options.textPage = '';
                        }
                    }

                    scope.ulClass = options.ulClass;

                    // 上一页
                    scope.prevPage = function () {
                        if (scope.page > 1) {
                            _internalAction(scope.page - 1);
                        }
                    };
                    // 下一页
                    scope.nextPage = function () {
                        if (scope.page < scope.totalPages) {
                            _internalAction(scope.page + 1);
                        }
                    };
                    // 选择页
                    scope.selectPage = function (page) {
                        if (angular.isNumber(page)) {
                            _internalAction(page);
                        }
                    };

                    element.addClass('sn_pager_' + pagerType);
                    element.append(template);
                    $compile(template)(scope);                    
                };

                _validateScope = () => {
                    // 清空
                    scope.list = [];
                    scope.prev = null;
                    scope.next = null;
                    scope.current = null;

                    scope.page = parseInt(scope.page, 10) || 1;
                    scope.total = parseInt(scope.total, 10) || 0;
                    scope.pageSize = parseInt(scope.pageSize, 10) || 10;

                    //计算总页数
                    scope.totalPages = Math.ceil(scope.total / scope.pageSize) || 1;

                    //当前页不得超过总页数
                    if (scope.page > scope.totalPages) {
                        scope.page = scope.totalPages;
                    } else if (scope.page < 1) {
                        scope.page = 1;
                    }

                    scope.hidePager = options.hideIfEmpty && scope.total == 0;

                    if (options.pagerType === TYPE_DEFAULT) {
                        //跳转目标页为当前页+1,或最后一页
                        scope.targetPage = scope.page == scope.totalPages ? scope.totalPages : scope.page + 1;
                        scope.hideGoToPage = !options.showGoToPage || scope.totalPages <= 2 * (options.adjacent + options.endPoint) + 1;
                        scope.textTotalPages = options.textTotalPages.replace(REGEX, scope.totalPages);
                    }
                };

                _addPrevNext = () => {
                    // 默认类型分页，上下页只有在总页码数超过最大显示页码数,且配置项showPrevNext为true时才显示
                    // 小分页，上下页只要总页码数超过1就显示
                    // 极简分页，上下页始终显示
                    if (options.pagerType === TYPE_DEFAULT && (!options.showPrevNext || 2 * (options.adjacent + options.endPoint) + 1 >= scope.totalPages)) {
                        return;
                    }

                    if (options.pagerType === TYPE_MINI && scope.totalPages <= 1) {
                        return;
                    }

                    let disabled;

                    // add prev
                    disabled = scope.page == 1;

                    scope.prev = {
                        value: disabled ? 1 : scope.page - 1,
                        text: options.textPrev,
                        liClass: disabled ? [options.disabledClass, options.prevClass].join(' ') : options.prevClass,
                        iconClass: options.iconPrevClass
                    };

                    //add next
                    disabled = scope.page == scope.totalPages;

                    scope.next = {
                        value: disabled ? scope.totalPages : scope.page + 1,
                        text: options.textNext,
                        liClass: disabled ? [options.disabledClass, options.nextClass].join(' ') : options.nextClass,
                        iconClass: options.iconNextClass
                    };
                };

                _addRange = (start, end) => {
                    for (let i = start; i <= end; i++) {
                        let item = {
                            value: i,
                            text: options.pagerType === TYPE_MINI && options.textPage ? options.textPage.replace(REGEX, i) : i,
                            liClass: scope.page == i ? options.activeClass : ''
                        };

                        // 小分页当前页不显示
                        if (options.pagerType !== TYPE_MINI || scope.page != i) {
                            scope.list.push(item);
                        }
                        if (scope.page == i) {
                            scope.current = item;
                        }
                    }
                };

                _addDots = () => {
                    scope.list.push({
                        text: options.textDots,
                        liClass: options.dotsClass,
                        iconClass: options.iconDotsClass
                    });
                };

                _addBeginning = (next) => {
                    _addRange(1, options.endPoint);

                    // We ignore dots if the next value is 2
                    // ie: 1 [...] 2 3 4 5 becomes just 1 2 3 4 5
                    if (next != options.endPoint + 1) {
                        _addDots();
                    }
                };

                _addEnd = (prev) => {
                     // We ignore dots if the prev value is one less that our start range
                    // ie: 1 2 3 4 5 [...] 6  becomes just 1 2 3 4 5 6
                    if (prev != scope.totalPages - options.endPoint) {
                        _addDots();
                    }

                    _addRange(scope.totalPages - options.endPoint + 1, scope.totalPages);
                };

                _validateTargetPage = () => {
                    let {targetPage, page, totalPages} = scope;

                    targetPage = parseInt(targetPage, 10) || 1;

                    if (targetPage < 1 || targetPage > totalPages) {
                        scope.targetPage = page < totalPages ? page + 1 : totalPages;
                    } else {
                        scope.targetPage = targetPage; //转为数字类型
                    }
                };

                _internalAction = (page) => {
                    // Block clicks we try to load the active page
                    if (scope.page == page) {
                        return;
                    }

                    // Update the page in scope
                    scope.page = page;

                    // Pass our parameters to the paging action
                    scope.pagingAction({
                        page: scope.page,
                        pageSize: scope.pageSize,
                        total: scope.total,
                    });
                };

                _renderPager = () => {
                    _validateScope();

                    _addPrevNext();

                    if (options.pagerType === TYPE_TINY) {
                        return;
                    }

                    let start, end;
                    let {totalPages, page} = scope;
                    let {endPoint, adjacent} = options;
                    let maxVisible = 2 * (endPoint + adjacent) + 1;

                    // 总页码数不超过最大显示页数
                    if (totalPages <= maxVisible) {
                        _addRange(1, totalPages);
                    } else {
                        //当前页在开头
                        if (page <= adjacent + endPoint + 1) {
                            start = 1;
                            end = page <= adjacent + 1 ?  2 * adjacent + 1 : page + adjacent;
                            _addRange(start, end);
                            _addEnd(end);
                        }
                        //当前页在页码列表末端
                        else if (page >= totalPages - endPoint - adjacent) {
                            start =  page >= totalPages - adjacent ? totalPages - 2 * adjacent : page - adjacent;
                            end = totalPages;
                            _addBeginning(start);
                            _addRange(start, end);
                        }
                        //当前页在页码列表中间
                        else {
                            start = page - adjacent;
                            end = page + adjacent;
                            _addBeginning(start);
                            _addRange(start, end);
                            _addEnd(end);
                        }
                    }
                }

                _init();
                
                scope.$watchCollection('[page,pageSize,total]', function (newVals, oldVals, scope) {
                    _renderPager();
                });
            }
        };     
    }]);

}
