"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.getThisMonthDays = function(year, month) {
  return new Date(year, month, 0).getDate();
};

exports.getFirstDayOfWeek = function(year, month) {
  return new Date(Date.UTC(year, month - 1, 1)).getDay();
};

exports.calculateEmptyGrids =function (year, month) {
  var days=[];
  var firstDayOfWeek = this.getFirstDayOfWeek(year, month);
  if (firstDayOfWeek > 0) {
    for (var i = 0; i < firstDayOfWeek; i++) {
      var obj = {
        date: null,
        isSign: false
      };
      days.push(obj);
    }
  }
  return days;
},

exports.calculateDays=function (year, month) {
  const thisMonthDays = this.getThisMonthDays(year, month);
  for (var i = 1; i <= thisMonthDays; i++) {
    var obj = {
      date: i,
      isSign: ''
    }
    that.data.days.push(obj);
  }
  this.setData({
    days: that.data.days
  });
}

exports.getMonth=function(year,month){
  var days=[]
  /*
  index
  date
  */
}