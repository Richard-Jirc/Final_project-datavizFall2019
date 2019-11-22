

var width_DOM = d3.select("#svg_zone_Container").style("width")
var height_DOM = d3.select("#svg_zone_Container").style("height")
	
var WIDTH = parseFloat(width_DOM.slice(0, width_DOM.length-2))
var HEIGHT = parseFloat(height_DOM.slice(0, height_DOM.length-2))


var create_svg = function() {
	return d3.select("#svg_zone_Container").append("svg").attr("width", WIDTH).attr("height", HEIGHT)
}

var step0 = function() {
	
	console.log("step0 LOADED")
	
	svg = create_svg()
	
	var parseDate_time = d3.timeParse("%Y/%m/%d/%H%M"),
		parseTime = d3.timeParse("%H%M"),
		parseDate = d3.timeParse("%Y/%m/%d")
	
	var formatHour = d3.timeFormat("%H"),
		formatMin = d3.timeFormat("%M"),
		formatYear_day = d3.timeFormat("%j"),
		formatYear = d3.timeFormat("%Y")
	
	var time_calibrate = function(d) {
		if (d.length == 3) {
			return "0" + d;
		} else {
			return d;
		}
	}
	
	var seeBoolean = function(d) {
		if (d == "TRUE") {
			return true
		} else { return false }
	}
	
	var convert = function(d) {
		return {
			suc_flag: seeBoolean(d.success1),
			smt_year_obj: parseDate( d.smtdate ),   // YYYY/mm/dd  (NO invalid data)
			smt_clock_obj: parseTime( time_calibrate(d.smttime) ),   // 1900/01/01/HH:MM  (invalid data YES)
			smt_time_obj: parseDate_time( d.smtdate + "/" + d.smttime ),   // YYYY/mm/dd/HH:MM (invalid data YES)
			min_locate: parseFloat( formatHour(parseTime( time_calibrate(d.smttime) )) ) * 60 + parseFloat(formatMin(parseTime(time_calibrate(d.smttime)))),
			day_locate: parseFloat(formatYear_day(parseDate(d.smtdate))),
			year_locate: (parseFloat(formatYear(parseDate(d.smtdate))) - 1960) * 365 + parseFloat(formatYear_day(parseDate(d.smtdate))),
			memberNum: parseFloat(d.smtmembers),
			count: 0,
			season_position: 0,
			season_flag: 0,
			clock_position: 0,
			clock_flag: 0
		}
	}
	
	d3.csv("raw_data/expeditions_raw.csv", convert)
	.then(function(d) {
		
		data = d
		// console.log(data)
		
		// for (i=0; i < data.length; i++) {
		// 	if (data[i].smt_clock_obj == null) {
		// 		console.log("error");
		// 	}
		// }
		// console.log("complete")
		
		var w = WIDTH, h = HEIGHT
		var lapse_margin = {left: 50, bottom: 50, top: 50, right: 0}
		
		var draw_lapseElements = function() {
			
			var margin = lapse_margin
			
			var hour = []
			for (var j=0; j<=24; j++) { hour.push(j) }
			
			var axisScale = d3.scaleLinear()
			.domain([0, 24])
			.range([margin.top, h - margin.bottom])
			
			var appear = 500
			
			//背景时刻指示线
			svg.selectAll(".axis_time")
				.data(hour)
				.enter()
				.append("line")
				.attr("class", "show_elements")
				.attr("x1", margin.left)
				.attr("x2", w)
				.attr("stroke", "rgb(200, 200, 200)")
				.attr("stroke-dasharray", "2,3")
					.attr("opacity", 0)
					.attr("y1", function(d,i) { return axisScale(i) / 1.2 })
					.attr("y2", function(d,i) { return axisScale(i) / 1.2 })
					.transition()
					.duration(appear)
					.delay(200)
				.attr("opacity", 1)
				.attr("y1", function(d,i) { return axisScale(i); })
				.attr("y2", function(d,i) { return axisScale(i); })
			
			//左侧时刻标签
			svg.selectAll(".time_label")
				.data(hour)
				.enter()
				.append("text")
				.attr("class", "show_elements")
				.text(function(d) {
					return d + ":00"
				})
					.attr("text-anchor", "end")
					.attr("fill", "rgb(180, 180, 180)")
					.attr("font-size", "10px")
				.attr("x", margin.left - 20)
					.attr("opacity", 0)
					.attr("y", function(d,i) { return axisScale(i) / 1.2 })
					.transition()
					.duration(appear)
					.delay(200)
				.attr("opacity", 1)
				.attr("y", function(d,i) { return axisScale(i) + 4 })
			
			//画顶部月标签
			var position_array = [[0, 2/12], [2/12, 5/12], [5/12, 8/12], [8/12, 11/12], [11/12, 1]],
				color_array = ["grey", "#cfbaa2", "#b6cfa6", "#dbdaac", "grey"],
				month_array = ["WINTER", "SPRING", "SUMMER", "AUTUMN", "WINTER"]
				y = 20,
				span = w - 50
			
			//细线
			svg.selectAll(".bg_line")
				.data(position_array)
				.enter()
				.append("line")
				.attr("class", "show_elements")
				.attr("x1", function(d) { return span * d[1] + margin.left;})
				.attr("x2", function(d) { return span * d[1] + margin.left;})
				.attr("y1", y)
				.attr("y2", h - margin.bottom)
				.attr("stroke", "rgb(220, 220, 220)")
				.attr("stroke-dasharray", "2,2")
					.attr("opacity", 0)
					.transition()
					.duration(appear)
					.delay(200)
				.attr("opacity", 1)
			
			//粗线
			svg.selectAll(".month_line")
				.data(position_array)
				.enter()
				.append("line")
				.attr("class", "show_elements")
				.attr("x1", function(d) { return span * d[0] + margin.left; })
				.attr("x2", function(d) { return span * d[1] + margin.left; })
				.attr("y1", y)
				.attr("y2", y)
				.attr("stroke-width", "5px")
				.attr("stroke", function(d,i){ return color_array[i]; })
					.attr("opacity", 0)
					.transition()
					.duration(appear)
					.delay(200)
				.attr("opacity", 1)
			
			//标签
			svg.selectAll(".month_name")
				.data(month_array)
				.enter()
				.append("text")
				.attr("class", "show_elements")
				.text(function(d) { return d; })
				.attr("x", function(d,i) {
					return span * (position_array[i][1] + position_array[i][0]) / 2 + margin.left
				})
				.attr("y", y - 10)
				.attr("text-anchor", "middle")
				.attr("font-size", "10px")
				.attr("fill", function(d,i) { return color_array[i]; })
					.attr("opacity", 0)
					.transition()
					.duration(appear)
					.delay(200)
				.attr("opacity", 1)
			
		}
		
		var draw_timelapse = function(sec) {
			// console.log("time lapse begins")
			
			var margin = lapse_margin
			
			// x scale
			var dateScale = d3.scaleLinear()
				.domain([0, 365])
				.range([0 + margin.left, w - margin.right])
		
			// y scale
			var timeScale = d3.scaleTime()
				.domain([new Date(1900, 0, 1, 0, 0), new Date(1900, 0, 1, 23, 59)])
				.range([0 + margin.top, h - margin.bottom])
			
			
			//控制动画时间数据
			var startTime = 200, endSec = sec
			var long = 3000, short = 200
		
			var year_locate_array = [] //delay, duration的scale函数调用
		
			for(i=0; i<data.length; i++) { year_locate_array.push(data[i].year_locate) }
		
			var delayScale = d3.scaleLinear()
				.domain([0, d3.max(year_locate_array)])
				.range([startTime, endSec * 1000])
		
			var durationScale = d3.scaleLinear()
				.domain([0, d3.max(year_locate_array)])
				.range([long, short])
			
			var year_hueScale = d3.scaleLinear()
				.domain([1960, 2018])
				.range(["rgb(0,0,255)", "rgb(0,255,0)"])
			
			
			//筛选成功登顶且有有效登顶时刻数据，用于画圆，推时间数据
			var expd_validcheck = function(d) {
				return (d.smt_clock_obj != null) && (d.suc_flag)
			}
			
			//用于计算每个时间标签显示时长
			var delay_array = []
			
			for (var i=0; i<data.length; i++) {
				if (expd_validcheck(data[i])) {
					delay_array.push(delayScale(data[i].year_locate))
				}
			}
			delay_array.push(endSec * 1000)
			
			var temp_successCount = 0 //显示成功次数计数
			var temp_successPeople = 0
			
			//显示登顶时间具体信息
			svg.selectAll(".event_tag")
				.data(data)
				.enter()
				.append("text")
				.attr("class", "step0")
				.attr("class", "dym_tag")
				.filter( function(d) { return expd_validcheck(d) })
					.attr("font-size", "20px")
					.attr("font-family", "Helvetica")
					.attr("fill", "grey")
					.attr("text-anchor", "end")
				.attr("x", w - margin.right)
				.attr("y", h - 2)
				.text( function(d) {
					var displayTime = d3.timeFormat("%Y/%m/%d")
					temp_successCount += 1
					return temp_successCount + " successful expeditions " +" " + displayTime(d.smt_year_obj)
				})
				.attr("opacity", 0)
					.transition()
					.duration(function(d,i) {
						return (delay_array[i+1] - delay_array[i])
					})
					.delay(function(d,i) {
						return delayScale(d.year_locate);
					})
					.on("start" , function() {
						d3.select(this)
						.attr("opacity", 1)
					})
					.on("end", function(d,i) {
						if (i == delay_array.length - 2) {
							d3.select(this)
							.attr("opacity", 1)
						} else {
							d3.select(this).remove()
						}
					})
			
			//显示登顶人数
			svg.selectAll(".num_summit")
				.data(data)
				.enter()
				.append("text")
				.attr("class", "step0")
				.attr("class", "dym_tag")
				.filter( function(d) { return expd_validcheck(d) })
				.attr("font-size", "20px")
					.attr("font-family", "Helvetica")
					.attr("fill", "grey")
					.attr("text-anchor", "end")
				.attr("x", w - margin.right)
				.attr("y", h - 24)
				.text( function(d) {
					var displayTime = d3.timeFormat("%Y/%m/%d")
						temp_successPeople += d.memberNum
					return temp_successPeople + " summitted climbers"
				})
				.attr("opacity", 0)
					.transition()
					.duration(function(d,i) {
						return (delay_array[i+1] - delay_array[i])
					})
					.delay(function(d,i) {
						return delayScale(d.year_locate);
					})
					.on("start" , function() {
						d3.select(this)
						.attr("opacity", 1)
					})
					.on("end", function(d,i) {
						if (i == delay_array.length - 2) {
							d3.select(this)
							.attr("opacity", 1)
						} else {
							d3.select(this).remove()
						}
					})
				
			
			var year_lapse_array = []
			for (var i=1960; i<=2018; i++) {
				var time = i + "/01/01"
				year_lapse_array.push(delayScale((parseFloat(formatYear(parseDate(time))) - 1960) * 365 + parseFloat(formatYear_day(parseDate(time)))))
			}
			year_lapse_array.push(endSec * 1000)
			
			//显示动画进度年份
			svg.selectAll(".year_tag")
				.data(year_lapse_array)
				.enter()
				.append("text")
				.attr("class", "step0")
				.attr("class", "dym_tag")
					.attr("font-family", "font-family: 'Century Gothic',CenturyGothic,AppleGothic,sans-serif")
					.attr("font-size", "40px")
					.attr("fill", "grey")
					.attr("text-anchor", "start")
				.attr("x", 0)
				.attr("y", h - 2)
				.text(function(d,i) { return 1960 + i })
				.attr("opacity", 0)
					.transition()
					.duration(function(d,i) {
						return year_lapse_array[i+1] - year_lapse_array[i]
					})
					.delay(function(d,i) {
						return d
					})
					.on("start", function() {
						d3.select(this).attr("opacity", 1)
					})
					.on("end", function(d,i) {
						if (i == year_lapse_array.length - 2) {
							d3.select(this)
							.attr("opacity", 1)
						} else {
							d3.select(this).remove()
						}
					})
			
			
			//带延时画圆
			svg.selectAll(".expedition_circles")
				.data(data)
				.enter()
				.append("circle")
				.attr("class", "step0")
				.attr("class", "expedition_circles")
				.attr("cx", function(d) {
					return dateScale(d.day_locate);
				})
				.attr("cy", function(d) {
					return timeScale(d.smt_clock_obj);
				})
				.attr("opacity", 0)
					.attr("r", "2px")
					.attr("fill", function(d) {
						return year_hueScale(parseFloat(formatYear(d.smt_year_obj)));
					})
				.filter( function(d) {
					return expd_validcheck(d)
				})
					.transition("appear")
					.duration(function(d,i) {
						return durationScale(d.year_locate)
					})
					.delay(function(d,i) {
						return delayScale(d.year_locate);
					})
					.on("start", function() {
						d3.select(this)
						.attr("r","20px")
					})
				.attr("r", "2px")
				.attr("opacity", 0.6)
				.attr("fill", function(d) {
					return year_hueScale(parseFloat(formatYear(d.smt_year_obj)));
				})
				
				
			// console.log("circle LOADED")
		}
		
		var show_season = function() {
			
			//用循环进行分组计数
			var position_dict = {suc_1: -1, suc_2: -1, suc_3: -1, suc_4: -1, fal_1: -1, fal_2: -1, fal_3: -1, fal_4: -1}
			for (var i=0; i<data.length; i++) {
				var month = d3.timeFormat("%m")
			
				var k = parseFloat(month(data[i].smt_year_obj))
				
				if (k >= 3 && k <= 5) {
					data[i].season_flag = 1
					if (data[i].suc_flag == true) {
						position_dict.suc_1 += 1
						data[i].season_position = position_dict.suc_1
					} else {
						position_dict.fal_1 += 1
						data[i].season_position = position_dict.fal_1
					}
				} else if (k >= 6 && k <= 8) {
					data[i].season_flag = 2
					if (data[i].suc_flag == true) {
						position_dict.suc_2 += 1
						data[i].season_position = position_dict.suc_2
					} else {
						position_dict.fal_2 += 1
						data[i].season_position = position_dict.fal_2
					}
				} else if (k >= 9 && k <= 11) {
					data[i].season_flag = 3
					if (data[i].suc_flag == true) {
						position_dict.suc_3 += 1
						data[i].season_position = position_dict.suc_3
					} else {
						position_dict.fal_3 += 1
						data[i].season_position = position_dict.fal_3
					}
				} else if (k == 12 || k == 1 || k == 2) {
					data[i].season_flag = 4
					if (data[i].suc_flag == true) {
						position_dict.suc_4 += 1
						data[i].season_position = position_dict.suc_4
					} else {
						position_dict.fal_4 += 1
						data[i].season_position = position_dict.fal_4
					}
				}
			}
			
			var padding = 20
			var W = w - 2 * padding, H = h - 2 * padding
			
			//interactive背景框 & 显示百分比
			svg.selectAll(".show_elements")
			.data([1,2,3,4])
			.enter()
			.append("rect")
			.attr("class", "show_elements")
			.attr("x", function(d,i) {
				return i * (0.25 * W) + padding
			})
			.attr("y", padding)
			.attr("width", 0.25 * W)
			.attr("height", H)
			.attr("fill", function(d,i) {
				if (i == 0) { return "gold" }
				else { return "grey"}
			})
			.attr("opacity", 0.1)
				.on("mouseover", function(d,i) {
					
					var k = i
					
					d3.select(this)
					.transition("over")
					.attr("opacity", 0.8)
					
					var sum = position_dict["suc_" + d] + position_dict["fal_" + d]
					var suc_p = Math.round((position_dict["suc_" + d] / sum) * 100)
					var fal_p = 100 - suc_p
					
					svg.append("text") //失败率
					.text(fal_p + "%")
					.attr("class", "pop_numbers")
						.attr("font-size", "30px")
					.attr("x", function() {
						return padding + (0.5 + k) * 0.25 * W
					})
					.attr("y", padding + gap + 40)
					
					svg.append("text") //failure rate
					.text("failure rate")
					.attr("class", "pop_numbers")
						.attr("font-size", "18px")
					.attr("x", function() {
						return padding + (0.5 + k) * 0.25 * W
					})
					.attr("y", padding + gap + 70)
					
					
					svg.append("text") //成功率
					.text(suc_p + "%")
					.attr("class", "pop_numbers")
						.attr("font-size", "30px")
					.attr("x", function() {
						return padding + (0.5 + k) * 0.25 * W
					})
					.attr("y", H - gap - 40)
					
					svg.append("text") //success rate
					.text("success rate")
					.attr("class", "pop_numbers")
						.attr("font-size", "18px")
					.attr("x", function() {
						return padding + (0.5 + k) * 0.25 * W
					})
					.attr("y", H - gap - 10)
					
					//季节指示
					var season = ["SPRING", "SUMMER", "AUTUMN", "WINTER"]
					
					svg.append("text")
					.text(d)
					.attr("class", "pop_numbers")
					.text(season[k])
						.attr("font-size", "20px")
					.attr("x", function() {
						return padding + (0.5 + k) * 0.25 * W
					})
					.attr("y", H / 2)
					
					
				})
				.on("mouseout", function() {
					d3.select(this)
					.transition("out")
					.attr("opacity", 0.1)
					
					d3.selectAll(".pop_numbers")
					.classed("inactive", false)
					.transition()
					.remove()
				})
				.on("click", function(d,i) {
					if (i == 0) {
						d3.select("#season_onclick").classed("hidden", false);
						d3.select("#general_intro").classed("hidden", true);
					} else {
						d3.select("#season_onclick").classed("hidden", true);
						d3.select("#general_intro").classed("hidden", false);
					}
					
				})
			
			
			var gap = 0.1 * (0.25 * W) //组团与月份区边界值
			var x_column = Math.floor((0.25 * W - 2 * gap) / 6)//列数
			
			var xPosit = function(d) {
				var colScale = d3.scaleLinear()
				.domain([0, x_column])
				.range( [
					(d.season_flag - 1) * 0.25 * W + gap + padding,
					(d.season_flag) * 0.25 * W - gap + padding
				] )
				return colScale(d.season_position % x_column)
				
			}
			
			var yPosit = function(d) {
				var rowH = 6
				if (d.suc_flag == true) {
					return H - gap - (Math.floor(d.season_position / x_column) - 1) * rowH
				} else {
					return gap + (Math.floor(d.season_position / x_column)) * rowH + padding
				}
			}
			
			//变换圆位置！！
			d3.selectAll(".expedition_circles")
			.attr("opacity", 1)
			.transition()
			.attr("cx", function(d) {
				return xPosit(d)
			})
			.attr("cy", function(d) {
				return yPosit(d)
			})
			.filter(function(d) {
				return d.suc_flag == false
			})
			.attr("opacity", 0.5)
			
		}
		
		var show_clock = function() {
			
			var position_dict = {suc_1: -1, suc_2: -1, suc_3: -1, suc_4: -1, fal_1: -1, fal_2: -1, fal_3: -1, fal_4: -1}
			for (var i=0; i<data.length; i++) {
				var k = parseFloat(formatHour(data[i].smt_clock_obj))
				if (data[i].smt_clock_obj != null) {
					if (k >= 0 && k <= 5) {
						data[i].clock_flag = 1
						if (data[i].suc_flag == true) {
							position_dict.suc_1 += 1
							data[i].clock_position = position_dict.suc_1
						} else {
							position_dict.fal_1 += 1
							data[i].clock_position = position_dict.fal_1
						}
					} else if (k >= 6 && k <= 12) {
						data[i].clock_flag = 2
						if (data[i].suc_flag == true) {
							position_dict.suc_2 += 1
							data[i].clock_position = position_dict.suc_2
						} else {
							position_dict.fal_2 += 1
							data[i].clock_position = position_dict.fal_2
						}
					} else if (k >= 12 && k <= 18) {
						data[i].clock_flag = 3
						if (data[i].suc_flag == true) {
							position_dict.suc_3 += 1
							data[i].clock_position = position_dict.suc_3
						} else {
							position_dict.fal_3 += 1
							data[i].clock_position = position_dict.fal_3
						}
					} else if (k >= 19 && k <= 23) {
						data[i].clock_flag = 4
						if (data[i].suc_flag == true) {
							position_dict.suc_4 += 1
							data[i].clock_position = position_dict.suc_4
						} else {
							position_dict.fal_4 += 1
							data[i].clock_position = position_dict.fal_4
						}
					}
				}
			}
			for (var i in position_dict) {
				if (position_dict[i] == -1) {
					position_dict[i] = 0
				}
			}
						
			var padding = 20
			var W = w - 2 * padding, H = h - 2 * padding
			
			//interactive背景框 & 显示百分比
			svg.selectAll(".show_elements")
			.data([1,2,3,4])
			.enter()
			.append("rect")
			.attr("class", "show_elements")
			.attr("x", padding)
			.attr("y", function(d,i) {
				return i * (0.25 * H) + padding
			})
			.attr("height", 0.25 * H)
			.attr("width", W)
			.attr("fill", function(d,i) {
				if (i == 1) { return "gold" }
				else { return "grey"}
			})
			.attr("opacity", 0.1)
				.on("mouseover", function(d,i) {
					var k = i
					
					d3.select(this)
					.transition("over")
					.attr("opacity", 0.8)
					
					var sum = position_dict["suc_" + d] + position_dict["fal_" + d]
					var suc_p = Math.round((position_dict["suc_" + d] / sum) * 100)
					var fal_p = 100 - suc_p
					
					svg.append("text") //成功率
					.text(suc_p + "%")
					.attr("class", "pop_numbers")
						.attr("font-size", "30px")
					.attr("x", padding + 70)
					.attr("y", function() {
						return padding + (0.5 + k) * 0.25 * H - 5
					})
					
					svg.append("text") //success rate
					.text("success rate")
					.attr("class", "pop_numbers")
						.attr("font-size", "18px")
					.attr("x", padding + 70)
					.attr("y", function() {
						return padding + (0.5 + k) * 0.25 * H + 23
					})
					
					svg.append("text") //失败率
					.text(fal_p + "%")
					.attr("class", "pop_numbers")
						.attr("font-size", "30px")
					.attr("x", W - gap - 40)
					.attr("y", function() {
						return padding + (0.5 + k) * 0.25 * H - 5
					})
					
					
					svg.append("text") //failure rate
					.text("failure rate")
					.attr("class", "pop_numbers")
						.attr("font-size", "18px")
					.attr("x", W - gap - 40)
					.attr("y", function() {
						return padding + (0.5 + k) * 0.25 * H + 23
					})
					
					//时段指示
					var hour = ["0:00 - 6:00", "6:00 - 12:00", "12:00 - 18:00", "18:00 - 24:00"]
					
					svg.append("text")
					.text(d)
					.attr("class", "pop_numbers")
					.text(hour[k])
						.attr("font-size", "16px")
					.attr("y", function() {
						return padding + (0.5 + k) * 0.25 * H + 8;
					})
					.attr("x", W / 2)
					
				})
				.on("mouseout", function() {
					d3.select(this)
					.transition("out")
					.attr("opacity", 0.1)
					
					d3.selectAll(".pop_numbers")
					.classed("inactive", false)
					.transition()
					.remove()
				})
				.on("click", function(d,i) {
					if (i == 1) {
						d3.select("#clock_onclick").classed("hidden", false);
						d3.select("#general_intro").classed("hidden", true);
					} else {
						d3.select("#clock_onclick").classed("hidden", true);
						d3.select("#general_intro").classed("hidden", false);
					}
					
				})
			
			
			var gap = 0.1 * (0.25 * W) //组团与月份区边界值
			var y_row = Math.floor((0.25 * H - 2 * gap) / 6)//列数
			
			var xPosit = function(d) {
				var colH = 6
				if (d.suc_flag == false) {
					return W - gap - (Math.floor(d.clock_position / y_row) - 1) * colH
				} else {
					return gap + (Math.floor(d.clock_position / y_row)) * colH + padding
				}
			}
			
			var yPosit = function(d) {
				var rowScale = d3.scaleLinear()
				.domain([0, y_row])
				.range( [
					(d.clock_flag - 1) * 0.25 * H + gap + padding,
					(d.clock_flag) * 0.25 * H - gap + padding
				] )
				return rowScale(d.clock_position % y_row)
			}
			
			//变换圆位置！！
			d3.selectAll(".expedition_circles")
			.filter(function(d) {
				return d.smt_clock_obj != null
			})
			.attr("opacity", 1)
			.transition()
			.attr("cx", function(d) {
				return xPosit(d)
			})
			.attr("cy", function(d) {
				return yPosit(d)
			})
			.filter(function(d) {
				return d.suc_flag == false
			})
			.attr("opacity", 0.5)
			
		}
		
		var transform_barChart = function() {
			
			var year_count_dict = {}
			
			for (var i=1960; i<2019; i++) {
				year_count_dict[i] = 0
			}
			
			//年份内排序号计算
			for (var k in data) {
				yearTag = formatYear(data[k].smt_year_obj)
				
				if ((data[k].suc_flag == true)) {
					year_count_dict[yearTag] += 1
				}
				
				data[k].count = year_count_dict[yearTag]
			}
			
			//用于yScale函数
			var max = 0
			for (var k in year_count_dict) {
				if (max < year_count_dict[k]) { max = year_count_dict[k] }
			}
			
			margin = {left: 20, top: 20, bottom: 50, right: 20}
			
			//x position as years
			var yearScale = d3.scaleLinear()
				.domain([1960, 2018])
				.range([0 + margin.left, w - margin.right])
			
			//y as amounts
			var yScale = d3.scaleLinear()
				.domain([1, max])
				.range([0 + margin.top, h - margin.bottom])
			
			//筛选成功登顶且有有效登顶时刻数据，用于画圆，推时间数据
			var expd_validcheck = function(d) {
				return (d.smt_clock_obj != null) && (d.suc_flag)
			}
			
			svg.selectAll(".expedition_circles")
				.attr("opacity", 1)
				.transition()
				.duration(4000)
				.attr("cx", function(d,i) {
					y = formatYear(d.smt_year_obj)
					return yearScale(y)
				})
				.attr("cy", function(d) {
					return h - yScale(d.count)
				})
			
		}
		
		var reset_timelapse = function() {
			
			var margin = lapse_margin
			
			// x scale
			var dateScale = d3.scaleLinear()
				.domain([0, 365])
				.range([0 + margin.left, w - margin.right])
		
			// y scale
			var timeScale = d3.scaleTime()
				.domain([new Date(1900, 0, 1, 0, 0), new Date(1900, 0, 1, 23, 59)])
				.range([0 + margin.top, h - margin.bottom])
			
			
			//控制动画时间数据
			var startTime = 200, endSec = 60
			var long = 2000, short = 50
		
			var year_locate_array = [] //delay, duration的scale函数调用
		
			for(i=0; i<data.length; i++) { year_locate_array.push(data[i].year_locate) }
		
			var delayScale = d3.scaleLinear()
				.domain([0, d3.max(year_locate_array)])
				.range([startTime, endSec * 1000])
		
			var durationScale = d3.scaleLinear()
				.domain([0, d3.max(year_locate_array)])
				.range([long, short])
			
			var year_hueScale = d3.scaleLinear()
				.domain([1960, 2018])
				.range(["blue", "gold"])
			
			var expd_validcheck = function(d) {
				return (d.smt_clock_obj != null) && (d.suc_flag)
			}
			
			svg.selectAll(".expedition_circles")
			.transition()
			.attr("opacity", 0.6)
			.attr("cx", function(d) {
				return dateScale(d.day_locate);
			})
			.attr("cy", function(d) {
				return timeScale(d.smt_clock_obj);
			})
			
		}
		
		
		d3.select("#transform_guide").attr("class", "hidden")
		d3.select("#return_guide").attr("class", "hidden")
		d3.select("#timelapse_settings").attr("class", null)
		
		
		draw_lapseElements()
		
		//开始time lapse
		d3.select("#secSubmit")
		.on("click", function() {
			var a = document.getElementById("timelapse_second").value
			
			if (a <= 0) { time = 1 } else { time = a }
			
			draw_timelapse(time)
			
			d3.select("#timelapse_settings").classed("hidden", true)
			
			d3.select("#transform_guide")
			.transition()
			.delay(a * 1000)
			.attr("class", null)
		})
		
		//按季度分类变换
		d3.select("#season_classify_transform_button")
		.on("click", function() {
			d3.selectAll(".dym_tag").remove()
			d3.selectAll(".show_elements").remove()
			
			d3.select("#transform_guide").classed("hidden", true);
			d3.select("#return_guide").classed("hidden", false);
			
			show_season(data)
			
		});
		
		//按时刻分类变换
		d3.select("#hour_classify_transform_button")
		.on("click", function() {
			d3.selectAll(".dym_tag").remove()
			d3.selectAll(".show_elements").remove()
			
			d3.select("#transform_guide").classed("hidden", true);
			d3.select("#return_guide").classed("hidden", false);
			
			show_clock(data)
			
		})
		
		//年度柱状图变换
		// d3.select("#barChart_transform_button")
		// .on("click", function() {
		// 	d3.selectAll(".dym_tag").remove()
		// 	d3.selectAll(".show_elements").remove()
		// 	d3.select("#transform_guide").classed("hidden", true);
		// 	d3.select("#return_guide").classed("hidden", false);
		//
		// 	transform_barChart()
		//
		// });
		
		//返回键
		d3.select("#return_button")
		.on("click", function() {
			svg.selectAll(".show_elements").remove()

			d3.select("#return_guide").classed("hidden", true);
			d3.select("#transform_guide").classed("hidden", false);
			
			d3.select("#general_intro").classed("hidden", false);
			d3.select("#season_onclick").classed("hidden", true);
			d3.select("#clock_onclick").classed("hidden", true);
			d3.select("#year_onclick").classed("hidden", true);
			
			draw_lapseElements()
			reset_timelapse()
		})
		
		//重放，重洗svg
		d3.select("#timelapse_replay_button")
		.on("click", function() {
			svg.remove()
			
			step0()
		})
		
	})
	
}

