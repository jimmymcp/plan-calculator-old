/// <reference path="./Helper.ts" />
/// <reference path="./Members.ts" />
/// <reference path="./Run.ts" />

function readAwayDates(): AwayDate[] {
  let awayDates: AwayDate[] = [];
  let awayDateArray: any[] = readArrayFromSheet('Away Dates');
  const sheet = spreadsheet.getSheetByName('Away Dates');
  if (!sheet) {
    return awayDates;
  }

  for (let column = 1; column < sheet.getLastColumn(); column++) {
    if (awayDateArray[1][column] != '') {
      let member = getMemberFromName(awayDateArray[0][column], awayDateArray[1][column]);
      for (let row = 2; row < sheet.getLastRow(); row++) {
        if (awayDateArray[row][column] != '') {
          const awayDate = new Date(awayDateArray[row][0]);
          awayDates.push({ Member: member.Code, Date: awayDate, AwayType: awayDateArray[row][column] });
        }
      }

    }
  }

  return awayDates;
}

function createConstraintsForAwayDates() {
  //loop through the away dates and create contrainsts for each duty that that member does
  awayDates.forEach(awayDate => {
    //foreach duty that the member who is away does insert a constraint
    const member = members.filter(member => member.Code === awayDate.Member)[0];
    member.Duties.forEach(memberDuty => {
      const dutiesToConstrain = duties.filter(duty => duty.DutyCode === memberDuty.Code && duty.Date.getFullYear() === awayDate.Date.getFullYear() && duty.Date.getMonth() === awayDate.Date.getMonth() && duty.Date.getDate() === awayDate.Date.getDate());
      dutiesToConstrain.forEach(dutyToConstrain => {
        dutyConstraints.push({
          DutyNo: dutyToConstrain.DutyNo,
          DutyCode: dutyToConstrain.DutyCode,
          Date: dutyToConstrain.Date,
          MemberCode: member.Code,
          Reason: awayDate.AwayType.toString()
        })
      });
    });
  });
}

// function writeDutyConstraint(dutyNo, memberCode, reason) {
//   var sheet = spreadsheet.getSheetByName('Duty Constraint');
//   sheet.appendRow([dutyNo, memberCode, reason]);
// }

// function writeAwayDateSummary() {
//   var sheet = spreadsheet.getSheetByName('Away Date Summary');

//   sheet.clear();

//   var startDate = getFirstGivenDayOfWeekAfterDate(0, getStartDate()); //0 = Sunday
//   var endDate = getEndDate();

//   var awayDateSummaryArray = [];

//   while (startDate <= endDate) {
//     sheet.appendRow([startDate, getAwayDateSummaryForDate(startDate)]);
//     startDate = addDaysToDate(7, startDate);
//   }

//   writeArrayToSheet(awayDateSummaryArray, 'Away Date Summary');
// }

// function getAwayDateSummaryForDate(date) {
//   var awayDatesOnDate = getAwayDatesByDate(date);
//   var summary = '';
//   for (var i = 0; i < awayDatesOnDate.length; i++) {
//     summary += ',' + awayDatesOnDate[i][0];
//   }

//   if (summary.length > 0) {
//     return summary.substr(1, summary.length - 1);
//   }
//   else {
//     return '';
//   }
// }

// function getAwayDatesByDate(date) {
//   return awayDateArray.filter(awayDatesByDateFilter(date));
// }

// function awayDatesByDateFilter(date) {
//   return function (element) {
//     if ((element[1].getTime() == date.getTime()) && element[2] == 'Away') {
//       return true;
//     }
//     else {
//       return false;
//     }
//   }
// }