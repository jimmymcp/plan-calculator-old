function clearDuties() {
  var sheet = spreadsheet.getSheetByName('Duties');
  sheet.clear();    
}

function getNoOfDutiesSetup() {
  return dutySetupArray.length;
}

function getDutyByDutyNo(dutyNo) {
  return dutyArray.filter(dutyNoFilter(dutyNo));
}

function dutyNoFilter(dutyNo) {
  return function(element) {
    if (element[0] == dutyNo) {
      return true;
    }
    else {
      return false;
    }
  }
}

function getPlannedDuties() {
  return dutyArray.filter(plannedDutyFilter());
}

function plannedDutyFilter() {
  return function(element) {
    if (element[4] != "") {
      return true;
    }
    else {
      return false;
    }
  }
}

function getIndexOfDutyNo(dutyNo) {
  for (var i = 0; i < dutyArray.length; i++) {
    if (dutyArray[i][0] == dutyNo) {
      return i;
    }
  }    
}

function getDutyForDutyCodeAndDate(dutyCode,dutyDate) {
  return dutyArray.filter(dutyFilter(dutyCode,dutyDate));
}

function dutyFilter(dutyCode,dutyDate) {
  return function(element) {
    if ((element[1] == dutyCode) && datesAreEqual(element[3],dutyDate)) {
      return true;
    }
    else {
      return false;
    }
  }
}

function getDutiesByDutyFilterAndDateRange(dutyFilter,startDate,endDate) {
  return dutyArray.filter(filterDutiesByDutyFilterAndTimePeriod(dutyFilter,startDate,endDate));
}

function filterDutiesByDutyFilterAndTimePeriod(dutyFilter,startDate,endDate) {
  return function(element) {
    //check this isn't the header row
    if (element[0] == 'Entry No.') {
      return false;
    }
    
    if (!dutyMatchesDutyFilter(element[1],dutyFilter)) {
      return false;
    }
    
    if (element[3] < startDate) {
      return false;
    }
    
    if (element[3] > endDate) {
      return false;
    }
    
    return true;
  }
}

function getDutiesSetup(){
  var sheet = spreadsheet.getSheetByName('Duty Setup');
  return sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn());  
}

function populateDuties(){  
  var sheet = spreadsheet.getSheetByName('Duties');
  sheet.appendRow(['Entry No.','Duty Code','Description','Date','Member','Candidates','No. of Candidates']);
  sheet.getRange(1, 1, 1, sheet.getLastColumn()).setFontWeight('bold');
    
  for (var i = 0; i < dutySetupArray.length; i++)
  {
    duty = dutySetupArray[i];
    
    if (duty[3] == 'Yes')
    {
      populateRecurringDuty(duty);
    }
  }   
}

function populateRecurringDuty(duty){
  var dutyDate = getFirstGivenDayOfWeekAfterDate(getDayOfWeekOfDuty(duty[4]),getStartDate());
  var endDate = getEndDate();

  while (dutyDate <= endDate)
  {
    populateDuty(duty[0],dutyDate,duty[1]);
    dutyDate = addDaysToDate(7,dutyDate);
  }
}

function populateDuty(dutyCode,date,dutyDescription){
  var sheet = spreadsheet.getSheetByName('Duties');
  dutyNo += 1;
  sheet.appendRow([dutyNo,dutyCode,dutyDescription,date]);
}

function getDayOfWeekOfDuty(dayName){
  switch(dayName)
  {
    case 'Sunday':
      return 0;
    case 'Monday':
      return 1;
    case 'Tuesday':
      return 2;
    case 'Wednesday':
      return 3;
    case 'Thursday':
      return 4;
    case 'Friday':
      return 5;       
    case 'Saturday':
      return 6;
  }
}
       
function dutyMatchesDutyFilter(dutyCode,dutyFilter) {
  if (dutyFilter == '*') {
    return true;
  }
  else if (dutyFilter.substr(dutyFilter.length - 1,1) == '*') {
    return dutyCode.substring(0,dutyFilter.length - 1) == dutyFilter.substring(0,dutyFilter.length - 1);
  }
  else {
    return dutyCode == dutyFilter;
  }
}