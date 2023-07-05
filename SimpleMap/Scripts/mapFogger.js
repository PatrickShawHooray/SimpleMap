/********** Members ***********/

// Used for figuring out the scaleX and scaleY for resizing the overlay.
var cachedImageWidth, cachedImageHeight;

/********** Initialization ***********/

// On window load
window.onload = function () {
    setFog();
};

function setFog() {
    // Make the canvas the same size as the map and set fog.
    SetOverlaySize($("#theMap").outerWidth(), $("#theMap").outerHeight());

    // Cache the size of the overlay.
    cachedImageWidth = $("#canvas").width();
    cachedImageHeight = $("#canvas").height();
};

/********** Event Handlers ***********/
// Event handler for when the view mode changes (between player and DM).
$("input[name='viewMode']").on("change", function () {
    ToggleOverlayUnexploredColor(this.value);
    UpdatePixelBufferColor();
});

// Event handler for when the radius of the fogger/defogger changes.
$("#rbFogRadius").change(function () {
    radius = parseInt($(this).val(), 10);
});

// Event handler for when the fog entire map buttons are clicked.
$("#btnFogEntireMap").on("click", function () {
    FogEverything();
});

// Event handler for when the defog entire map buttons are clicked.
$("#btnDeFogEntireMap").on("click", function () {
    RevealEverything();
});

// Event handler for when the current tool changes (mouse, fogger, or defogger).
$("input:radio[type=radio][name=tool]").change(function () {
    // Update the pixel buffer color used for future spray paints (fogger/defogger).
    UpdatePixelBufferColor();
});

// Event handler for when the preview and fullscreen view size is changed.
$("#btnToggleFullScreen").on("click", function () {
    ToggleMapCtrFullScreen();

    // Toggle button text.
    if ($("#btnToggleFullScreen").text() === "Preview") {
        $("#btnToggleFullScreen").text("Full Screen");
    } else {
        $("#btnToggleFullScreen").text("Preview");
    }
});

// Event handler for when the spray/solid fogger/defogger is changed.
$("#btnToggleSpraySolid").on("click", function () {

    // Toggle button text.
    if ($("#btnToggleSpraySolid").text() === "Spray") {
        $("#btnToggleSpraySolid").text("Solid");
    } else {
        $("#btnToggleSpraySolid").text("Spray");
    }
});

$(document).ready(function () {
    $.fn.rwdImageMaps = function () {
        var $img = this;

        var rwdImageMap = function () {
            $img.each(function () {
                if (typeof $(this).attr('usemap') === 'undefined')
                    return;

                var that = this,
                    $that = $(that);

                // Since WebKit doesn't know the height until after the image has loaded, perform everything in an onload copy
                $('<img />').on('load', function () {
                    var attrW = 'width',
                        attrH = 'height',
                        w = $that.attr(attrW),
                        h = $that.attr(attrH);

                    if (!w || !h) {
                        var temp = new Image();
                        temp.src = $that.attr('src');
                        if (!w)
                            w = temp.width;
                        if (!h)
                            h = temp.height;
                    }

                    var wPercent = $that.width() / 100,
                        hPercent = $that.height() / 100,
                        map = $that.attr('usemap').replace('#', ''),
                        c = 'coords';

                    $('map[name="' + map + '"]').find('area').each(function () {
                        var $this = $(this);
                        if (!$this.data(c))
                            $this.data(c, $this.attr(c));

                        var coords = $this.data(c).split(','),
                            coordsPercent = new Array(coords.length);

                        for (var i = 0; i < coordsPercent.length; ++i) {
                            if (i % 2 === 0)
                                coordsPercent[i] = parseInt(((coords[i] / w) * 100) * wPercent);
                            else
                                coordsPercent[i] = parseInt(((coords[i] / h) * 100) * hPercent);
                        }
                        $this.attr(c, coordsPercent.toString());
                    });
                }).attr('src', $that.attr('src'));
            });
        };
        $(window).resize(rwdImageMap).trigger('resize');

        return this;
    };

    $("#theMap").rwdImageMaps();
});

