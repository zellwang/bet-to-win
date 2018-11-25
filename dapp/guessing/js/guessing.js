//var BottosWalletSDK = require('bottos-sdk-js');

var BottosWalletSDK = window.BottosWalletSDK
const config = {
    baseUrl:'http://193.112.98.92:8689/v1',
    version:1
}
var SDK = new BottosWalletSDK(config)
var Tool = SDK.Tool
var Wallet = SDK.Wallet
var Contract = SDK.Contract
var Api = SDK.Api

let account_chain = ''
let password_chain = ''
let keystore = null

var storage=window.localStorage

function isEmpty(obj){
    if(typeof obj == "undefined" || obj == null || obj == ""){
        return true;
    }else{
        return false;
    }
}

//if success jump to game, if fail alert
function registerUser(){
	console.log("write username into chain")
	
	// write to wallet
	account_chain = $(".username")[0].value;
	password_chain = $(".password")[0].value;
	
	storage.bottosname = account_chain;
	// tomodify api取不到password，临时的持久化方案：
	storage.password = password_chain;
	
	//let keys = Wallet.createKeys()
	//console.log(keys)
	
	let params1 = {account:account_chain,password:password_chain}
	keystore = Wallet.createAccountByIntro(params1)
	storage.keystore = JSON.stringify(keystore)
	/*
	Wallet.createAccount(params1)
        .then(response=>{
            keystore = response
			storage.keystore = keystore
            //document.getElementById('createAccount').innerHTML = JSON.stringify(response)
        }).catch(error=>{
            console.log({error})
            //document.getElementById('createAccount').innerHTML = JSON.stringify(error)

        })
		*/

	
	// write to chain
	let url =  config.baseUrl + '/common/query'
    let params = {
        contract:'junjie870113',
        object:'userdetail',
        key:account_chain
    }
    fetch(url,{
        method:'POST',
        body:JSON.stringify(params)
    }).then(function(response){return response.json()})   
    .then(function(response){
        //document.getElementById('getTransaction').innerHTML = JSON.stringify(response)
		console.log(JSON.stringify(response))
		if (false){   //TODO test if user exist
			alert("User existed!")
		    //return;
		}  else {
			// TODO write user
			// done,need test
			let params2 = {
				method:'reguser',
				contract:'junjie870113',
				sender:account_chain,
				param:{
					userName:account_chain,
					amount:10000,
					win:0,
					lose:0
				}
			}
			
			if(storage.keystore == null || storage.keystore == ""){
				alert('请先创建账户')
				return
			}
			let privateKey = Wallet.recover(storage.password,JSON.parse(storage.keystore))
			let privateKeyStr = Tool.buf2hex(privateKey)

			console.log(param2)
			console.log(privateKeyStr)
			Contract.callContract(params2,privateKeyStr)
				.then(response=>{
					console.log({response})
					window.location.href = "guessing.html";
				}).catch(error=>{
					console.log({error})
					//temp: goto game anyway
					window.location.href = "guessing.html";
				})

		}
		
		//return true;
    }).catch(function(error){
        //document.getElementById('getTransaction').innerHTML = JSON.stringify(error)
		console.log(JSON.stringify(error))
		//temp: goto game anyway
		window.location.href = "guessing.html";
		//alert("an error occured")
		//return false;
    })
}

//if success jump to game, if fail alert
function loginUser(username,password){
	console.log("login")
	
	storage.bottosname = username;
	// tomodify api取不到password，临时的持久化方案：
	storage.password = password;
	
	// check if user/passwd pair exist in chain
	let url =  config.baseUrl + '/common/query'
    let params = {
        contract:'junjie870113',
		//contract:"game",
        object:'userdetail',
        key:username
    }
    fetch(url,{
        method:'POST',
        body:JSON.stringify(params)
    }).then(function(response){return response.json()})   
    .then(function(response){
        //document.getElementById('getTransaction').innerHTML = JSON.stringify(response)
		console.log(JSON.stringify(response))
		if (response.errcode != 0){
			console.log("fail to get user detail")
			//alert("Login fail!")
			return
		}
		// TODO 从钱包或链取得密码，确认登录
		/*
		if (response.value.password != password) {
			console.log("password incorrect")
			alert("Login fail!")
		}
		*/
		// jump to my guessing
	    storage.bottosname = username;
	    window.location.href = "guessing.html";
		//return true;
    }).catch(function(error){
        //document.getElementById('getTransaction').innerHTML = JSON.stringify(error)
		console.log(JSON.stringify(error))
		//return false;
		alert("Login fail!")
    })

}



/**
 * 首页，已登录跳转到home page，未登录跳转到login page
 */
function indexController() {
    pageAnimated();
    logoAnimated();
    // 检查是否登录
    checkLogin();
}

/**
 * 判断用户是否登录：TODO（需要调用真实的API）
 */
function checkLogin() {
    // loading 5s后检查login
    setTimeout(function () {
        //var r = confirm("用户是否已经登录？")
		var r = false;
		var nameInStorage = storage.bottosname;
		if (!isEmpty(nameInStorage)) {
			r = true;
		}
        if (r == true) {
            window.location.href = "guessing.html";
        }
        else {
            window.location.href = "login.html";
        }
    }, 5 * 1000);
}

/**
 * login page
 */
