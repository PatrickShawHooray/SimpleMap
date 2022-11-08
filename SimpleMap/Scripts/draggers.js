var HELPER = {
    IMG_SHOWING: true,
    ORIGIN_TD: "",
    MONSTER_COUNT: 1
};

$(document).on("click", "#reduceMapSizeBtn", function () {
    $("#theMap").width($("#theMap").width() - 100);
    $("#theMap").height($("#theMap").height() - 100);
    window.setTimeout(setFog, 50);
});

$(document).on("click", ".nameClick", function () {
    if (HELPER.IMG_SHOWING === true) {
        $(".characterImg").hide();
        $(".characterDetails").show();
        HELPER.IMG_SHOWING = false;
    } else {
        $(".characterImg").show();
        $(".characterDetails").hide();
        HELPER.IMG_SHOWING = true;
    }
});

$('.characterDraggy').on('dragstart', function (e) {
    HELPER.ORIGIN_TD = $(this).parent();
    var dt = e.originalEvent.dataTransfer;
    dt.setData('Text', $(this).attr('id'));
});

$('table td').on('dragenter dragover drop', function (e) {
    e.preventDefault();
    if (e.type === 'drop') {
        var data = e.originalEvent.dataTransfer.getData('Text', $(this).attr('id'));
        var swapItem = $(this).children();
        var de = $('#' + data).detach();
        de.appendTo($(this));
        HELPER.ORIGIN_TD.append(swapItem);
    }
});

function drag_start(event) {
    var style = window.getComputedStyle(event.target, null);
    var str = (parseInt(style.getPropertyValue("left")) - event.clientX) + ',' + (parseInt(style.getPropertyValue("top")) - event.clientY) + ',' + event.target.id;
    event.dataTransfer.setData("Text", str);
}

function drop(event) {
    var offset = event.dataTransfer.getData("Text").split(',');
    var dm = document.getElementById(offset[2]);
    dm.style.left = (event.clientX + parseInt(offset[0], 10)) + 'px';
    dm.style.top = (event.clientY + parseInt(offset[1], 10)) + 'px';
    event.preventDefault();
    return false;
}

function drag_over(event) {
    event.preventDefault();
    return false;
}

$(document).on("click", ".figurine", function () {
    $(this).appendTo("#theMap");

    var pos = $("#theMap").position();

    $(this).css({
        position: "absolute",
        top: pos.top + "px",
        left: pos.left + "px"
    }).show();
});

$(document).on("click", "#monsterMaker", function () {
    var initial = $("#monsterInitial").val();
    if (initial === "") {
        return;
    }

    var monsterID = "M" + HELPER.MONSTER_COUNT;
    HELPER.MONSTER_COUNT = Number(HELPER.MONSTER_COUNT) + 1;

    var pos = $("#theMap").position();

    var size = $("#mosterSize").val();

    var newMonsterToken = '<div id=' + monsterID + ' style="position:absolute; top:' + pos.top + 'px; left:' + pos.left + 'px" class="figurine monster' + size + '" draggable="true" ondragstart="drag_start(event)">' + initial + '</div>';
    $("#playerHolder").append(newMonsterToken);
});

$(document).on("dblclick", ".figurine", function () {
    if ($(this).hasClass("bloodied")) {
        $(this).removeClass("bloodied");
        $(this).addClass("dead");
        $(this).css("background-color", "black");
        $(this).css("color", "white");
    } else if ($(this).hasClass("dead")) {
        $(this).css("color", "black");
        $(this).css("background-color", "rgba(255,255,255,0.66)");
        $(this).removeClass("dead");
    } else {
        $(this).addClass("bloodied");
        $(this).css("background-color", "rosybrown");
    }
});

$(document).on("dblclick", ".characterDraggy", function () {
    alert("SUP");
});

$(document).on("click", "#saveChars", function () {
    saveMonsterText();
    saveCharacters();
});

function saveMonsterText() {
    var text = $("#monsterText").val();

    var textToSend = { textToSave: text };

    $.ajax({
        type: 'POST',
        url: "/Home/SaveMonster/",
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(textToSend),
        success: function (data) {

        },
        error: function (ex) {
            alert("Fail SaveMonster");
        }
    });
};


function saveCharacters() {
    var chars = $(".characterDraggy");
    var sortOrder = 1;
    var data = [];
    chars.each(function (index) {
        var $this = $(this);
        var name = $this.find(".nameClick").html();
        var condition = $this.find(".condition").val();
        var ac = $this.find(".ac").val();
        var hp = $this.find(".hp").val();
        var totalHp = $this.find(".totalHp").val();

        if (name !== "Monsters") {
            data.push({
                Name: name,
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
        url: "/Home/SaveChars/",
        type: 'POST',
        data: c,
        datatype:'json',
        contentType: 'application/json;utf-8',
        success: function (data) {

        },
        error: function (ex) {
            alert("Fail Save Chars");
        }
    });
};

$(document).on("change", "#MapSelect", function () {
    mapName = $(this).val();
    backGroundImg.src = '/Content/Maps/' + mapName;
    $("#theMap").css('background-image', 'url(' + backGroundImg.src + ')');
    window.setTimeout(setFog, 50);
});

const backGroundImg = new Image();
backGroundImg.onload = function () {
    $("#theMap").width(this.width);
    $("#theMap").height(this.height);
};

