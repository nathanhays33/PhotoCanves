// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/colorList/colorList.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            // TODO: Initialize the page here.

            var pictureListDOM = document.getElementById('listX').winControl;
            pictureListDOM.addEventListener('iteminvoked', SelectItem);

            document.getElementById("clearButton")
                    .addEventListener("click", clearColorWarning, false);

            function clearColorWarning() {
                var msg = new Windows.UI.Popups.MessageDialog('This will erase all the colors',
                                                                  'Clear Palette');
                //Add buttons and set their callback functions
                msg.commands.append(new Windows.UI.Popups.UICommand("Cancel",
                   function (command) {


                   }));
                msg.commands.append(new Windows.UI.Popups.UICommand("Erase",
                       function (command) {
                           for (var i = 0; i < Data.colorArray.length; i++) {
                               //  codeShow.Demos.listview.live.data.unshift(WinJS.Binding.as({ value: "", color: "white" }));
                               codeShow.Demos.listview.live.data.pop();
                           };
                           Data.colorArray = new Array();

                       }));
                msg.showAsync();
            }

                updatecolor();

            function updatecolor() {
                var count = 0;
                codeShow.Demos.listview.live.data.forEach(function (value, color, index, array) {
                    if (count < Data.colorArray.length) {
                        value.value = Data.colorArray[count].color + '\n' + "red " + Data.colorArray[count].red +
                                       '\n' + "blue " + Data.colorArray[count].blue + '\n' + "green " + Data.colorArray[count].green;
                        value.color = Data.colorArray[count].color;
                    }
                    count++;
                });
            }

        },

        unload: function () {
            // TODO: Respond to navigations away from this page.
        },

        updateLayout: function (element) {
            /// <param name="element" domElement="true" />

            // TODO: Respond to changes in layout.
        }
    });
})();
