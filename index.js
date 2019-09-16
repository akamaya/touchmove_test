
$(function() {
    // スクロールを無効にする
    $(window).on('touchmove.noScroll', function(e) {
        e.preventDefault();
    });
    
    const $canvas = $('#canvas-box');
    console.log($canvas);

    class Pen{
        constructor( width, length, drawCanvas ) {
            this.drawing = false;
            this.width = width;
            this.length = length;
            this.force = 0;// 筆圧:0〜99
            this.drawCanvas = drawCanvas;
            this.initDraw();
        }

        initDraw(){
            this.force = 0;
            this.position = {x:0,y:0};
            this.positions = [];
            for(let i=0;i < 100;i++){
                this.positions[i] = {x:0,y:0};
            }
        }
        setPositions(e){
            const rowForce = e.touches ? e.touches[0].force : 1.0;
            const nowPos = {x:e.pageX, y:e.pageY};
            const prePos = this.force ? this.position : nowPos;
            const force = Math.ceil(rowForce * 99);

            this.drawRing(this.force, force, nowPos, prePos);
            this.force = force;
            this.position = nowPos;
        }

        drawRing(preForce, force, nowPos, prePos){
            const diffX = nowPos.x - prePos.x;
            const diffY = nowPos.y - prePos.y;
            const diffF = force - preForce;
            if(diffX == 0 && diffY == 0){
                const size = this.width * force / 100;
                this.drawCanvas(size, nowPos.x, nowPos.y);
                return;
            }

            const distance = Math.ceil(Math.sqrt(diffX * diffX + diffY * diffY));// 前回と今回の2点間の距離

            // 距離1に対して1回描画
            for(let d=0;d <= distance;d++){
                const x = prePos.x + diffX * d / distance;
                const y = prePos.y + diffX * d / distance;
                const size = this.width * (force + diffF * d / distance) / 100;
                this.drawCanvas(size, x, y);
            }
        }

    
        get x(){
            return this.position.x;
        }
        get y(){
            return this.position.y;
        }

        touchStart(e){
            this.drawing = true;
            this.initDraw();
            this.setPositions(e);
        }
        touchMove(e){
            if(this.drawing){
                this.setPositions(e);
            }
        }
        touchEnd(e){
            this.drawing = false;
        }
    }

    const pen = new Pen(30, 150, drawCanvas);

    // touchイベント PCでは存在しないっぽい。タッチパッドでも不可
    let existsTouchEvent = false;
    $canvas.on('touchstart', function(e) {
        existsTouchEvent = true;
        pen.touchStart(e);
        writeTouchEvent(pen);
    });

    $canvas.on('touchmove', function(e) {
        pen.touchMove(e);
        writeTouchEvent(pen);
    });

    $canvas.on('touchend', function(e) {
        pen.touchEnd(e);
        writeTouchEvent(pen);
    });

    // タッチイベントが存在しないときはmouseイベント
    $canvas.on('mousedown', function(e) {
        if(existsTouchEvent){
            return;
        }
        pen.touchStart(e);
        writeTouchEvent(pen);
    });

    $canvas.on('mousemove', function(e) {
        if(existsTouchEvent){
            return;
        }
        pen.touchMove(e);
        writeTouchEvent(pen);
    });

    $canvas.on('mouseup', function(e) {
        if(existsTouchEvent){
            return;
        }
        pen.touchEnd(e);
        writeTouchEvent(pen);
    });

    function writeTouchEvent(pen){
        $('#pen-force').text(pen.force);
        $('#position-x').text(pen.x);
        $('#position-y').text(pen.y);
    }

    function drawCanvas(size, x, y){
        // canvasのスケールを取得
        const $canvas = $('#canvas-box');
        const canvas = $canvas.get(0);
        const scaleX = canvas.width / $canvas.width() ;
        const scaleY = canvas.height / $canvas.height();
        
        console.log(size, x, y);
        
        const ctx = canvas.getContext('2d');
         
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(x * scaleX, y * scaleY, size / 2, 0, Math.PI*2, false);
        ctx.fill();
    }
    
});