var step1 = function() {
	
	console.log("step1 LOADED")
	
	svg = create_svg()
	
	var w = WIDTH;
	var h = HEIGHT;
	
	margin = {left: 70, right: 20, top: 20, bottom: 50}
	
	d3.select("#guess_start").classed("hidden", false)
	
	d3.select("#guess_after").classed("hidden", true)
		
	//高亮显示用背景矩形
	svg.append("rect")
	.attr("id", "bg_rect")
	.attr("opacity", 0)
	.attr("x", 0)
	.attr("y", 0)
	.attr("width", w)
	.attr("height", h)
	.attr("fill", "black")
	
	//creare movable circles
	var radius = 7;

	var circles = [5180,6100,6500,7010,7775,8230,8850]
	
	var xScale = d3.scaleLinear()
	.domain([0, 80])
	.range([margin.left, w - margin.right]);
	
	var yScale = d3.scaleLinear()
	.domain([5000,8850])
	.range([h - margin.bottom, margin.top]);
	
	svg.selectAll("circle")
		.data(circles)
		.enter()
		.append("circle")
		.attr("class", "drag_circle")
		.attr("cx", function (d) { return margin.left; })
		.attr("cy", function (d) { return yScale(d); })
		.attr("r", radius)
		.attr("fill", "#d44d37")
		.on("mouseover", function (d) {d3.select(this).style("cursor", "move");})
		.on("mouseout", function (d) {})
		.call(d3.drag()
			.on("start", dragstarted)
			.on("drag", dragged)
			.on("end", dragended)
		)
	
	var cir_coor = []
	
	for (var i=0; i<circles.length; i++) {
		cir_coor.push([margin.left,yScale(circles[i])])
	}
	
	var drag_line = d3.line()
	.x(function(d) { return d[0]; })
	.y(function(d,i){
		return d[1];
	})
	.curve(d3.curveMonotoneX)
	
	d3.select("svg")
	.data([cir_coor])
	.append("path")
	.attr("id", "drag_path")
	.attr("d", drag_line)
	.attr("stroke", "#d44d37")
	.attr("stroke-width", 1)
	.attr("fill", "none")
	
	
	var draw_line = function(d) {
		
		d3.select("#drag_path").remove()
		
		d3.select("svg")
		.data([d])
		.append("path")
		.attr("id", "drag_path")
		.attr("d", drag_line)
		.attr("stroke", "#d44d37")
		.attr("stroke-width", 3)
		.attr("fill", "none")
	
	}
	
	function dragstarted(d) {
		d3.select(this).raise().classed("active", true);
	}
	
	//限制滑块的活动区间
	function dragged(d,i) {
		d3.select(this).attr("cx", function(){
			if (d3.event.x >= margin.left && d3.event.x <= w - margin.right) { return d3.event.x }
			else if (d3.event.x < margin.left) { return margin.left }
			else if (d3.event.x > w - margin.right) { return w - margin.right }
		})
		
		var k
		
		if (d3.event.x >= margin.left && d3.event.x <= w - margin.right) { k = d3.event.x }
			else if (d3.event.x < margin.left) { k = margin.left }
			else if (d3.event.x > w - margin.right) { k = w - margin.right }
		
		cir_coor[i][0] = k
		
		draw_line(cir_coor)
		
	}
	
	function dragended(d) {
		d3.select(this).classed("active", false);
		
		
	}
	
	
	var line = d3.line()
		.x(function(d,i){
			return xScale(d[0])
		})
		.y(function(d,i){
			return yScale(d[1])
		})
		.curve(d3.curveMonotoneX)
	
	// var area = d3.area()
	// 	.x(function(d,i){
	// 		return xScale(d[0])
	// 	})
	// 	.y0(function(d,i){
	// 		return yScale(d[1])
	// 	})
	// 	.y1(function(d,i){
	// 		return h-padding
	// 	})
	// 	.curve(d3.curveMonotoneX)
	
	
	//draw x Axis and legends
	for(var i=0; i<circles.length; i++){
		
		
		//画滑块辅助线
		svg.selectAll(".guide_path")
		   .data(circles)
		   .enter()
		   .append("line")
		   .attr("x1", margin.left)
		   .attr("x2", w - margin.right)
		   .attr("y1", function(d){ return yScale(d); })
		   .attr("y2", function(d){ return yScale(d); })
		   .attr("class", "guide_path")
		   .attr("fill", "none")
		   .attr("class", "lines")
		   .attr("stroke","#cccccc")
		   .attr("opacity", 0.3)
		   .style("stroke-dasharray", ("2, 3"));
		
		//画高度标签
		svg.selectAll("text")
		   .data(circles)
		   .enter()
		   .append("text")
		   .text(function(d,i){
			   return d + "m"
		   }) 
		   .attr("x", 40)
		   .attr("y", function(d,i){
			   return yScale(d) + 4;
			})
		   .attr("font-size", "10px")
		   .attr("text-anchor", "end")
		   .attr("fill", "rgb(140, 140, 140)");
	}
	
	var formatDay = function(d) {
		return "day " + d;
	}
	
	var xAxis = d3.axisBottom()
		.scale(xScale)
		.ticks(10)
		.tickFormat(formatDay);
	
	d3.select("svg")
		.append("g")
		.attr("class","axis")
		.attr("transform","translate(0,"+ (h-margin.top) +")")
		.call(xAxis)
		
	// d3.select("svg")
	// 	.append("g")
	// 	.attr("class","axis")
	// 	.call(yAxis)
	
	var show_routes = function() {
		
		d3.csv("raw_data/N_Col_NE_Ridge_6.csv")
		.then(function(data) {
			
			var parsedData = parseRoute(data)
			
			//画点和线循环，循环数据组数次
			for (var i=0; i<parsedData.length; i++) {
				
				time = i
				
				dataset = parsedData[i];
				
				t = 200
				 
				//画节点
				svg.selectAll(".new")
				   .data(dataset)
				   .enter()
				   .append("circle")
				   .classed("camp_circle", true)
				   .attr("class", function(d,i) { return "camp_circle" + " " + i; })
				   .attr("cx", function(d) {
				   		return xScale(d[0]);
				   })
				   .attr("cy", function(d) {
				   		return yScale(d[1]);
				   })
				   .attr("fill","gold")
				   .attr("r", 10)
				   .attr("opacity",0)
						.transition("pop!")
						.duration(t)
						.delay( function(d,i) {  return time * t})
				   .attr("opacity",1)
				   .attr("r", 2)
				   .attr("fill","gold")
				   
				   
				//画路线
				svg.append("path")
				   .data([dataset])
				   .attr("d",line)
				   .attr("fill", "none")//styles the line with attr
				   .attr("class", "climb_path" + " " + time)
				   .attr("stroke","#ccac2b")
				   .attr("opacity",0)
						.transition("pop!")
						.duration(t)
						.delay( function(d,i) {  return time * t})
				   .attr("opacity", 0.4)
				   .attr("stroke-width", 1.5)
				   .attr("fill","none")
			}
			
			
		   })
		
		
		const _MS_PER_DAY = 1000 * 60 * 60 * 24;

		// a and b are javascript Date objects
		function dateDiffInDays(a, b) {
		  // Discard the time and time-zone information.
		  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
		  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
		  
		  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
		}
	
		//数据处理函数
		function parseRoute(data){
		
			var formatted = []//Array to store new organized data
			var simplified = []
			
			for(var i in data){
				
				var year = data[i].year
				formatted[i]=[]
				simplified[i]=[]//each line is an array
				
				if (data[i].route!=undefined){
					
                    var route = data[i].route.split("),").join(")").split(")") // get each route data one by one
                    //console.log(route)
                    var parsedRoute = []
					
                    for(var r in route){
                        // r is the number of elements in each route array
                        var complete = true
                        var entry = route[r] //entry is a string
                        var station = entry.split("(")[0]
                        var stationRecord = entry.split("(")[1]
                        if(stationRecord!=undefined){
                            var sRList = stationRecord.split(",")
                            if(sRList.length==2){
								var parser2 = d3.timeParse("%d/%m/%Y")
								var dateconverted = sRList[0] +"/"+ year
                                var date = parser2(dateconverted)
                                var elevation = sRList[1]
                            }else{
                                
                                //when there is a missing value, then "NA" is substituted
                                //you will have to decide how to draw
                                if(stationRecord.includes("/")){
                                    var date = parser2(stationRecord +"/"+ year)
									if(station == "Smt")
                                    var elevation = 8850
										else complete = false
                                }else{
                                    var elevation = stationRecord
                                    var date = "NA"
									var complete = false
                            
                                }
                            }
							
							if(date != "NA" && date != null){
							   if(r==0){
								   var day = 0
							   }
							   else
								   if(formatted[i][0][1] != "NA" && formatted[i][0][1] != null)
								   var day = dateDiffInDays(formatted[i][0][1],date)
								   
							}
							else
								{var day = "null"
								var complete = false}
							
                            //you may need to put this in different formats
                            formatted[i].push([station, date, elevation,year])
							//console.log(complete)
							if(complete == true)
							simplified[i].push([day, parseInt(elevation)])
							
							else{
							    // simplified[i].push([0,8850])
								
							}
                        }
                    }
					if(complete == false)
						simplified[i]=null
						complete = true
					
                }
            }
            return simplified
        }
	}
	
	
	//按钮触发显示登顶时间
	d3.select("#show_trend_button")
	.on("click", function() {
		
		show_routes()
		
		d3.select("#guess_start")
		.attr("class", "hidden")
		
		d3.select("#guess_after")
		.transition()
		.delay(64 * 210)
		.duration(200)
		.attr("class", null)
		
	})
	
	
	sec = 500
	
	d3.select("#show_camps")
	.on("mouseover", function() {
		d3.select("#bg_rect")
			.transition()
			.duration(sec)
		.attr("opacity", 0.8)
		
		d3.selectAll(".camp_circle")
			.transition("camp_show")
			.duration(sec)
		.attr("opacity", 1)
		.attr("fill", function(d) {
			var colors = ["#de3c78",
			"#d84d34",
			"#d68e27",
			"#9bb32c",
			"#469534",
			"#56c04c",
			"#626ce1",
			"#a25dd5",
			"#d04bba"]
			
			var k = d3.select(this).attr("class").slice(-1)
			
			return colors[k]
		})
		
		d3.selectAll(".climb_path")
			.transition("camp_fade")
			.duration(sec)
		.attr("stroke", "white")
		.attr("stroke-width", 1)
		.attr("opacity", 0.1)
		
		d3.selectAll(".drag_circle")
			.transition()
			.duration(sec)
		.attr("fill", "gold")
		
		d3.selectAll("#drag_path")
			.transition()
			.duration(sec)
		.attr("stroke", "gold")
		
	})
	.on("mouseout", function() {
		d3.select("#bg_rect")
			.transition()
			.duration(sec)
		.attr("opacity", 0)
		
		d3.selectAll(".camp_circle")
			.transition()
			.duration(sec)
		.attr("fill", "gold")
		.attr("opacity", 1)
		
		d3.selectAll(".climb_path")
			.transition()
			.duration(sec)
		.attr("stroke", "#ccac2b")
		.attr("stroke-width", 2)
		.attr("opacity", 0.4)
		
		d3.selectAll(".drag_circle")
			.transition("camp_fade")
			.duration(sec)
		.attr("fill", "#d44d37")
		
		d3.selectAll("#drag_path")
			.transition("camp_fade")
			.duration(sec)
		.attr("stroke", "#d44d37")
		
	})
	
	var get_seq = function(d) {
		return parseFloat(d.slice(d.length - 2, d.length))
	}
	
	d3.select("#show_lines")
	.on("mouseover", function() {
		
		d3.select("#bg_rect")
			.transition()
			.duration(sec)
		.attr("opacity", 0.8)
		
		d3.selectAll(".climb_path")
			.transition("climb_show")
			.duration(sec)
		.attr("stroke-width", 1)
		.attr("opacity", 0.6)
		.filter(function() {
			var k = get_seq(d3.select(this).attr("class"))
			return k <= 64
		})
		.attr("stroke", function(d,i) {
			
			var scale = d3.scaleLinear()
			.domain([0, 64])
			.range(["rgb(0,0,255)", "rgb(0,255,0)"])
			
			var k = get_seq(d3.select(this).attr("class"))
			
			return scale(k)
		})
		
		d3.selectAll(".camp_circle")
			.transition("climb_fade")
			.duration(sec)
		.attr("fill", "white")
		.attr("opacity", 0.2)
		
		d3.selectAll(".drag_circle")
			.transition()
			.duration(sec)
		.attr("fill", "gold")
		
		d3.selectAll("#drag_path")
			.transition()
			.duration(sec)
		.attr("stroke", "gold")
	})
	.on("mouseout", function() {
		
		d3.select("#bg_rect")
			.transition()
			.duration(sec)
		.attr("opacity", 0)
		
		d3.selectAll(".climb_path")
			.transition()
			.duration(sec)
		.attr("stroke-width", 2)
		.attr("opacity", 0.4)
		.attr("stroke", "#ccac2b")
		
		d3.selectAll(".camp_circle")
			.transition()
			.duration(sec)
		.attr("fill", "gold")
		.attr("opacity", 1)
		
		d3.selectAll(".drag_circle")
			.transition("camp_fade")
			.duration(sec)
		.attr("fill", "#d44d37")
		
		d3.selectAll("#drag_path")
			.transition("camp_fade")
			.duration(sec)
		.attr("stroke", "#d44d37")
		
	})
	
}

