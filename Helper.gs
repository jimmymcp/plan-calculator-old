function initUI()
{
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var menuEntries = [];
  menuEntries.push({name: "Insert Duties", functionName: "insertDuties"});
  menuEntries.push({name: "Insert Away Dates", functionName: "insertAwayDates"});  
  menuEntries.push({name: "Insert Away Date Constraints", functionName: "insertAwayDateContraints"});
  menuEntries.push({name: "Update Duty Constraints", functionName: "updateDutyConstraints"})
  menuEntries.push({name: "Update Candidates for Duties", functionName: "updateCandidatesForDuties2"});
  menuEntries.push({name: "Calculate Plan", functionName: "calculatePlan"});
  menuEntries.push({name: "Write Away Date Summary", functionName: "awayDateSummary"});
  spreadsheet.addMenu('Plan', menuEntries);
}

function onOpen()
{
  this.initUI();
}

function getStartDate(){
  var sheet = spreadsheet.getSheetByName('Options');
  var dateString = sheet.getRange(1, 2).getValue();
  var startDate = new Date(dateString);
  return startDate;
}

function getEndDate(){
  var sheet = spreadsheet.getSheetByName('Options');
  var dateString = sheet.getRange(2, 2).getValue();
  var endDate = new Date(dateString);
  return endDate;
}

function getFirstGivenDayOfWeekAfterDate(dayOfWeek,date){
  while (date.getDay() != dayOfWeek)
  {
    date = addDaysToDate(1,date);
  }
  
  return date;
}

function addDaysToDate(days,date){
  var newDate = new Date(date);
  newDate.setTime(newDate.getTime() + 86400000 * days);
  newDate.setTime(newDate.getTime() + 43200000); //add half a day
  newDate.setHours(0); //and set the hour to zero (to account for daylight savings)
  return newDate;
}

function datesAreEqual(date1,date2) {
  if ((date1.getDate() == date2.getDate()) && (date1.getMonth() == date2.getMonth()) && (date1.getFullYear() && date2.getFullYear())) {
    return true;
  }
  else {
    return false;
  }
}

function writeArrayToSheet(dataArray,sheetName) {
  var sheet = spreadsheet.getSheetByName(sheetName);  
  for (var i = 0; i < dataArray.length; i++) {
    for (var j = 0; j < dataArray[i].length; j++) {
      sheet.getRange(i + 1, j + 1).setValue(dataArray[i][j]);
    }
  }
}

function readArrayFromSheet(sheetName) {
  var sheet = spreadsheet.getSheetByName(sheetName);
  if (sheet.getLastRow() > 0) {
    return sheet.getRange(1, 1, sheet.getLastRow(), sheet.getLastColumn()).getValues();
  }
  else {
    return [];
  }
}