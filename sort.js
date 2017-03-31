// 設定の取得、初期化
chrome.storage.local.get(function(data) {
    var defaultSortList = [
        "all",
        "isch",
        "vid",
        "nws",
        "map"
    ];
    var sortList = defaultSortList;
    chrome.storage.local.set({
        sortList: sortList
    }, function() {});
    // "もっと見る"タブの中身ができるまで待つ
    var interval = setInterval(function() {
        var list = document.querySelectorAll("g-header-menu a.q.qs");
        if (list.length > 0) {
            clearInterval(interval);

            // 現在選択中のタブを他のと一緒にする
            (function() {
                var selectTab = document.querySelector('#hdtb-msb .hdtb-msel');
                var ancer = (function(text) {
                    var ancer = document.createElement('a');
                    ancer.textContent = text;
                    ancer.href = '/search' + location.search;
                    ancer.classList.add('q', 'qs');
                    return ancer;
                })(selectTab.textContent);
                selectTab.firstChild.replaceWith(ancer);
                selectTab.classList.remove('hdtb-msel');
            })();

            var tabs = (function() {
                var tabs = {};
                for (var item of document.querySelectorAll('#hdtb-msb .hdtb-mitem a.q.qs')) {
                    var url = new URL(item.href);
                    var key = url.searchParams.get("tbm") || (url.hostname.indexOf("map") != -1 ? "map" : "all");
                    tabs[key] = item;
                };
                return tabs;
            })();

            // 並び替える
            (function(tabs, sortList) {
                for (var parent of document.querySelectorAll('#hdtb-msb .hdtb-imb')) {
                    var tmp = tabs[sortList.shift()];
                    parent.appendChild(tmp);
                    tmp.parentNode.appendChild(parent.firstChild);
                }
            })(tabs, sortList);

            // スタイルを合わせる
            var menuStyle = (function() {
                return document.querySelector('#hdtb-msb a.q.qs[data-ved]').className.split(' ').filter(function(name) {
                    return name !== 'q' && name !== 'qs'
                }).pop();
            })();

            var highlightStyle = (function() {
                return [].slice.call(document.styleSheets).reduce(function(a, b) {
                    return a.concat([].slice.call(b.rules));
                }, []).filter(function(css) {
                    return ("" + css.selectorText).indexOf('highlighted') != -1 && (("" + css.selectorText).split('.').length - 1) == 1;
                }).pop().selectorText.substr(1);
            })();

            for (var dom of document.querySelectorAll('#hdtb-msb .hdtb-imb a.q.qs')) {
                dom.classList.remove(menuStyle);
            };

            var highlight = function() {
                this.classList.toggle(highlightStyle);
            };
            for (var dom of document.querySelectorAll('#hdtb-msb g-header-menu a.q.qs')) {
                dom.classList.add(menuStyle);
                dom.addEventListener('mouseover', highlight);
                dom.addEventListener('mouseout', highlight);
            };

            var select = tabs[(new URL(location.href)).searchParams.get('tbm') || 'all'].closest('.hdtb-imb');
            if (select) {
                select.classList.add('hdtb-msel');
                select.firstChild.replaceWith(select.textContent);
            }
        }
    }, 10);
    setTimeout(function() {
        clearInterval(interval)
    }, 10000);
});
