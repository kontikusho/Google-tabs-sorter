// 10ms単位で"もっと見る"タブの子要素の状態を見に行っていくつかあったらソートの実行
(function () {
    var interval = setInterval(function () {
        var moreInfo = document.querySelector('#hdtb-more-mn');
        if (moreInfo && moreInfo.children.length > 0) {
            clearInterval(interval);
            tabSort();
        }
    }, 10);
})();

var tabSort = function () {
    var sortList = {"ウェブ": null, "画像": null, "動画": null, "ニュース": null};
    // 現在のタブを未選択状態にし、他のタブと同じ扱いが出来るようにする
    var a = document.createElement('a');
    a.className = 'q qs';
    var div = document.querySelector('div.hdtb-mitem.hdtb-msel.hdtb-imb');
    a.innerText = div.innerText;
    div.innerText = '';
    div.appendChild(a);
    div.classList.remove('hdtb-msel');

    // リンクの取得
    var data = document.querySelectorAll('a.q.qs');
    var list = [].slice.call(data);

    // リンクテキストとリンクのオブジェクトを作る
    list.forEach(function (d) {
        sortList[d.innerText] = d.href;
    });

    // オブジェクトのキー順に、リンクテキストとリンクを変更する
    Object.keys(sortList).forEach(function (d, i) {
        if (!data.item(i))
            return;
        data.item(i).href = sortList[d];
        data.item(i).innerText = d;
    });

    // 一旦他のと同じ扱いにするために未選択状態にしたものを選択状態に戻す
    var selectTab = document.querySelector('a.q.qs[href=""]').parentNode;
    selectTab.classList.add('hdtb-msel');
    selectTab.innerHTML = selectTab.innerText;
};
