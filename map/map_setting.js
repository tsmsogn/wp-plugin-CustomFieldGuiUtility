/*ウィンドウを開く*/

function map_setting(url) {
    var subWin = window.open(url, "map_setting", "width=430,height=470,scrollbars=yes");
}

/*map_setting.html用*/

var mapname = "map";
var mc_lat = 34.995691265035695;	//中心座標の緯度初期値
var mc_lng = 135.74295043945312;    //中心座標の経度初期値
var mp_lat = 34.995691265035695;	//マーカーの緯度初期値
var mp_lng = 135.74295043945312;	//マーカーの経度初期値
var zoom = 10;	//ズーム初期値
var geocoder;
var map;
var marker;
var return_id = location.search;
return_id = return_id.substring(1, return_id.length);


function set_map() {
    // すでにデータが入っている場合は、初期値を変更する
    exist_mapdata = opener.document.getElementById(return_id).value;
    if (exist_mapdata != null) {
        exist_mapdata_array = exist_mapdata.split(",");
        if (exist_mapdata_array.length == 5) {
            mp_lat = exist_mapdata_array[0];
            mp_lng = exist_mapdata_array[1];
            mc_lat = exist_mapdata_array[2];
            mc_lng = exist_mapdata_array[3];
            zoom = parseInt(exist_mapdata_array[4]);
        }
    }

    // マップ表示
    map = new google.maps.Map(document.getElementById(mapname), {
        center: new google.maps.LatLng(mc_lat, mc_lng),
        zoom: zoom,
        zoomControlOptions: {
            style: google.maps.ZoomControlStyle.SMALL
        }
    });
    geocoder = new google.maps.Geocoder();

    // ドラッグ可能なマーカー
    var marker_point = new google.maps.LatLng(mp_lat, mp_lng);
    marker = new google.maps.Marker({position: marker_point, draggable: true});

    // ドロップ時に緯度経度取得
    google.maps.event.addListener(marker, "dragend", function () {
        var p = marker.getPosition();
        document.getElementById("latitude").value = p.lat();
        document.getElementById("longitude").value = p.lng();
    });

    // マップにマーカーを表示
    marker.setMap(map);
    document.getElementById("latitude").value = marker.getPosition().lat();
    document.getElementById("longitude").value = marker.getPosition().lng();

    // ズーム取得（イベント時）
    google.maps.event.addListener(map, "zoom_changed", function () {
        document.getElementById("zoom").value = map.getZoom();
    });

    // ズーム初期設定
    zoom = map.getZoom();
    document.getElementById("zoom").value = zoom;

    // 中心座標を取得（イベント時）
    google.maps.event.addListener(map, "center_changed", function () {
        var center = map.getCenter();
        document.getElementById("center_latitude").value = center.lat();
        document.getElementById("center_longitude").value = center.lng();
    });

    // 中心座標初期設定
    document.getElementById("center_latitude").value = mc_lat;
    document.getElementById("center_longitude").value = mc_lng;
}

//住所を取得する
function moveAddress() {
    var address = document.getElementById("search_word").value;
    geocoder.geocode({address: address}, function (geocoderResult, geocoderStatus) {
        if (geocoderStatus === "ERROR") {
            alert("There was a problem contacting the Google servers.");
        } else if (geocoderStatus === "INVALID_REQUEST") {
            alert("This GeocoderRequest was invalid.");
        } else if (geocoderStatus === "OK") {
            var latLng = geocoderResult[0].geometry.location;
            map.setCenter(latLng);
            marker.setPosition(latLng);
            document.getElementById("latitude").value = latLng.lat();
            document.getElementById("longitude").value = latLng.lng();
        } else if (geocoderStatus === "OVER_QUERY_LIMIT") {
            alert("The webpage has gone over the requests limit in too short a period of time.");
        } else if (geocoderStatus === "REQUEST_DENIED") {
            alert("The webpage is not allowed to use the geocoder.");
        } else if (geocoderStatus === "UNKNOWN_ERROR") {
            alert("A geocoding request could not be processed due to a server error. The request may succeed if you try again.");
        } else if (geocoderStatus === "ZERO_RESULTS") {
            alert("No result was found for this GeocoderRequest.");
        }
    });
}

//親ウィンドウにデータを渡し、ウィンドウを閉じる
function window_close() {
    input_array = document.getElementById("gmap_form").getElementsByTagName("input");
    for (i = 0; i < input_array.length; i++) {
        if (i == 0) {
            input_data = input_array[i].value;
        } else {
            input_data += "," + input_array[i].value;
        }
    }

    opener.document.getElementById(return_id).value = input_data;
    this.close();
}

//検索フォームの中身を空にする
function search_empty() {
    var search_word = document.getElementById("search_word").value;
    if (search_word == "住所から検索") {
        document.getElementById("search_word").value = "";
    }
}
