d =  20.0;

const regimes = {
    SIMULATION: 'simulation',
    CREATION: 'creation',
}

let regime = regimes.SIMULATION;

let object = { 	
			vertex : [[50, 50], [100, 50], [50, 100]],
			oldposition : [[40 , 40], [100, 50], [50, 100]],
			edges : [[0, 1], [1, 2], [0, 2]],
			distances : [],
		}

let selected = false; 
let select; 

// let object = { 	
// 			vertex : [[50, 50], [200, 50]],
// 			oldposition : [[40 , 40], [200, 50]],
// 			edges : [[0, 1]],
// 			distances : [],
// 		}

function add_gravity(ob) {
	for (var i = 0; i < ob.oldposition.length; ++i){
		ob.oldposition[i][1] -= 0.1;
	}
}

function update(ob) {
	// s_x = [];
	// s_y = [];
	for (var i = 0; i < ob.oldposition.length; ++i){
		const speed_x = ob.vertex[i][0] - ob.oldposition[i][0];
		const speed_y = ob.vertex[i][1] - ob.oldposition[i][1];
		ob.oldposition[i][0] = ob.vertex[i][0];
		ob.oldposition[i][1] = ob.vertex[i][1];
		ob.vertex[i][0] += speed_x;
		ob.vertex[i][1] += speed_y;
		// s_x.push(speed_x);
		// s_y.push(speed_y);
	}
	// for (var i = 0; i < s_x.length; ++i){
	// 	console.log(i, ": ", s_x[i], s_y[i]);
	// }
	// console.log("SUM: ", s_x.reduce((a, b) => a + b), s_y.reduce((a, b) => a + b));
}

function get_coords(obj_edge, ob){
	v1 = obj_edge[0];
	v2 = obj_edge[1];
	v1_x = ob.vertex[v1][0];
	v1_y = ob.vertex[v1][1];
	v2_x = ob.vertex[v2][0];
	v2_y = ob.vertex[v2][1];
	return [v1_x, v1_y, v2_x, v2_y];
}

function dist(vert1_x, vert1_y, vert2_x, vert2_y){
	return sqrt((vert1_x - vert2_x)**2 + (vert1_y - vert2_y)**2);
}

function add_dist_to_edges(ob){
	for (let edge of ob.edges){
		coords = get_coords(edge, ob);
		v1_x = coords[0];
		v1_y = coords[1];
		v2_x = coords[2];
		v2_y = coords[3];
		// console.log(dist(v1_x, v1_y, v2_x, v2_y));
		ob.distances.push(dist(v1_x, v1_y, v2_x, v2_y));
	}
	// console.log(ob.distances);
}

function check_collision(ob){
	nx = 1;
	ny = 1;
	for (let i=0; i < ob.vertex.length; ++i){
		if (ob.vertex[i][1] < 0){
			ob.vertex[i][1] 	 *= -ny;
			ob.oldposition[i][1] *= -ny;
		}
		if (ob.vertex[i][1] >= height - d/2){
			ob.vertex[i][1] 	 = height - d/2 + ny * (height - d/2 - ob.vertex[i][1]);
			ob.oldposition[i][1] = height - d/2 + ny * (height - d/2 - ob.oldposition[i][1]);
			//трение о пол (на остальные поверхности забил)
			let speed_x = ob.vertex[i][0] - ob.oldposition[i][0];
			speed_x *= 0.9;
			ob.oldposition[i][0] = ob.vertex[i][0] - speed_x;
		}
		if (ob.vertex[i][0] < 0){
			ob.vertex[i][0] 	 *= -nx;
			ob.oldposition[i][0] *= -nx;
		}
		if (ob.vertex[i][0] >= width - d/2){
			ob.vertex[i][0] 	 = width - d/2 + nx * (width - d/2 - ob.vertex[i][0]);
			ob.oldposition[i][0] = width - d/2 + nx * (width - d/2 - ob.oldposition[i][0]);
		}
	}
}

