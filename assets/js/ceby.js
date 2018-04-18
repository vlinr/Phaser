/*****Initializing - Cornus officinalis****/
'user strict'
this._wid = document.documentElement.clientWidth;
this._hei = document.documentElement.clientHeight;
this.game = new Phaser.Game(this._wid * 2, this._hei * 2, Phaser.CANVAS, 'game');
/********Start Loading Interface*********/
this.loading = function(game){
	this.init =()=>{
		game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.draw = game.add.graphics(0, 0);
		this.draw.beginFill(0Xffffff, 1);
		this.draw.drawRect(0, 0, game.width, game.height);
		this.draw.endFill();
		this.tip = game.add.graphics(0, 0);
		this.tip.beginFill(0Xf37213, 1);
		this.tip.drawRect(0, game.world.centerY, 1, 5);
		this.style = {
			font: "60px  Microsoft YaHei",
			fill: "#f37213",
			align: "center"
		};
		this.txt = game.add.text(game.world.centerX, game.world.centerY - 200, "0%", this.style);
		this.txt.y = game.height / 2 - this.txt.height / 2 - 50;
		this.txt.anchor.set(.5);
	}
	this.preload =()=>{
		game.load.image('a', 'assets/images/a.png');
		game.load.image('b', 'assets/images/b.png');
		game.load.image('bg1', 'assets/images/bg1.jpg');
		game.load.image('bg2', 'assets/images/bg2.jpg');
		game.load.image('bg3', 'assets/images/bg3.jpg');
		game.load.image('bg4', 'assets/images/bg4.jpg');
		game.load.image('bg5', 'assets/images/bg5.jpg');
		game.load.image('g', 'assets/images/g.png');
		game.load.image('q', 'assets/images/q.png');
		game.load.image('r', 'assets/images/r.png');
		game.load.image('x', 'assets/images/x.png');
		game.load.image('x1', 'assets/images/x1.png');
		game.load.image('x2', 'assets/images/x2.png');
		game.load.image('t', 'assets/images/t.png');
		game.load.image('y', 'assets/images/y.png');
		game.load.image('z', 'assets/images/z.png');
		game.load.image('over', 'assets/images/gameover.png');
		game.load.image('z1', 'assets/images/z1.png');
		game.load.audio('_in', 'assets/audio/_in.mp3');
		game.load.audio('click', 'assets/audio/click.mp3');
		game.load.audio('scroea', 'assets/audio/dj.mp3');
		game.load.audio('defeat', 'assets/audio/defeat.wav');
		this.wid = game.width / 100;
		game.load.onFileComplete.add(()=>{
			this.txt.text = game.load.progress + '%';
			this.tip.drawRect(0, game.height / 2 - 5, this.wid * game.load.progress, 10);
		}, this);
		game.load.onLoadComplete.add(()=>game.state.start('main'));
	}
}
//Game Master Interface
this.main = function(game) {
	this.init = ()=>{
		this.index=0;
		this.w=game.world.centerX-100;//第一个的位置
		this.h=game.world.centerY+100;
		this.fw=25,this.fh=50,this.qw=100,this.qh=40,this.num=0,this.name=0,this.arr=[],this.arrs=[],this.once=true,this.msc=1000,this.__=1;
	}
	this.preload = ()=> {}
	this.create = ()=>this.addBg()
	//添加背景
	this.addBg =()=>{
		this.bg = game.add.image(0, 0, 'bg1');
		this.bg.y = game.world.centerY;
		this.bg.x = game.world.centerX;
		this.bg.height = game.world.height;
		this.bg.width = game.world.width;
		this.g = game.add.image(0, 0, 'g');
		this.g.y = game.world.height-this.g.height;
		this.g.x = game.world.centerX;
		this.g.anchor.set(.5);
		this.bg.anchor.set(.5);
		this.group=game.add.group();
		this.group.enableBody=true;
		this.group.physicsBodyType=Phaser.Physics.ARCADE;
		this.rg=game.add.group();
		this.addScore();
		this.arrObj=[];
		for (let i = 0; i < 6; i++) {
	      var rand = game.rnd.integerInRange(0, 1);
	      this.draw3D(this.fw, this.fh, this.qw, this.qh, this.w,-200, false);
	      this.arrObj.push(this.h - i * (this.qh * 2 + 5));
	      if (rand) { //判断是往那边走
	        this.w = this.w + this.qw;
	      } else {
	        this.w = this.w - this.qw;
	      }
	      //这儿一定要少一个
	      if (i < 5) {
	        this.arr.push(rand);
	      }
	    }
	    this.inx=0;
	    this.group.forEach(function(pos){
	        this.tween = game.add.tween(pos).to({ y: this.arrObj[this.inx], alpha: 1 }, 500+this.inx*100, Phaser.Easing.Linear.In, true, 0, 0);
	        this.inx++;
	    },this);
	    this.tween.onComplete.add(function (e) {
	      if (this.tween.manager.getAll().length == 1) {//下面消除以后，要从新
	        this.i = this.group.getChildAt(0).x;
	        this.p = this.group.getChildAt(0).y;
	        //默认方向的朝向
	        if (this.group.getChildAt(0).x < this.group.getChildAt(1).x) {
	          this.addRole('right');
	        } else {
	          this.addRole('left');
	        }
	        game.input.onDown.add(this.onDown, this);
	      }
	    }, this);
		this.addAudio();
	}
	//3d小方块绘制方法
	this.draw3D=(cx,cy,w,h,x,y,f)=>{
		this.c=game.add.bitmapData();
		//右
		this.c.ctx.beginPath();
		this.c.ctx.setTransform(1, .5, 0, 1, 0, 0);
		this.c.ctx.drawImage(game.cache.getImage('z1'), cx, cy, w,h);
		//左
		this.c.ctx.beginPath();
		this.c.ctx.setTransform(1, -.5, 0, 1, 0, 0);
		this.c.ctx.drawImage(game.cache.getImage('z'),cx*5, cy*3.5, w, h);
		//新建一个canvas，然后在把他画到世界。绘制顶部
		this.r = document.createElement("canvas");
		this.o = this.r.getContext("2d");
		this.o.beginPath();
		this.o.setTransform(1, 0, .6, .8, 0, 0);
		this.o.drawImage(game.cache.getImage('a'),-cx*1.6,cy*1.4,w * Math.sqrt(5) / 2,w * Math.sqrt(5) / 2);
		this.c.ctx.beginPath();
		this.c.ctx.setTransform(1, 0, 0, 1, 0, 15);
		this.c.ctx.rotate(-Math.asin(1 / Math.sqrt(5)));
		this.c.ctx.drawImage(this.r, 0, 0);
		//做后面的工作
		if(f){
			this.c.ctx.beginPath();
			this.c.ctx.setTransform(1, 0, 0, 1, -30, 15);
			this.v=game.rnd.integerInRange(0,1)==1?'q':'y';
			this.c.ctx.drawImage(game.cache.getImage(this.v),cx*4.6,cy*.1,w * Math.sqrt(2) / 2,w * Math.sqrt(2) / 2);
		}
		this.group.create(x,y,this.c,0,true,this.index);
		this.index++;
	}
	this.onDown=(e)=>{//时间控制
		if((this.num-1)%10==0){
			this.time.removeAll();
			this.timer(this.msc);
			this.msc-=50; 
		}
		//切换背景
//		if((this.num-1)%30==0 && this.num!=1){
//			this.__++;
//			if(this.__>5){
//				this.__=1;
//			}
//			this.bg.loadTexture('bg'+this.__);
//		}
		this.click.play();
		this.tween=game.add.tween(this.g).to({alpha:0},500,null,true,0,0);
		e.x>=game.world.centerX?this.onDownRight():this.onDownLeft();
	}
	//right
	this.onDownRight=()=>{
		var rand=game.rnd.integerInRange(0,1);
		this.arr.push(rand);
		this.arrs.push(1);
		this.direction='right';
		this.addRole(this.direction);
		this.group.forEachAlive((pos)=>{
			if(pos.y>game.world.height){ //超过就杀掉
				pos.kill();
			}
		},this);
		if(rand){
			this.n=this.group.getChildAt(this.group.children.length-1).x+this.qw;
		}else{
			this.n=this.group.getChildAt(this.group.children.length-1).x-this.qw;
		}
		this.m=this.group.getChildAt(this.group.children.length-1).y-(this.qh*2+5);
		var flag=false;
		if(game.rnd.integerInRange(0,1000)<300){
			if(rand){
				this.draw3D(this.fw,this.fh,this.qw,this.qh,this.n-this.qw*2,0,true);
			}else{
				this.draw3D(this.fw,this.fh,this.qw,this.qh,this.n+this.qw*2,0,true);
			}
			flag=true;
		}
		this.draw3D(this.fw,this.fh,this.qw,this.qh,this.n,0);
		this.group.forEachAlive((pos)=>{
			this.tween=game.add.tween(pos).to({x:pos.x-this.qw,y:pos.y+(this.qh*2+5)},100,null,true,0,0);
		},this);
		this.group.getChildAt(this.group.children.length-1).y=200;
		this.group.getChildAt(this.group.children.length-1).alpha=0;
		this.tween=game.add.tween(this.group.getChildAt(this.group.children.length-1)).to({y:this.m+(this.qh*2+5),alpha:1},100,Phaser.Easing.Bounce.Out,true,0,0);
		if(flag){
			this.group.getChildAt(this.group.children.length-2).y=200;
			this.group.getChildAt(this.group.children.length-2).alpha=0;
			this.tween=game.add.tween(this.group.getChildAt(this.group.children.length-2)).to({y:this.m+(this.qh*2+5),alpha:1},100,Phaser.Easing.Bounce.Out,true,0,0);
			flag=false;
		}
	}
	//left
	this.onDownLeft=()=>{
		//分数
		var rand=game.rnd.integerInRange(0,1);
		this.arr.push(rand);  //记录路径
		this.arrs.push(0); //匹配路径
		this.direction='left';
		this.addRole(this.direction);
		this.group.forEachAlive((pos)=>{
			if(pos.y>game.world.height){
				pos.kill();
			}
		},this);
		if(rand){
			this.n=this.group.getChildAt(this.group.children.length-1).x+this.qw;
		}else{
			this.n=this.group.getChildAt(this.group.children.length-1).x-this.qw;
		}
		var flag=false;
		this.m=this.group.getChildAt(this.group.children.length-1).y-(this.qh*2+5);
		if(game.rnd.integerInRange(0,1000)<300){
			if(rand){
				this.draw3D(this.fw,this.fh,this.qw,this.qh,this.n-this.qw*2,0,true);
			}else{
				this.draw3D(this.fw,this.fh,this.qw,this.qh,this.n+this.qw*2,0,true);
			}
			flag=true;
		}
		this.draw3D(this.fw,this.fh,this.qw,this.qh,this.n,0);
		this.group.forEachAlive((pos)=>{
			this.tween=game.add.tween(pos).to({x:pos.x+this.qw,y:pos.y+(this.qh*2+5)},100,null,true,0,0);
		},this);
		this.group.getChildAt(this.group.children.length-1).y=200;
		this.group.getChildAt(this.group.children.length-1).alpha=0;
		this.tween=game.add.tween(this.group.getChildAt(this.group.children.length-1)).to({y:this.m+(this.qh*2+5),alpha:1},100,Phaser.Easing.Bounce.Out,true,0,0);
		if(flag){
			this.group.getChildAt(this.group.children.length-2).y=200;
			this.group.getChildAt(this.group.children.length-2).alpha=0;
			this.tween=game.add.tween(this.group.getChildAt(this.group.children.length-2)).to({y:this.m+(this.qh*2+5),alpha:1},100,Phaser.Easing.Bounce.Out,true,0,0);
			flag=false;
		}
	}
	this.drawCir=()=>{
		this.draw = game.add.graphics(0, 0);
		this.draw.beginFill(0Xffffff, 1);
		return this.draw.drawCircle(10,10,10);
		this.draw.endFill();
	}
	//添加粒子颗粒
	this.addEmitter=(img,img1,img2)=>{
		this.emitter = game.add.emitter(0, 0, 10);
  	 	this.emitter.makeParticles(img);
// 		this.emitter.gravity = 200;
   		this.emitter.setXSpeed(-200,200);
   		this.emitter.setYSpeed(-200,200);
   		this.emitter1 = game.add.emitter(0, 0, 10);
  	 	this.emitter1.makeParticles(img1);
// 		this.emitter1.gravity = 200;
   		this.emitter.setXSpeed(-200,200);
   		this.emitter.setYSpeed(-200,200);
   		this.emitter2 = game.add.emitter(0, 0, 10);
  	 	this.emitter2.makeParticles(img2);
// 		this.emitter2.gravity = 200;
   		this.emitter.setXSpeed(-200,200);
   		this.emitter.setYSpeed(-200,200);
	}
	//添加自动消除
	this.timer=(ms)=>{
		this.time=game.time.create(true);
		this.time.loop(ms,()=>{
			var is=0;
			var frist=this.group.getFirstAlive();
			//相同的一起干掉
			this.group.forEachAlive((pos)=>{
				if(pos.y==frist.y){
					if(pos.x==this.rg.getChildAt(0).x && pos.y-this.qh/2==this.rg.getChildAt(0).y || pos.x+this.qh*1.5==this.rg.getChildAt(0).x && pos.y-this.qh/2==this.rg.getChildAt(0).y){
						game.input.onDown.remove(this.onDown,this);
						//效果需要优化
						this.tween=game.add.tween(this.rg.getChildAt(0)).to({y:game.world.height,rotation:Math.PI/180*360},300,null,true,0,0);
						this.tween.onComplete.add(()=>{
							this.time.stop();
						});
					}
					var tweenD=game.add.tween(pos).to({y:game.world.height*1.4},ms-ms/10,Phaser.Easing.Linear.Out,true,0,0);
					tweenD.onComplete.add(()=>{
						pos.kill();
					});
				}
			},this);
		});
		this.time.start();
	}
	//绘制角色
	this.addRole=function(direction){
		if(this.rg.children.length)this.rg.removeAll(); 
		this.addEmitter('x', 'x1', 'x2');
		//通过下面方法可以实现2d转3d，模拟
		this.cr=game.add.bitmapData();
		this.cr.ctx.beginPath();
		if(direction=='left'){
			this.cr.ctx.setTransform(-1, 0, 0, 1, 200,0); //实现3d转换
			this.cr.ctx.drawImage(game.cache.getImage('r'),0,0, this.qw*1.15,this.qw*1.15);
			this.rg.create(this.i,this.p-this.qh/2,this.cr);
		}else if(direction=='right'){
			this.cr.ctx.setTransform(1, 0, 0, 1,0,0);
			this.cr.ctx.drawImage(game.cache.getImage('r'),0,0, this.qw*1.2,this.qw*1.2);
			this.rg.create(this.i+this.qh*1.5,this.p-this.qh/2,this.cr);
		}
		this.tween=game.add.tween(this.rg.getChildAt(0)).to({y:this.p-this.qh*2},60,null,true,0,0,true);
		game.input.onDown.remove(this.onDown, this);
   		if (this.arr[this.num - 1] != this.arrs[this.arrs.length - 1]) {
		this.tween.onComplete.add(()=>{
//			if(this.arr[this.num-1]!=this.arrs[this.arrs.length-1]){
			//game over
			game.input.onDown.remove(this.onDown,this);
			this.tween=game.add.tween(this.rg.getChildAt(0)).to({y:this.rg.getChildAt(0).y-100},60,null,true,0,0);
			this.tween.onComplete.add(()=>{
				this.tween=game.add.tween(this.rg.getChildAt(0)).to({y:game.world.height+this.rg.getChildAt(0).height,rotation:Math.PI/180*300},300,null,true,0,0);
				this.tween.onComplete.add(()=>{
					this.rg.getChildAt(0).kill();
					this.drawOver();
				});
			},this);
			this.tween.onComplete.add(()=>{
				this.time.stop();
			});
			return false;
//			}
		},this);
		}else{
	      this.tween.onComplete.add(() => {
	        this.emitter.y = this.p * 1.08;
	        this.emitter.x = this.i * 1.45;
	        this.emitter.start(true, 500, null, 10);
	        this.emitter1.y = this.p * 1.08;
	        this.emitter1.x = this.i * 1.35;
	        this.emitter1.start(true, 500, null, 10);
	        this.emitter2.y = this.p * 1.08;
	        this.emitter2.x = this.i * 1.25;
	        this.emitter2.start(true, 500, null, 10);
	        game.input.onDown.add(this.onDown, this);
	      }, this);
	    }
		this.num++;
		this.score.text=this.num-1;
		if((this.num-1)%10==0 && this.num!=1){
			this.tween=game.add.tween(this.score.scale).to({x:1.2,y:1.2},150,null,true,0,0,true);
			this.scroea.play();
		}
//		},this);
	}
	this.addAudio=()=>{
		this._in = game.add.audio('_in', 1, false);
		this._in.loop=true;
		this._in.play();
		this.click = game.add.audio('click', 1, false);
		this.scroea = game.add.audio('scroea', 1, false);
		this.defeat = game.add.audio('defeat', 1, false);
	}
	this.drawOver=()=>{
		this._in.stop();
		this.defeat.play();
		//draw
		var draw = game.add.graphics(0, 0);
		draw.beginFill(0X000000,.5);
		draw.alpha=0;
		draw.drawRect(0, 0, game.width, game.height);
		draw.endFill();
		this.tween=game.add.tween(draw).to({alpha:.5},300,null,true,0,0);
		//img
		var over = game.add.image(0, 0, 'over');
		over.y = -over.height;
		over.x = game.world.centerX;
		over.anchor.set(.5);
		over.inputEnabled=true;
		this.tween=game.add.tween(over).to({y:game.world.centerY},1000,Phaser.Easing.Bounce.Out,true,300,0);
		this.tween.onComplete.add(()=>{
			over.events.onInputDown.add(()=>{ //失败
				game.state.start('main');
			},this);
		},this);
	}
	//添加成绩
	this.addScore=()=>{
		this.style = {
			font: "100px  Microsoft YaHei",
			fill: "#fff",
			align: "center"
		};
		this.score = game.add.text(game.world.centerX, game.world.centerY - 200, "0", this.style);
		this.score.y = 100;
		this.score.anchor.set(.5);
	}
	this.update=()=>{
	}
	this.render=()=> {
		this.group.forEach(function(pos){
//			game.debug.body(pos);
		},this)
	}
}
//Games Start,Put It At The Bottom
game.state.add('loader', this.loading);
game.state.add('main', this.main);
game.state.start('loader');