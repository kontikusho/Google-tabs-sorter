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
            init();

            var tabs = getTabList();

            // 並び替える
            tabSort(tabs, sortList);

            // スタイルを合わせる
            var menuStyle = getMenuStyle();

            removeStyle(menuStyle);

            addStyle(menuStyle,highlightEvent);

            var select = tabs[getTabName(location.href)].closest('.hdtb-imb');
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

var createAncer = function(text,href,classList) {
    var ancer = document.createElement('a');
    ancer.textContent = text;
    ancer.href = href;
    classList.forEach(function(className){
      ancer.classList.add(className);
    });
    return ancer;
};

var init=function() {
    var selectTab = document.querySelector('#hdtb-msb .hdtb-msel');
    // アンカータグの生成
    var ancer = createAncer(selectTab.textContent,'/search'+location.search,['q','qs']);
    selectTab.firstChild.replaceWith(ancer);
    selectTab.classList.remove('hdtb-msel');
};

var getTabName = function(url){
  var url = new URL(url);
  return url.searchParams.get("tbm") || (url.hostname.indexOf("map") != -1 ? "map" : "all");
};

var getTabList =function() {
    var tabs = {};
    for (var item of document.querySelectorAll('#hdtb-msb .hdtb-mitem a.q.qs')) {
        tabs[getTabName(item.href)] = item;
    };
    return tabs;
};

var tabSort = function(tabs, sortList) {
    for (var parent of document.querySelectorAll('#hdtb-msb .hdtb-imb')) {
        var tmp = tabs[sortList.shift()];
        parent.appendChild(tmp);
        tmp.parentNode.appendChild(parent.firstChild);
    }
};

var getMenuStyle=function() {
    return document.querySelector('#hdtb-msb a.q.qs[data-ved]').className.split(' ').filter(function(name) {
        return name !== 'q' && name !== 'qs'
    }).pop();
};

var getHighlightStyle=function() {
    return [].slice.call(document.styleSheets).reduce(function(a, b) {
        return a.concat([].slice.call(b.rules));
    }, []).filter(function(css) {
        return ("" + css.selectorText).indexOf('highlighted') != -1 && (("" + css.selectorText).split('.').length - 1) == 1;
    }).pop().selectorText.substr(1);
};

// メニュー1のスタイル
var removeStyle = function(menuStyle){
  for (var dom of document.querySelectorAll('#hdtb-msb .hdtb-imb a.q.qs')) {
      dom.classList.remove(menuStyle);
  };
}

var highlightEvent = function() {
    this.classList.toggle(getHighlightStyle());
};

var addStyle = function(menuStyle,highlightEvent){
  for (var dom of document.querySelectorAll('#hdtb-msb g-header-menu a.q.qs')) {
      dom.classList.add(menuStyle);
      dom.addEventListener('mouseover', highlightEvent);
      dom.addEventListener('mouseout', highlightEvent);
  };
}
