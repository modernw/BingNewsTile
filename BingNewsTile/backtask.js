(function () {
    "use strict";

    importScripts(
        "//Microsoft.WinJS.2.0/js/base.js",
        "/js/uri.js",
        "/js/tiletemplate.js",
        "/js/tiletrans.js",
        "/js/tileup.js"
    );

    setGetMarketFunction(function () {
        return Windows.Storage.ApplicationData.current.localSettings.values["language"];
        var lang = Windows.Globalization.ApplicationLanguages.languages[0];
        if (lang) {
            var parts = lang.split("-");
            if (parts.length === 1) return parts[0].toLowerCase();
            if (parts.length === 2) return (parts[0] + "-" + parts[1]).toLowerCase();
            // 多段形式，如 zh-Hans-CN → zh-CN，ca-ES-Valencia → ca-ES
            return (parts[0] + "-" + parts[parts.length - 1]).toLowerCase();
        }
        return "";
    });

    var cancel = false,
        progress = 0,
        backgroundTaskInstance = Windows.UI.WebUI.WebUIBackgroundTaskInstance.current,
        cancelReason = "";

    function getDateTimeStamp() { return "" + new Date().toDateString() + " " + new Date().toTimeString(); }

    // 自定义日志工具（保持原样）
    function SimpleLogger() {
        this.id = "TileUpdate";
        this.log = function (msg) { console.log("[" + this.id + "] " + msg); };
        this.logError = function (msg) { console.error("[" + this.id + "] " + msg); };
        this.initialize = function () { return new WinJS.Promise.as(); };
        this.close = function () { return WinJS.Promise.as(); };
    }
    var TileUpdateTask =
        {
            run: function (taskInstance) {
                var deferral = taskInstance.getDeferral();
                var logger = new SimpleLogger();
                logger.initialize().then(function () {
                    logger.log(getDateTimeStamp());
                    logger.log("后台磁贴更新任务启动");
                    this._executeTask(taskInstance, logger, deferral);
                }.bind(this)).done(undefined, function (error) { 
                    logger.logError("初始化失败: " + error.message);
                    deferral.complete();
                });
            },
            _executeTask: function (taskInstance, logger, deferral) {
                updateTileAsync()
                    .then(function () {
                        logger.log("磁贴更新成功");
                        taskInstance.succeeded = true;
                    }, function (e) {
                        logger.logError("磁贴更新失败: " + e.message);
                        taskInstance.succeeded = false;
                    })
                    .then(function () {
                        return logger.close();
                    }, function (finalError) {
                        logger.logError("最终错误: " + finalError.message);
                        return logger.close();
                    })
                    .then(function () {
                        deferral.complete();
                    });
            }
        };
    
    TileUpdateTask.run(backgroundTaskInstance);
})();