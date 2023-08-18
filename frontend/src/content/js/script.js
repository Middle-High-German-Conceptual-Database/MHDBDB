if(window.devicePixelRatio >= 1.2){
  var elems = document.getElementsByTagName('*');
  for(var i=0;i < elems.length;i++){
  var attr = elems[i].getAttribute('data-2x');
    if(attr){
      elems[i].style.cssText += 'background-image: url('+attr+')';
    }
  }
}
/*=============================================================================================*/
/* Ready Function START Here*/
jQuery(document).ready(function() {
	'use strict';
	 $('select').niceSelect();
	/*=====================================*/
	/* Homepage Footer Flag Slider : Start */
	 
	
	/* Homepage Footer Flag Slider : End */
	/*=====================================*/
	jQuery(".user-icon > a").click(function() {
		jQuery(this).toggleClass("active");
		//jQuery("body").toggleClass("hiddenscroll");
		jQuery(".user-icon .login-hide").slideToggle();
	});
	
	/*----- menu open  js start -------*/
		jQuery(".menu-bar a").click(function() {
			jQuery(".header-bot-main").addClass("is-active");
			jQuery("body").addClass("hiddenscroll");
			
		});
	/*----- menu open  js End -------*/
	/*----- menu close  js start -------*/
		jQuery(".menu-close a").click(function() {
			jQuery(".header-bot-main").removeClass("is-active");
			jQuery("body").removeClass("hiddenscroll");
		});
	/*----- menu close  js End -------*/
});
/* Ready Function END Here*/
/*=============================================================================================*/


 
 



