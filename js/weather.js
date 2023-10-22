
$(function () {
    var arr = [];
    var today = new Date();
    var week = new Array('일', '월', '화', '수', '목', '금', '토');
    var year = today.getFullYear();
    var month = today.getMonth() + 1;
    var day = today.getDate();
    var hours = today.getHours();
    var minutes = today.getMinutes();
    var hours_al = new Array('02', '05', '08', '11', '14', '17', '20', '23');
    var korea = [{ 'region': '서울', 'nx': 60, 'ny': 127 },
                { 'region': '인천', 'nx': 55, 'ny': 124 },
                { 'region': '경기도', 'nx': 60, 'ny': 121 },
                { 'region': '강원도', 'nx': 92, 'ny': 131 },
                { 'region': '충청북도', 'nx': 69, 'ny': 106 },
                { 'region': '충청남도', 'nx': 68, 'ny': 100 },
                { 'region': '전라북도', 'nx': 63, 'ny': 89 },
                { 'region': '전라남도', 'nx': 50, 'ny': 67 },
                { 'region': '경상북도', 'nx': 91, 'ny': 106 },
                { 'region': '경상남도', 'nx': 90, 'ny': 77 },
                { 'region': '제주도', 'nx': 52, 'ny': 38 }];

    $('.weather-date').html(
        month + "월 " + day + "일 "
        + week[today.getDay()] + "요일 " + hours + "시" + minutes + "분");


    /* 동네예보 시간이 0200 0500 ... 3시간 단위로 23시까지 */
    for (var i = 0; i < hours_al.length; i++) {
        var h = hours_al[i] - hours;
        if (h == -1 || h == 0 || h == -2) {
            var now = hours_al[i];
        }
        if (hours == 0) {
            var now = hours_al[7];

        }
    }

    /* example
     * 9시 -> 09시 변경 필요
     */
    if (hours < 10) {
        hours = '0' + hours;
    }
    if (month < 10) {
        month = '0' + month;
    }
    if (day < 10) {
        day = '0' + day;
    }

    today = year + "" + month + "" + day;

    /* 좌표 */
    $.each(korea, function (j, k) {
        var _nx = korea[j].nx, _ny = korea[j].ny, region = korea[j].region,
            apikey = "7lllQjBgb%2Fi6o%2By42IT99yvqHfscHoO8j1prUikyE0bB%2BE4mZ%2BNCyLuXlSoZsuaHxMX6UM8LUc0JepTebV9GGQ%3D%3D",
            ForecastGribURL = "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst";
        ForecastGribURL += "?ServiceKey=" + apikey;
        ForecastGribURL += "&pageNo=1";
        ForecastGribURL += "&numOfRows=1000";
        ForecastGribURL += "&dataType=XML";
        ForecastGribURL += "&base_date=" + today;
        ForecastGribURL += "&base_time=" + now + "00";
        ForecastGribURL += "&nx=" + _nx + "&ny=" + _ny;
        arr.push({ 'url': ForecastGribURL, 'region': region });

        $.ajax({
            url: arr[j].url,
            type: 'GET',
            success: function (data) {
                var $data = $(data).find("response>body>items>item");
                var cate = '';
                var temp = '';
                var sky = '';
                var rain = '';

                $.each($data, function (i, o) {
                    cate = $(o).find("category").text(); // 카테고리 목록    

                    if (cate == 'TMP') {
                        temp = $(this).find("fcstValue").text(); // 3시간 기온
                    }
                    if (cate == 'SKY') {
                        sky = $(this).find("fcstValue").text(); // 하늘상태
                    }
                    if (cate == 'PTY') {
                        rain = $(this).find("fcstValue").text(); // 강수형태
                    }
                });

            
                var clothingRecommendation = recommendClothingByTemperature(temp);
                $('.clothing-recommendation').text(clothingRecommendation);
                
                //var umbrellaRecommendation = recommendUmbrellaByRain(rain);
                $('.ummbrella-recommendation').html(recommendUmbrellaByRain(rain));

                $('.weather').append('<li class="list-group-item weather_li' + j + '"></li>');
                $('.weather_li' + j).addClass('in' + j);
                $('.in' + j).html(temp + "℃"); //온도 
                $('.in' + j).prepend(arr[j].region + '&nbsp;'); // 지역이름

                if (rain != 0) {
                    switch (rain) {
                        case '1':
                            $('.in' + j).append(" / 비");
                            $('.in' + j).prepend('<i class="fas fa-cloud-showers-heavy"></i>&nbsp;');
                            break;
                        case '2':
                            $('.in' + j).append(" / 비/눈");
                            $('.in' + j).prepend('<i class="fas fa-cloud-rain"></i>&nbsp;');
                            break;
                        case '3':
                            $('.in' + j).append(" / 눈");
                            $('.in' + j).prepend('<i class="fas fa-snowflake"></i>&nbsp;');
                            break;
                    }
                } else {
                    switch (sky) {
                        case '1':
                            $('.in' + j).append(" / 맑음");
                            $('.in' + j).prepend('<i class="fas fa-sun"></i>&nbsp;');
                            break;
                        case '2':
                            $('.in' + j).append(" / 구름조금");
                            $('.in' + j).prepend('<i class="fas fa-cloud-sun"></i>&nbsp;');
                            break;
                        case '3':
                            $('.in' + j).append(" / 구름많음");
                            $('.in' + j).prepend('<i class="fas fa-cloud"></i>&nbsp;');
                            break;
                        case '4':
                            $('.in' + j).append(" / 흐림");
                            $('.in' + j).prepend('<i class="fas fa-smog"></i>&nbsp;');
                            break;
                    }
                }//if 종료
            }//success func 종료
        });
    });
    
});

 function recommendClothingByTemperature(temp) {
    var clothing = "";
    if (temp < 0) {
        clothing = "기모 옷, 패딩, 두꺼운 코트, 목도리, 장갑, 마스크";
    } else if (temp >= 0 && temp <= 10) {
        clothing = "후드 티, 코트, 스웨터, 가죽 재킷";
    } else if (temp > 10 && temp <= 20) {
        clothing = "자켓, 가디건, 긴팔 티셔츠";
   } else if (temp > 20 && temp <= 28) {
        clothing = "반팔 티셔츠, 얇은 스웨터, 반바지";
    } else if (temp > 28){
        clothing = "민소매, 반바지, 여름 옷";
    }
    return clothing;
}

function recommendUmbrellaByRain(rain){
    var umbrella ="";
    var image = "";
    if(rain == 1){
        umbrella  = "비가 오니 우산 챙기세요.";
        image = '<img src="./images/rain.jpg" height="100" width="215"/>';
    } else if (rain == 2){
        umbrella = "눈, 비가 오니 우산 챙기세요.";
        image = '<img src="./images/snow_rain.jpg" height="100" width="215"/>';
    } else if (rain == 3){
        umbrella = "눈이 오니 우산 챙기세요.";
        image = '<img src="./images/snow.jpg" height="100" width="215"/>';
    } else{ 
        umbrella = "비 소식이 없어요."; 
        image = '<img src="./images/sun.jpg" height="100" width="215"/>';
    }
    return umbrella +" "+ image;
}