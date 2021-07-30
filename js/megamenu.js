(function() {

    'use strict';
    var inBrowser = typeof window !== 'undefined' && Object.prototype.toString.call(window) !== '[object Object]',
        isIE = inBrowser && (navigator.userAgent.indexOf("MSIE") > -1);
    var win = inBrowser ? window : global;
    var LIB = {};

    LIB.mmPlugin = function(menu, opts) {

        var noop = function() {};
        var menuContainer = menu,
            activeMenuitem = null,
            mousePosition = [],
            lastDelayPosition = null,
            timeoutId = null,
            options = Object.assign({}, {
                menuItem: ".theme-menu > ul > li",
                megamenuItem: "data-megamenu",
                megamenuContent: "[data-megamenu-content] .zpmm-inner",
                megamenuDirection: "below",
                megamenuEvent: "hover",
                onMouseEnterMenuItem: noop,
                onMouseLeaveMenuItem: noop,
                activateMenuItem: noop,
                deactivateMenuItem: noop,
                exitMenuContainer: noop
            },
            opts);

        var previousMousePosition = 3,
            mousePositionDelay = 400;
            
        var mousemoveDocument = function(e) {
            mousePosition.push({
                x: e.pageX,
                y: e.pageY
            });
            if (mousePosition.length > previousMousePosition) {
                mousePosition.shift();
            }
        };

        var mouseleaveMenu = function() {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }

            if (options.exitMenuContainer(this)) {
                if (activeMenuitem) {
                    options.deactivateMenuItem(activeMenuitem);
                }

                activeMenuitem = null;
            }
            return this;
        };

        var mouseenterMenuContent = function() {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        }

        var mouseenterMenuitem = function() {
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }

                options.onMouseEnterMenuItem(this);
                possiblyActivate(this);
                return this;
            },
            mouseleaveMenuitem = function() {
                options.onMouseLeaveMenuItem(this);
                return this;
            };
        var clickMenuitem = function(e) {
            e.preventDefault();
            activate(this);
        };
        var activate = function(megamenuItem) {
            if (megamenuItem == activeMenuitem && options.megamenuEvent == 'hover') {
                return;
            } else if (megamenuItem == activeMenuitem && options.megamenuEvent == 'click') {
                options.deactivateMenuItem(activeMenuitem);
                activeMenuitem = null;
                return;
            }

            if (activeMenuitem) {
                options.deactivateMenuItem(activeMenuitem);
            }

            options.activateMenuItem(megamenuItem);
            activeMenuitem = megamenuItem;
        };

        var possiblyActivate = function(megamenuItem) {
            if (!megamenuItem.hasAttribute(options.megamenuItem)) {
                if (activeMenuitem) {
                    options.deactivateMenuItem(activeMenuitem);
                    activeMenuitem = null;
                }
                return;
            }

            var delay = activationDelay();

            if (delay) {
                timeoutId = setTimeout(function() {
                    possiblyActivate(megamenuItem);
                }, delay);
            } else {
                activate(megamenuItem);
            }
        };

        var activationDelay = function() {
            function getOffset(element) {
                if (!element.getClientRects().length) {
                    return {
                        top: 0,
                        left: 0
                    };
                }

                let rect = element.getBoundingClientRect();
                let win = element.ownerDocument.defaultView;
                return ({
                    top: rect.top + win.pageYOffset,
                    left: rect.left + win.pageXOffset
                });
            }
            if (!activeMenuitem || !activeMenuitem.hasAttribute(options.megamenuItem)) {

                return 0;
            }

            var activeMegamenuContentId = activeMenuitem.getAttribute('data-megamenu');
            var activemegamenuContent = document.querySelector("[data-megamenu-content='" + activeMegamenuContentId + "']");

            var offsetEl = getOffset(activemegamenuContent);
            var offsetLeft = offsetEl.left;
            var offsetTop = offsetEl.top,
                upperLeft = {
                    x: offsetLeft,
                    y: offsetTop
                },
                upperRight = {
                    x: offsetLeft + activemegamenuContent.offsetWidth,
                    y: upperLeft.y
                },
                lowerLeft = {
                    x: offsetLeft,
                    y: offsetTop + activemegamenuContent.offsetHeight
                },
                lowerRight = {
                    x: offsetLeft + activemegamenuContent.offsetWidth,
                    y: lowerLeft.y
                },
                curLoc = mousePosition[mousePosition.length - 1],
                prevLoc = mousePosition[0];

            if (!curLoc) {
                return 0;
            }

            if (!prevLoc) {
                prevLoc = curLoc;
            }

            if (lastDelayPosition &&
                curLoc.x == lastDelayPosition.x && curLoc.y == lastDelayPosition.y) {
                return 0;
            }
            var isPointInsideTriangle = isInsideTriangle(curLoc.x, curLoc.y, prevLoc.x, prevLoc.y, upperLeft.x, upperLeft.y, upperRight.x, upperRight.y);
            if (options.megamenuDirection == "right") {
                var isPointInsideTriangle = isInsideTriangle(curLoc.x, curLoc.y, prevLoc.x, prevLoc.y, upperLeft.x, upperLeft.y, lowerLeft.x, lowerLeft.y);
            }
            function isInsideTriangle(px, py, ax, ay, bx, by, cx, cy) {
                var v0 = [cx - ax, cy - ay];
                var v1 = [bx - ax, by - ay];
                var v2 = [px - ax, py - ay];

                var dot00 = (v0[0] * v0[0]) + (v0[1] * v0[1]);
                var dot01 = (v0[0] * v1[0]) + (v0[1] * v1[1]);
                var dot02 = (v0[0] * v2[0]) + (v0[1] * v2[1]);
                var dot11 = (v1[0] * v1[0]) + (v1[1] * v1[1]);
                var dot12 = (v1[0] * v2[0]) + (v1[1] * v2[1]);

                var invDenom = 1 / (dot00 * dot11 - dot01 * dot01);

                var u = (dot11 * dot02 - dot01 * dot12) * invDenom;
                var v = (dot00 * dot12 - dot01 * dot02) * invDenom;

                return ((u >= 0) && (v >= 0) && (u + v < 1));
            }

            if (isPointInsideTriangle) {
                lastDelayPosition = curLoc;
                return mousePositionDelay;
            }

            lastDelayPosition = null;
            return 0;
        };

        if (options.megamenuEvent == 'hover') {
            var megamenuContent = document.querySelectorAll(options.megamenuContent);
            for (var i = 0; i < megamenuContent.length; i++) {
                megamenuContent[i].addEventListener('mouseenter', mouseenterMenuContent);
            }
            var megamenuBackdrop = document.querySelector(".zpmm-backdrop");
            megamenuBackdrop.addEventListener('mouseenter', mouseleaveMenu);
            var menuItem = menuContainer.querySelectorAll(options.menuItem);
            for (var i = 0; i < menuItem.length; i++) {
                menuItem[i].addEventListener('mouseenter', mouseenterMenuitem);
                menuItem[i].addEventListener('mouseleave', mouseleaveMenuitem);
            }
            document.addEventListener("mousemove", mousemoveDocument);
        } else if (options.megamenuEvent == 'click') {
            var menuItem = menuContainer.querySelectorAll(options.menuItem);
            for (var i = 0; i < menuItem.length; i++) {
                menuItem[i].addEventListener('click', clickMenuitem);
            }
        }
    }

    win.$mm = LIB.mmPlugin;

})();


