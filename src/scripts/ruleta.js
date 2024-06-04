let walletCash = 150;
var data = [
	{
		label: "0",
		value: 1,
	},
	{
		label: "1",
		value: 1,
	}, // padding
	{
		label: "2",
		value: 1,
	}, //font-family
	{
		label: "3",
		value: 1,
	}, //color
	{
		label: "4",
		value: 1,
	}, //font-weight
	{
		label: "5",
		value: 1,
	}, //font-size
	{
		label: "6",
		value: 1,
	}, //background-color
	{
		label: "7",
		value: 1,
	}, //nesting
	{
		label: "8",
		value: 1,
	}, //bottom
	{
		label: "9",
		value: 1,
	}, //sans-serif
	{
		label: "10",
		value: 1,
	},
];
var oldpick = [];
var numerosRojos = [1, 3, 6, 8, 9];
var numerosNegros = [2, 4, 5, 7, 10];
var par = d3.select("#par");
var impar = d3.select("#impar");
var rojo = d3.select("#rojo");
var negro = d3.select("#negro");
var randomSelected;
var selectedLabel;

//#region ruleta girar y dibujar

var padding = {
	top: 20,
	right: 40,
	bottom: 0,
	left: 0,
},
	w = 500 - padding.left - padding.right,
	h = 500 - padding.top - padding.bottom,
	r = Math.min(w, h) / 2,
	rotation = 0,
	oldrotation = 0,
	picked = 100000;


var svg = d3
	.select("#chart")
	.append("svg")
	.data([data])
	.attr("width", w + padding.left + padding.right)
	.attr("height", h + padding.top + padding.bottom);

var container = svg
	.append("g")
	.attr("class", "chartholder")
	.attr(
		"transform",
		"translate(" +
		(w / 2 + padding.left) +
		"," +
		(h / 2 + padding.top) +
		")",
	);
var vis = container.append("g");
var pie = d3.layout
	.pie()
	.sort(null)
	.value(function (d) {
		return 1;
	});
// declare an arc generator function
var arc = d3.svg.arc().outerRadius(r);
// select paths, use arc generator to draw
var arcs = vis
	.selectAll("g.slice")
	.data(pie)
	.enter()
	.append("g")
	.attr("class", "slice");
arcs.append("path")
	.attr("fill", function (d, i) {
		if (data[i].label === "0") {
			return "green";
		} else if (data[i].label in numerosRojos) {
			return "red";
		} else if (data[i].label in numerosNegros) {
			return "black";
		}
	})
	.attr("d", function (d) {
		return arc(d);
	})
	.on("click", function (d, i) {
		selectedLabel = data[i].label;
		console.log("Etiqueta seleccionada:", selectedLabel);
	});
// add the text
arcs.append("text")
	.attr("transform", function (d) {
		d.innerRadius = 0;
		d.outerRadius = r;
		d.angle = (d.startAngle + d.endAngle) / 2;
		return (
			"rotate(" +
			((d.angle * 180) / Math.PI - 90) +
			")translate(" +
			(d.outerRadius - 10) +
			")"
		);
	})
	.attr("text-anchor", "end")
	.style("fill", "white")
	.text(function (d, i) {
		return data[i].label;
	});


