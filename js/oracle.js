var Oracle = {

	app_id : null,
	scopes : null,
	fields : null,

	init: function(){
		Oracle.app_id = '';
		Oracle.scopes = ['email', 'user_friends', 'user_birthday', 'user_hometown', 'user_likes', 'user_location', 'user_website', 'user_about_me'];
		Oracle.fields = ['name','email','bio','birthday','cover','website','locale','gender','hometown','location'];

		Oracle.fbInit();

		$("#login").on('click', function(){
			Oracle.fbLogin();
		});
		$("#logout").on('click', function(){
			Oracle.fbLogout();
		});
	},

	fbInit: function(){
 		window.fbAsyncInit = function(){
			FB.init({
				appId   : Oracle.app_id,
				status  : true,
				cookie  : true, 
				xfbml   : true, 
				version : 'v2.1'
			});

			Oracle.fbCheckLoginState(
			function(data){
	   			if(data.status === 'connected'){
	    			Oracle.fbGetData();
	  			}
  			});
		};
	},

	fbCheckLoginState : function(callBack){
		FB.getLoginStatus(function(response){
			callBack(response);
		});
	},

	fbGetData: function(){
		FB.api('/me?fields=' + Oracle.fields.join(','), function(response) {
			$('#login').fadeOut();
			$('#name').html(response.name);
			$('#email').html(response.email);
			$('#bio').html(response.bio);
			$('#date').html(response.birthday);
			$('#website').html(response.website);
			$('#gender').html(response.gender);
			$('#location').html(response.location.name);
			$('#image').attr('src','http://graph.facebook.com/'+response.id+'/picture?type=large');
			$('#facebook-session').fadeIn();
		});
	},

	fbLogin : function(){
		Oracle.fbCheckLoginState(
		function(data){
   			if(data.status !== 'connected'){
    			FB.login(
    			function(response){
     				if(response.status === 'connected')
      					Oracle.fbGetData();
  				}, {scope: Oracle.scopes.join(',')});
  			}
  		});
	},

	fbLogout: function(){
		Oracle.fbCheckLoginState(
		function(data){
   			if(data.status === 'connected'){
    			FB.logout(function(response){
					$('#facebook-session').fadeOut();
					$('#login').fadeIn();
   				});
  			}
		});
	}
}

$(document).ready(function(){
    Oracle.init();
});

(function(d, s, id){
	var js, fjs = d.getElementsByTagName(s)[0];
	if (d.getElementById(id)) return;
	js = d.createElement(s); js.id = id;
	js.src = "//connect.facebook.net/en_US/sdk.js";
	fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));