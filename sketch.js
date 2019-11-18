 chain = [];
 r =  15.0;
 l = 50.0;
 selected = false;
 select = 0;

function update(){
	for (let i = select+1; i < chain.length; ++i){
		const leng = sqrt((chain[i-1].x - chain[i].x)**2 + (chain[i-1].y - chain[i].y)**2);
		const n = l/leng;
		chain[i].x = chain[i-1].x + (chain[i].x - chain[i-1].x) * n;
		chain[i].y = chain[i-1].y + (chain[i].y - chain[i-1].y) * n;
    }

	for (let i = select-1; i >= 0; --i){
		const leng = sqrt((chain[i+1].x - chain[i].x)**2 + (chain[i+1].y - chain[i].y)**2);
		const n = l/leng;
		chain[i].x = chain[i+1].x + (chain[i].x - chain[i+1].x) * n;
		chain[i].y = chain[i+1].y + (chain[i].y - chain[i+1].y) * n;
    }
}

function check_collision(){
	for (let i = 0; i < chain.length; ++i){
		if (chain[i].y > height - r) chain[i].y = height - r;
    }
}

function setup() {
    createCanvas(600, 400);

   

    for (let i = 0; i < 10; ++i){
    	chain.push(createVector(50 + l*i, 100));
    }

}

function draw() {
	background(0);

	stroke('green');
	strokeWeight(3);
    for (let i = 1; i < chain.length; ++i){
		line(chain[i-1].x, chain[i-1].y, chain[i].x, chain[i].y);
    }

    stroke(255);
    strokeWeight(1);
    fill('green');
    for (let i = 0; i < chain.length; ++i){
    	circle(chain[i].x, chain[i].y, 2 * r);
    }
   	
   	for (let i = 0; i < chain.length; ++i){
		if (!(i == select && selected)){
			++chain[i].y;
		}
    }

    update();
    check_collision();
    // console.log(chain[0].y, height);
}

function mousePressed() {
  	for (let i = 0; i < chain.length; ++i){
    	if ((mouseX - chain[i].x)**2 + (mouseY - chain[i].y)**2 < r**2){
    		select = i;
    		selected = true;
    		//console.log(select);
    		break;
    	}
    }
}

function mouseReleased() {
	selected = false;
}

function mouseDragged() {
	if (selected){
		chain[select].x = mouseX;
		chain[select].y = mouseY;
	}
}