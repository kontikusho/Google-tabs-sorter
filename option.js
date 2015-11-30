// データのセッター
var setData = function(element, data) {
  element.value = data;
};
// ゲッター
var getData = function() {
  var result = {};
  [].slice.call(document.querySelectorAll('select')).map(function(element) {
    if (element.value !== "指定なし")
      result[element.value] = null;
  });
  return result;
}

// 設定の取得
var reset = function() {
  chrome.storage.local.get(function(data) {
    var defaultSortList = {
      "ウェブ": null,
      "画像": null,
      "動画": null,
      "ニュース": null
    };
    var sortList = data.sortList || defaultSortList;
    var element = document.querySelectorAll('select');
    Object.keys(sortList).forEach(function(data, index) {
      setData(element.item(index), data);
    });
  });
};

window.onload = function() {
  // イベントの設定
  // 保存ボタン
  document.getElementById('save').onclick = function() {
    console.log(getData());
    chrome.storage.local.set(getData(), reset);
  };
  document.getElementById('reset').onclick = reset;
};
reset();
