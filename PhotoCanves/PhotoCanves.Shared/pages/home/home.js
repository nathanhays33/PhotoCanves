


(function () {
    "use strict";


    WinJS.UI.Pages.define("/pages/home/home.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            // TODO: Initialize the page here.


            document.getElementById("getPhotoButton")
                .addEventListener("click", getPhotoButtonClickHandler, false);

            var zoomButton =  document.getElementById("zoomOutButton");
            zoomButton.addEventListener("click", zoomOut, false);
            zoomButton.style.visibility = 'hidden';

            var grayButton = document.getElementById("grayScaleButton");
            grayButton.addEventListener("click", alterPhotoButton, false);
            grayButton.style.visibility = 'hidden';

            var x = null;
            var ctx = (document.getElementsByTagName('canvas')[0]).getContext('2d');
            var img = new Image();
            var canvas = document.getElementsByTagName('canvas')[0];
            var clickPromise;
            const ITEM_COUNT = 5;

            if (Data.currentFile != null) {
                loadFileInCanvas();
                setCanvasEvents();
                grayButton.style.visibility = 'visible';

            }
            else {
                ctx.font = 'italic 18pt Calibri';
                ctx.fillText('Load an image by Windows logo key‌ + z, right clicking or by bottom swiping', 20, 50);
            }

            /*** List Live ***/
            for (var i = 0; i < ITEM_COUNT; i++) {
                codeShow.Demos.listview.live.data.push(WinJS.Binding.as({ value: "", color: "white" }));
            };

            var pictureListDOM = document.getElementById('list').winControl;
            pictureListDOM.addEventListener('iteminvoked', SelectItem);

            function updatecolor(hex, red, green, blue) {
                var count = 0;
                Data.colorArray.unshift({
                    'color': hex,
                    'red': red,
                    'green': green,
                    'blue': blue,
                    'file' : Data.currentFile.path

                });


                codeShow.Demos.listview.live.data.forEach(function (value, color, index, array) {
                    if (count < Data.colorArray.length ) {
                        value.value = Data.colorArray[count].color + '\n' + "red " + Data.colorArray[count].red +
                                       '\n' + "blue " + Data.colorArray[count].blue + '\n' + "green " + Data.colorArray[count].green;
                        value.color = Data.colorArray[count].color;
                    }
                    count++;
                });
            }


            /*****/


            function setCanvasEvents() {
                canvas.addEventListener('mousemove',
                function (evt) {
                    liveColor(evt);
                }, false);

                canvas.addEventListener('click',
                    function (evt) {
                        var mousePos = getMousePos(event);
                        if (clickPromise === undefined)
                            clickPromise = WinJS.Promise.timeout(250).then(function () {
                                var x = getHexFromPixel(mousePos.y, mousePos.x);
                                clickPromise = undefined;
                            });

                    }, false);

                canvas.addEventListener('dblclick',
                    function (evt) {
                        if (clickPromise !== undefined) {
                            clickPromise.cancel();
                            clickPromise = undefined;
                        }

                            var factor =2;
                            var pt = getMousePos(event);
                            ctx.translate(pt.x, pt.y);
                            ctx.scale(factor, factor);
                            ctx.translate(-pt.x, -pt.y);
                            ctx.restore();
                            loadFileInCanvas();
                            zoomButton.style.visibility = 'visible';
                    }, false);
                    
            }
              function getMousePos(evt) {
                var canPos = WinJS.Utilities.getPosition(evt.currentTarget);
                var mouseX = evt.clientX - canPos.left;
                var mouseY = evt.clientY - canPos.top;
                return {
                    x: mouseX,
                    y: mouseY
                };
            }


            function rgbToHex(R, G, B) { return toHex(R) + toHex(G) + toHex(B) }
            function toHex(n) {
                n = parseInt(n, 10);
                if (isNaN(n)) return "00";
                n = Math.max(0, Math.min(n, 255));
                return "0123456789ABCDEF".charAt((n - n % 16) / 16)
                     + "0123456789ABCDEF".charAt(n % 16);
            }
            function getPixel(yy, xx) {
                return ((yy - 1) * (x.width * 4)) + ((xx - 1) * 4);
            }

            function getHexFromPixel(mouseY, mouseX) {
                var pixel = getPixel(mouseY, mouseX);
                var length = x.data.length;
                var hex = rgbToHex(x.data[pixel], x.data[pixel + 1], x.data[pixel + 2]);
                updatecolor("#" + hex, x.data[pixel], x.data[pixel] + 1, x.data[pixel] + 2);
                return hex;
            }

            function liveColor(evt) {
                var canPos = WinJS.Utilities.getPosition(evt.currentTarget);
                var mouseX = evt.clientX - canPos.left;
                var mouseY = evt.clientY - canPos.top;
                var pixel = getPixel(mouseY, mouseX);
                //  var hex = rgbToHex(x.data[pixel], x.data[pixel + 1], x.data[pixel + 2]);

                var c = document.getElementById("colorSample");
                var ctx = c.getContext("2d");
                ctx.rect(20, 20, 150, 100);
                ctx.fillStyle = "rgb(" + x.data[pixel] + "," +  x.data[pixel + 1] + "," +  x.data[pixel + 2] + ")";
                ctx.fill();

            }


            function loadFileInCanvas() {
                // Application now has read/write access to the picked file
                var imageBlob = URL.createObjectURL(Data.currentFile, { oneTimeOnly: false });
                img.src = imageBlob;

                img.onload = function () {
                    if (Data.vertical) {
                        ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, 600, 800);
                        x = ctx.getImageData(0, 0, 1000, 700);
                    }
                    else {
                        ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, 800, 600);
                        x = ctx.getImageData(0, 0, 1000, 700);
                    }
                }
            }

            function zoomOut(evt) {
                canvas.width = canvas.width;
                loadFileInCanvas();
                zoomButton.style.visibility = 'hidden';
                grayButton.style.visibility = 'visible';

            }

            function saveCanvas() {
                var canvas = document.getElementsByTagName('canvas')[0];
                var blob = canvas.msToBlob();

                var output;
                var input;
                var outputStream;

                Windows.Storage.KnownFolders.picturesLibrary.createFileAsync(testImage.jpg,
                                Windows.Storage.CreationCollisionOption.replaceExisting).
                    then(function (file) {
                        return file.openAsync(Windows.Storage.FileAccessMode.readWrite);
                    }).then(function (stream) {
                        outputStream = stream;
                        output = stream.getOutputStreamAt(0);
                        input = blob.msDetachStream();
                        return Windows.Storage.Streams.RandomAccessStream.copyAsync(input, output);
                    }).then(function () {
                        return output.flushAsync();
                    }).done(function () {
                        input.close();
                        output.close();
                        outputStream.close();
                    });
            }

            function getPhotoButtonClickHandler (eventInfo) {
                // Create the picker object and set options
                var openPicker = new Windows.Storage.Pickers.FileOpenPicker();
                openPicker.viewMode = Windows.Storage.Pickers.PickerViewMode.thumbnail;
                openPicker.suggestedStartLocation = Windows.Storage.Pickers.PickerLocationId.picturesLibrary;
                // Users expect to have a filtered view of their folders depending on the scenario.
                // For example, when choosing a documents folder, restrict the filetypes to documents for your application.
                openPicker.fileTypeFilter.replaceAll([".png", ".jpg", ".jpeg"]);

                // Open the picker for the user to pick a file
                openPicker.pickSingleFileAsync().then(function (file) {
                    if (file) {
                        grayButton.style.visibility = 'visible';

                        file.properties.getImagePropertiesAsync().then(
                               function (imageProperties) {
                                   canvas.width = canvas.width;
                                   Data.currentFile = file;
                            //       Data.zoomed = false;
                                   if (imageProperties.width > imageProperties.height) {
                                       Data.vertical = false;
                                       loadFileInCanvas();
                                   }
                                   else {
                                       Data.vertical = true;
                                       loadFileInCanvas();
                                   }
                                   setCanvasEvents();

                               })
                    }
                    else {

                    }
                });

            }
       
            function alterPhotoButton() {              
             //   ctx.drawImage(img, 0, 0);
              //  var c = getCanvas(img.width, img.height);
                x = ctx.getImageData(0, 0, img.width, img.height);
                blackWhite();
                ctx.putImageData(x, 0, 0);
                zoomButton.style.visibility = 'visible';
                grayButton.style.visibility = 'hidden';

            }

            function getCanvas (w, h) {
                var c = document.createElement('canvas');
                c.width = w;
                c.height = h;
                return c;
            }

            function blackWhite() {
                for (var i = 0; i < x.data.length; i += 4) {
                    
                    var r = x.data[i];
                    var g = x.data[i + 1];
                    var b = x.data[i + 2];
                    // CIE luminance for the RGB
                    // The human eye is bad at seeing red and blue, so we de-emphasize them.
                    var v = 0.2126 * r + 0.7152 * g + 0.0722 * b;
                    x.data[i] = x.data[i + 1] = x.data[i + 2] = v
                    
               //     x.data[i] = 0;
                }
            }

            function removeColor() {
                var color = RED;
                var int = 0;
                switch(color) {
                    case 0:
                        int = 0;
                        break;
                    case 1:
                        int = 1;
                        break;
                    case 2:
                        int = 2;
                        break;
                    default:
                        int = 0;
                }

                for (var i = int ; i < x.data.length; i += 4) {

                    x.data[i] = 0;
                }
            }

            function updateList(array) {
                var simpleTemplate = document.getElementById('itemtemplate');
                var newList = new WinJS.Binding.List(array);

                pictureListDOM.itemTemplate = simpleTemplate;
                pictureListDOM.itemDataSource = newList.dataSource;
            }

            function decodeFiles(array) {
                for (var i = 0; i < array.length; i++) {
                    var imageBlob = URL.createObjectURL(array[i], { oneTimeOnly: false });
                    pictureArray.push({
                        displayNam: array[i].displayName,
                        name: array[i].name,
                        src: imageBlob,
                        path: array[i].path,
                        dateCreated: array[i].dateCreated,
                        file: array[i]
                    });

                }
            }
        }
    });
})();
