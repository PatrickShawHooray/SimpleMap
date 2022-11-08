var drawLeftOffset = 0;
var drawUpOffset = 0;
var drawCanvas, cntx, flag = false,
    prevX = 0,
    currX = 0,
    prevY = 0,
    currY = 0,
    dot_flag = false;

$(document).ready(function () {
    var leftBarW = $(".leftBar").width() + 30;
    $(".rightBar").css("margin-left", leftBarW);
    drawLeftOffset = leftBarW + 25;

    var toolBarH = $("#toolBar").height();
    drawUpOffset = toolBarH + 30;

    init();
});

var x = "black",
    y = 2;

function init() {
    canvas = document.getElementById('canvas');
    cntx = canvas.getContext("2d");
    w = canvas.width;
    h = canvas.height;

    canvas.addEventListener("mousemove", function (e) {
        if ($("input[name='viewMode']:checked").val() == "draw") {
            findxy('move', e)
        }
    }, false);
    canvas.addEventListener("mousedown", function (e) {
        if ($("input[name='viewMode']:checked").val() == "draw") {
            findxy('down', e)
        }
    }, false);
    canvas.addEventListener("mouseup", function (e) {
        if ($("input[name='viewMode']:checked").val() == "draw") {
            findxy('up', e)
        }
    }, false);
    canvas.addEventListener("mouseout", function (e) {
        if ($("input[name='viewMode']:checked").val() == "draw") {
            findxy('out', e)
        }
    }, false);
}

function color(obj) {
    switch (obj.id) {
        case "green":
            x = "green";
            break;
        case "blue":
            x = "blue";
            break;
        case "red":
            x = "red";
            break;
        case "yellow":
            x = "yellow";
            break;
        case "orange":
            x = "orange";
            break;
        case "black":
            x = "black";
            break;
        case "white":
            x = "white";
            break;
    }
    if (x == "white") y = 14;
    else y = 2;
}

function draw() {
    cntx.beginPath();
    cntx.moveTo(prevX - drawLeftOffset, prevY - canvas.getBoundingClientRect().top);
    cntx.lineTo(currX - drawLeftOffset, currY - canvas.getBoundingClientRect().top);
    cntx.strokeStyle = x;
    cntx.lineWidth = y;
    cntx.stroke();
    cntx.closePath();
}

function erase() {
    var m = confirm("Want to clear");
    if (m) {
        cntx.clearRect(0, 0, w, h);
        document.getElementById("canvasimg").style.display = "none";
    }
}

function save() {
    document.getElementById("canvasimg").style.border = "2px solid";
    var dataURL = canvas.toDataURL();
    document.getElementById("canvasimg").src = dataURL;
    document.getElementById("canvasimg").style.display = "inline";
}

function findxy(res, e) {
    if (res == 'down') {
        prevX = currX //- canvas.getBoundingClientRect().left;
        prevY = currY //- canvas.getBoundingClientRect().top;

        console.log("res == 'down' prev: " + prevX + " " + prevY);

        currX = e.clientX //- canvas.getBoundingClientRect().left;
        currY = e.clientY //- canvas.getBoundingClientRect().top;

        console.log("res == 'down' curr: " + currX + " " + currY);

        flag = true;
        dot_flag = true;
        if (dot_flag) {
            cntx.beginPath();
            cntx.fillStyle = x;
            cntx.fillRect(currX, currY, 2, 2);
            cntx.closePath();
            dot_flag = false;
        }
    }
    if (res == 'up' || res == "out") {
        flag = false;
    }
    if (res == 'move') {
        if (flag) {
            prevX = currX;
            prevY = currY;
            currX = e.clientX;
            currY = e.clientY;
            draw();
        }
    }
}

$(document).on("change", ".charBattleDetail", function () {
    saveCharactersBattleMap();
});

function saveCharactersBattleMap() {
    var chars = $(".character");
    var sortOrder = 1;
    var data = [];
    chars.each(function (index) {
        var $this = $(this);
        var playerID = $this.find(".playerId").html();
        var condition = $this.find(".condition").val();
        var ac = $this.find(".ac").val();
        var hp = $this.find(".hp").val();
        var totalHp = $this.find(".totalHp").val();

        if (name !== "Monsters") {
            data.push({
                PlayerID: playerID,
                Condition: condition,
                AC: ac,
                HP: hp,
                TotalHP: totalHp,
                SortOrder: sortOrder
            });

            sortOrder++;
        }
    });

    var c = JSON.stringify({ 'chars': data });

    $.ajax({
        url: "/Home/SaveCharsBattleMap/",
        type: 'POST',
        data: c,
        datatype: 'json',
        contentType: 'application/json;utf-8',
        success: function (data) {

        },
        error: function (ex) {
            alert("Fail Save Chars");
        }
    });
};