container.on("click", null);
//container.on("click", spin);
if (selectedLabel != "") {
	container.on("click", spin);
}
function spin(d) {
	if (walletCash < 10) {
		alert("No tens diners per fer la jugada!");
		return;
	}
	container.on("click", null);
	if (oldpick.length == data.length) {
		console.log("done");
		container.on("click", null);
		return;
	}
	//all slices have been seen, all done
	var ps = 360 / data.length,
		pieslice = Math.round(1440 / data.length),
		rng = Math.floor(Math.random() * 1440 + 360);
	rotation = Math.round(rng / ps) * ps;
	picked = Math.round(data.length - (rotation % 360) / ps);
	picked = picked >= data.length ? picked % data.length : picked;
	randomSelected = picked;

	rotation += 90 - Math.round(ps / 2);
	vis.transition()
		.duration(3000)
		.attrTween("transform", rotTween)
		.each("end", function () {
			//mark question as seen
			// d3.select(
			// 	".slice:nth-child(" + (picked + 1) + ") path",
			// ).attr("fill", "#111");
			//populate question
			d3.select("#question h2").text("Numero que ha salido " + picked);
			oldrotation = rotation;
			container.on("click", spin);
		});
	if (!isNaN(selectedLabel)) {
		if (selectedLabel == 0) {
			alert("Has perdido!");
			walletCash = 0;
		}
		if (selectedLabel == randomSelected) {
			walletCash = walletCash + 100;
		} else {
			walletCash = walletCash - 10;
		}
	} else {
		checkWiner(randomSelected);
	}
	d3.select("#question h1").text("DINERO: " + walletCash);
}
//make arrow
svg.append("g")
	.attr(
		"transform",
		"translate(" +
		(w + padding.left + padding.right) +
		"," +
		(h / 2 + padding.top) +
		")",
	)
	.append("path")
	.attr(
		"d",
		"M-" + r * 0.15 + ",0L0," + r * 0.05 + "L0,-" + r * 0.05 + "Z",
	)
	.style({
		fill: "black",
	});
//draw spin circle
container
	.append("circle")
	.attr("cx", 0)
	.attr("cy", 0)
	.attr("r", 60)
	.style({
		fill: "white",
		cursor: "pointer",
	});
//spin text
container
	.append("text")
	.attr("x", 0)
	.attr("y", 15)
	.attr("text-anchor", "middle")
	.text("Jugar")
	.style({
		"font-weight": "bold",
		"font-size": "30px",
	});

function rotTween(to) {
	var i = d3.interpolate(oldrotation % 360, rotation);
	return function (t) {
		return "rotate(" + i(t) + ")";
	};
}

function getRandomNumbers() {
	var array = new Uint16Array(1000);
	var scale = d3.scale
		.linear()
		.range([360, 1440])
		.domain([0, 100000]);
	if (
		window.hasOwnProperty("crypto") &&
		typeof window.crypto.getRandomValues === "function"
	) {
		window.crypto.getRandomValues(array);
		console.log("works");
	} else {
		//no support for crypto, get crappy random numbers
		for (var i = 0; i < 1000; i++) {
			array[i] = Math.floor(Math.random() * 100000) + 1;
		}
	}
	return array;
}
//#endregion

//#region par impar rojo y negro
par.on("click", () => noNumberSelect("par"));
impar.on("click", () => noNumberSelect("impar"));
rojo.on("click", () => noNumberSelect("rojo"));
negro.on("click", () => noNumberSelect("negro"));

function noNumberSelect(option) {
	switch (option) {
		case "par":
			selectedLabel = "par";
			container.on("click", spin);
			break;

		case "impar":
			selectedLabel = "impar";
			container.on("click", spin);
			break;

		case "rojo":
			selectedLabel = "rojo";
			container.on("click", spin);
			break;

		case "negro":
			selectedLabel = "negro";
			container.on("click", spin);
			break;
	}
}

function checkWiner(resultado) {
	if (selectedLabel == "par") {
		if (resultado % 2 == 0) {
			walletCash += 20;
		} else {
			walletCash -= 10;
		}
	} else if (selectedLabel == "impar") {
		if (resultado % 2 != 0) {
			walletCash += 20;
		} else {
			walletCash -= 10;
		}
	} else if (selectedLabel == "rojo") {
		if (resultado in numerosRojos) {
			walletCash += 20;
		} else {
			walletCash -= 10;
		}
	} else if (selectedLabel == "negro") {
		if (resultado in numerosNegros) {
			walletCash += 20;
		} else {
			walletCash -= 10;
		}
	} else {
		walletCash -= 10;
	}

}
//#endregion

export default function getInfo() {
	var info = {
		apuesta: selectedLabel,
		resultado: randomSelected,
		dinero: walletCash
	};
	return info;
}