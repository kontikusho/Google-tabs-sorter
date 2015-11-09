window.onload = function () {
    var sortList = {"ウェブ": null, "画像": null, "動画": null, "ニュース": null};
    var a = document.createElement('a');
    a.className = 'q qs';
    var div = document.querySelector('div.hdtb-mitem.hdtb-msel.hdtb-imb');
    a.innerText = div.innerText;
    div.innerText = '';
    div.appendChild(a);
    div.classList.remove('hdtb-msel');

    var data = document.querySelectorAll('a.q.qs');
    var list = [].slice.call(data);

    list.forEach(function (d) {
        sortList[d.innerText] = d.href;
    });

    Object.keys(sortList).forEach(function (d, i) {
        if (!data.item(i))
            return;
        data.item(i).href = sortList[d];
        data.item(i).innerText = d;
    });

    var selectTab = document.querySelector('a.q.qs[href=""]').parentNode;
    selectTab.classList.add('hdtb-msel');
    selectTab.innerHTML = selectTab.innerText;
};