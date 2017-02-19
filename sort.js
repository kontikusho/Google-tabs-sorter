// 設定の取得、初期化
chrome.storage.local.get(function(data) {
  var defaultSortList = [
    "ウェブ",
    "画像",
    "動画",
    "ニュース"
  ];
  var sortList = data.sortList || defaultSortList;
  chrome.storage.local.set({sortList:sortList}, function() {});
  // "もっと見る"タブの中身ができるまで待つ
  var interval = setInterval(function() {
    var list = document.querySelectorAll("g-dropdown-menu a.q.qs")
    if (list.length > 0){
        clearInterval(interval);
        window.tablist = [].slice.call(document.querySelectorAll('#hdtb-msb a.q.qs')).map(function(item){
            item.url = new URL(item.href);
            return item;
        });
        console.log(tablist.map(function(item){
            return item.url.searchParams.get("tbm")||(item.url.hostname.indexOf("map") != -1?"map":"all" )
        }));
    }
  }, 10);
  setTimeout(function(){clearInterval(interval)},10000);
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
    var i=sortList.indexOf(dom.innerText==='すべて'?'ウェブ':dom.innerText);
    i>=0?sortList[i]=dom:sortList.push(dom);
    dom.href=dom.href||null;
  });
  list=list.map(function(d){
    return d.parentNode;
  });
  list.forEach(function(d){
    var data=sortList.shift();
    if(typeof(data)!=="string")
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
  topNav.style.display= '';

};
