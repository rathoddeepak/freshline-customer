const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const days = ['SUN', 'MON', 'TUE', 'WED',  'THU', 'FRI', 'SAT'];
const messTimes = ['Breakfast', 'Lunch', 'Dinner'];
const messClock = ['9:00 AM - 10:30 AM', '12:00 PM - 13:30 PM', '8:00 PM - 9:30 PM'];
const MONIDX = [0,7,14,21,28,35];
const TUEIDX = [1,8,15,22,29,36];
const WEDIDX = [2,9,16,23,30];
const THUIDX = [3,10,17,24,31];
const FRIIDX = [4,11,18,25,32];
const SATIDX = [5,12,19,26,33];
const SUNIDX = [6,13,20,27,34];                                              
const DAYIDX = [
	0,7,14,21,28,35, //0  - 5 MON 
	1,8,15,22,29,36, //6  - 11 TUE
	2,9,16,23,30,    //12 - 16 WED
	3,10,17,24,31,   //17 - 21 THU
	4,11,18,25,32,   //22 - 26 FRI
	5,12,19,26,33,   //27 - 31 SAT
	6,13,20,27,34    //32 - 36 SUN
];
const moment = require('moment');
function lm (d, l) {
	return d < l;
}
const Calender = {
	ganerateCalendar() {
	  var date = moment();
	  var todayDate = date.date();
	  var currentHour = date.hours();	  
	  var startDay = date.day();
	  var numberOfDays = date.endOf('month').date();
	  var theseMonth = [];
	  var calendar = [];
	  var nextMonthLimit = (numberOfDays - (numberOfDays - todayDate) - 1);
	  var active = false;
	  if(nextMonthLimit == 0)nextMonthLimit = currentHour < 18 ? 0 : 1;	  	 	  
	  if(startDay == 0)for(i = 0; i < 6; i++)theseMonth.push({disabled:true});
	  else for(i = 0; i < (startDay - 1); i++)theseMonth.push({disabled:true});
	  let v = currentHour > 18 ? (todayDate + 1) : todayDate;	  
	  for(v; v <= numberOfDays; v++)theseMonth.push({date:v,breakfast:true,lunch:true,dinner:true,disabled:false});
	  calendar.push({startDay,monthid:(date.month() + 1),month:months[date.month()],year:date.year(),dates:theseMonth});
	  if(nextMonthLimit > 0){	    
	    var nextDate = moment().add(1, 'month').startOf('month');	    
	    startDay = nextDate.day();
	    var numberOfDays = nextDate.endOf('month').date();
	    var nextMonthData = [];
	    if(nextMonthLimit > numberOfDays)nextMonthLimit = numberOfDays;	   
	    if(startDay == 0)for(i = 0; i < 6; i++)nextMonthData.push({disabled:true});
		else for(i = 0; i < (startDay - 1);i++)nextMonthData.push({disabled:true});
	    for(i = 1; i <= nextMonthLimit; i++)nextMonthData.push({date:i,active:true,breakfast:true,lunch:true,dinner:true});	    
	    calendar.push({dates:nextMonthData,startDay:startDay,startWord:days[startDay],month:months[nextDate.month()],year:nextDate.year(),monthid:nextDate.month()});
	  }
	  return calendar;
	},
	messTime(time){
		return messTimes[time];
	},
	getMonth(index){
		return months[index];
	},
	getDay(day){
		return days[day];
	},
	messClockTime(time){
	    return messClock[time];	
	},
	getDayIdx(day, limit = 36){
		switch(day){
			case 0: 
			return MONIDX.find((d) => lm(d,limit));
			case 1:
			return TUEIDX.find((d) => lm(d,limit));
			case 2:
			return WEDIDX.find((d) => lm(d,limit));
			case 3:
			return THUIDX.find((d) => lm(d,limit));
			case 4:
			return FRIIDX.find((d) => lm(d,limit));
			case 5:
			return SATIDX.find((d) => lm(d,limit));
			case 6:
			return SATIDX.find((d) => lm(d,limit));
		}
	},
	whichDay(d){
		let i = DAYIDX.indexOf(d);		
		if(i >= 0  && i <= 5){
			return 0;
		}else if(i >= 6  && i <= 11){
			return 1;
		}else if(i >= 12 && i <= 16){
			return 2;
		}else if(i >= 17 && i <= 21){
			return 3;
		}else if(i >= 22 && i <= 26){
			return 4;
		}else if(i >= 27 && i <= 31){
			return 5;
		}else if(i >= 32 && i <= 36){
			return 6;
		}








	}
}

export default Calender;