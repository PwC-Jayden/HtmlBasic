var clock = document.getElementById('clock');
var ctx = clock.getContext('2d');

function drawClock(){
	ctx.clearRect(0,0,500,500);
	var now = new Date();
	var sec = now.getSeconds();
	var min = now.getMinutes();
	var hour = now.getHours();  //24 hours
	hour = hour>12?hour-12:hour;  //12 hours

	//clock face
	ctx.lineWidth = 10;
	ctx.strokeStyle = "blue";
	ctx.beginPath();
	ctx.arc(250,250,200,0,360,false);
	ctx.stroke();
	ctx.closePath();
	ctx.font = "25px Arial";
	ctx.fillText("Code by Shawn", 160, 330);


	//graduation
	//hour
	ctx.lineWidth = 7;
	ctx.strokeStyle = "black";
			for (var i=0; i<12; i++){  //use rotation
				ctx.save();
				ctx.translate(250,250);  //set center
				ctx.rotate(i*30*Math.PI/180);
				ctx.beginPath();
				ctx.moveTo(0,-165);
				ctx.lineTo(0,-190);
				ctx.closePath();
				ctx.stroke();
				ctx.restore();
			}
	//minute
	ctx.lineWidth = 5;
	ctx.strokeStyle = "black";
	for (var i=0; i<60; i++){
		ctx.save();
		ctx.translate(250,250);
		ctx.rotate(i*6*Math.PI/180);
		ctx.beginPath();
		ctx.moveTo(0,-180);
		ctx.lineTo(0,-190);
		ctx.closePath();
		ctx.stroke();
		ctx.restore();
	}

	//set the real time
	//hour
	ctx.lineWidth = 7;
	ctx.strokeStyle = "black";

	ctx.save();
	ctx.translate(250,250);
	ctx.rotate((hour+min/60)*30*Math.PI/180);
	ctx.beginPath();
	ctx.moveTo(0,-100);
	ctx.lineTo(0,20);
	ctx.closePath();
	ctx.stroke();
	ctx.restore();

	//minute
	ctx.lineWidth = 5;
	ctx.strokeStyle = "black";

	ctx.save();
	ctx.translate(250,250);
	ctx.rotate(min*6*Math.PI/180);
	ctx.beginPath();
	ctx.moveTo(0,-140);
	ctx.lineTo(0,20);
	ctx.closePath();
	ctx.stroke();
	ctx.restore();


	//second
	ctx.lineWidth = 2;
	ctx.strokeStyle = "red";

	ctx.save();
	ctx.translate(250,250);
	ctx.rotate(sec*6*Math.PI/180);
	ctx.beginPath();
	ctx.moveTo(0,-160);
	ctx.lineTo(0,20);
	ctx.closePath();
	ctx.stroke();
	//draw second hand
	ctx.beginPath();
	ctx.arc(0,-130,5,0,360,false)
	ctx.closePath();
	ctx.stroke();
	ctx.fillStyle = "white";
	ctx.fill();
	ctx.stroke();
	ctx.beginPath();
	//draw the dish
	ctx.arc(0,0,5,0,360,false);
	ctx.closePath();
	ctx.fillStyle = "gray";
	ctx.fill();
	ctx.stroke();
	ctx.restore();

}

drawClock;
setInterval(drawClock,1000);