// number click P.O.C.
$("#itemOne").on("dblclick", function () {
    alert("test");
});

$(document).ready(function () {
    $("#theMap").on("dblclick", function (i, e) {

        // Don't do anything if the mouse tool isn't selected.
        if ($("input:radio[name=tool]:checked").val() !== "Mouse") {
            return;
        }

        // test of any area is inside x, y
        var x = e.pageX;
        var y = e.pageY;
        var offset = $(this).offset();

        var xOff = x - offset.left;
        var yOff = y - offset.top;

        $("area").each(function () {
            var coordsArr = this.coords.split(",");
            var t1 = false;
            var t2 = false;
            var t3 = false;
            var t4 = false;

            if (xOff >= coordsArr[0] && yOff >= coordsArr[1]) {
                t1 = true;
            }

            if (xOff >= coordsArr[2] && yOff <= coordsArr[3]) {
                t2 = true;
            }

            if (xOff <= coordsArr[4] && yOff <= coordsArr[5]) {
                t3 = true;
            }

            if (xOff <= coordsArr[6] && yOff >= coordsArr[7]) {
                t4 = true;
            }

            // open up the info on double-clicked ite,
            if (pnpoly(8, vertxTEST, vertyTEST, xOff, yOff)) {
                showClicky();
            }
        });
    });
});

function showClicky() {
    $("#clickyModal").show();

    // reset modal if it isn't visible
    if (!($(".modal.in").length)) {
        $(".modal-dialog").css({
            top: 0,
            left: 0
        });
    }
    $("#clickyModal").modal({
        backdrop: false,
        show: true
    });

    $(".modal-dialog").draggable({
        handle: ".modal-header"
    });
}

var vertxTEST = [521, 525, 530, 575, 712, 740, 780, 610];
var vertyTEST = [431, 515, 580, 620, 682, 620, 553, 438];

function pnpoly(nvert, vertx, verty, testx, testy) {
    var i, j, c = false;
    for (i = 0, j = nvert - 1; i < nvert; j = i++) {
        if (((verty[i] > testy) !== (verty[j] > testy)) &&
            (testx < (vertx[j] - vertx[i]) * (testy - verty[i]) / (verty[j] - verty[i]) + vertx[i])) {
            c = !c;
        }
    }
    return c;
}

/********** Methods ***********/

// Sets the overlay canvas's width and height to that of the passed in width and height.
function SetOverlaySize(width, height) {
    var canvas = document.getElementById("canvas");

    // Set the canvas's resolution and size (not CSS).
    canvas.width = width;
    canvas.height = height;

    // Set the fill color based on current view mode
    const curViewMode = $("input:radio[name=viewMode]:checked").val();
    if (curViewMode === "DM") {
        ctx.fillStyle = "rgba(181, 171, 165, .5)";
    } else {
        ctx.fillStyle = "#000000";
    }
    ctx.fillRect(0, 0, width, height);

    // Cache the new image size.
    cachedImageWidth = width;
    cachedImageHeight = height;
}

// Toggles the size of the map container between a preview size and a full screen.
function ToggleMapCtrFullScreen() {
    // On map container double-click, toggle preview and fullscreen styles.
    if ($("#mapsMapContainer").hasClass("preview")) {
        $("#mapsMapContainer").removeClass();
        $("#mapsMapContainer").addClass("fullScreen");
    } else {
        $("#mapsMapContainer").removeClass();
        $("#mapsMapContainer").addClass("preview");
    }

    // Resize the overlay to the size of the image.
    ToggleOverlayFullScreen();
}

// Sets the overlay canvas's width and height to that of the width and height of the image.
function ToggleOverlayFullScreen() {

    // Get the new image's width and height.
    const imageWidth = $("#theMap").outerWidth();
    const imageHeight = $("#theMap").outerHeight();

    // Set the scale factors.
    const xScale = imageWidth / cachedImageWidth;
    const yScale = imageHeight / cachedImageHeight;

    // scale
    ScaleCanvas(imageWidth, imageHeight, xScale, yScale);

    // Cache the new/current map size.
    cachedImageWidth = $("#theMap").width();
    cachedImageHeight = $("#theMap").height();
}

