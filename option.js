// データのセッター
var setData = function(element, data) {
    element.value = data;
};
// ゲッター
var getData = function() {
    return [].slice.call(document.querySelectorAll('select')).map(function(element) {
        return element.value;
    }).filter(function(value) {
        return value !== "指定なし";
    });
}

// 設定の取得
var reset = function() {
    chrome.storage.local.get(function(data) {
        var defaultSortList = [
            "ウェブ",
            "画像",
            "動画",
            "ニュース"
        ];
        var sortList = data.sortList || defaultSortList;
        var element = document.querySelectorAll('select');
        sortList.forEach(function(data, index) {
            setData(element.item(index), data);
        });
    });
};

window.onload = function() {
    // イベントの設定
    // 保存ボタン
    document.getElementById('save').onclick = function() {
        chrome.storage.local.set({
            sortList: getData()
        }, reset);
    };
    document.getElementById('reset').onclick = reset;
};
reset();
