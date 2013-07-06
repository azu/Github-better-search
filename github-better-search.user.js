// ==UserScript==
// @id   github-better-search
// @name Github Better Search
// @namespace http://efcl.info/
// @version 1.0
// @description Enhance Github Search
// @include https://github.com/*
// @exclude http://twicli.neocat.jp/twicli.html
// @require https://gist.github.com/yoko/648950/raw/5eefb998f63948b7baad776421a76eceedf853d3/dispatcher.js
// @run-at  document-end
// ==/UserScript==
var URLHandler = {
    onSearch: function (){

    },
    onRepo: function (){
        var searchForm = util.selector("#top_search_form");
        var searchButton = document.createElement("button");
        searchButton.textContent = "ボタン";
        searchButton.style = "position: absolute;right: 30px;";
        searchButton.addEventListener("click", function (evt){
            var input = util.querySelector("#js-command-bar-field");
            var searchWord = input.value;
            Github.searchInPublic(searchWord);
        });
        searchForm.parentNode.insertBefore(searchButton, searchForm);
        Github.selectRadioBox(Github.selectRadioType.global);
    },

    onOther: function (){
    }

};

var Github = (function (){
    /**
     * Github Search の検索オプション
     * @type {{repository: string, global: string}}
     */
    var selectRadioType = {
        repository: "repository",
        global: "global"
    };

    /**
     * 検索オプションの選択をする
     * @param {selectRadioType} radioType
     */
    function selectRadioBox(radioType){
        var searchTarget = document.getElementsByName("search_target");
        for (var i = 0, len = searchTarget.length; i < len; i++) {
            var input = searchTarget[i];
            var inputValue = input.value;
            if (inputValue === radioType) {
                input.checked = true;
            } else {
                input.checked = false;
            }
            // update laabel
            var label = util.selector(".js-select-button");
            label.textContent = radioType;
        }
    }

    function searchInPublic(word){
        var searchBasedURL = "https://github.com/search?q=";
        location.href = searchBasedURL + word;
    }


    return {
        selectRadioType: selectRadioType,
        selectRadioBox: selectRadioBox,
        searchInPublic: searchInPublic
    }
})();

var util = (function (){
    function selector(selector){
        var result = document.querySelector(selector);
        if (result == null) {
            throwError(new Error("Not found" + selector));
        }
        return result;
    }

    function selectorAll(selector){
        var result = document.querySelectorAll(selector);
        if (result == null) {
            throwError(new Error("Not found" + selector));
        }
        return result;
    }

    /**
     * throw error & notification error
     * @param {Error} error
     */
    function throwError(error){
        GM_notification(error.message, GM_getMetadata("name") + " is Error");
        throw error;
    }

    return {
        selector: selector,
        selectorAll: selectorAll,
        throwError: throwError
    }
})();

(function main(){

    dispatcher
        .connect(/^\/search/, URLHandler.onSearch)
        .connect(/^\/.*?\//, URLHandler.onRepo)
        .connect(/^\/.*?/, URLHandler.onOther)
        .dispatch();

})();
