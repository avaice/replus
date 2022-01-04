//れぷらすバックグラウンド処理ソースコード
//2022.01.04
//れぷらすは　AVAの複垢管理ツール「あばぷらす」のプログラムを転用して作っています。

//注: ここでいうセッションIDとは "lkey" クッキーのことです


//初回起動時に変数を作る
chrome.storage.sync.get(["firstopen"], function(items) {
    if(items.firstopen == null){
        alert("れぷらすのインストールが完了しました\n※自己責任でご利用ください。作者はすべての事象において，責任を負いません。\n※HPからログアウト処理をすると登録したIDが使えなくなりますので，IDを追加する場合は拡張機能メニューの「新規」から行ってください。");
        chrome.storage.sync.set(
            {
                "firstopen": "1",
                "IDs": ""
            }
            );
    }    
});



chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    var unPackReq = request.split("&");
    if(unPackReq[0] == "getAuth"){
        chrome.cookies.get({url:'https://members.redsonline.jp/', name:'lkey'}, ((aCookie)=>{
            if(aCookie){
                const response = aCookie.value; //セッションID
                sendResponse(response); //セッションIDを返す

                //クエリが「#now」ならセッションIDだけ取得して終了する(Ver0.20)
                if(unPackReq[1] == "#now"){
                    return true;
                }
                
                //保存領域にセッションIDが保存されているか確認
                chrome.storage.sync.get(["IDs"], function(items) {
                    //console.log("IDs:"+ items.IDs);
                    if(items.IDs.indexOf( response ) == -1){
                        //登録処理
                        chrome.storage.sync.set(
                            {
                                "IDs": items.IDs + unPackReq[1] + "," + response + "\n"
                            }
                            );
                        alert("「" + unPackReq[1] + "」をれぷらすに追加しました！");
                    }else{

                        items.IDs.split("\n").forEach(element => {
                            if(element.indexOf( response ) != -1 && element.indexOf( unPackReq[1] ) == -1){
                                const _element = unPackReq[1] + "," + element.split(",")[1];
                                //登録処理
                                chrome.storage.sync.set(
                                    {
                                        "IDs": items.IDs.replace(element, _element)
                                    }
                                    );
                                alert("れぷらすの登録を「" + unPackReq[1] + "」に変更しました！");
                            }
                        });
                        //デバッグ用
                        //alert("「" + unPackReq[1] + "」は既に存在しています");
                        

                    }
                });
                
            }else{
                sendResponse("未ログイン");
            }
            
        }));
    }
    
    return true; //同期処理にさせる
});

