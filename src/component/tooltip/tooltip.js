import template from './tooltip.html';

export default app => {
    app.service("snTooltipService", ["$document", "$rootScope", "$compile", "$timeout",
        ($document, $rootScope, $compile, $timeout) => {
            let tooltip = angular.element(template);
            var newScope = angular.extend($rootScope.$new());
            $compile(tooltip)(newScope);
            $document.find("body").append(tooltip);
            tooltip.css("z-index", "1500");
            tooltip.css("pointer-events", "none");
            tooltip.css("visibility", "hidden");
            return {
                showTooltip: (element) => {
                    var content = element.attr('sn-tooltip') || element.text();
                    var direction = element.attr("direction") || 'right';

                    newScope.direction = direction;
                    newScope.content = content;
                    newScope.$digest();

                    $timeout(() => {
                        var tipClient = tooltip[0].getBoundingClientRect();
                        var client = element[0].getBoundingClientRect();
                        var x, y, xOffset;
                        if (element.is('.link')) {// link 提示居中
                            xOffset = client.width ? client.width / 2 - 10 : 0;
                        } else {
                            xOffset = 0;
                        }
                        // xOffset yOffset
                        switch (direction) {
                            case 'left':
                                x = client.left - tipClient.width;
                                y = client.top + (client.height - tipClient.height) / 2;
                                break;
                            case 'right':
                                x = client.left + client.width - xOffset;
                                y = client.top + (client.height - tipClient.height) / 2;
                                break;
                            case 'top':
                                x = client.left + (client.width - tipClient.width) / 2;
                                y = client.top - tipClient.height;
                                break;
                            case 'bottom':
                                x = client.left + (client.width - tipClient.width) / 2;
                                y = client.top + client.height;
                                break;
                        }
                        x = x + window.scrollX;
                        y = y + window.scrollY;
                        tooltip.css("left", x + "px");
                        tooltip.css("top", y + "px");
                        tooltip.css("opacity", "1");
                        tooltip.css("visibility", "visible");
                    }, 0);
                },
                hideTooltip: () => {
                    tooltip.css('visibility', 'hidden');
                }
            }
        }
    ]);
    app.directive("snTooltip", ["snTooltipService",
        function (snTooltipService) {
            return {
                restrict: "A",
                priority: 1,
                link: function (scope, element, attrs) {
                    element.on("mouseenter", function (evt) {
                        snTooltipService.showTooltip(element);
                    });

                    element.on("mouseleave", function () {
                        snTooltipService.hideTooltip();
                    });
                }
            };
        }
    ]);
}