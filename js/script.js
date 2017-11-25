$(document).ready(function(){

	// 常用乘船人信息数据
	var passengerData = [
		{
			id:1,
			name:'王大川',
			codeTypeId:1,
			codeType:'身份证',
			code:'2202045678951',
			mobile:'13608965458',
			isDefault:true
		},
		{
			id:2,
			name:'张三',
			codeTypeId:1,
			codeType:'身份证',
			code:'220204565671111',
			mobile:'13608961111',
			isDefault:false
		},
		{
			id:3,
			name:'李四',
			codeTypeId:2,
			codeType:'军人证',
			code:'220204565672222',
			mobile:'13608961111',
			isDefault:false
		},
		{
			id:4,
			name:'王五',
			codeTypeId:3,
			codeType:'港澳台通行证',
			code:'220204565673333',
			mobile:'13608963333',
			isDefault:false
		},
		{
			id:5,
			name:'赵六',
			codeTypeId:4,
			codeType:'其他证件',
			code:'220204565674444',
			mobile:'13608964444',
			isDefault:false
		},
		{
			id:6,
			name:'钱七',
			codeTypeId:1,
			codeType:'身份证',
			code:'220204565675555',
			mobile:'13608965555',
			isDefault:false
		},
	];

	var htmlStr;//html字符串

	// 船票价格下拉列表
	var priceListHtml = '<select name="price"><option value="315">普通 ￥315</option><option value="300">学生 ￥300</option><option value="270">军人 ￥270</option><option value="100">儿童 ￥100</option></select>';
	
	// 证件类型下拉列表
	var certTypeHtml = '<select name="certType"><option value="1">身份证</option><option value="2">军人证</option><option value="3">港澳台通行证</option><option value="4">其他证件</option></select>';

	var passengerCount = 0;//人数限制

	/*
		页面数据初始化
	*/	
	var defaultPassenger;// 默认乘船人

	// 查找默认乘船人
	$.each(passengerData,function(index, el) {	
		if (el.isDefault) {
			defaultPassenger = el;
			return false;//相当于break
		}
	});

	// 设置显示默认乘船人姓名复选
	htmlStr = '<label><input type="checkbox" id="' + defaultPassenger.id + '">' + defaultPassenger.name + '</label>';
	$('#defaultPassenger').html(htmlStr);

	// 设置其他常用乘船人姓名复选
	var passengerBlock = $('#passengerBlock');
	$.each(passengerData,function(index, el) {
		if (!el.isDefault) {
			htmlStr = '<label><input type="checkbox" id="' + el.id + '">' + el.name + '</label> ';
			passengerBlock.append(htmlStr);
		}
	});
	
	/*
		显示更多常用乘船人姓名
	*/
	$('#moreBtn').click(function(event) {
		if ( $('#passengerBlock').css('display')=='none') {
			$('#passengerBlock').show();		
			$('#moreBtn').html("&lt;&lt;收回");
		}else {
			$('#passengerBlock').hide();		
			$('#moreBtn').html("更多&gt;&gt;");	
		}
	});

	/*
		单击任何一个乘船人姓名的复选按钮激发事件处理
	*/
	$('#allPassenger :checkbox').click(function(e) {

		//获得checkbox的id
		var pid = $(this).attr('id');

		// 选中增加，取消选中为删除
		if (this.checked) {

			//判断人数是否已超过5人
			if (passengerCount>=5) {
				alert('最多选择5人!');
				return false;
			}
			
			passengerCount ++;//计数加1

			// 获得对应乘客信息
			var p = findPassengerById(pid);			

		    // 拼接html字符串
		    htmlStr = '<ul id="' + pid + '">';
		    htmlStr += '<li>' + priceListHtml +'</li>';
		    htmlStr += '<li>姓名：<input type="text" size="8" value="' + p.name + '" readonly></li>';
		    htmlStr += '<li><select><option value="' + p.codeTypeId + '">' + p.codeType + '</option></select><input type="text" value="' + p.code + '" readonly></li>';
		    htmlStr += '<li>电话：<input type="text" value="' + p.mobile + '" readonly></li>';
		    htmlStr += '<li><input type="button" value="删除当前" class="delBtn"></li>';
		    htmlStr += '</ul>';

		    // 增加条目
		    $('#passengerList').append(htmlStr);
		} else {
			if (confirm('删除此条信息？')) {
				// 删除对应条目
				$('#passengerList').find('#'+pid).remove();

				passengerCount --;//计数减1
				console.log('passengerCount=' + passengerCount);
			}						
		}

		getTotalPrice();//价格改变

	});

	// 默认乘船人信息条目添加
	$('#defaultPassenger :checkbox').click();

	/*
		单击删除当前按钮，删除当前条目
	*/
	$('#passengerList').on('click', '.delBtn', function(event) {
		if (!confirm('删除此条信息？')) {
			return;
		}

		// 获得当前ul
		var ul = $(this).parents('ul');
		// 获得当前ul的id
		var pid = ul.attr('id');
		// 删除ul
		ul.remove();

		// 复选取消
		if (pid){
			$('#allPassenger').find('#'+pid).prop('checked',false);
		}

		passengerCount --;//计数减1	
		
		getTotalPrice();//价格改变			
	});

	/*
		手动添加乘船人
	*/
	$('#addPassBtn').click(function(event) {

		//判断人数是否已超过5人
		if (passengerCount>=5) {
			alert('最多选择5人!');
			return false;
		}
		
		passengerCount ++;//计数加1

		// 拼接html字符串
	    htmlStr = '<ul>';
	    htmlStr += '<li>' + priceListHtml +'</li>';
	    htmlStr += '<li>姓名：<input type="text" size="8"></li>';
	    htmlStr += '<li>' + certTypeHtml + '<input type="text"></li>';
	    htmlStr += '<li>电话：<input type="text"></li>';
	    htmlStr += '<li><input type="button" value="删除当前" class="delBtn"></li>';
	    htmlStr += '</ul>';

	    // 增加条目
	    $('#passengerList').append(htmlStr);

	    getTotalPrice();//价格改变
	});

	/*
		价格下拉框改变时，更新金额
	*/
	$('#passengerList').on('change', 'select[name=price]', function(event) {
		getTotalPrice();
	});

	/*
		根据id获得乘船人信息
	*/
	function findPassengerById(id) {
		var p;

		$.each(passengerData,function(index, el) {
			if (el.id == id) {
				p = el;
				return false;
			}
		});

		return p;
	}

	/*
		计算票总价格
	*/
	function getTotalPrice() {
		
		var totalPrice = 0;//总票价

		$('#passengerList select[name=price]').each(function(index, opt) {
	        totalPrice += parseFloat(opt.value);
	    });
		
		//显示票数量
		$('#ticketCountTxt').text(passengerCount);
		//显示总价格
		$('#totalPriceTxt').text(totalPrice);		
	}	

});