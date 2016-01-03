var globalres;

function calcConsumption(input){
	//console.log(input);


	var sum = 0.0;
	var date_n = new Date();
	var currentTime = date_n;
	var currentDay = currentTime.getDay();
	var wednesday = 3;
	var daysBack, pastDate;
	if(currentDay >= wednesday){
		daysBack = currentDay - wednesday;
	}
	else{
		daysBack = (7 - wednesday) + currentDay;
	}

	last_wednesday = new Date(date_n.getFullYear(),date_n.getMonth(), date_n.getDate() - daysBack);
		//console.log(last_wednesday);
	
	var last_updated;

	for (i in input){

		var x = input[i];

		date = new Date(x.stoptime + ", 2015");
		//console.log(date);
		d = parseFloat(x.download.split(' ')[0]);
		data_size= x.download.split(' ')[1];
		if(data_size == "KB") d/=1024;
		else if(data_size == "GB") d*=1024;

		if(date > last_wednesday){	
			sum += d;
		}

		

	}
	if(input.length){
		last_updated = input[0].stoptime;
	}
	else{
		last_updated = 'empty response recd, try again later!';
	}


	response = "<b>Data Downloaded:</b> " + sum + " MB" + "<br>" + "<b>Percentage Data:</b> " + sum/30 + "%" + 
			"<br>" + "<b>Last Updated:</b> " + last_updated + "<br>";
	//console.log(response);
	
  chrome.runtime.sendMessage(
    {from: "bg", action: "updateData", value: response}
  );
}
function ajaxReq() {
  //your code here
	//alert("welcome!");
	var currentMonth = (new Date()).getMonth()+1;
	var currentYear  = (new Date()).getYear() -100 +2000;
	uid='00000';
	chrome.storage.sync.get({
	    userID: '00000'
	  }, function(items) {
	    uid = items.userID;
	    $.ajax({
		  url: 'http://192.168.50.1/24online/servlet/AjaxManager',
		  type: 'GET',
		  data: 'mode=740&selectedyear=2015&selectedmonth='+currentMonth+'&userid='+uid,
		  success: function(data) {
			//called when successful
			//console.log(data);
			calcConsumption(data);


		  },
		  error: function(e) {
			//called when there is an error
			console.log(e.message);
		  }
		});
	  });
/*
	$.ajax({
	  url: 'http://192.168.50.1/24online/servlet/AjaxManager',
	  type: 'GET',
	  data: 'mode=740&selectedyear=2015&selectedmonth='+currentMonth+'&userid='+uid,
	  success: function(data) {
		//called when successful
		if(data != [])
			calcConsumption(data);
		else{
			console.log('empty data rec');
		}
	  },
	  error: function(e) {
		//called when there is an error
		console.log(e.message);
	  }
	});*/


}

chrome.runtime.onMessage.addListener( function(message, sender, sendResponse) {
  if(message.from && message.from === "popup"){
    switch(message.action){
      case "doAjaxReq":
        /* Do something */
        ajaxReq();
        /* Maybe sendResponse(something) */
        sendResponse(globalres)
        break;
    }
  }
});

//http://192.168.50.1/24online/servlet/AjaxManager?mode=740&ran=0.5069594494998455&selectedyear=2015&userid=20975