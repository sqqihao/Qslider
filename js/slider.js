// JavaScript Document

(function($) {
		
	function typeOfSlide( type ) {
		var _this = this;
		return {
			defaults : function() {
				_this.sliderDefault.call(_this);
			}
		}[type];
	};
	
	function QSlider( ) {
		this.defaults = {
			width : 200 ,
			height : 200 ,
			time : 1000,
			speed : "fast"
		};
		this.Sinit.apply(this, arguments);
	};
	
	$.fn.Qslider = QSlider.instance = function(setting) {
		this.each(function(){
			$.extend(true, setting, {el:this} );
			new QSlider( setting );
		});
	};
	
	QSlider.prototype = {
		Sinit : function(setting) {
			//定义初始的值;
			this.setting = $.extend(true, this.defaults , setting);
			//为了添加各种的滑动效果，所以要有个配置项;
			this.slideType();
			this.navType();
		},
		
		sliderDefault : function() {
			this.slider = $(this.setting.el);
			if(this.slider.length === 0) throw new Error("没有这个元素");
			this.slideFn[0].call(this);
		},
		
		slideType : function() {
			//这个走默认的类型;
			if( !this.type ) {
				typeOfSlide.call(this,"defaults")();
			};
 		},
		
		navType : function() {
			if( this.setting.nav === "right-bottom" || !this.setting.nav ) {
				//nav就在默认的位置
				return
			};
			if( this.setting.nav === "right-top" ) {
				this.$nav.removeClass().addClass( "nav-right-top" );
			};
			if( this.setting.nav === "left-bottom" ) {
				this.$nav.removeClass().addClass( "nav-left-bottom" );
			};
			if( this.setting.nav === "left-top" ) {
				this.$nav.removeClass().addClass( "nav-left-top" );
			}; 
		},
		//旋转木马么么哒;
		slideFn : [
			function() {
				var _this = this;
				var $slider = this.slider;
				this.$list = $slider.children(".list");
				this.$lis = this.$list.children("li");
				this.$nav = $slider.children(".nav");
				this.$number = this.$nav.children("li");
				
				this.len = $("li",this.$list).length;
				this.nWidth = $("li",this.$list).eq(0).width();
				
				this.tTime = 0;
				this.now = 0;
				this.time = this.setting.time || 1000;
				
				this.ifLastLi = function() {
					//如果当前的now是已经复制的最后一个;
					//初始化为原来的值;
					if(_this.now === _this.len) {
						_this.$list.css({ "left" : 0 });
						_this.now = 0;
					};
					_this.$number.removeClass("cur").eq( _this.now ).addClass("cur");
				};
				
				$("img",$slider).width( this.setting.width ).height( this.setting.height );
				
				//设置视区高度;
				$slider.width( this.setting.width ).height( this.setting.height ).css("overflow", "hidden");
				
				//克隆第一个li到最后一个;
				$("li",this.$list).eq(0).clone().appendTo( this.$list );
				
				/*
					//初始化left;
					this.$list.css({ "left" : 0 });
				*/
				
				//设置宽度;
				this.$list.width( this.nWidth*( this.len+1 ) );
				
				//保存初始的index值到btn;
				this.$nav.find("li").each(function(i, e) {
					$(this).data("index",i);
				});
				
				function move(index, callback) {
					if( _this.setting.fade ) {
						_this.$lis.fadeOut(_this.setting.speed ,callback);
						_this.$lis.eq(index).fadeIn(_this.setting.speed ,callback);
					}else{
						_this.$list.animate({ "left" : -index*_this.nWidth }, callback || function() {});
					};
				};
				
				function auto() {
					clearInterval(_this.tTime);
					_this.tTime = setInterval(function() {
						_this.now++;
						move.call(_this, _this.now, _this.ifLastLi);
					}, _this.time);
				};
				
				function stopRun() {					
					//关定时器;
					clearInterval( _this.tTime );
				};
				
				$slider.hover(
					stopRun,
					auto
				);
				
				this.$nav.click(function(ev) {
					var tempIndex = $(ev.target).data("index");
					_this.now = tempIndex;
					move( _this.now , _this.ifLastLi ) ;
				});
				
				//轮播开始;
				//auto();
				
			}
		]
	};

})(jQuery);