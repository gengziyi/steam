 function fn(data){
	console.log(data);
	//根据服务器返回的JSON数据生成元素
	for (var i = 0; i < data.length; i++) {
		//根据模板克隆标签并插入到他的父级里
		var tem=$("#tem").clone(true);
		$(".w2").append(tem);
		tem.attr("id","");
		//将克隆出来的节点插入内容
		tem.find(".name").html(data[i].name)
		//将该游戏的gameId写入自定义属性
		tem.attr("gameId",data[i].gameId)
		for(var j=0;j<data[i].imgUrl.length;j++){
			tem.find(".imgList img").eq(j).attr("src",data[i].imgUrl[j])
		}
		//设置大图封面
		tem.find(".fl img").attr("src",data[i].imgUrl[0])
		//设置价格
		if (data[i].isSale) {
			tem.find(".discount").html(data[i].discount*100+"%");
			tem.find(".originPrice").html("￥" + data[i].originPrice);
		}
		tem.find(".price").html("￥" + data[i].price);

		if (data[i].platform[0]=="Windows") {
			tem.find(".windows").css({display:"inline-block"})
		}
		if (data[i].platform[1]=="Mac OS") {
			tem.find(".apple").css({display:"inline-block"})
		}
		if (data[i].platform[2]=="Steam") {
			tem.find(".steam").css({display:"inline-block"})
		}

		//对接弹出层数据
		var tanchu=tem.find(".tanchu");
		tanchu.find(".gameName").html(data[i].name);
		tanchu.find(".date").find("span").html(data[i].date.replace("-","年").replace("-","月")+"日");
		//弹出层里插入图片
		for(var j=0;j<data[i].imgUrl.length;j++){
			tem.find(".tanchu").find(".gameImg").find('img').eq(j).attr("src",data[i].imgUrl[j]);
		}

		//游戏口碑
		if (data[i].evaluate==1) {
			tem.find('.pingjia').find("p").html("好评如潮").css({color:"#2c5fc6"})
		}
		if (data[i].evaluate==2) {
			tem.find('.pingjia').find("p").html("特别好评").css({color:"#66c0f4"})
		}
		if (data[i].evaluate==3) {
			tem.find('.pingjia').find("p").html("多半好评").css({color:"#27b09e"})
		}
		if (data[i].evaluate==4) {
			tem.find('.pingjia').find("p").html("褒贬不一").css({color:"#b9a074"})
		}
		if (data[i].evaluate==5) {
			tem.find('.pingjia').find("p").html("多半差评").css({color:"#a34c25"})
		}
		if (data[i].evaluate==6) {
			tem.find('.pingjia').find("p").html("差评如潮").css({color:"#f00"})
		}
		if (data[i].evaluate==7) {
			tem.find('.pingjia').find("p").html("无评论").css({color:"#fff"})
		}
		var spanCount=String(data[i].evaluatingCount.toLocaleString());
		tem.find('.pingjia').find("span").html("("+spanCount+"篇报道)")
		//用户标签
		for(var j=0;j<data[i].label.length;j++){
			var span = document.createElement("span");
			tem.find(".biaoqian").find("p").append(span);
			$(span).html(data[i].label[j]);
		}
	}
	//显示第一个游戏
	$(".w2 li").eq(0).fadeIn();

	//轮播
	// var n=0;
	// var liList=$(".w2 li")
	// $(".next").click(function(){
	// 	n++;
	// 	if (n==liList.length) {
	// 		n=0;
	// 	}
	// 	$(".w2 li").hide();
	// 	$(".w2 li").eq(n).fadeIn();
	// 	change(n)
	// })
	// $(".last").click(function(){
	// 	if (n==0) {	
	// 		n=liList.length;
	// 	}
	// 	n--;
	// 	$(".w2 li").hide();
	// 	$(".w2 li").eq(n).fadeIn();
	// 	change(n)
	// })

	// 添加小圆点
	for(k=0;k<data.length;k++){
		var newSpan=$("<span></span>");
		$(".point").append(newSpan);
		if (!k) {
			newSpan.addClass('focus')
		}
		newSpan.attr("index",k)
		newSpan.click(function(){
			var spanNum=$(this).attr("index")
			change(spanNum)
			$(".w2 li").hide();
			$(".w2 li").eq(spanNum).fadeIn();
		})
	}
	function change(n){
		$(".point span").removeClass("focus")
		$(".point span").eq(n).addClass("focus")
	}

	//鼠标移上切换大图
	$(".imgList img").mouseenter(function(){
		$(this).closest('.fr').siblings('.fl').find("img").attr("src",this.src)
	})
	$(".imgList img").mouseleave(function(){
		var imurl=$(this).closest(".imgList").find('img')[0].src
		$(this).closest('.fr').siblings('.fl').find("img").attr("src",imurl)
	})


	//弹出层
	$(".temi").mouseenter(function(){
		var tanchu=$(this).find(".tanchu")
		tanchu.fadeIn("fast");

		//让第一张显示
		imgList=tanchu.find(".gameImg img");
		imgList.hide();
		imgList.eq(0).show();
		//当前所在的张数
		var index=0;
		autoPlay=setInterval(function(){
			index++;
			imgList.hide();
			if (index==imgList.length-1) {
				index=0;
			}
			imgList.hide();
			imgList.eq(index).fadeIn();
		},1000)
	}).mouseleave(function(){
		$(this).find(".tanchu").fadeOut("fast");
		clearInterval(autoPlay)
	});

	//历史记录
	$(".temi").click(function(){
		// 获取游戏ID
		var gameId = $(this).attr("gameId");
		if (localStorage.getItem("history")) {
			localStorage.setItem("history",`${localStorage.getItem("history")},${gameId}`)
		}
		else{
			localStorage.setItem("history",gameId)
		}
	})

	$(function(){
		function Slide(wrap,speed,autoplayable){
			this.wrap=wrap;
			this.n=0;
			this.autoplayable = false || autoplayable;
			this.count = this.wrap.find(".temi").length;
			this.next = this.wrap.find(".next")
			this.last = this.wrap.find(".last")
			this.autoplay = null;
			this.speed = speed;
			this.toNext = ()=>{
				this.n++;
				if (this.n==this.count) {
					this.n=0;
				}
				$(".w2 li").hide();
				$(".w2 li").eq(this.n).fadeIn();
			}
			this.toLast = ()=>{
				if (this.n==0) {
					this.n=this.count;
				}
				this.n--;
				$(".w2 li").hide();
				$(".w2 li").eq(this.n).fadeIn();
			}
			if (this.autoplayable) {
				this.autoplay = setInterval(()=>{
					this.toNext();
				},this.speed)
			}
			this.stopAuto = ()=>{
				clearInterval(this.autoplay)
			}
			this.startAuto = ()=>{
				setInterval(()=>{
					this.toNext();
				},this.speed)
			}
			this.next.click(this.toNext);
			this.last.click(this.toLast);
			this.wrap.mouseenter(this.stopAuto)
			this.wrap.mouseleave(this.startAuto)
		}
		new Slide($(".w2"),3000,true)
	})
}

function historyfn(data){
	var history=$(".histoy");
	for(let item of data){
		var a = $("<a target='_blank'></a>").appendTo(history);
		a.attr("href",item.href);
		a.html(item.name);
	}
}
	
window.onload=function(){
	//轮播图的jsonp请求
	var script=document.createElement("script");
	script.src="http://wangdawei.tech:81/recommendGame?callback=fn";
	document.getElementsByTagName("head")[0].appendChild(script);

	//历史记录的jsonp请求
	var historyList = localStorage.getItem("history")
	if (historyList) {
		var historyList = historyList.split(",");
		var historyList = new Set(historyList);
		var historyList = Array.from(historyList);
	}

	var script=document.createElement("script");
	script.src=`http://wangdawei.tech:81/history?callback=historyfn&gameId=${historyList}`;
	document.getElementsByTagName("head")[0].appendChild(script);

	
}
