// For an introduction to the Navigation template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=392287

var roamingSettings, appData = null;

(function () {
    "use strict";

    var activation = Windows.ApplicationModel.Activation;
    var app = WinJS.Application;
    var nav = WinJS.Navigation;
    var sched = WinJS.Utilities.Scheduler;
    var ui = WinJS.UI;


    app.addEventListener("activated", function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {


            WinJS.Namespace.define("codeShow.Demos.listview.live", {
                data: new WinJS.Binding.List({ binding: true })
            });

            WinJS.Namespace.define("Data", {
                zoomed: false,
                currentFile: null,
                vertical: false,
                colorArray: new Array()
            });

            appData = Windows.Storage.ApplicationData.current;
            roamingSettings = appData.roamingSettings;

            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                // TODO: This application has been newly launched. Initialize
                // your application here.
            } else {
                // TODO: This application has been reactivated from suspension.
                // Restore application state here.

                // Restore the rating. 
                var colors = roamingSettings.values["colorArray"];
                if (colors) {
                    var parsedJson = JSON.parse(colors);
                    Data.colorArray = parsedJson;

                    for (var i = 0; i < Data.colorArray.length; i++) {
                        codeShow.Demos.listview.live.data.push(WinJS.Binding.as({ value: "", color: "white" }));
                    };
                }

            }

            nav.history = app.sessionState.history || {};
            nav.history.current.initialPlaceholder = true;

            // Optimize the load of the application and while the splash screen is shown, execute high priority scheduled work.
            ui.disableAnimations();
            var p = ui.processAll().then(function () {
                return nav.navigate(nav.location || Application.navigator.home, nav.state);
            }).then(function () {
                return sched.requestDrain(sched.Priority.aboveNormal + 1);
            }).then(function () {
                ui.enableAnimations();
            });

            args.setPromise(p);
        }
    });

    app.oncheckpoint = function (args) {
        // TODO: This application is about to be suspended. Save any state
        // that needs to persist across suspensions here. If you need to 
        // complete an asynchronous operation before your application is 
        // suspended, call args.setPromise().
        saveColor(Data.colorArray)

        app.sessionState.history = nav.history;
    };

    app.start();
})();

function saveColor(colorArray) {
    // Store the rating for multiple sessions.
    roamingSettings = appData.roamingSettings;
    roamingSettings.values["colorArray"] = JSON.stringify(colorArray);
}

function SelectItem(event) {
    var selectedItem = event.detail.itemIndex;
    showColorDialog(selectedItem);
}

function showColorDialog(index) {
    var message =
                  "Hex: " + Data.colorArray[index].color + '\n' +
                  "Red: " + Data.colorArray[index].red + '\n' +
                  "Green: " + Data.colorArray[index].green + '\n' +
                  "Blue: " + Data.colorArray[index].blue + '\n' +
                  "File: " + Data.colorArray[index].file;

    var msg = new Windows.UI.Popups.MessageDialog(message,
                                                      'Color Details');
    //Add buttons and set their callback functions
    msg.commands.append(new Windows.UI.Popups.UICommand("OK",
       function (command) {


       }));
    msg.showAsync();
}