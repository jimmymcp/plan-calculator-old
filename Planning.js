function updateCandidatesForDuties() {
  for (var i = 0; i < dutyArray.length; i++) {
    if (dutyArray[i][4] == '') {
      updateConstraintsForDuty(i);
      updateCandidatesForDuty(dutyArray[i][0],i);
    }
  }    
}

function updateCandidatesForDuty(dutyNo,index) {
  if (index == -1) {
    index = getIndexOfDutyNo(dutyNo);
  }
                                 
  var candidates = getCandidatesForDuty(dutyNo);
  dutyArray[index][5] = candidates.toString();
  dutyArray[index][6] = candidates.length;
}

function memberCanDoDuty(memberCode,dutyNo) {
  var dutyConstraints = getDutyConstraintByMemberAndDutyNo(memberCode,dutyNo);
  if (dutyConstraints.length > 0) {
    return false;
  }
  else {
    return true;
  }
}

function getCandidatesForDuty(dutyNo) {
  var duty = getDutyByDutyNo(dutyNo);
  var dutyMembers = getMembersByDutyCode(duty[0][1]);
  var candidates = [];
  for (var i = 0; i < dutyMembers.length; i++) {
    if (memberCanDoDuty(dutyMembers[i][0],dutyNo)) {
      candidates.push(dutyMembers[i][0]);
    }
  }
  return candidates;
}

function readDutyConstraintArray() {
  var sheet = spreadsheet.getSheetByName('Duty Constraint');
  dutyConstraintArray = sheet.getRange(1,1,sheet.getLastRow(),sheet.getLastColumn()).getValues();  
}

function getDutyConstraintByMemberAndDutyNo(memberCode,dutyNo) {
  return dutyConstraintArray.filter(dutyConstraintByMemberAndDutyNoFilter(memberCode,dutyNo));
}

function dutyConstraintByMemberAndDutyNoFilter(memberCode,dutyNo) {
  return function(element) {
    if ((element[0] == dutyNo) && (element[1] == memberCode)) {
      return true;
    }
    else {
      return false;
    }
  }
}

function getIndexOfMostConstrainedDuty() {
  //find the duty with the fewest candidates (but more than 0)
  var fewestCandidates = 999999;
  var index = -1;
  for (var i = 0; i < dutyArray.length; i++) {
    if ((dutyArray[i][4] == '') && (dutyArray[i][6] < fewestCandidates) && (dutyArray[i][6] > 0)) {
      fewestCandidates = dutyArray[i][6];
      index = i;
    }
  }
  
  return index;
}

function planDuties() {
  var dutiesToPlan = 25;  
  var dutiesPlanned = 0;
  var index = getIndexOfMostConstrainedDuty()
  while ((index > -1) && (dutiesPlanned < dutiesToPlan)) {
    planDuty(index);
    index = getIndexOfMostConstrainedDuty()
    dutiesPlanned++;
  }
}

function planDuty(dutyIndex) {
  var candidates = dutyArray[dutyIndex][5].split(',');
  
  var fewestInstances = 999999;
  var fewestInstancesCandidatesIndex = -1;
  var fewestInstancesMemberDutyIndex = -1;
  var memberDutyIndex = -1;
  
  //which of the candidates is doing this duty the fewset number of times?
  for (var i = 0; i < candidates.length; i++) {
    memberDutyIndex = getIndexOfMemberDuty(candidates[i],dutyArray[dutyIndex][1]);
    if (memberDutyArray[memberDutyIndex][2] < fewestInstances) {
      fewestInstancesCandidatesIndex = i;
      fewestInstancesMemberDutyIndex = memberDutyIndex;
      fewestInstances = memberDutyArray[memberDutyIndex][2];
    }
  }
  
  dutyArray[dutyIndex][4] = candidates[fewestInstancesCandidatesIndex];
  memberDutyArray[fewestInstancesMemberDutyIndex][2] += 1;
  
  Logger.log(dutyArray[dutyIndex]);
  
  updateConstraintsForDuty(dutyIndex);
}

function updateConstraintsForDuty(dutyIndex) {
  Logger.log(`Update contraints for duty ${dutyIndex} ${dutyArray[dutyIndex]}`);
  var constraintsForDuty = getConstraintSetupForMemberAndDuty(dutyArray[dutyIndex][4],dutyArray[dutyIndex][1]);
  for (var i = 0; i < constraintsForDuty.length; i++) {
    Logger.log('  Processing duty constraint ' + constraintsForDuty[i])
    var startDate = addDaysToDate(constraintsForDuty[i][6] * -1,dutyArray[dutyIndex][3]);
    var endDate = addDaysToDate(constraintsForDuty[i][6],dutyArray[dutyIndex][3]);
    var constrainedDuties = getDutiesByDutyFilterAndDateRange(constraintsForDuty[i][5],startDate,endDate);
    for (var j = 0; j < constrainedDuties.length; j++) {
      if (constrainedDuties[j][0] != dutyIndex) {
        //only add constraints for duties that the member actually does
        if (memberDoesDuty(dutyArray[dutyIndex][4], constrainedDuties[j][1])) {
          dutyConstraintArray.push([constrainedDuties[j][0],dutyArray[dutyIndex][4],constraintsForDuty[i][1],dutyIndex,dutyArray[dutyIndex][1],dutyArray[dutyIndex][3]]);
          Logger.log(`    Adding constraint ${constrainedDuties[j][0]} ${dutyArray[dutyIndex][4]} ${constraintsForDuty[i][1]} ${dutyIndex,dutyArray[dutyIndex][1]} ${dutyArray[dutyIndex][3]}`);
          updateCandidatesForDuty(constrainedDuties[j][0],-1);
        }
      }
    }
  }
}
  
function getConstraintSetupForMemberAndDuty(memberCode,dutyCode) {
  return constraintSetupArray.filter(dutyConstraintSetupFilter(memberCode,dutyCode));
}

function dutyConstraintSetupFilter(memberCode,dutyCode) {
  return function(element) {
    //has a member been set?
    if (dutyCode == '') {
      return false;
    }
    
    //does this constraint apply to this member?
    if (element[2] == 'Specific Member') {
      if (element[3] != memberCode) {
        return false;
      }
    }
    
    //does this constraint apply to this duty?
    if (!dutyMatchesDutyFilter(dutyCode,element[4])) {
      return false;
    }
    
    return true;
  }
}