var step2 = function() {
	
	console.log("step2 LOADED")
	
	d3.select("#step2")
	.classed("hidden", false)
	.attr("width", WIDTH)
	.attr("height", HEIGHT)
	
}


var execution = [step0, step1, step2]

var maxPage = 3; //WARNING: 填写 *页面数量*

var currentPage = 0

var page_transition = function() {
	
	console.log("Now is Page " + currentPage)
	
	step0()
	
	d3.select("#button_minus")
	.on("click", function() {
		
		if (currentPage != 0) {
			if (currentPage == 1) {
				d3.select(this).classed("inactive", true)
			}
			
			currentPage -= 1
			console.log("Page Changed. Now is Page " + (currentPage))
			
			if (currentPage == 1) {
				d3.select("#step2").attr("class", "hidden")
			}

			update_Content(currentPage)
			
			if (currentPage == maxPage - 2) {
				d3.select("#button_plus").classed("inactive", false)
			}
			
		} else {
			d3.select(this).classed("inactive", true)
			console.log("stop: no previous page")
		}
	})
	
	d3.select("#button_plus")
	.on("click", function() {
		if (currentPage != maxPage - 1) {
			
			if (currentPage == maxPage - 2) {
				d3.select(this).classed("inactive", true)
			}
			
			currentPage += 1
			console.log("Page Changed. Now is Page " + (currentPage))
			
			update_Content(currentPage)
			
			if (currentPage == 1) {
				d3.select("#button_minus").classed("inactive", false)
			}
			
		} else {
			d3.select(this).classed("inactive", true)
			console.log("stop: no next page")
		}
	})
	
	
}

//更新页面+执行绘图命令函数，每次换页时调用
var update_Content = function(page) {
	
	d3.select("svg").remove()
	
	//更换intro/interactive_zone显示
	for (i=0 ; i<maxPage; i++) {
		if (i == page) {
			d3.select("#intro_zone_words_" + page).classed("hidden", false)
			d3.select("#interact_zone_elements_" + page).classed("hidden", false)
			// console.log("show page" + page)
		} else {
			d3.select("#intro_zone_words_"+ i).attr("class", "hidden")
			d3.select("#interact_zone_elements_"+ i).attr("class", "hidden")
			// console.log("hided page" + i)
		}
	}
	
	execution[page]()
}

d3.select("#welcome_go")

page_transition()


console.log("end")
