(function() {
    'use strict';

    if (typeof window.editorPaste === 'function') {
        window.editorPaste = function() { return true; };
    }

    function unlockCodeEditors() {
        if (window.codeEditors && typeof window.codeEditors === 'object') {
            Object.keys(window.codeEditors).forEach(function(key) {
                var cm = window.codeEditors[key];
                if (cm && cm._handlers && cm._handlers.beforeChange) {
                    cm._handlers.beforeChange = [];
                }
            });
        }
    }

    if (window.CodeMirror && window.CodeMirror.prototype) {
        var origOn = window.CodeMirror.prototype.on;
        window.CodeMirror.prototype.on = function(type, f) {
            if (type === 'beforeChange') {
                var safeFn = function(cm, change) {
                    if (change && change.origin === 'paste') {
                        return;
                    }
                    return f.apply(this, arguments);
                };
                return origOn.call(this, type, safeFn);
            }
            return origOn.apply(this, arguments);
        };
    }

    unlockCodeEditors();
    setInterval(unlockCodeEditors, 1000);

    ['copy', 'paste', 'cut', 'contextmenu', 'selectstart'].forEach(function(event) {
        document.addEventListener(event, function(e) {
            e.stopPropagation();
        }, true);
    });


    var style = document.createElement('style');
    style.id = 'force-allow-select-copy';
    style.innerHTML = `
        *, *::before, *::after {
            -webkit-user-select: auto !important;
            -moz-user-select: auto !important;
            -ms-user-select: auto !important;
            user-select: auto !important;
        }
    `;
    document.head.appendChild(style);

    console.log('%c[成功] 复制与粘贴限制已全部解除！', 'color: green; font-weight: bold; font-size: 14px;');
})();
