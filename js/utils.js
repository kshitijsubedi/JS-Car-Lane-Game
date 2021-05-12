class Canvas {
    constructor(){
        this.canvas=document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.height = this.ctx.canvas.height;
        this.width = this.ctx.canvas.width;
        // this.ctx.imageSmoothingEnabled = true;
        // this.ctx.imageSmoothingQuality = 'high';
        this.bgx=0;
        this.bgy=0;
    }

    environment (){
        
        var background = new Image();
        background.src='./assets/roadBackground.png';
        background.onload=() =>{
            this.ctx.clearRect(0, 0, canvas.width, canvas.height);
            this.ctx.drawImage(background,-this.bgx,-this.bgy,this.width,this.height*2);
            (this.bgy>=canvas.height)?this.bgy=0:(this.bgy+=10)       
        }
        this.ctx.beginPath();
        this.ctx.rect(10, 30, 150, 150); // 10-150
        this.ctx.rect(170,30,160,150);   // 170-330
        this.ctx.rect(340,30,150,150);   // 340-490

        this.ctx.stroke();
    }
    drawcar (locationX,locationY)

}

class playerCar {
    constructor(){
        this.positionX=245;
        this.positionY= 450;
    }

    move(operation){

    }


}

var canvas = new Canvas()

let loop = ()=>{

    canvas.environment()
    
    window.requestAnimationFrame(loop)
}

loop()