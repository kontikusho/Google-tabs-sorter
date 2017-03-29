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
            var tabs = {};
            // アンカーを入れほかのタブと同じ状態にする
            var selectTab = document.querySelector('#hdtb-msb .hdtb-msel');
            var selectText = selectTab.innerText;
            selectTab.innerText = '';
            // アンカーの作成
            var selectAncer = document.createElement('a');
            selectAncer.innerText = selectText;
            selectAncer.classList.add('q', 'qs');
            selectAncer.href = '/search' + location.search;
            selectTab.appendChild(selectAncer);
            selectTab.classList.remove('hdtb-msel');
            var parents = [];
            // タブ名?をキーにしてそれぞれのDOMを
            [].slice.call(document.querySelectorAll('#hdtb-msb .hdtb-mitem a.q.qs')).map(function(item) {
                var url = new URL(item.href);
                var key = url.searchParams.get("tbm") || (url.hostname.indexOf("map") != -1 ? "map" : "all");
                tabs[key] = item;
                parents.push(item.parentElement);
            });

            // 並び替える
            var n = 0;
            sortList.forEach(function(data) {
                var p = tabs[data].parentNode;
                var c = parents[n].firstChild;
                parents[n++].firstChild.replaceWith(tabs[data]);
                p.appendChild(c);
            });

            // スタイルを合わせる
            var menuStyle = document.querySelector('#hdtb-msb a.q.qs[data-ved]').className.split(' ').filter(function(name) {
                return name !== 'q' && name !== 'qs'
            }).pop();
            var highlightStyle = [].slice.call(document.styleSheets).reduce(function(a, b) {
                return a.concat([].slice.call(b.rules));
            }, []).filter(function(css) {
                return ("" + css.selectorText).indexOf('highlighted') != -1 && (("" + css.selectorText).split('.').length - 1) == 1;
            }).pop().selectorText.substr(1);
            [].slice.call(document.querySelectorAll('#hdtb-msb .hdtb-imb a.q.qs')).map(function(dom) {
                dom.classList.remove(menuStyle);
            });
            [].slice.call(document.querySelectorAll('#hdtb-msb g-header-menu a.q.qs')).map(function(dom) {
                dom.classList.add(menuStyle);
                dom.addEventListener('mouseover', function() {
                    this.classList.toggle(highlightStyle);
                });
                dom.addEventListener('mouseout', function() {
                    this.classList.toggle(highlightStyle);
                })
            });

            var select = tabs[(new URL(location.href)).searchParams.get('tbm') || 'all'].closest('.hdtb-imb');
            if(select){
                select.classList.add('hdtb-msel');
                select.firstChild.replaceWith(select.textContent);
            }
        }
    }, 10);
    setTimeout(function() {
        clearInterval(interval)
    }, 10000);
});

// イベントの設定
var setEevnt = function(sortList) {
    var time;
    var input = document.getElementById('lst-ib');
    input.onblur = event;
    input.oncompositionend = event;
    input.oncompositionstart = event;
    input.oncut = event;
    input.onfocus = event;
    input.oninput = event;
    input.onkeydown = input.onkeypress = event;
    input.onkeyup = event;
    input.onmousedown = event;
    input.onmouseup = event;
    input.onpaste = event;
    input.onselect = event;
    var search = document.querySelector('.lsb');
    search.onclick = event;
    var event = function() {
        if (time)
            clearTimeout(time);
        time = setTimeout(tabSort, 100, sortList);
    };
}

// ソート
var tabSort = function(sortList) {
    // 現在のタブを未選択状態にし、他のタブと同じ扱いが出来るようにする
    var a = document.createElement('a');
    a.className = 'q qs';
    var div = document.querySelector('div.hdtb-mitem.hdtb-msel.hdtb-imb');
    if (!div)
        return;
    a.innerText = div.innerText;
    div.innerText = '';
    div.appendChild(a);
    div.classList.remove('hdtb-msel');

    // リンクの取得
    var data = document.querySelectorAll('a.q.qs');
    var list = [].slice.call(data);

    // リストを作る
    list.forEach(function(dom) {
        var i = sortList.indexOf(dom.innerText === 'すべて' ? 'ウェブ' : dom.innerText);
        i >= 0 ? sortList[i] = dom : sortList.push(dom);
        dom.href = dom.href || null;
    });
    list = list.map(function(d) {
        return d.parentNode;
    });
    list.forEach(function(d) {
        var data = sortList.shift();
        if (typeof(data) !== "string")
            d.appendChild(data);
    });

    // 一旦他のと同じ扱いにするために未選択状態にしたものを選択状態に戻す
    var selectTab = document.querySelector('a.q.qs[href="null"]');
    if (!selectTab)
        return;
    selectTab = selectTab.parentNode;
    selectTab.classList.add('hdtb-msel');
    selectTab.innerHTML = selectTab.innerText;
    var topNav = document.querySelector('#top_nav');
    topNav.style.display = '';

};