// Create a newly scaled canvas from the original and then delete the original.
function ScaleCanvas(width, height, xScale, yScale) {

    // Get the true overlay's current image data.
    const imageData = ctx.getImageData(0, 0, cachedImageWidth, cachedImageHeight);

    // Create an in-memory canvas at the new resolution.
    const newCanvas = $("<canvas>")
        .attr("width", cachedImageWidth)
        .attr("height", cachedImageHeight)[0];

    // Draw the true overlay's image data into the in-memory canvas.
    newCanvas.getContext("2d").putImageData(imageData, 0, 0);

    // Update the size/resolution of the true overlay.
    ctx.canvas.width = width;
    ctx.canvas.height = height;

    // Scale the true overlay's context.
    ctx.scale(xScale, yScale);

    // Draw the in-memory canvas onto the true overlay.
    ctx.drawImage(newCanvas, 0, 0);
}

// Turn all black pixels to gray and all gray pixels to black.
function ToggleOverlayUnexploredColor(e) {
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;

    // If switching to the DM view mode, then turn all black pixels grey.
    if (e === "DM") {
        // For all pixels, if the pixel isn't transparent, set the RGB to grey.
        for (let i = 0; i < data.length; i += 4) {
            const alpha = data[i + 3];

            if (alpha !== 0) {
                data[i] = 181;
                data[i + 1] = 171;
                data[i + 2] = 165;
                data[i + 3] = 128;
            }
        }
    }
    // Else we're switching to the Player view so turn all grey pixels black.
    else {
        // For all pixels, if the pixel isn't the DM transparency value (128), set the RGB to black.
        for (let i = 0; i < data.length; i += 4) {

            const alpha = data[i + 3];

            if (alpha === 128) {
                data[i] = 0;
                data[i + 1] = 0;
                data[i + 2] = 0;
                data[i + 3] = 255;
            }
        }
    }

    // save any altered pixel data back to the context
    // the image will reflect any changes you made
    ctx.putImageData(imgData, 0, 0);
}

// Toggles the color of the pixel buffer used for future spray paints.
function UpdatePixelBufferColor() {
    const curViewMode = $("input:radio[name=viewMode]:checked").val();

    // Set the color based on the current value of the view mode and tool.
    if (curViewMode === "unfog") {
        transparentPixel.data[3] = 0;
    } else if (curViewMode === "refog") {
        transparentPixel.data[0] = 0;
        transparentPixel.data[1] = 0;
        transparentPixel.data[2] = 0;
        transparentPixel.data[3] = 255;
    } else if (curViewMode === "draw") {
        transparentPixel.data[0] = 0;
        transparentPixel.data[1] = 0;
        transparentPixel.data[2] = 0;
        transparentPixel.data[3] = 255;
    } else if (curViewMode === "peak") {
        transparentPixel.data[0] = 181;
        transparentPixel.data[1] = 171;
        transparentPixel.data[2] = 165;
        transparentPixel.data[3] = 128;
    }
}

// Fog up the entire map.
function FogEverything() {
    //get the map width
    const mapWidth = $("#theMap").width();
    const mapHeight = $("#theMap").width();

    // Set the canvas's resolution and size (not CSS).
    var canvas = document.getElementById("canvas");
    canvas.width = mapWidth;
    canvas.height = mapHeight;

    //ctx.width = mapWidth;
    //ctx.height = mapHeight;

    ctx.fillRect(0, 0, mapWidth, mapHeight);
}

// Reveal everything on the map.
function RevealEverything() {
    const width = $("#canvas").width();
    const height = $("#canvas").height();
    ctx.clearRect(0, 0, width, height);
}

