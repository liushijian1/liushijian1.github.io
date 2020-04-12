jQuery(document).ready(function() {
				boxBg()
				// 此全局变量用来存放获取到的地位
				var localcity
				
				// 腾讯定位，获取当前的地区信息
				$.ajax({
					url: "https://apis.map.qq.com/ws/location/v1/ip?&key=KQQBZ-FWMYQ-OVL5U-GW2MF-EXE63-3TFVU&output=jsonp",
					type: "GET",
					dataType: "jsonp", //指定服务器返回的数据类型
					jsonp: "callback",
					success: function(data) {
						// var datas=JSON.stringify(data)
						console.log(data)
						// 获取位置信息精确到县级市或城区
						localcity=data.result.ad_info.city
						// 将获取的定位赋值给页面
						$('.city').text(localcity)
						console.log(localcity)
						// 获取到定位后再执行和风天气的ajax请求，确保数据加载正常
						hefeng()
					},
					error: function() {
						alert('fail');
					}
				});
				
				// 此函数将和风天气的ajax请求封装在一起，和风为get请求
				function hefeng(){
					
					// 请求获取当地实况天气
					$.ajax({
						url: "https://api.heweather.net/s6/weather/now?location="+localcity+"&key=4fb5bfa08ec54f15a17d1b9938111b46",
						type: "GET",
						success: function(data) {
							// var datas=JSON.stringify(data)
							console.log(data)
							var tmp=data.HeWeather6[0].now.tmp
							var cond_txt=data.HeWeather6[0].now.cond_txt
							var cond_code=data.HeWeather6[0].now.cond_code
							var hum=data.HeWeather6[0].now.hum
							var vis=data.HeWeather6[0].now.vis
							var wind_dir=data.HeWeather6[0].now.wind_dir
							var wind_sc=data.HeWeather6[0].now.wind_sc
							$('.wd').text(tmp)
							$('.tianqi span').text(cond_txt)
							$('.shidu>div').text(hum)
							$('.kjd>div').text(vis)
							$('.wind>.w1').text(wind_dir)
							$('.wind>.w2').text(wind_sc)
							
							$(".tianqi img").attr("src", './images/'+cond_code+'.png')
						},
						error: function() {
							alert('fail');
						}
					});
					
					// 请求获取当地3-10天天气预报数据
					$.ajax({
						url: "https://api.heweather.net/s6/weather/forecast?location="+localcity+"&key=4fb5bfa08ec54f15a17d1b9938111b46",
						type: "GET",
						success: function(data) {
							console.log(data)
							var tmp_max=data.HeWeather6[0].daily_forecast[0].tmp_max
							var tmp_min=data.HeWeather6[0].daily_forecast[0].tmp_min
							var update=data.HeWeather6[0].update.loc
							$('.tmp_max').text(tmp_max)
							$('.tmp_min').text(tmp_min)
							$('.update').text(update)
							
							// 遍历获取数据然后赋值给页面
							for(var i=1;i<10;i++){
								var date=data.HeWeather6[0].daily_forecast[i].date
								var tmp_max=data.HeWeather6[0].daily_forecast[i].tmp_max
								var tmp_min=data.HeWeather6[0].daily_forecast[i].tmp_min
								var cond_txt_d=data.HeWeather6[0].daily_forecast[i].cond_txt_d
								var cond_code_d=data.HeWeather6[0].daily_forecast[i].cond_code_d
								// console.log(cond_code_d)
								
								// 切割成数组
								var newdate=date.split("-")
								$('.f'+(i)+" .date").text(newdate[1]+"/"+newdate[2])
								$('.f'+(i)+" .max").text(tmp_max+"°")
								$('.f'+(i)+" .min").text(tmp_min+"°")
								$('.f'+(i)+" .tb").text(cond_txt_d)
								$('.f'+(i)+" .tbimg img").attr("src", './images/'+cond_code_d+'.png')
								
								if(!iconsConfig["icon"+cond_code_d]){
									$('.f'+(i)+" .tbimg img").attr("src", './images/-1.png')
								}
							}
						},
						error: function() {
							alert('fail');
						}
					});
					
					// 逐小时预报  请求获取当地未来24-168个小时的逐小时天气数据
					$.ajax({
						url: "https://api.heweather.net/s6/weather/hourly?location="+localcity+"&key=4fb5bfa08ec54f15a17d1b9938111b46",
						type: "GET",
						success: function(data) {
							console.log(data)
							for(var i=0;i<24;i++){
								var time=data.HeWeather6[0].hourly[i].time
								var tmp=data.HeWeather6[0].hourly[i].tmp
								var cond_txt=data.HeWeather6[0].hourly[i].cond_txt
								var cond_code=data.HeWeather6[0].hourly[i].cond_code
								var newtime=time.split(" ")
								$('.c'+(i+1)).text(newtime[1])
								$('.d'+(i+1)+">span").text(tmp+"°")
								$('.r'+(i+1)+" .tubiao span").text(cond_txt)
								$('.r'+(i+1)+" .tubiao img").attr("src", './images/'+cond_code+'.png')
								if(!iconsConfig["icon"+cond_code]){
									$('.r'+(i+1)+" .tubiao img").attr("src", './images/-1.png')
								}
								
							}
						},
						error: function() {
							alert('fail');
						}
					});
					
					$.ajax({
						url: "https://api.heweather.net/s6/air/now?location="+localcity+"&key=4fb5bfa08ec54f15a17d1b9938111b46",
						type: "GET",
						success: function(data) {
							console.log(data)
							var qlty=data.HeWeather6[0].air_now_city.qlty
							$('.kongqi span').text(qlty)
						},
						error: function() {
							alert('fail');
						}
					});
				}
				
				
				$('.search').click(function(){
					var value=$('.inp')[0].value
					if(value!=""){
						localcity=value
						$('.city').text(localcity)
						hefeng()
						$('.inp')[0].value=""
					}else{
						return;
					}
				})
				
				// function CheckImgExists(imgurl) {
				//     var ImgObj = new Image();
				//     ImgObj.src = imgurl;
				//     if (ImgObj.fileSize > 0 || (ImgObj.width > 0 && ImgObj.height > 0)) {
				//         return true;
				//     } else {
				//         return false;
				//     }
				// }
				
				function boxBg() {
				  //获取当前时间
				  let hours = new Date().getHours();
				
				  let $box = $('.box');
				
				  if (hours >= 6 && hours < 12) {
				    $box.addClass('morning');
				  } else if (hours >= 12 && hours < 19) {
				    $box.addClass('days');
				  } else {
				    $box.addClass('night');
				  }
				}
				
				
				var iconsConfig = {
				  icon100: {
				    code: 100,
				  },
				  icon101: {
				    code: 101,
				  },
				  icon104: {
				    code: 104,
				  },
				  icon300: {
				    code: 300,
				  },
				  iconDefault: {
				    code: -1,
				    title: '未知',
				    imgName: '-1.png'
				  }
				}
				
			});