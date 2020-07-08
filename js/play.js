$(function(){
	 var t;//倒计时定时器
	// 一、 生成柱子
	// 思路：设置柱子得宽度，依次加入柱子，放到盒子里
	var wellWidth = 100; //柱子得宽度  暂不写px单位 便于后面计算
	function initWell(){
		//清除盒子里原来的柱子
		$(".well-box").empty();
		/*
		//生成固定的柱子 不同间距取决于left值
		//第一根柱子
		$(".well-box").append("<div class='well' style='width:100px;left:0px'>");
		//第二根柱子
		$(".well-box").append("<div class='well' style='width:100px;left:300px'>");
		//第三根柱子
		$(".well-box").append("<div class='well' style='width:100px;left:700px'>");
		//第四根柱子
		$(".well-box").append("<div class='well' style='width:100px;left:1000px'>");*/

		var color1 = '#'+Math.floor(Math.random()*0xffffff).toString(16);
		var color2 = '#'+Math.floor(Math.random()*0xffffff).toString(16);
		var color3 = '#'+Math.floor(Math.random()*0xffffff).toString(16);
		var color4 = '#'+Math.floor(Math.random()*0xffffff).toString(16);


		//生成随机间距的柱子
		//第一根柱子
		$(".well-box").append("<div class='well' style='width:"+wellWidth+"px;left:0px;background:"+color1+";'>");

		//第二根柱子 left=柱子的宽度+1和2之间的间距（最大？最小）
		//柱子间最大间距 = 棍子的最长的长度（盒子离顶部的距离）
		var max = $(".container").offset().top;
		//柱子间最小的间距 防止柱子重叠或贴在一起
		var min = 80;
		//柱子间的随机间距
		Math.random()*(max-min);

		//第二根柱子的left值 加上最小间距，防止柱子重叠或贴在一起 因为随机数可能为0
		var end2 = wellWidth + parseInt(Math.random()*(max-min)) + min;
		/*console.log(max);
		console.log(end2);*/
		//生成第二跟柱子
		$(".well-box").append("<div class='well' style='width:"+wellWidth+"px;left:"+end2+"px;background:"+color2+";'>");

		//第三根柱子的left值 = 第二根柱子的left值 + 柱子宽度 + 2和3之间的随机间距 + 最小值（增加游戏乐趣）
		var end3 = end2 + wellWidth + parseInt(Math.random()*(max-min)) + min;
		//生成第三跟柱子
		$(".well-box").append("<div class='well' style='width:"+wellWidth+"px;left:"+end3+"px;background:"+color3+";'>");


		//第四根柱子的left值 = 第三根柱子的left值 + 柱子宽度 + 3和4之间的随机间距 + 最小值（增加游戏乐趣）
		var end4 = end3 + wellWidth + parseInt(Math.random()*(max-min)) + min;

		//优化柱子会跑出屏幕外的问题
		var all = $("body").width();
		// $(".well-box").width(all);
		if(end4+wellWidth>all){
			end4 = all - wellWidth;
		}
		//生成第三跟柱子
		$(".well-box").append("<div class='well' style='width:"+wellWidth+"px;left:"+end4+"px;background:"+color4+";'>");


		
		// console.log(all);
		// console.log($(".well-box").width());

	}//生成柱子的函数结束符
	initWell();//调用生成柱子的函数
	

	// 二、鼠标按下按钮不动时，棍子长出来，鼠标松开按钮，棍子停止生长并倒下  小人开始跑动
	var stop = true;
	// 1、鼠标按下按钮不动时，棍子长出来
	$(".btnClick").mousedown(function(){
		if(stop == true){
			//棍子长出来,控制棍子的宽度 width  最大宽度是内容盒子离顶部的距离
			var stickH = $(".container").offset().top;
			//棍子生长 是自定义的动画
			$(".stick").animate({"width":stickH+"px"},2000);
		}
	})

	// 2.鼠标松开按钮，棍子停止生长
	$(".btnClick").mouseup(function(){
		if(stop == true){
			// 1 棍子停止生长
			$(".stick").stop();
			//给stop变量赋值为false 不满足stop == true 棍子倒下后，又依次按按钮时就不会继续长
			stop = false;
			// 2 棍子倒下 添加stickDown样式
			$(".stick").addClass("stickDown");
			// 3 小人跑动的函数
			moveMan();
		}
		
	})

	// 三、小人跑动的函数
	var num = 0;//存放的是小人在第几个柱子上
	var money = 0;//金币
	function moveMan(){
		//获取当前棍子的宽度
		var stickW = $(".stick").width();
		//为了展示效果合理，加定时器，小人等待一定时间后，再换成跑动的图片
		setTimeout(function(){
			// 1 把站立的小人图片换成跑动的1小人图片
			$(".man img").attr("src","img/stick.gif");
			// 2 小人移动的距离(离左边的距离left) = 棍子的宽度
			$(".man img").animate({"left":stickW+"px"},1000,function(){
				// 2-1 判断小人挑战成功还是失败
				// 2-1-1 失败  棍子小于两个柱子之间的距离  棍子大于两个柱子之间的距离+柱子的宽度
				//  两个柱子之间的距离 = 后一个柱子left-前一个柱子的宽度
				var juli = $(".well").eq(num+1).offset().left - wellWidth;
				if(stickW<juli || stickW > (juli+wellWidth)){
					//挑战失败的函数
					fail();					
				}else{
					// 一个跑成功 跑下一个柱子
					// 1 把小人图片换成站立的图片 把他的left的值设为0px
					$(".man img").attr("src","img/stick_stand.png").css("left","0px").hide();
					// 2 把棍子初始化
					$(".stick").removeClass("stickDown").width("0px");
					// 3 把装柱子的盒子整体往左边移动 从视线上隐藏到左边的屏幕外
					// 装柱子的盒子整体左移的距离 = 后一个柱子的left值(往左，取负值)
					var next = $(".well").eq(num+1).css("left");// 后一个盒子的left值
					console.log(next);//279px 用css获取的属性值是有px的
					$(".well-box").animate({"left":"-"+next},1000,function(){
						// 4 把小人显示出来
						$(".man img").show();
						// 5 把stop的值赋值为true 让按钮能按下 棍子长出来 
						stop = true;
						// 6 跑下一个柱子
						num++;
						// 每过一根柱子金币加10
						money = money + (num*10);
						$(".money .number").text(money);
						
						// 7 跑到最一个柱子时，即索引num为3的时候，本关挑战成功
						if(num == 3){
							// 按钮不能再按  避免棍子继续长出来
							stop = false;
							
							// 调用成功的函数
							success();
						}
					})
				}

			})
		},1000)
		
	}



	// 四、挑战失败的函数
	
	var count = 3;//生命值
	function  fail(){
		count--;
		//生命值变为灰色
		$(".life_value").eq(count).css("background","#ccc");
		// 1 小人掉下去
		$(".man img").addClass("rotate");
		// 为了优化视觉效果，加一个定时器，等待一段时间后把小人隐藏
		setTimeout(function(){
			$(".man img").hide();
			// 2 把棍子初始化
			$(".stick").removeClass("stickDown").width("0px");
		},300)
		// 如果三次生命用完，就弹出提示 否则继续游戏
		if(count == 0){
			$(".life_value").eq(count).css("background","#ccc");
			setTimeout(function(){
				//询问是否购买生命值
				var c = confirm("生命值已用完是否立即购买");
				if(Number($(".number").text()) > Number($(".life_money").text())){	
					if(c){
						//调用购买生命值的函数
						maiCount();
						//将自己的钱减去买生命值的钱
						var nowMoney = $(".number").text() - $(".life_money").text();
						//再写如自己的钱
						$(".number").text(nowMoney);
						console.log($(".number").text());
						stop = true;
						//小人图片显示
						$(".man img").show();
						// 小人图片改变
						$(".man img").attr("src","img/stick_stand.png").css("left","0px");
						// 移除rotate
						$(".man img").removeClass("rotate");
					}else{
						//关掉倒计时定时器
						clearInterval(t);
						// 3 显示提示的弹出框
						$(".dialog").show();
						// 4 给弹框添加文本类容
						$(".dialog .name").html(filText[parseInt(Math.random()*20)]);
						// 5  给弹框加按钮
						$(".dialog .dialog-btn").html("<a href='javascript:void' class='play-agin'>再试一次</a>");
					}

				}else{
					alert("金币不够了！");
					//关掉定时器
					clearInterval(t);
				}
			
			},1000)
		}else{
			setTimeout(function(){
				//小人图片显示
				$(".man img").show();
				// 小人图片改变
				$(".man img").attr("src","img/stick_stand.png").css("left","0px");
				// 移除rotate
				$(".man img").removeClass("rotate");
				stop = true;
			},600)
		}
		
	}


	//四-1 小人失败后的文本数组
    var filText = [
    	'志在峰巅的攀登者，不会陶醉在沿途的某个脚印之中。',
		'海浪为劈风斩浪的航船饯行，为随波逐流的轻舟送葬。',
		'人生最重要的一点是，永远不要迷失自己。',
		'一个人承受孤独的能力有多大，他的能力就有多大。',
		'实力塑造性格，性格决定命运。',
		'普通人成功并非靠天赋，而是靠把寻常的天资发挥到不寻常的高度。',
		'对于强者，要关注他们的灵魂，对于弱者，他关注他们的生存。',
		'积极的人在每一次忧患中都看到一个机会，而消极的人则在每个机会都看到某种忧患。',
		'成功不是将来才有的，而是从决定去做的那一刻起，持续累积而成。',
		'当你感到悲哀痛苦时，最好是去学些什么东西。学习会使你永远立于不败之地。',
		'有的人一生默默无闻，有的人一生轰轰烈烈，甚至千古流芳，为什么会这样？因为默默无闻的人只是满足于现状，而不去想怎么轰轰烈烈过一生，不要求自己，去做，去行动，怎么能够成功？',
		'人性最可怜的就是：我们总是梦想着天边的一座奇妙的玫瑰园，而不去欣赏今天就开在我们窗口的玫瑰。',
		'在人生的道路上，即使一切都失去了，只要一息尚存，你就没有丝毫理由绝望。因为失去的一切，又可能在新的层次上复得。',
		'没有一劳永逸的开始；也没有无法拯救的结束。人生中，你需要把握的是：该开始的，要义无反顾地开始；该结束的，就干净利落地结束。',
		'生命的奖赏远在旅途终点，而非起点附近。我不知道要走多少步才能达到目标，踏上第一千步的时候，仍然可能遭到失败。但我不会因此放弃，我会坚持不懈，直至成功！',
		'不要认为只要付出就一定会有回报，这是错误的。学会有效地工作，这是经营自己强项的重要课程。',
		'苦心人天不负，卧薪尝胆，三千越甲可吞吴。有志者事竞成，破釜沉舟，百二秦川终属楚。',
		'生命本身是一个过程，成功与失败只是人生过程中一些小小的片段，若果把生命与成功或失败联系在一起，生命将失去本身该有的意义。',
		'我们不要哀叹生活的不幸，诅咒命运的不公。在命运面前，我们要做强者，掐住命运的咽喉，叩问命运，改变命运。',
		'努力和效果之间，永远有这样一段距离。成功和失败的唯一区别是，你能不能坚持挺过这段无法估计的距离。'
    ]



    // 五 小人挑战成功的函数
    function success(){
    	//过完一关金币+50
		money = money+50;
		$(".money .number").text(money);
    	// 1 把弹框显示出来
    	$(".dialog").show();
    	// 2 给弹框添加文本内容
    	$(".dialog .name").html(sucText[parseInt(Math.random()*20)]);
    	// 3 给弹框添加按钮 重玩一次 下一关
    	$(".dialog .dialog-btn").html("<a href='javascript:void(0);' class='play-agin'>再试一次</a><a href='javascript:void(0);' class='go-next'>下一关</a>");
    } 

    //五-1 小人成功后的文本数组
    var sucText = [
    	'勇敢坚毅真正之才智乃刚毅之志向。 —— 拿破仑',
		'志向不过是记忆的奴隶，生气勃勃地降生，但却很难成长。 —— 莎士比亚',
		'骏马是跑出来的，强兵是打出来的。',
		'只有登上山顶，才能看到那边的风光。',
		'如果惧怕前面跌宕的山岩，生命就永远只能是死水一潭。',
		'平时没有跑发卫千米，占时就难以进行一百米的冲刺。',
		'梯子的梯阶从来不是用来搁脚的，它只是让人们的脚放上一段时间，以便让别一只脚能够再往上登。',
		'没有激流就称不上勇进，没有山峰则谈不上攀登。',
		'真正的才智是刚毅的志向。 —— 拿破仑',
		'山路曲折盘旋，但毕竟朝着顶峰延伸。',
		'只有创造，才是真正的享受，只有拚搏，才是充实的生活。',
		'敢于向黑暗宣战的人，心里必须充满光明。',
		'种子牢记着雨滴献身的叮嘱，增强了冒尖的勇气。',
		'自然界没有风风雨雨，大地就不会春华秋实。',
		'只会幻想而不行动的人，永远也体会不到收获果实时的喜悦。',
		'勤奋是你生命的密码，能译出你一部壮丽的史诗。',
		'对于攀登者来说，失掉往昔的足迹并不可惜，迷失了继续前时的方向却很危险。',
		'奋斗者在汗水汇集的江河里，将事业之舟驶到了理想的彼岸。',
		'忙于采集的蜜蜂，无暇在人前高谈阔论。',
		'勇士搏出惊涛骇流而不沉沦，懦夫在风平浪静也会溺水。'
    ]


    // 六 定义刷新函数 在点击再试一次 重玩一次 和下一关的时候调用
    function shuaXin(){
    	//console.log(count);
    	clearInterval(t);//关掉之前得定时器
    	//初始化倒计时
    	time = 60;
    	//从新开启定时器
    	t = setInterval(dao,1000);
    	// 1 弹框隐藏 按钮可以按下去
    	$(".dialog").hide();
    	stop = true;
    	// 2 小人初始化
    	$(".man img").attr("src","img/stick_stand.png").css("left","0px").removeClass("rotate");
    	// 3 棍子初始化
    	$(".stick").removeClass("stickDown").width("0px");
    	// 4 放柱子的盒子初始化
    	$(".well-box").css("left","0px");
    	// 5 把跑到第几根柱子初始化
    	num = 0;
    	//刷新金币不变
    	money = money;
    	$(".money .number").text(money);
    	// 6 把背景初始化
    	var suijishu = Math.ceil(Math.random()*19+1);
    	// 6-1 移除原来的背景
    	$("body").removeClass("");
    	// 6-2 随机添加一个背景
    	$("body").addClass("bg"+suijishu);
    	// 从新生成柱子
    	initWell();
    }




    // 七 点击再试一次和从玩一次调用的函数
    $(".dialog-btn").on("click",".play-agin",function(){
    	clearInterval(t);//关掉之前得定时器
    	shuaXin();
    	// 让小人显示
    	$(".man img").show();
    	// 让生命值都变为绿色
    	$(".life_value").css("background","radial-gradient(#7fff00,#32cd32,#228b22)");
    })


    // 八 点击下一关要调用的函数和执行的代码
    var leave = 1;//关卡数
    $(".dialog-btn").on("click",".go-next",function(){
    	clearInterval(t);//关掉之前得定时器
    	shuaXin();
    	//改变关卡数 每次点击都+1
    	leave = leave + 1;
    	$(".play-title").text("关卡"+leave);
    	// 让生命值都变为绿色
    	/*$(".life_value").css("background","radial-gradient(#7fff00,#32cd32,#228b22)");*/
    })



    // 十 倒计时 60秒
    var time = 60;
    function dao(){
    	if(time == 0){
    		alert("时间到了哟！");
    		shuaXin();
    	}else{
    		time--;
    		//加0补位
    		if(time<10){
    			time = "0" + time;
    		}
    		//写入到倒计时中
    		$(".secord").text(time);
    	}
    }
    t = setInterval(dao,1000);


    // 十一  点击商城图片显示货物 点×关闭
    
    $(".shopping").hover(function(){
     	$(".product").show();
     },function(){
     	$(".product").hide();
     })

    // 点击背景商城显示 背景商城 点×隐藏
    $(".product_bg_img").click(function(){
    	$(".bg_img").show();
    })
     $(".shopping_close").click(function(){
    	$(".bg_img").hide();
    })

    // 十二 点击相应得背景改变 背景
    var index;//背景索引
    $(".imgs").click(function(){
    	//判断 当自己的金币不够时弹出提示
    	if(Number($(".number").text()) < Number($(this).find("span").text())){
    		alert("金币不够了!");
    	}else{
    		//将点击的图片索引值加1赋值给index
	    	index = $(this).index() +1;
	    	// 移除原来的背景样式
	    	$("body").removeClass();
	    	//添加当前的背景样式
	    	$("body").addClass("b"+index);
	    	//将自己的钱减去买生命值的钱
			var newMoney = $(".number").text() -$(this).find("span").text();
			//再写如自己的钱
			$(".number").text(newMoney);
    	}
    })
    
    // 十三  当生命值小于3时 可购买一个生命值
   
    	$(".product_life").click(function(){
    		if(Number($(".number").text()) > Number($(".life_money").text())){
    			maiCount();
    			//将自己的钱减去买生命值的钱
				nowMoney = $(".number").text() - $(".life_money").text();
				//再写如自己的钱
				$(".number").text(nowMoney);
    		}else{
    			alert("金币不够了！");
    		}
	    })
	    //购买生命值的函数
   		function maiCount(){
		    if(count == 3){
		    	alert("生命值已满不能购买哦");
		    }else{	
		    	//将灰的生命值变成绿色
		    	$(".life_value").eq(count).css("background","radial-gradient(#7fff00,#32cd32,#228b22)");
		    	count = count + 1;
		    }
	    }


})

// 九 背景音乐
   	var audio = document.getElementsByTagName('audio')[0];
	var music = document.getElementsByClassName("music");
		
	music[0].onclick = function(){
		//播放
		audio.play();
	}
	music[1].onclick = function(){
		//暂停
		audio.pause();
	}