/*
 * START - Spray paint fog of war section.
 */
const ctx = canvas.getContext("2d");
requestAnimationFrame(mainLoop); // start main loop when code below has run
ctx.fillStyle = "#000000";

// create a pixel buffer for one pixel
var transparentPixel = ctx.getImageData(0, 0, 1, 1);

// Spray paint logic.
const density = 1000;
var radius = 50;

// mouse handler
const mouse = { x: 0, y: 0, button: false };
function mouseEvents(e) {
    const bounds = canvas.getBoundingClientRect();
    mouse.x = e.pageX - bounds.left - scrollX;
    mouse.y = e.pageY - bounds.top - scrollY;
    mouse.button = e.type === "mousedown" ? true : e.type === "mouseup" ? false : mouse.button;
}
["down", "up", "move"].forEach(name => canvas.addEventListener("mouse" + name, mouseEvents));

function getRandomOffset() {
    const angle = Math.random() * Math.PI * 2;
    const rad = Math.random() * radius;
    return { x: Math.cos(angle) * rad, y: Math.sin(angle) * rad };
}

// Spray paint effect. Puts a random pixel to transparent within the radius of the click.
function spray(pos) {
    var i;
    for (i = 0; i < density; i++) {
        const offset = getRandomOffset();
        ctx.putImageData(transparentPixel, pos.x + offset.x, pos.y + offset.y);
    }
}

// Solid circle effect. Puts all pixels within the radius of the click to transparent.
function spraySolid(pos) {
    if ($("input[name='viewMode']:checked").val() == "draw") {
        return false;
    }

    // Create the range of pixels to search through.
    const startX = pos.x - radius;
    const startY = pos.y - radius;
    const endX = pos.x + radius;
    const endY = pos.y + radius;

    // Iterate through the relevant pixels and see if they're within range.
    for (let x = startX; x < endX; x++) {
        for (let y = startY; y < endY; y++) {

            // If the current coordinate is within the radius of the clicked point then turn it
            // transparent.
            if (Math.abs(Math.hypot(pos.x - x, pos.y - y)) < radius) {
                ctx.putImageData(transparentPixel, x, y);
            }
        }
    }
}

// main loop called 60 times a second
function mainLoop() {

    // Only do work if the mouse tool is currently selected.
    if (mouse.button && $("input:radio[name=tool]:checked").val() !== "Mouse") {

        // Use the spray effect or the solid circle effect appropriately.
        if ($("#btnToggleSpraySolid").text() === "Spray") {
            spray(mouse);
        } else {
            spraySolid(mouse);
        }
    }

    // Repeat.
    requestAnimationFrame(mainLoop);
}

/*
 * END - Spray paint fog of war section.
 */

/*
 * START - Clicks through elements P.O.C.
 */

// click placed on document, catches events that bubble up from anywhere in the page
$(document).click(function (e) {
    console.log("PAPSPASF");

    var clickX = e.pageX,
        clickY = e.pageY,
        offset,
        range;

    // Create the list of elements that were clicked on.
    const $list = $("body *").filter(function () {
        offset = $(this).offset();
        range = {
            x: [offset.left,
            offset.left + $(this).outerWidth()],
            y: [offset.top,
            offset.top + $(this).outerHeight()]
        };

        // Include the elements that were clicked on and was the item info. box.
        return (clickX >= range.x[0] && clickX <= range.x[1]) && (clickY >= range.y[0] && clickY <= range.y[1])
            && (this.id === "itemOne");
    });

    const list = $list.map(function () {
        return this.nodeName + " " + this.className;
    }).get();
});




/*
 * END - Clicks through elements P.O.C.
 */

/*
* rwdImageMaps jQuery plugin v1.6
*
* Allows image maps to be used in a responsive design by recalculating the area coordinates to match the actual image size on load and window.resize
*
* Copyright (c) 2016 Matt Stow
* https://github.com/stowball/jQuery-rwdImageMaps
* http://mattstow.com
* Licensed under the MIT license
*/