function initMegamenu() {
    var megamenuContent = $D.getAll('[data-megamenu-content]');
    var megamenuContentContainer = $D.get('[data-megamenu-content-container]');
    if(megamenuContent && megamenuContent.length>0 && megamenuContentContainer){
        if (window.innerWidth >= 992) {
            var megamenuBackdrop = document.querySelector(".zpmm-backdrop");
            var megamenuDirection = document.querySelector("[data-megamenu-direction]").getAttribute('data-megamenu-direction');
            if ((typeof(megamenuContent) != 'undefined' && megamenuContent != null) && (typeof(megamenuContentContainer) != 'undefined' && megamenuContentContainer != null)) {
                moveMegamenuContent(megamenuContentContainer, megamenuContent);
            }

            var menu = document.querySelector("[data-megamenu-content-container]  .theme-menu > ul");
            $mm(menu, {
                megamenuDirection: megamenuDirection,
                activateMenuItem: activateMegamenu,
                deactivateMenuItem: deactivateMegamenu,
                exitMenuContainer: exitMegamenu
            });

            function activateMegamenu(megamenuItem) {
                var megamenuContentId = megamenuItem.getAttribute('data-megamenu'),
                    megamenuContent = document.querySelector("[data-megamenu-content='" + megamenuContentId + "']"),
                    megamenuDirection = document.querySelector("[data-megamenu-direction]").getAttribute('data-megamenu-direction'),
                    sidebarnav = document.querySelector('.theme-veritical-nav-with-sidebar');
                if (typeof(sidebarnav) == 'undefined' || sidebarnav == null) {
                    document.body.classList.add("theme-body-overflowhidden");
                }
                megamenuContent.classList.add("mmactive");
                if (megamenuDirection == 'right') {
                    var megamenuContentContainer = $D.get('[data-megamenu-content-container]');
                    var megamenuItemBounding = megamenuItem.getBoundingClientRect();
                    var firstMegamenuItemBounding = megamenuItem.parentNode.firstChild.getBoundingClientRect();
                    var firstVisibleMegamenuItem, lastVisibleMegamenuItem, elPos;
                    var megamenuItems = megamenuItem.parentNode.querySelectorAll("[data-megamenu]");
                    for (var i = 0; i < megamenuItems.length; i++) {
                        var isElemOutOfViewport = isOutOfViewport(megamenuItems[i]);
                        if ((firstVisibleMegamenuItem == 'undefined' || firstVisibleMegamenuItem == null) && isElemOutOfViewport.top == false) {
                            firstVisibleMegamenuItem = megamenuItems[i]
                        }
                        if ((firstVisibleMegamenuItem != 'undefined' || firstVisibleMegamenuItem != null) && (lastVisibleMegamenuItem == 'undefined' || lastVisibleMegamenuItem == null) && isElemOutOfViewport.bottom == true) {
                            lastVisibleMegamenuItem = megamenuItems[i - 1]
                        } else if (i == megamenuItems.length - 1) {
                            lastVisibleMegamenuItem = megamenuItems[i]
                        }
                    }
                    elPos = getPosition(firstVisibleMegamenuItem);
                    megamenuContent.style.top = elPos.top - 30 + "px";
                    if ((lastVisibleMegamenuItem.getBoundingClientRect().top - firstVisibleMegamenuItem.getBoundingClientRect().top) < 450) {
                        megamenuContent.style.height = 500 + "px";
                    } else {
                        megamenuContent.style.height = lastVisibleMegamenuItem.getBoundingClientRect().top + lastVisibleMegamenuItem.getBoundingClientRect().height - firstVisibleMegamenuItem.getBoundingClientRect().top + 60 + "px";
                    }
                    megamenuContent.style.left = megamenuContentContainer.clientWidth + "px";
                    megamenuContent.style.width = (window.innerWidth || document.documentElement.clientWidth) - megamenuContentContainer.clientWidth + "px";


                    if (typeof(sidebarnav) == 'undefined' || sidebarnav == null) {
                        megamenuContent.style.top = firstMegamenuItemBounding.top - 30 + "px";
                    }


                }
                megamenuItem.classList.add("theme-menu-selected");
                megamenuBackdrop.style.display = "block";
            }

            function deactivateMegamenu(megamenuItem) {
                var megamenuContentId = megamenuItem.getAttribute('data-megamenu'),
                    megamenuContent = document.querySelector("[data-megamenu-content='" + megamenuContentId + "']"),
                    megamenuDirection = document.querySelector("[data-megamenu-direction]").getAttribute('data-megamenu-direction'),
                    sidebarnav = document.querySelector('.theme-veritical-nav-with-sidebar');
                if (typeof(sidebarnav) == 'undefined' || sidebarnav == null) {
                    document.body.classList.remove("theme-body-overflowhidden");
                }
                megamenuContent.classList.remove("mmactive");
                megamenuItem.classList.remove("theme-menu-selected");
                if (megamenuDirection == 'right') {
                    megamenuContent.style.top = "";
                    megamenuContent.style.bottom = "";
                    megamenuContent.style.left = "";
                    megamenuContent.style.width = "";
                    megamenuContent.style.maxHeight = "";
                }
                megamenuBackdrop.style.display = "none";
                lastVisibleMegamenuItem = firstVisibleMegamenuItem = undefined;
            }

            function exitMegamenu(backdrop) {
                return true;
            }
        } else {
            moveMegamenuContentResponsive(megamenuContent);
        }
    }
}

