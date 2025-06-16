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
                uptime = setInterval(updateTileForTimer, 60 * 60 * 1000);
            } else {
                if (console.warn) console.warn("此应用程序已挂起，然后终止。");
                if (uptime) {
                    var itr = uptime;
                    uptime = null;
                    clearInterval(itr);
                }
                if (!uptime) {
                    uptime = setInterval(updateTileForTimer, 60 * 60 * 1000);
                }
                // TODO: 此应用程序已挂起，然后终止。
                // 若要创造顺畅的用户体验，请在此处还原应用程序状态，使应用似乎永不停止运行。
            }
            args.setPromise(WinJS.UI.processAll());
        }
    };

    WinJS.Application.onloaded = function () {
        updateTileForTimer();
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
    var background = Windows.ApplicationModel.Background;

    // 检查任务是否已注册
    function isTaskRegistered(name) {
        var iter = background.BackgroundTaskRegistration.allTasks.first();
        while (iter.hasCurrent) {
            if (iter.current.value.name === name) {
                return true;
            }
            iter.moveNext();
        }
        return false;
    }

    var requestStatus = background.BackgroundExecutionManager.requestAccessAsync();
    requestStatus.done(function (status) {
        if (status === background.BackgroundAccessStatus.allowedWithAlwaysOnRealTimeConnectivity ||
            status === background.BackgroundAccessStatus.allowedMayUseActiveRealTimeConnectivity) {

            // 注册定时触发任务（每60分钟）
            if (!isTaskRegistered("TileUpdateTask_Timer")) {
                var builderTimer = new background.BackgroundTaskBuilder();
                builderTimer.name = "TileUpdateTask_Timer";
                builderTimer.taskEntryPoint = "backtask.js";
                builderTimer.setTrigger(new background.TimeTrigger(30, false));
                builderTimer.addCondition(new background.SystemCondition(background.SystemConditionType.internetAvailable));
                builderTimer.register();
            }

            // 注册系统事件触发任务（用户登录后）
            if (!isTaskRegistered("TileUpdateTask_OnBoot")) {
                var builderBoot = new background.BackgroundTaskBuilder();
                builderBoot.name = "TileUpdateTask_OnBoot";
                builderBoot.taskEntryPoint = "backtask.js";
                builderBoot.setTrigger(new background.SystemTrigger(background.SystemTriggerType.userPresent, false));
                builderBoot.addCondition(new background.SystemCondition(background.SystemConditionType.internetAvailable));
                builderBoot.register();
            }

            if (!isTaskRegistered("TileUpdateTask_Network")) {
                var builderNet = new background.BackgroundTaskBuilder();
                builderNet.name = "TileUpdateTask_Network";
                builderNet.taskEntryPoint = "backtask.js";
                builderNet.setTrigger(new background.SystemTrigger(background.SystemTriggerType.networkStateChange, false));
                builderNet.addCondition(new background.SystemCondition(background.SystemConditionType.internetAvailable));
                builderNet.register();
            }
        }
    });
}

function updateTileForTimer() {
    return WinJS.Promise.timeout(15000, updateTileAsync()).then(
        function () {

        }, function (err) {
            if (typeof setDisplayStatus === "function") {
                setDisplayStatus("更新磁贴失败：" + err);
            }
            if (typeof setUpdateButtonDisabled === "function") {
                setUpdateButtonDisabled(false);
            }
            return;
            return WinJS.Promise.wrapError(err);
        });
}