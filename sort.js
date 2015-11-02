var sortList={"画像":null,"動画":null,"ニュース":null};

//window.onload = function() {
  var data = document.querySelectorAll('a.q.qs');
  var list = [].slice.call(data);

  list.forEach(function(d){
      sortList[d.innerText]=d.href;
  });

  Object.keys(sortList).forEach(function(d,i){
    data.item(i).href=sortList[d];
    data.item(i).innerText=d;
  });
//};
