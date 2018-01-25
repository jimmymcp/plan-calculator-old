function memberIsAwayOnDate(memberCode,date){
}

function populateAwayDateData() {  
  var sheet = spreadsheet.getSheetByName('Away Dates');
  var awayDateArray2 = sheet.getRange(1, 1, sheet.getLastRow(),sheet.getLastColumn()).getValues();
  for (var column = 1; column < sheet.getLastColumn(); column++)
  {
    var memberCode = getMemberCodeFromName(awayDateArray2[0][column],awayDateArray2[1][column]);
    for (var row = 2; row < sheet.getLastRow(); row++)
    {
      if (awayDateArray2[row][column] != '')
      {
        var awayDate = new Date(awayDateArray2[row][0]);        
        awayDateArray.push([memberCode,awayDate]);
      }
    }
  }
}

function updateAwayDateDataFromArray() {
  var sheet = spreadsheet.getSheetByName('Away Date Data');
  sheet.clear();
  for (var i = 0; i < awayDateArray.length; i++) {
    sheet.appendRow([awayDateArray[i][0],awayDateArray[i][1]]);
  }
}

function readAwayDateArray() {
  var sheet = spreadsheet.getSheetByName('Away Date Data');
  awayDateArray = sheet.getRange(1,1,sheet.getLastRow(),sheet.getLastColumn()).getValues();
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
}