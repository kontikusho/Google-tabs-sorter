var sortList=["画像","動画","ニュース"];

var data = document.querySelectorAll('a.q.qs');
var list = [].slice.call(data);

list.sort(function(a,b){
  var ai = sortList.indexOf(a.innerText);
  var bi = sortList.indexOf(b.innerText);
  if(ai>bi){
    return -1;
  }else{
    return 1;
  }
});
list.forEach(function(d,i){
  var text=data.item(i).innerText;
  data.item(i).innerText=d.innerText;
  d.innerText=text;
});