function loginController() {
    pageAnimated();
    // 监听登录按钮
    $(".login-form .form-group button").click(function () {
        // 发送登录请求
        var username = $(".login-form .username").val();
        if (username == "") {
            $(".login-form .username").parent().parent().addClass("has-error");
            $(".login-form .username").attr("placeholder", "Please input username");
        }
        var password = $(".login-form .password").val();
        if (password == "") {
            $(".login-form .password").parent().parent().addClass("has-error");
            $(".login-form .password").attr("placeholder", "Please input password");
        }
        if (username != "" && password != "") {
            userLogin(username, password);
        }
    });

    // 移除has-error效果
    $(".login-form .username").focus(function () {
        $(this).parent().parent().removeClass("has-error");
        $(this).attr("placeholder", "Username");
    });
    $(".login-form .password").focus(function () {
        $(this).parent().parent().removeClass("has-error");
        $(this).attr("placeholder", "Password");
    });
}

/**
 * 调用登录API：TODO（需要调用真实的API）
 */
function userLogin(username, password) {
    // 登录中的loading
    showLoading();
    // done： 发送请求
	loginUser(username, password);
    // 登录中
    setTimeout(function () {
        // 去除loading
        hideLoading();
        // 登录失败UI
        $(".login-form .form-tip .form-tip-txt").text("Login Error!");
        $(".login-form .form-tip").removeClass("hide");
        // 登录成功则跳转至home page
        // window.location.href = "home.html";
    }, 5 * 1000);
}

/**
 * register page
 */
function registerController() {
    pageAnimated();
    // 监听注册按钮
    $(".register-form .form-group button").click(function () {
        // 发送登录请求
        var username = $(".register-form .username").val();
        if (username == "") {
            $(".register-form .username").parent().parent().addClass("has-error");
            $(".register-form .username").attr("placeholder", "Please input username");
        }
        var password = $(".register-form .password").val();
        if (password == "") {
            $(".register-form .password").parent().parent().addClass("has-error");
            $(".register-form .password").attr("placeholder", "Please input password");
        }
        if (username != "" && password != "") {
            userRegister(username, password);
        }

    });

    // 移除has-error效果
    $(".register-form .username").focus(function () {
        $(this).parent().parent().removeClass("has-error");
    });
    $(".register-form .password").focus(function () {
        $(this).parent().parent().removeClass("has-error");
    });
}

/**
 * 调用注册API：TODO（需要调用真实的API）
 */
function userRegister(username, password) {
    // 登录中的loading
    showLoading();
    // done： 发送请求
	registerUser();
    // 注册中
    setTimeout(function () {
        // 去除loading
        hideLoading();
        // 注册失败
        // $(".register-form .form-tip .form-tip-txt").text("Register Error!");
        // $(".register-form .form-tip").removeClass("hide");
        // 注册成功
        window.location.href = "guessing.html";
    }, 5 * 1000);
}

/**
 * home page
 */
function homeController() {
    pageAnimated();
    logoAnimated();

}

/**
 * my guessing page
 */
function myGuessingController() {
    pageAnimated();
    logoAnimated();
}

function addBetListener() {
	$(".btn-token").click(function () {
		var accountname = storage.bottosname;
		/*
		if (acountname==""){
			alert("Not logged in!");
			window.location.href = "login.html";
		}
		*/
		var opponentbet = parseInt(Math.random()*12000, 10)
		var mybet = parseInt($(".input-num")[0].value)
		if (mybet > parseInt($(".total-amount")[0].innerHTML) ){
			alert("余额不足！")
			return;
		}
		var winner = ""
		var winOrLose = ""
		var amount = 0
		if (mybet>opponentbet){
			winner = "你"
			winOrLose = "win"
			amount = mybet
		}else if(mybet<opponentbet){
			winner = "你的对手"
			winOrLose = "lose"
			amount = mybet
		}else{
			winner = "平局"
			winOrLose = "draw"
			amount = 0
		}
		let params = {
			method:'dobet',
			contract:'junjie870113',
			sender:accountname,
			param:{
				userName:accountname,
				winOrLose:winOrLose,
				amount:amount
			}
		}
		
		//TODO 改变页面元素值
		//tomodify 从链上取数据确认
		$(".bet-num")[0].innerHTML = mybet
		$(".opponent-num")[0].innerHTML = opponentbet
		$(".winner")[0].innerHTML = winner
		$(".win-amount")[0].innerHTML = (winOrLose == "lose") ? "-" + amount.toString() :  amount.toString()
		$(".total-amount")[0].innerHTML = (winOrLose == "lose") ? parseInt($(".total-amount")[0].innerHTML) - amount : parseInt($(".total-amount")[0].innerHTML) + amount
		
		
		//tomodify 从钱包取password和keystore
		var password = ""
		
		if(storage.keystore == null || storage.keystore == ""){
			alert('请先创建账户')
			return
		}
		
		let privateKey = Wallet.recover(storage.password,JSON.parse(storage.keystore))
        let privateKeyStr = Tool.buf2hex(privateKey)
		
		Contract.callContract(params,privateKeyStr)
			.then(response=>{
				console.log({response})
				
			}).catch(error=>{
				console.log({error})
			})
			
	});
}

/**
 * guessging page
 */
function guessingController() {
    pageAnimated();
    logoAnimated();
	
	$(".title-name")[0].innerHTML = storage.bottosname;
	addBetListener();

    // 
	/*
    $(".game-content .btn-token").click(function () {
        showLoading();
        setTimeout(function () {
            hideLoading();
        }, 5 * 1000);
    });
	*/
};