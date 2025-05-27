// 有关“空白”模板的简介，请参阅以下文档:
// http://go.microsoft.com/fwlink/?LinkId=232509

function isBackgroundTask() { return false; }
(function () {
    "use strict";

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;

    var uptime = null;

    app.onactivated = function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                if (console.warn) console.warn("[" + new Date().toDateString() + " " + new Date().toTimeString () + "] " + "此应用程序刚刚启动。在此处初始化。");
                // TODO: 此应用程序刚刚启动。在此处初始化
                //您的应用程序。
                registerTask();
                uptime = setInterval(updateTileAsync, 60 * 60 * 1000);
            } else {
                if (console.warn) console.warn("此应用程序已挂起，然后终止。");
                if (uptime) {
                    var itr = uptime;
                    uptime = null;
                    clearInterval(itr);
                }
                if (!uptime) {
                    uptime = setInterval(updateTileAsync, 60 * 60 * 1000);
                }
                // TODO: 此应用程序已挂起，然后终止。
                // 若要创造顺畅的用户体验，请在此处还原应用程序状态，使应用似乎永不停止运行。
            }
            args.setPromise(WinJS.UI.processAll());
        }
    };

    WinJS.Application.onloaded = function () {
        updateTileAsync();
        WinJS.Resources.processAll();
    }

    app.oncheckpoint = function (args) {
        if (console.warn) console.warn("即将挂起此应用程序。");
        if (uptime) {
            var itr = uptime;
            uptime = null;
            clearInterval(itr);
        }
        // TODO: 即将挂起此应用程序。在此处保存
        //需要在挂起中保留的任何状态。您可以使用
        // WinJS.Application.sessionState 对象，该对象将在
        //挂起中自动保存和恢复。如果您需要在
        //挂起应用程序之前完成异步操作，请调用
        // args.setPromise()。
    };

    app.start();
})();

function registerTask() {
    var taskRegistered = false;
    var background = Windows.ApplicationModel.Background;
    var iter = background.BackgroundTaskRegistration.allTasks.first();
    while (iter.hasCurrent) {
        if (iter.current.value.name === "TileUpdateTask") {
            taskRegistered = true;
            break;
        }
        iter.moveNext();
    }
    if (!taskRegistered) {
        var requestStatus = background.BackgroundExecutionManager.requestAccessAsync();
        requestStatus.done(function (status) {
            if (status === background.BackgroundAccessStatus.allowedWithAlwaysOnRealTimeConnectivity ||
                status === background.BackgroundAccessStatus.allowedMayUseActiveRealTimeConnectivity) {
                var builder = new Windows.ApplicationModel.Background.BackgroundTaskBuilder();
                builder.name = "TileUpdateTask";
                builder.taskEntryPoint = "backtask.js";
                builder.setTrigger(new Windows.ApplicationModel.Background.TimeTrigger(60, false));
                builder.addCondition(new background.SystemCondition(background.SystemConditionType.internetAvailable));
                builder.register();
            }
        });
    }
};