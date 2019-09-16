
window.onload = function() {
    const canvas = document.getElementById('canvas');
    console.log(canvas);
    canvas.addEventListener('touchmove', function(e) {
        console.log("move");
        const force = e.touches[0].force;
        console.log(force);
        log(force);
    });
    canvas.addEventListener('click', function(e) {
        console.log("click");
        log("click");
    });
};

function log(message){
    const data = document.getElementById('data');
    const div = document.createElement("div");
    div.innerText = message;
    data.insertBefore(div, data.firstChild);
}