// 設定の取得、初期化
chrome.storage.local.get(function(data) {
  var defaultSortList = {
    "ウェブ": null,
    "画像": null,
    "動画": null,
    "ニュース": null
  };
  var sortList = data.sortList || defaultSortList;
  chrome.storage.local.set(sortList, function() {});
  // "もっと見る"タブの中身ができるまで待つ
  var interval = setInterval(function() {
    var moreInfo = document.querySelector('#hdtb-more-mn');
    if (moreInfo && moreInfo.children.length > 0) {
      clearInterval(interval);
      setEevnt(sortList);
      tabSort(sortList);
    }
  }, 10);
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
    console.log("test");
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

  // リンクテキストとリンクのオブジェクトを作る
  list.forEach(function(d) {
    sortList[d.innerText] = d.href;
  });

  // オブジェクトのキー順に、リンクテキストとリンクを変更する
  Object.keys(sortList).forEach(function(d, i) {
    if (!data.item(i))
      return;
    data.item(i).href = sortList[d];
    data.item(i).innerText = d;
  });

  // 一旦他のと同じ扱いにするために未選択状態にしたものを選択状態に戻す
  var selectTab = document.querySelector('a.q.qs[href=""]');
  if (!selectTab)
    return;
  selectTab = selectTab.parentNode;
  selectTab.classList.add('hdtb-msel');
  selectTab.innerHTML = selectTab.innerText;
};