function moveMegamenuContent(container, content) {
    for (var i = 0; i < content.length; i++) {
        $D.append(container, content[i]);
    }
}

function moveMegamenuContentResponsive(content) {
    var contentId, container;
    for (var i = 0; i < content.length; i++) {
        contentId = content[i].getAttribute('data-megamenu-content');
        container = document.querySelector("[data-megamenu='" + contentId + "'] > ul");
        $D.append(container, content[i]);
    }
}

var isOutOfViewport = function(elem) {
    var bounding = elem.getBoundingClientRect();
    var out = {};
    out.bounding = bounding;
    out.top = bounding.top < 0;
    out.left = bounding.left < 0;
    out.bottom = bounding.bottom > (window.innerHeight || document.documentElement.clientHeight);
    out.right = bounding.right > (window.innerWidth || document.documentElement.clientWidth);
    out.any = out.top || out.left || out.bottom || out.right;
    out.all = out.top && out.left && out.bottom && out.right;
    out.elh = bounding.height;
    out.vw = (window.innerWidth || document.documentElement.clientWidth);
    out.vh = (window.innerHeight || document.documentElement.clientHeight);
    return out;
};

function getPosition(elem) {
    var bounding = elem.getBoundingClientRect();
    var elPos = {};
    var body = document.body;
    var docEl = document.documentElement;
    var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
    var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;
    var clientTop = docEl.clientTop || body.clientTop || 0;
    var clientLeft = docEl.clientLeft || body.clientLeft || 0;
    elPos.top = Math.round(bounding.top + scrollTop - clientTop);
    elPos.left = Math.round(bounding.left + scrollLeft - clientLeft);
    return elPos;
}

$E.callOnLoad(initMegamenu);

window.addEventListener('resize', function(event) {
    initMegamenu();
});
