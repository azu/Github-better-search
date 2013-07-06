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
(function (){

    var URLHandler = {
        onSearch: function (){

        },
        onRepo: function (){
            var searchForm = util.selector("#js-command-bar-field");

            searchForm.addEventListener("keypress", function (evt){
                if (isShiftEnter(evt)) {
                    evt.preventDefault();
                    var input = util.querySelector("#js-command-bar-field");
                    var searchWord = input.value;
                    Github.searchInRepository(searchWord);
                }
            });

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
                // Hidden Radioを更新する
                var inputValue = input.value;
                input.checked = (inputValue === radioType);
                // update label
                var label = util.selector(".js-select-button");
                label.textContent = inputValue;
            }
        }

        function searchInPublic(word){
            var searchBasedURL = "https://github.com/search?q=";
            location.href = searchBasedURL + word;
        }

        function searchInRepository(word){
            // user/repoName
            var repositoryPath = getRepositoryInfo(repositoryInfoType.repository_nwo);
            var searchBasedURL = "https://" + repositoryPath + "/search?q=";
            location.href = searchBasedURL + word;
        }

        /**
         *
         * @type {{user_id: string, user_login: string, repository_id: string, repository_nwo: string, repository_public: string, repository_is_fork: string, repository_network_root_id: string, repository_network_root_nwo: string}}
         */
        var repositoryInfoType = {
            "user_id": "user_id",
            "user_login": "user_login",
            "repository_id": "repository_id",
            "repository_nwo": "repository_nwo",
            "repository_public": "repository_public",
            "repository_is_fork": "repository_is_fork",
            "repository_network_root_id": "repository_network_root_id",
            "repository_network_root_nwo": "repository_network_root_nwo"
        };

        /**
         *
         * @param {repositoryInfoType} infoType
         */
        function getRepositoryInfo(infoType){
            var info = window._octo[infoType];
            if (info == null) {
                util.throwError(new Error("Not found" + infoType));
            }
            return info;
        }

        return {
            selectRadioType: selectRadioType,
            selectRadioBox: selectRadioBox,
            searchInPublic: searchInPublic,
            searchInRepository: searchInRepository
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
})();