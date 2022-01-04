//れぷらすメインソースコード
//2020.08.26
//Ver0.20 2021.08.29
//Ver0.30 2021.09.27

var nowURL = null;

//ページの読み込みが終わったら


 document.addEventListener('DOMContentLoaded', function() {
    //console.log("AVAPLUS is now running!");
    nowURL = window.location;
     var pName = null;
     try {
         //左サイドのプレーヤー情報から，プレーヤー名を取得
        var elements = document.getElementById("redstoneidnametxt");
        pName = elements.innerHTML;
        document.getElementsByClassName("imgsp btn_logout")[0].innerHTML = '';

     } catch (error) {
     }

    if(pName){
        //ページの読み込みが終わったからセッションIDを持ってこいって命令している
        //引数にプレーヤー名を指定している
        chrome.runtime.sendMessage("getAuth&"+pName, function (response) {
            //alert(response);
        });
    }
    
});

chrome.extension.onMessage.addListener(function(req, sender, sendResponse) {
    var request;
    if(req.indexOf(",")){
        const _req = req.split(",");
        request = _req[0];
        var arr = _req[1];
    }else{
        request = req;
    }


    if (request == "reload") {
        window.location.reload(true);
    }else if (request == "login") {
        window.location.href = "https://secure.redsonline.jp/login/login.asp";
    }else if (request == "isLoaded") {
        sendResponse(nowURL);
    }else{
        window.location.href = request;
    }
});






