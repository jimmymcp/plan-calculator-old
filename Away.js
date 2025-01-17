function populateAwayDateData() {  
  var sheet = spreadsheet.getSheetByName('Away Dates');
  var awayDateArray2 = sheet.getRange(1, 1, sheet.getLastRow(),sheet.getLastColumn()).getValues();
  for (var column = 1; column < sheet.getLastColumn(); column++)
  {
    if (awayDateArray2[1][column] != '') //allow columns to be used for non-members on the away dates sheet
    {
      var memberCode = getMemberCodeFromName(awayDateArray2[0][column],awayDateArray2[1][column]);
      for (var row = 2; row < sheet.getLastRow(); row++)
      {
        if (awayDateArray2[row][column] != '')
        {
          var awayDate = new Date(awayDateArray2[row][0]);        
          awayDateArray.push([memberCode,awayDate,awayDateArray2[row][column]]);
        }
      }
    }
  }
}

function populateConstraintsForAwayDates() {
  //loop through the away dates and create contrainsts for each duty that that member does
  for(var i = 0; i < awayDateArray.length; i++) {
    //find the duties that the member does
    var memberDuties = getDutiesByMemberCode(awayDateArray[i][0])
    for (var j = 0; j < memberDuties.length; j++) { 
      var dutyToConstrain = getDutyForDutyCodeAndDate(memberDuties[j][1],awayDateArray[i][1]);
      if (dutyToConstrain.length > 0) {        
        dutyConstraintArray.push([dutyToConstrain[0][0],memberDuties[j][0],'Away']);
      }
    }
  }    
}

function writeDutyConstraint(dutyNo,memberCode,reason) {
  var sheet = spreadsheet.getSheetByName('Duty Constraint');
  sheet.appendRow([dutyNo,memberCode,reason]);
}
  
function writeAwayDateSummary() {
  var sheet = spreadsheet.getSheetByName('Away Date Summary');

  sheet.clear();

  var startDate = getFirstGivenDayOfWeekAfterDate(0,getStartDate()); //0 = Sunday
  var endDate = getEndDate();

  var awayDateSummaryArray = [];

  while (startDate <= endDate) {
    sheet.appendRow([startDate,getAwayDateSummaryForDate(startDate)]);
    startDate = addDaysToDate(7,startDate);
  }

  writeArrayToSheet(awayDateSummaryArray,'Away Date Summary');
}

function getAwayDateSummaryForDate(date) {
  var awayDatesOnDate = getAwayDatesByDate(date);
  var summary = '';
  for (var i = 0; i < awayDatesOnDate.length; i++) {
    summary += ',' + awayDatesOnDate[i][0];
  }

  if (summary.length > 0) {
    return summary.substr(1,summary.length - 1);
  }
  else {
    return '';
  }
}

function getAwayDatesByDate(date) {
  return awayDateArray.filter(awayDatesByDateFilter(date));
}

function awayDatesByDateFilter(date) {
  return function(element) {
    if ((element[1].getTime() == date.getTime()) && element[2] == 'Away') {
      return true;
    }
    else {
      return false;
    }
  }
}