function check_edges(ob){
	let i = 0
	for (let edge of ob.edges){
		coords = get_coords(edge, ob);
		v1_x = coords[0];
		v1_y = coords[1];
		v2_x = coords[2];
		v2_y = coords[3];

		leng = dist(v1_x, v1_y, v2_x, v2_y);
		l = ob.distances[i];
		n = l / leng;

		middle_x = (v1_x + v2_x) / 2;
		middle_y = (v1_y + v2_y) / 2;

		v1_x = middle_x + (v1_x - middle_x) * n;
		v1_y = middle_y + (v1_y - middle_y) * n;
		v2_x = middle_x + (v2_x - middle_x) * n;
		v2_y = middle_y + (v2_y - middle_y) * n;

		// correction_x = (v2_x - v1_x) * (1 - n);
		// correction_y = (v2_y - v1_y) * (1 - n);
		
		// v1_x += correction_x / 2;
		// v1_y += correction_y / 2;
		// v2_x -= correction_x / 2;
		// v2_y -= correction_y / 2;

		ob.vertex[v1][0] = v1_x;
		ob.vertex[v1][1] = v1_y;
		ob.vertex[v2][0] = v2_x;
		ob.vertex[v2][1] = v2_y;
		++i;
    }
}

function setup() {
	createCanvas(600, 400);

	// frameRate(1);
	add_dist_to_edges(object);
	// console.log(object.distances);
}

function draw_object(ob){
	stroke('green');
	strokeWeight(4);
    for (let edge of object.edges){
		line(object.vertex[edge[0]][0], object.vertex[edge[0]][1], object.vertex[edge[1]][0], object.vertex[edge[1]][1]);
    }

    stroke(255);
    strokeWeight(2);
    fill('green');
    for (let vert of object.vertex){
		circle(vert[0], vert[1], d);		
    }
}

function simulation(){
	add_gravity(object);
	update(object);

	for (let i=0; i < 5; ++i){
		check_edges(object);
	}

	check_collision(object);
}

function check_mouseIsPressed(){
	if (mouseIsPressed) {
		if (selected){
			object.vertex[select][0] = mouseX;
			object.vertex[select][1] = mouseY;
		}
	}
}

function draw() {
	background(0);	
	draw_object(object)
	
	switch(regime){
	    case regimes.SIMULATION:
	    	simulation();
			check_mouseIsPressed();
	    	break;
	    case regimes.CREATION:
	    	break;
    }
}

function find_selected_vertex(){
	for (var i = 0; i < object.vertex.length; ++i){
    	if ((mouseX - object.vertex[i][0])**2 + (mouseY - object.vertex[i][1])**2 < d**2/4){
    		select = i;
    		selected = true;
    		console.log(select);
    		break;
    	}
    }
}

function create_new_vertex(){
	object.vertex.push([mouseX, mouseY]);
	object.oldposition.push([mouseX, mouseY]);
}

function create_new_edge(vertex1, vertex2){
	let find_same_edge = false;
	for (let edge of object.edges){
		if ((vertex1 === edge[0] && vertex2 === edge[1]) ||
			(vertex1 === edge[1] && vertex2 === edge[0])){
			find_same_edge = true;
		}
	}
	if (!find_same_edge){
		object.edges.push([vertex1, vertex2]);
		object.distances = [];
		add_dist_to_edges(object);
	}
	console.log(object);
}

function mousePressed() {
	switch(regime){
	    case regimes.SIMULATION:
	    	find_selected_vertex();
	    	break;
	    case regimes.CREATION:
	    	let prev_select;
	    	if (selected) {
	    		prev_select = select;
	    	} else {
	    		find_selected_vertex();
	    		if (selected){
	    			console.log("to_memory");
	    		} else {
	    			create_new_vertex();
	    			console.log("create_new_vertex");
	    		}
	    		// selected = false;
	    		break;
	    	}
	    	selected = false;
			find_selected_vertex()
	    	if (!selected) {
	    		create_new_vertex();
	    		create_new_edge(select, prev_select);
	    		console.log("create_new_vertex and new_edge");
	    		selected = false;
	    	} else {
	    		create_new_edge(select, prev_select);
	    		console.log("create_new_edge");
	    		selected = false;
	    	}
	    	break;
    }
}

function mouseReleased() {	
	switch(regime){
	    case regimes.SIMULATION:
	    	selected = false;
	    	break;
	    case regimes.CREATION:
	    	break;
    }
}

function keyPressed(){
	if (keyCode === 32){
		if (regime === regimes.SIMULATION){
			console.log("CREATION");
			regime = regimes.CREATION;
		} 
		else if (regime === regimes.CREATION){
			console.log("SIMULATION");
			selected = false;
			regime = regimes.SIMULATION;
		} 
	}
}

