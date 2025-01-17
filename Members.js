function getNoOfMembers() {
  return memberArray.length;
}

function getMemberCodeFromName(firstName, surname) {    
  var member = memberArray.filter(memberArrayFilter(firstName,surname));
  if (member.length === 0) {
    throw 'Cannot find ' + firstName + ' ' + surname;
  }
  return member[0][0];
}

function memberArrayFilter(firstName,surname) {
  return function(element) {
    if ((element[1] == firstName) && (element[2] == surname))
    {
      return true;
    }
    else
    {
      return false;
    }
  }
}

function populateMemberDutyArray() {
  var sheet = spreadsheet.getSheetByName('Members');
  var sheetArray = sheet.getRange(1,1,sheet.getLastRow(),sheet.getLastColumn()).getValues();
  
  for (var i = 0; i < getNoOfMembers(); i++) {    
    for (var j = 0; j < getNoOfDutiesSetup(); j++) {
      if (sheetArray[i + 1][j + 6] == 'Yes') {
        //member code, duty code, number of instances
        memberDutyArray.push([sheetArray[i + 1][0],sheetArray[0][j + 6],getDutiesByMemberAndDutyCode(sheetArray[i + 1][0],sheetArray[0][j + 6]).length]);
      }
    }
  }  
}

function memberDoesDuty(memberCode, dutyCode) {
  var filteredMemberDutyArray = memberDutyArray.filter(filterMemberDutiesByMemberAndDutyCode(memberCode, dutyCode));
  return filteredMemberDutyArray.length > 0;
}

function filterMemberDutiesByMemberAndDutyCode(memberCode, dutyCode) {
  return function(element) {
    if ((element[0] == memberCode) && (element[1] == dutyCode)) {
      return true;
    }
    else {
      return false;
    }
  }
}

function getDutiesByMemberAndDutyCode(memberCode,dutyCode) {
  return dutyArray.filter(filterDutiesByMemberAndDutyCode(memberCode,dutyCode));
}

function filterDutiesByMemberAndDutyCode(memberCode,dutyCode) {
  return function(element) {
    if ((element[1] == dutyCode) && (element[4] == memberCode)) {
      return true;
    }
    else {
      return false;
    }
  }
}

function getDutiesByMemberCode(memberCode) {
  return memberDutyArray.filter(memberDutyFilter(memberCode));
}

function memberDutyFilter(memberCode) {
  return function(element) {
    if (element[0] == memberCode) {
      return true;
    }
    else {
      return false;
    }
  }
}

function getMembersByDutyCode(dutyCode) {
  return memberDutyArray.filter(memberByDutyCodeFilter(dutyCode));
}

function memberByDutyCodeFilter(dutyCode) {
  return function(element) {
    if (element[1] == dutyCode) {
      return true;
    }
    else {
      return false;
    }
  }
}

function getIndexOfMemberDuty(memberCode,dutyCode) {
  for (var i = 0; i < memberDutyArray.length; i++) {
    if ((memberDutyArray[i][0] == memberCode) && (memberDutyArray[i][1] == dutyCode)) {
      return i;
    }
  }
  
  Logger.log(['No member duty code found: ',memberCode,dutyCode]);
  return -1;
}