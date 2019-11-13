console.log("CORE.js LOADED")


var step0 = function() {
	console.log("0")
}

var step1 = function() {
	console.log("1")
}

var step2 = function() {
	console.log("2")
}

var step3 = function() {
	console.log("2")
}

var step4 = function() {
	console.log("2")
}



var execution = [step0, step1, step2, step3, step4]

var maxPage = 5; //WARNING: 填写 *页面数量*


var page_transition = function() {
	
	var currentPage = 0
	console.log("Now is Page " + currentPage)
	
	d3.select("#button_up")
	.on("click", function() {
		if (currentPage != 0) {
			currentPage -= 1
			console.log("Page Changed. Now is Page " + currentPage)
			update_Content(currentPage)
		} else {
			console.log("stop: no previous page")
		}
	})
	
	d3.select("#button_down")
	.on("click", function() {
		if (currentPage != maxPage - 1) {
			currentPage += 1
			console.log("Page Changed. Now is Page " + currentPage)
			update_Content(currentPage)
		} else {
			console.log("stop: no next page")
		}
	})
	
	
	
}

//更新页面+执行绘图命令函数，每次换页时调用
var update_Content = function(page) {
	//更换页面上各个元素的loop
	for (i=0 ; i<maxPage; i++) {
		if (i == page) {
			d3.select("#intro_zone_words_"+ page).attr("class", null)
			// console.log("show page" + page)
		} else {
			d3.select("#intro_zone_words_"+ i).attr("class", "hidden")
			// console.log("hided page" + i)
		}
	}
}


page_transition()


console.log("end")
