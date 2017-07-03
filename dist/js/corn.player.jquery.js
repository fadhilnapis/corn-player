log = function(s){
	console.log(s)
}

if (typeof Object.create !=='function') {
	Object.create = function( obj ) {
		function F(){};
		F.prototype = obj;
		return new F();
	}
}
(function( $, window, document, undefined) {
	var Corn = {
		onCallMethod:{
			videoInit:null,
			videoEnd:null,
			videoStart:null,
		},
		init: function(options,elem, args) {
			var that = this;
			that.elem = elem;
			that.$elem = $(elem)

			if (that.$elem.attr('corn-player')===undefined) {
				that.playing=undefined;
			}
			if (typeof options === 'object') {
				$.extend($.fn.cornPlayer.options, $.fn.cornPlayer.options, options)
			}
			if (that.$elem.attr('corn-player')!=undefined&&options!=undefined&&args!=undefined) {
				el = $.fn.cornPlayer.options[options]
				if (!(options in that.onCallMethod)) {
					if (typeof el==='function') {
						that.$elem.data(options, el.call(that.elem))
						that[options]=el.call(that.elem)
					}else{
						that.$elem.data(options, el)
						that[options]=el
					}
				}
			}
			if (that.$elem.attr('corn-player')===undefined) {
				$.each($.fn.cornPlayer.options,function(index, el) {
					if (!(index in that.onCallMethod)) {
						if (typeof el==='function') {
							that.$elem.data(index, el.call(that.elem))
							that[index]=el.call(that.elem)
						}else{
							that.$elem.data(index, el)
							that[index]=el
						}
					}else{
						that[index]=el
					}
				});
			}
			that.fetch()
			that.build()
			that.initFunction()

		},
		fetch:function() {
			var that = this
			if (that.$elem.attr('autoplay')!==undefined) {
				if (that.elem.paused) {
					setTimeout(function() {
						var isPlaying = that.player.currentTime > 0 && !that.player.paused && !that.player.ended && that.player.readyState > 2;
						if (!isPlaying) {
							that.elem.play()
						}
					},100)
				}
			}
			if (typeof that.source==='string') {
				that.$elem.attr('src',that.source);
			}else if (that.source instanceof Array) {
				sourceelem = ''
				for (var i = 0; i < that.source.length; i++) {
					if (typeof that.source[i]==='string') {
						sourceelem += '<source src="'+that.source[i]+'"></source>'
					}else{
						sourceelem += '<source src="'+that.source[i]['src']+'"></source>'
					}
				}
				that.$elem.html(sourceelem)
			}
		},
		refreshData:function() {
			var that = this
		},
		build:function() {
			var that=this
			that.player = that.elem
			that.$elem.removeAttr('width')
			that.$elem.removeAttr('height')
			that.$elem.removeAttr('controls')
			if (that.$elem.attr('corn-player')===undefined) {
				that.$elem.wrap("<div class='corn-player' style='width:"+that.width+"px;height:"+that.height+"px;'></div>")
				that.$elem.before('<span class="keyhit"></span>')
				that.$elem.after('<div '+((!that.showController)?'style="display:none"':'')+' class="controller">'+
					'<button class="component btg btg-play'+((that.$elem.attr('autoplay'))?' paused':'')+'">'+
					'	<span class="inner"></span>'+
					'</button>'+
					'<div class="component time-display">'+
					'	<div class="inner">00:01</div>'+
					'</div>'+
					'<div class="component timeline">'+
					'	<div class="inner bar">'+
					'	<div class="inner buffer-group">'+
					'		<div class="inner buffered" style="left: 0;width: 0%"></div>'+
					'	</div>'+
					'		<div class="inner current" style="width: 0%"></div>'+
					'		<div class="inner thumb" style="left: 0%"></div>'+
					'	</div>'+
					'</div>'+
					'<div class="component total-time-display">'+
					'	<div class="inner">1:00</div>'+
					'</div>'+
					'<button class="component btg btg-sound">'+
					'	<span class="inner"></span>'+
					'</button>'+
					'<div class="component volumeline">'+
					'	<div class="inner bar">'+
					'		<div class="inner buffered" style="left: 0;width: 100%"></div>'+
					'		<div class="inner current" style="width: 50%"></div>'+
					'		<div class="inner thumb" style="left: 50%"></div>'+
					'	</div>'+
					'</div>'+
					'<div class="relate">'+
					'	<button class="component btg btg-cc '+((that.cc)?'yes':'')+'">'+
					'		<span class="inner"></span>'+
					'	</button>'+
					'	<div class="cc-list">'+
					'	</div>'+
					'</div>'+
					'<button class="component btg btg-fullscreen">'+
					'	<span class="inner"></span>'+
					'</button>'+
				'</div>')
			}
			that.wrapper = that.$elem.parent()
			that.vidControl = that.wrapper.find(".controller")
			if (that.controller)
				that.vidControl = that.wrapper.find(".controller").add(that.controller)
			if(that.controller){
				$(that.controller).each(function() {
					this.find('[data-role]').attr('class', this.find('[data-role]'));
				});
			}
			if (typeof that.videoEnd==='function') {
				$(that.elem).off('ended')
				$(that.elem).on('ended',function() {
					that.videoEnd.call(that.elem)
				})
			}
			if (typeof that.videoStart==='function') {
				$(that.elem).off('play')
				$(that.elem).on('play',function() {
					that.videoStart.call(that.elem)
				})
			}
			that.subtitles = that.wrapper.find("[kind='subtitles']")
			that.skipper = that.wrapper.find("[kind='skip']")
		},
		initFunction:function() {
		//---------------------------------------------	Variable Setup					{
			var that = this
			that.playerFocusonclick = false
			that.oncontrol = false;
			that.onplayer = false;
			that.hited;
			that.playerFocus;
			that.window = window
			that.document = document
			//}
		//---------------------------------------------	Global Function					{
			that.getCurrH = function(){
				return Math.min(that.player.offsetWidth*that.player.videoHeight/that.player.videoWidth,that.player.offsetHeight)
			}
			that.getCurrW = function(){
				return Math.min(that.player.offsetHeight*that.player.videoWidth/that.player.videoHeight,that.player.offsetWidth)
			}
			that.setVol = function(vol){
				that.player.volume=Math.min(Math.max(vol,0),1)
				that.vidControl.find(".volumeline .bar .thumb").css("left",(Math.min(Math.max(vol*100,0),100))+"%")
				that.vidControl.find(".volumeline .bar .current").css("width",(Math.min(Math.max(vol*100,0),100))+"%")
			}
			toTitleCase = function(str) {
				return str.replace(/(?:^|\s)\w/g, function(match) {
					return match.toUpperCase();
				});
			}

			if (that.$elem.attr('corn-player')===undefined){
				goFullscreen =function(wrapper) {
					var that = this;
					if (that.document.documentElement.requestFullscreen) {
					  that.document.documentElement.requestFullscreen();
					} else if (that.document.documentElement.msRequestFullscreen) {
					  that.document.documentElement.msRequestFullscreen();
					} else if (that.document.documentElement.mozRequestFullScreen) {
					  that.document.documentElement.mozRequestFullScreen();
					} else if (that.document.documentElement.webkitRequestFullscreen) {
					  that.document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
					}
					that.vidControl = wrapper.find(".controller")
					wrapper.addClass("full-screen")
					$('body').css('overflow', 'hidden');
					that.vidControl.find(".btg-fullscreen").addClass("exit")
				},
				exitFullscreen =function(wrapper) {
					var that = this;
					if (that.document.exitFullscreen) {
					  that.document.exitFullscreen();
					} else if (that.document.msExitFullscreen) {
					  that.document.msExitFullscreen();
					} else if (that.document.mozCancelFullScreen) {
					  that.document.mozCancelFullScreen();
					} else if (that.document.webkitExitFullscreen) {
					  that.document.webkitExitFullscreen();
					}
					$('body').css('overflow', 'auto');
				},
				toggleFullscreen = function(wrapper) {
					var that = this;
					if (!that.document.fullscreenElement &&!that.document.mozFullScreenElement && !that.document.webkitFullscreenElement && !that.document.msFullscreenElement) {
						that.goFullscreen(wrapper)
					}else{
						that.exitFullscreen(wrapper)
					}
				},

				that.$elem.on('goFullscreen', function(event) {
					goFullscreen(that.wrapper)
				});
				that.$elem.on('exitFullscreen', function(event) {
					exitFullscreen(that.wrapper)
				});
				that.$elem.on('toggleFullscreen', function(event) {
					console.log('gg')
					toggleFullscreen(that.wrapper)
				});
				that.$elem.on('source', function(event,arg) {
					that.$elem.attr('src',arg);
				});
			}
			//}
		//---------------------------------------------	Enter Controller				{
			that.controllerEnter = function(e){
				that.oncontrol=true
			}
			that.controllerLeave = function(e){
				that.oncontrol=false
			}
			if (that.$elem.attr('corn-player')===undefined){
				that.vidControl.on("mouseenter",that.controllerEnter)
				that.vidControl.on("mouseleave",that.controllerLeave)
			}
			//}
		//---------------------------------------------	Enter Player					{
			that.playerEnter = function(e){
				that.onplayer=true
			}
			that.playerLeave = function(e){
				that.onplayer=false
			}
			if (that.$elem.attr('corn-player')===undefined){
				that.wrapper.on("mouseenter",that.playerEnter)
				that.wrapper.on("mouseleave",that.playerLeave)
			}
			//}
		//---------------------------------------------	Focus Player					{
			if (that.$elem.attr('corn-player')===undefined)//
			$(that.document).on('click',function(e) {
				if (!that.playerFocusonclick)
					that.playerFocus = false
				else
					that.playerFocus = true
				that.playerFocusonclick = false
			})
			if (that.$elem.attr('corn-player')===undefined)//
			that.wrapper.on('click',function(e) {
				that.playerFocusonclick=true
				that.playerFocus = true
			})
			//}
		//---------------------------------------------	Shortcut Keyboard				{
			that.kdu = function(down) {
				if (down) {
					that.wrapper.find(".keyhit").addClass("hiting")
					that.wrapper.find(".keyhit").removeClass("hited")
					clearTimeout(that.hited)
				}else{
					that.wrapper.find(".keyhit").addClass("hited")
					that.wrapper.find(".keyhit").removeClass("hiting")
					that.hited=setTimeout(function(){
						that.wrapper.find(".keyhit").removeClass("hited")
					},500)
				}
			}
			that.changeDur = 0;
			that.kc={
				"32":{
					name:"space",
					status:"up",
					down:function() {
						if(that.elem.paused){
							that.vidControl.find('.btg-play').addClass("paused")
							var isPlaying = that.player.currentTime > 0 && !that.player.paused && !that.player.ended && that.player.readyState > 2;
							if (!isPlaying) {
								that.elem.play()
							}
						}else{
							that.elem.pause()
							that.vidControl.find('.btg-play').removeClass("paused")
						}
					},
					up:function() {
					}
				},
				"16":{
					name:"shift",
					status:"up",
					down:function() {
					},
					up:function() {
					}
				},
				"70":{
					name:"f",
					status:"up",
					down:function() {
						toggleFullscreen(that.wrapper)
					},
					up:function() {
					}
				},
				"17":{
					name:"ctrl",
					status:"up",
					down:function() {
					},
					up:function() {
					}
				},
				"18":{
					name:"alt",
					status:"up",
					down:function() {
					},
					up:function() {
					}
				},
				"37":{
					name:"leftArrow",
					status:"up",
					down:function() {
						that.changeDur=0
						if (that.kc["16"].status=="down") {
							that.changeDur-=5
							that.player.currentTime = Math.min(that.player.currentTime+that.changeDur,that.player.duration)
							that.kc.hitMsg(that.changeDur+"s")
						}
						if (that.kc["17"].status=="down") {
							that.changeDur-=60
							that.player.currentTime = Math.min(that.player.currentTime+that.changeDur,that.player.duration)
							that.kc.hitMsg(that.changeDur+"s")
						}
						if (that.kc["18"].status=="down") {
							that.changeDur-=10
							that.player.currentTime = Math.min(that.player.currentTime+that.changeDur,that.player.duration)
							that.kc.hitMsg(that.changeDur+"s")
						}
					},
					up:function() {
					}
				},
				"38":{
					name:"upArrow",
					status:"up",
					down:function() {
						if (that.kc["17"].status=="down") {
							that.player.volume = Math.min(that.player.volume + 0.05,1)
							that.kc.hitMsg(parseInt(that.player.volume*100)+"%")
						}
					},
					up:function() {
					}
				},
				"39":{
					name:"rightArrow",
					status:"up",
					down:function() {
						that.changeDur=0
						if (that.kc["16"].status=="down") {
							that.changeDur += 5
							that.player.currentTime = Math.max(that.player.currentTime+that.changeDur,0)
							that.kc.hitMsg("+"+that.changeDur+"s")
						}
						if (that.kc["17"].status=="down") {
							that.changeDur += 60
							that.player.currentTime = Math.max(that.player.currentTime+that.changeDur,0)
							that.kc.hitMsg("+"+that.changeDur+"s")
						}
						if (that.kc["18"].status=="down") {
							that.changeDur += 10
							that.player.currentTime = Math.max(that.player.currentTime+that.changeDur,0)
							that.kc.hitMsg("+"+that.changeDur+"s")
						}
					},
					up:function() {
					}
				},
				"40":{
					name:"downArrow",
					status:"up",
					down:function() {
						if (that.kc["17"].status=="down") {
							that.player.volume = Math.max(that.player.volume - 0.05,0)
							that.kc.hitMsg(parseInt(that.player.volume*100)+"%")
						}
					},
					up:function() {
					}
				},
				hitMsg:function(text) {
					that.wrapper.find(".keyhit").text(text)
				},
			}
			if (that.$elem.attr('corn-player')===undefined)//
			$(that.window).on("keydown",function(e) {
				if (that.playerFocus) {
					if (e.keyCode.toString() in that.kc) {
						that.kc.hitMsg("")
						that.kdu(true)
						that.kc[e.keyCode.toString()].status = "down"
						that.kc[e.keyCode.toString()].down()
						return false
					}
				}
			})
			if (that.$elem.attr('corn-player')===undefined)//
			$(that.window).on("keyup",function(e) {
				if (that.playerFocus) {
					if (e.keyCode.toString() in that.kc) {
						that.kdu(false)
						that.kc[e.keyCode.toString()].status = "up"
						that.kc[e.keyCode.toString()].up()
						return false
					}
				}
			})
			//}
		//---------------------------------------------	Play Button						{
			if (that.$elem.attr('corn-player')===undefined)//
			that.vidControl.find(".btg-play").on("click",function(e){
				if ($(this).is(".paused")) {
					$(this).removeClass("paused")
					that.player.pause()
				}else{
					$(this).addClass("paused")
					var isPlaying = that.player.currentTime > 0 && !that.player.paused && !that.player.ended && that.player.readyState > 2;
					if (!isPlaying) {
						that.player.play()
					}
				}
			})
			//}
		//---------------------------------------------	Mute Button						{
			if (that.$elem.attr('corn-player')===undefined)//
			that.vidControl.find(".btg-sound").on("click",function(e){
				if ($(this).is(".muted")) {
					$(this).removeClass("muted")
					that.player.muted = false
				}else{
					$(this).addClass("muted")
					that.player.muted = true
				}
			})
			//}
		//---------------------------------------------	Full Screen Button				{
			if (that.$elem.attr('corn-player')===undefined)//
			that.vidControl.find(".btg-fullscreen").on("click",function(e){
				if ($(this).is(".exit")) {
					toggleFullscreen(that.wrapper)
				}else{
					$(this).addClass("exit")
					toggleFullscreen(that.wrapper)
				}
			})
			//}
		//---------------------------------------------	Skip Init						{
		// }
		//---------------------------------------------	Subtitle Init					{
			that.player.subs=[]
			that.subob = function(subnow){
				var sub={}
				text = subnow["text"]
				type = subnow["type"]
				name = subnow["name"]
				txtline = text.split("\n")
				numbefore = null
				for (var i = 0; i < txtline.length; i++) {
					var number,start,end
					if (numbefore!=null&&!(txtline[i].search("\-\-\>")>0)) {
						sub[numbefore]["text"]+="\n"+txtline[i]
					}
					if (i==txtline.length-1) {
						sub[numbefore]["text"]=sub[numbefore]["text"].trim()
						sub[numbefore]["text"]=sub[numbefore]["text"].replace("\n","<br>")
					}
					if(txtline[i].search("\-\-\>")>0){
						if (numbefore!=null) {
							sub[numbefore]["text"]=sub[numbefore]["text"].substr(0,sub[numbefore]["text"].lastIndexOf("\n"))
							sub[numbefore]["text"]=sub[numbefore]["text"].trim()
							sub[numbefore]["text"]=sub[numbefore]["text"].replace("\n","<br>")
						}
						start = txtline[i].split("\-\-\>")[0].trim()
						end = txtline[i].split("\-\-\>")[1].trim()
						start=start.replace(/,/gi,".")
						end=end.replace(/,/gi,".")

						tstt = start.split(":")
						numstart=0.0;
						for (var ns = 0; ns < tstt.length; ns++) {
							numstart+=tstt[(tstt.length-1-ns)]*(Math.pow(60,ns))
						}

						tend = end.split(":")
						numend=0.0;
						for (var ne = 0; ne < tend.length; ne++) {
							numend+=tend[tend.length-1-ne]*(Math.pow(60,ne))
						}

						number = numstart+"~"+numend
						sub[number]={
							start:numstart,
							end:numend,
							text:""
						}
						numbefore=number
					}
				}
				return {default:subnow["default"],sub:sub,type:type,name:name}
			}
			if (that.subtitles.length>0) {
				var ext = /(?:\.([^.]+))?$/;
				var sub = {}
				for (var i = 0; i < that.subtitles.length; i++) {
					if ($(that.subtitles[i]).attr("src")) {
						sub[$(that.subtitles[i]).attr("src")] = {}
						sub[$(that.subtitles[i]).attr("src")]["def"] = $(that.subtitles[i]).attr("default")!=undefined
						sub[$(that.subtitles[i]).attr("src")]["type"] = $(that.subtitles[i]).attr("type")||ext.exec($(that.subtitles[i]).attr("src"))[1]
						sub[$(that.subtitles[i]).attr("src")]["name"] = $(that.subtitles[i]).attr("name")||''
						sub[$(that.subtitles[i]).attr("src")]["srclang"] = $(that.subtitles[i]).attr("srclang")||$(that.subtitles[i]).attr("name")||''
						that.vidControl.find('.cc-list').append('<span class="inner sub" title="'+sub[$(that.subtitles[i]).attr("src")]['name']+'">'+toTitleCase(sub[$(that.subtitles[i]).attr("src")]['srclang'])+'</span>')
						$.ajax({
							url:$(that.subtitles[i]).attr("src"),
							success:function(data) {
								subnow = {
									"default":sub[this.url]["def"],
									"type":sub[this.url]["type"],
									"name":sub[this.url]["name"],
									"srclang":sub[this.url]["srclang"],
									"text":data.trim()
								}
								that.player.subs[that.player.subs.length]= subnow
								if (sub[this.url]["def"]) {
									that.player.currentSub = that.subob(subnow)
								}
							}
						})
					}
				}
			}else{
				that.vidControl.find('.btg-cc').css('display', 'none');
			}
			//}
		//---------------------------------------------	Subtitle Button					{
			that.ccheight = that.vidControl.find('.btg-cc').parent().find('.cc-list').height()
			that.vidControl.find('.btg-cc').parent().find('.cc-list').css('height',0)
			if (that.$elem.attr('corn-player')===undefined)//
			that.vidControl.find('.relate').on('mouseenter',function(e) {
				$(this).find('.cc-list').css('height',that.ccheight)
			})
			if (that.$elem.attr('corn-player')===undefined)//
			that.vidControl.find('.relate').on('mouseleave',function(e) {
				$(this).find('.cc-list').css('height',0)
			})
			if (that.$elem.attr('corn-player')===undefined)//
			that.vidControl.find('.btg-cc, .cc-list .sub').on('click',function(e) {
				ele = $(this)
				if ($(this).is('.sub')) {
					ele = $(this).parent().parent().find('.btg-cc')
				}
				if (ele.is('.yes')&&!($(this).is('.sub'))) {
					ele.removeClass('yes')
				}else{
					ele.addClass('yes')
					cursub = that.player.subs[0]
					if ($(this).is('.sub')) {
						for (var i = 0; i < that.player.subs.length; i++) {
							if($(this).attr('title')==that.player.subs[i]['name']){
								cursub = that.player.subs[i]
								break
							}
						}
						$(this).addClass('choosen')
					}
					that.player.currentSub = that.subob(cursub)
					ele.parent().find('.cc-list').css('height',0)
				}
			})
			//}
		//---------------------------------------------	Setup Default Player Setting	{
			if (typeof that.volume==='number') {
				that.setVol(that.volume)
			}
			//}
		//---------------------------------------------	Player Interval					{
			if (that.playing!==undefined) {
				clearInterval(that.playing)
			}
			that.playing = setInterval(function(e) {
				that.wrapper.find(".controller .time-display .inner").text(that.toHHMMSS(that.player.currentTime.toString()) )
				that.wrapper.find(".controller .total-time-display .inner").text("-"+that.toHHMMSS((that.player.duration-that.player.currentTime).toString()) )
				that.timelinebar = (Math.min(Math.max(that.player.currentTime/that.player.duration*100,0),100))+"%";
				that.volmlinebar = (Math.min(Math.max(that.player.volume*100,0),100))+"%";
				that.wrapper.find(".subtitleFloater").css("width", that.getCurrW() )
				that.wrapper.find(".subtitleFloater").css("margin-left", that.getCurrW()/2*-1 )
				that.wrapper.find(".subtitleFloater").css("margin-bottom", (that.getCurrH()/2*-1)+36 )
				that.wrapper.find(".subtitleFloater").css("font-size", .03*that.getCurrW() )
				that.wrapper.find(".timeline .bar .thumb").css("left",that.timelinebar)
				that.wrapper.find(".timeline .bar .current").css("width",that.timelinebar)

				that.wrapper.find(".volumeline .bar .thumb").css("left", that.volmlinebar)
				that.wrapper.find(".volumeline .bar .current").css("width", that.volmlinebar)

				if (that.skipper.length>0) {
					if (that.wrapper.find('.skipperGroup').length===0) {
						$('<span class="inner skipperGroup" ></span>"').appendTo(that.wrapper.find(".timeline .bar"))
					}
					if (that.skipper.length!==that.wrapper.find(".timeline .bar .skippeEl").length) {
						that.wrapper.find(".timeline .bar .skipperGroup").html("")
						for (var i = 0; i < that.skipper.length; i++) {
							$('<span class="inner skippeEl" style="left:0%;width:3px"></span>').appendTo(that.wrapper.find(".timeline .bar .skipperGroup"))
						}
					}
					//
					for (var i = 0; i < that.skipper.length; i++) {
						if ($(that.wrapper.find(".timeline .bar .skippeEl")[0]).css('left')!=(Math.max(Math.min((parseInt($(that.skipper[0]).attr('sec'))/that.player.duration*100),100),0))+'%')
						$(that.wrapper.find(".timeline .bar .skipperGroup").find('.skippeEl')[i]).css('left', ((Math.max(Math.min((parseInt($(that.skipper[i]).attr('sec'))/that.player.duration*100),100),0))||-0.01)+'%');
					}
				}
				if ($(that.wrapper.find(".timeline .bar .buffer-group")).find(".buffered").length!=that.player.buffered.length) {
					that.wrapper.find(".timeline .bar .buffer-group").html("")
					for (var i = 0; i < that.player.buffered.length; i++) {
						$('<div class="inner buffered" style="left: 0;width: 0%"></div>').appendTo(that.wrapper.find(".timeline .bar .buffer-group"))
					}
				}
				for (var i = 0; i < that.player.buffered.length; i++) {
					if($($(that.wrapper.find(".timeline .bar .buffer-group")).find('.buffered')[i]).css("left")!=(that.player.buffered.start(i)/that.player.duration*100)+"%")
						$($(that.wrapper.find(".timeline .bar .buffer-group")).find('.buffered')[i]).css("left",(that.player.buffered.start(i)/that.player.duration*100)+"%")
					if($($(that.wrapper.find(".timeline .bar .buffer-group")).find('.buffered')[i]).css("width")!=((that.player.buffered.end(i)-that.player.buffered.start(i))/that.player.duration*100)+"%")
						$($(that.wrapper.find(".timeline .bar .buffer-group")).find('.buffered')[i]).css("width",((that.player.buffered.end(i)-that.player.buffered.start(i))/that.player.duration*100)+"%")
				}
				if (that.wrapper.find(".subtitleFloater").length==0) {
					subtitleFloater=$("<span class='subtitleFloater'>OK ke?</span>")
					subtitleFloater.appendTo(that.wrapper)
				}
				if (that.player.currentSub!=undefined&&that.vidControl.find('.btg-cc').is('.yes')) {
					textshow = "";
					lastend = [];
					that.vidControl.find('.cc-list').find('[title=\''+that.player.currentSub["name"]+'\']').addClass('choosen')
					that.vidControl.find('.cc-list').find('.sub').not('[title=\''+that.player.currentSub["name"]+'\']').removeClass('choosen')
					$.each(that.player.currentSub["sub"], function(k,v){
						if (that.player.currentTime>v["start"]&&that.player.currentTime<=v["end"]) {
							ggtext = "<span class='subsub' id='sub"+k.replace(/\./gi,'m').replace('~','to')+"'>"+v["text"]+"</span>"
							textshow=textshow+((textshow!="")?"<br>":"")+ggtext
						}
					})
					textshow="<span class='subtd'>"+textshow+'</span>'
					if (textshow!="") {
						if ($("<span>"+textshow+"</span>").html()!=that.wrapper.find(".subtitleFloater").html()) {
							that.wrapper.find(".subtitleFloater").html(textshow)
						}
						that.wrapper.find(".subtitleFloater").addClass("show")
					}else{
						that.wrapper.find(".subtitleFloater").removeClass("show")
					}
				}else{
					that.wrapper.find(".subtitleFloater").html('')
					that.wrapper.find(".subtitleFloater").removeClass("show")
					that.vidControl.find('.btg-cc').removeClass('yes')
				}
			},500)
			//}
		//---------------------------------------------	Player Hide Controller On Idle	{
			that.hidetimout=setTimeout(function(e) {
				that.wrapper.addClass("idle")
			},1000);
			if (that.$elem.attr('corn-player')===undefined)//
			that.wrapper.on("mousemove",function(e){
				if (that.wrapper.find(".controller").css('display')=='none'&&that.showController) {
					that.wrapper.find(".controller").css('display', 'flex')
				}
				if (that.wrapper.is('.idle')) {
					that.wrapper.removeClass("idle")
				}
				clearTimeout(that.hidetimout)
				that.hidetimout = setTimeout(function(e) {
					if (!that.oncontrol) {
						if (!that.wrapper.is('.idle')) {
							that.wrapper.addClass("idle")
						}
						setTimeout(function(e) {
							that.wrapper.find(".controller").css('display', 'none')
						},500)
					}
				},1000)
			})
			//}
		//---------------------------------------------	Time Line						{
			that.gettimepos = function(e){
				bar = that.vidControl.find(".timeline .bar")
				posperc = (Math.min(Math.max((e.pageX-bar.offset().left)/bar.width()*100,0),100));
				if (!isNaN(posperc/100*that.player.duration)) {
					that.player.currentTime=posperc/100*that.player.duration
					that.vidControl.find(".timeline .bar .thumb").css("left",(Math.min(Math.max(posperc,0),100))+"%")
					that.vidControl.find(".timeline .bar .current").css("width",(Math.min(Math.max(posperc,0),100))+"%")
				}
			}
			if (that.$elem.attr('corn-player')===undefined)//
			that.vidControl.find(".timeline").on("mousedown",function(e){
				that.gettimepos(e)
				$(that.window).on("mousemove",function(e){
						that.gettimepos(e)
				})
				$(that.document).on("mouseup",function(e){
					$(that.window).off("mousemove")
					$(that.document).off("mouseup")
				})
				return false
			})
			//}
		//---------------------------------------------	Volume Line						{
			that.getvolpos = function(e){
				bar = that.vidControl.find(".volumeline .bar")
				posperc = (Math.min(Math.max((e.pageX-bar.offset().left)/bar.width()*100,0),100));
				if (!isNaN(posperc/100*1)) {
				that.player.volume=posperc/100*1
					that.vidControl.find(".volumeline .bar .thumb").css("left",(Math.min(Math.max(posperc,0),100))+"%")
					that.vidControl.find(".volumeline .bar .current").css("width",(Math.min(Math.max(posperc,0),100))+"%")
				}
			}
			if (that.$elem.attr('corn-player')===undefined)//
			that.vidControl.find(".volumeline").on("mousedown",function(e){
				that.getvolpos(e)
				$(that.window).on("mousemove",function(e){
						that.getvolpos(e)
				})
				$(that.document).on("mouseup",function(e){
					$(that.window).off("mousemove")
					$(that.document).off("mouseup")
				})
				return false
			})
			//}
		//---------------------------------------------	Full-screen Event Listener		{
			that.cancelVideoFullscreen = function() {
				if (!that.document.fullscreenElement &&!that.document.mozFullScreenElement && !that.document.webkitFullscreenElement && !that.document.msFullscreenElement) {
					that.wrapper.removeClass("full-screen")
					$('body').css('overflow', 'auto');
					that.vidControl.find(".btg-fullscreen").removeClass("exit")
				}
			}
			if (that.$elem.attr('corn-player')===undefined){
				$(that.document).on("webkitfullscreenchange",that.cancelVideoFullscreen)
				$(that.document).on("mozfullscreenchange", that.cancelVideoFullscreen)
				$(that.document).on("msfullscreenchange", that.cancelVideoFullscreen)
			}
			//}
		//---------------------------------------------	Scroll for Volume				{
			that.window.addEventListener('mousewheel', function(e){
				swDelta = e.wheelDelta < 0 ? 'down' : 'up';
				nowvol = that.player.volume
				if (that.onplayer&&that.playerFocus) {
					if (swDelta=='down'){
						that.setVol(nowvol-.05)
					} else {
						that.setVol(nowvol+.05)
					}
					e.preventDefault()
				}
			});
			//}
			if (that.$elem.attr('corn-player')===undefined){
				if (typeof that.videoInit==='function') {
					that.videoInit.call(that.elem)
				}
			}
			that.$elem.attr('corn-player','');
		},
		toHHMMSS : function(s) {
		    var sec_num = parseInt(s, 10); // don't forget the second param
		    var hours   = Math.floor(sec_num / 3600);
		    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
		    var seconds = sec_num - (hours * 3600) - (minutes * 60);

		    if (hours   < 10) {hours   = "0"+hours;}
		    if (minutes < 10) {minutes = "0"+minutes;}
		    if (seconds < 10) {seconds = "0"+seconds;}
		    hours = (isNaN(hours))?'00':hours
			minutes = (isNaN(minutes))?'00':minutes
			seconds = (isNaN(seconds))?'00':seconds
		    return ((Math.floor(sec_num / 3600)>0)?hours+':':'')+minutes+':'+seconds;
		},
		methods:{
			source:function(val) {
				return val||$(this).data('source')||$(this).attr('src')||$(this).find('source[src]').map(function(index, elem) {
					return $(elem).attr('src');
				})
			},
			width:function(val) {
				return val||$(this).data('width')||$(this).attr('width')||$(this).width()
			},
			height:function(val) {
				return val||$(this).data('height')||$(this).attr('height')||$(this).height()
			},
			volume:function(val) {
				return val||$(this).data('volume')||$(this).each(function() {
					return this.volume
				});
			},
			goFullscreen:function(val) {
				$(this).trigger('goFullscreen')
				return val
			},
			exitFullscreen:function(val) {
				$(this).trigger('exitFullscreen')
				return val
			},
			toggleFullscreen:function(val) {
				if ($(this).attr('corn-player')!=undefined){
					$(this).trigger('toggleFullscreen')
				}
				return val
			},
		},
	}

	$.fn.cornPlayer = function(options, args) {
		if (typeof options === 'string') {
			if (args===undefined) {
				if (this.attr('corn-player')===undefined) {
					this.each(function() {
						var corn = Object.create(Corn);
						corn.init(options,this,args);
					})
				}
				if (typeof $.fn.cornPlayer.options[options]==='function') {
					return $.fn.cornPlayer.options[options].call(this)
				}else{
					return $.fn.cornPlayer.options[options]
				}
			}else{
				if (typeof $.fn.cornPlayer.options[options]==='function') {
					$.fn.cornPlayer.options[options] = $.fn.cornPlayer.options[options].call(this, args)
				}else{
					$.fn.cornPlayer.options[options] = args
				}
			}
		}
		return this.each(function() {
			var corn = Object.create(Corn);
			corn.init(options,this,args);
		})
	}
	$.fn.cornPlayer.options = {
		showController: true,
		controller:null,
		source:function(val) {
			return Corn.methods.source.call(this, val)
		},
		width:function(val) {
			return Corn.methods.width.call(this, val)
		},
		height:function(val) {
			return Corn.methods.height.call(this, val)
		},
		volume:function(val) {
			return Corn.methods.volume.call(this, val)
		},
		goFullscreen:function(val) {
			return Corn.methods.goFullscreen.call(this, val)
		},
		exitFullscreen:function(val) {
			return Corn.methods.exitFullscreen.call(this, val)
		},
		toggleFullscreen:function(val) {
			return Corn.methods.toggleFullscreen.call(this, val)
		},
		cc:true,
		videoInit:null,
		videoEnd:null,
		videoStart:null,
	}
	$(document).ready(function($) {
		$('video[data-role="corn-player"]').cornPlayer();
	});
})(jQuery, window, document)