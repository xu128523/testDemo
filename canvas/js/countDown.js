/**
 * Created by jie11 on 2016/9/24.
 */
var WIDTH = 1024;
var HEIGHT = 600;
var RADIUS = 8;
var MARGIN_TOP = 60;
var MARGIN_LEFT = 30;

//js中月份是从0开始，所以6为7月,
//目前这倒计时限制在4天内
//截止时间
//const endTime = new Date(2016,8,26,10,23,44);
var endTime = new Date();
endTime.setTime(endTime.getTime() + 10800*1000);
var curShowTimeSeconds = 0;

//彩色小球数组
var balls = [];
const colors = ["#33B5E5","#0099CC","#AA66CC","#9933CC","#99CC00","#669900","#FFBB33","#FF8800","#FF4444","#CC0000"];

window.onload = function(){

    WIDTH = document.body.clientWidth;
    //没获取到屏高
    //HEIGHT = document.body.clientHeight;

    MARGIN_LEFT = Math.round(WIDTH/10);
    MARGIN_TOP = Math.round(HEIGHT/5);
    RADIUS = Math.round(WIDTH * 4 / 5 / 108) - 1;

    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");

    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    curShowTimeSeconds = getCurrentShowTimeSeconds();
    //render(context);
    //逐帧动画
    setInterval(function(){
        render(context);
        update();
    },50);

};

function update(){
    var nextShowTimeSeconds = getCurrentShowTimeSeconds();

    var nextHours  = parseInt(nextShowTimeSeconds/3600);
    var nextMinutes = parseInt((nextShowTimeSeconds - nextHours*3600)/60);
    var nextSeconds = nextShowTimeSeconds % 60;

    var curHours  = parseInt(curShowTimeSeconds/3600);
    var curMinutes = parseInt((curShowTimeSeconds - curHours*3600)/60);
    var curSeconds = curShowTimeSeconds % 60;

    if(nextSeconds != curSeconds){
        //判读数字变化，增加小球
        if(parseInt(curHours/10) != parseInt(nextHours/10)){
            addBalls(MARGIN_LEFT + 0, MARGIN_TOP, parseInt(curHours/10))
        }
        if(parseInt(curHours%10) != parseInt(nextHours%10)){
            addBalls(MARGIN_LEFT + 15*(RADIUS + 1), MARGIN_TOP, parseInt(curHours%10))
        }

        if(parseInt(curMinutes/10) != parseInt(nextMinutes/10)){
            addBalls(MARGIN_LEFT + 39*(RADIUS + 1), MARGIN_TOP, parseInt(curMinutes/10))
        }
        if(parseInt(curMinutes%10) != parseInt(nextMinutes%10)){
            addBalls(MARGIN_LEFT + 54*(RADIUS + 1), MARGIN_TOP, parseInt(curMinutes%10))
        }

        if(parseInt(curSeconds/10) != parseInt(nextSeconds/10)){
            addBalls(MARGIN_LEFT + 78*(RADIUS + 1), MARGIN_TOP, parseInt(curSeconds/10))
        }
        if(parseInt(curSeconds%10) != parseInt(nextSeconds%10)){
            addBalls(MARGIN_LEFT + 93*(RADIUS + 1), MARGIN_TOP, parseInt(nextSeconds%10))
        }

        curShowTimeSeconds = nextShowTimeSeconds;
    }

    updateBalls();
}

function updateBalls(){

    for(var i = 0; i < balls.length; i++){
        balls[i].x += balls[i].vx;
        balls[i].y += balls[i].vy;
        balls[i].vy += balls[i].g;

        //小球位置是否大于了底部
        if(balls[i].y >= HEIGHT - RADIUS){
            balls[i].y = HEIGHT - RADIUS;
            //0.5摩擦系数，速度每次都R会有损耗
            balls[i].vy = -balls[i].vy*0.75;
        }
    }

    var cnt = 0;
    for(var j = 0; j < balls.length; j++){

        //判断小球是否在画布内
        if(balls[j].x + RADIUS > 0 && balls[j].x - RADIUS < WIDTH){
            balls[cnt++] = balls[j];
        }
    }

    while(balls.length > Math.min(300, cnt)){
        //删除末尾小球
        balls.pop();
    }
}

function getCurrentShowTimeSeconds(){
    var curTime = new Date();

    //getTime获取毫秒数
    var ret = endTime.getTime() - curTime.getTime();
    //转换为秒
    ret = Math.round(ret/1000);

    return ret >= 0 ? ret : 0;
}



//数字是7*10的数组，每个数字距离就是14个半径，为留有空隙，多加一个半径
//数组10是冒号
function render(cxt){

    //对矩形空间内图像刷新
    cxt.clearRect(0, 0, WIDTH, HEIGHT);

    var hours  = parseInt(curShowTimeSeconds/3600);
    var minutes = parseInt((curShowTimeSeconds - hours*3600)/60);
    //var minutes = parseInt((curShowTimeSeconds/3600)/60);
    var seconds = curShowTimeSeconds%60;

    renderDigit(MARGIN_LEFT, MARGIN_TOP, parseInt(hours/10), cxt);
    renderDigit(MARGIN_LEFT + 15*(RADIUS+1), MARGIN_TOP, parseInt(hours%10), cxt);
    renderDigit(MARGIN_LEFT + 30*(RADIUS+1), MARGIN_TOP, 10, cxt);
    renderDigit(MARGIN_LEFT + 39*(RADIUS+1), MARGIN_TOP, parseInt(minutes/10), cxt);
    renderDigit(MARGIN_LEFT + 54*(RADIUS+1), MARGIN_TOP, parseInt(minutes%10), cxt);
    renderDigit(MARGIN_LEFT + 69*(RADIUS+1), MARGIN_TOP, 10, cxt);
    renderDigit(MARGIN_LEFT + 78*(RADIUS+1), MARGIN_TOP, parseInt(seconds/10), cxt);
    renderDigit(MARGIN_LEFT + 93*(RADIUS+1), MARGIN_TOP, parseInt(seconds%10), cxt);

    for(var i = 0; i < balls.length; i++){
        cxt.fillStyle = balls[i].color;

        cxt.beginPath();
        cxt.arc(balls[i].x, balls[i].y, RADIUS, 0, 2*Math.PI, true);
        cxt.closePath();

        cxt.fill();
    }
}

function renderDigit(x, y, num, cxt){

    cxt.fillStyle = "#0091e8";

    for(var i = 0; i < digit[num].length; i++){
        for(var j = 0; j < digit[num][i].length; j++){
            if(digit[num][i][j] == 1){
                cxt.beginPath();
                cxt.arc(x + j*2*(RADIUS+1)+(RADIUS+1), y + i*2*(RADIUS+1)+(RADIUS+1), RADIUS, 0, 2*Math.PI);
                cxt.closePath();

                cxt.fill();
            }
        }
    }
}

function addBalls(x, y, num){

    for(var i = 0; i < digit[num].length; i++){
        for(var j = 0; j < digit[num][i].length; j++){
            if(digit[num][i][j] == 1){

                var aBall = {
                    x: x + j*2*(RADIUS+1)+(RADIUS+1),
                    y: y + i*2*(RADIUS+1)+(RADIUS+1),
                    g: 1.5 + Math.random(),
                    vx: Math.pow(-1, Math.ceil(Math.random()*1000)) * 4,
                    vy: -Math.ceil(Math.random()*5),
                    color: colors[Math.floor(Math.random()*colors.length)]
                };

                balls.push(aBall);
            }
        }
    }
}



