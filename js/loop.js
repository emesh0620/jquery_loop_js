
/*
 loop.js - v0.1 
 * 
 * Copyright (c) 2020 emesh
 * MIT-style license. 
 */

;(function($) { 
    const ERROR_MASSGE  = 'データの更新に失敗しました'; //データの更新に失敗したときのエラーメッセージ
    const INITIAL       = 'loop-cache-';         //キャッシュの先頭に付けるワード 
    const IMAGE_LOOP   = '#next_loop';          //結果を表示するdiv(span）に指定するID
    const IMAGE_BTM    = '#next_loop_btm_body'　//【もっと見る】ボタンを囲むdiv(span）に指定するID

    /*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
    キャッシュのクリア 
   \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*/
    $.fn.loop_looping_clear = function() {
        var key_cache    = [];
        $(this).click(function(event){
            key_cache = get_cachename();
            key_cache.forEach(function( value ) {
                if(value.indexOf(INITIAL) == 0){
                    sessionStorage.removeItem(value);
                }
            });
        });
    }

    //全てのsessionStorageを取得する
    function get_cachename(){
        var key_cache  = [];
        var leng = Number(sessionStorage.length);
        for (var i = 0; i < leng; i++) {
            key_cache.push(sessionStorage.key(i));
        }
        return key_cache;
    }

    /*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
    無限スクロールを実現する
   /*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*/
    $.fn.loop_looping = function(pram) {
       
        const CACHE = INITIAL + pram.name;

        if (sessionStorage.getItem(CACHE) == null){
            var page = Number(0);
            var time = Math.round((new Date()).getTime() / 1000);
            var html = "";
        }else{
            var tmp = JSON.parse(sessionStorage.getItem(CACHE));
            var page = Number(tmp.page);
            var time = tmp.time;
            var html = tmp.html;
        }

        //ページ数と一致するならボタンを隠す
        var all_page = Number(pram.allpage);
        if (all_page < (page + 1)){
            $(IMAGE_BTM).fadeOut(10);
        }

        //キャッシュを挿入
        $(html).appendTo(IMAGE_LOOP).hide().fadeIn(600);

        //ボタンを押したときに実行
        $(this).click(function(event){
            event.preventDefault();

            //ページを指定
            page = Number(page) + Number(1);

            //URLを指定
            var url       = pram.url
            var targerURL = url.replace('$', page);

            if (Number(all_page) <= (Number(page) )){
                $(IMAGE_BTM).fadeOut(10);
            }

            //ajax
            $.ajax({
                url: targerURL,
                dataType : 'html',
                type:'GET'
            })
            .done(function(data) {
                html  = html + data;
                
                //cache
                var arr = {
                    page : page,
                    time : time,
                    html : html
                }

                //データを追加
                sessionStorage.setItem(CACHE, JSON.stringify(arr));                
                $(data).appendTo(IMAGE_LOOP).hide().fadeIn(850);

            })
            .fail(function(data) {
                alert(ERROR_MASSGE)
            });
            

        });
    }

})(jQuery);

