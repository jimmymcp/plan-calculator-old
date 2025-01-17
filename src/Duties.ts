/// <reference path="./Helper.ts" />
/// <reference path="./Run.ts" />

let dutyNo: number = 0;

function clearDuties() {
  const sheet = spreadsheet.getSheetByName('Duties');
  sheet!.clear();
}

function populateDuties(dutySetups: DutySetup[]) {
  var sheet = spreadsheet.getSheetByName('Duties');
  if (!sheet) {
    return;
  }

  sheet.appendRow(['Entry No.', 'Duty Code', 'Description', 'Date', 'Member', 'Candidates', 'No. of Candidates']);
  sheet.getRange(1, 1, 1, sheet.getLastColumn()).setFontWeight('bold');

  dutySetups.forEach(dutySetup => {
    if (dutySetup.Recurring) {
      populateRecurringDuty(dutySetup);
    }
  })
}

function populateRecurringDuty(dutySetup: DutySetup) {
  let dutyDate = getFirstGivenDayOfWeekAfterDate(dutySetup.RecurringDay, getStartDate());
  const endDate = getEndDate();

  dutyNo += 1;

  while (dutyDate <= endDate) {
    duties.push({
      DutyNo: dutyNo,
      DutyCode: dutySetup.Code,
      Description: dutySetup.Description,
      Date: dutyDate,
      Member: '',
      Candidates: '',
      NoOfCandidates: 0
    });
    dutyDate = addDaysToDate(7, dutyDate);
  }
}

// function getDayOfWeekOfDuty(dayName: DayOfWeek) {
//   switch (dayName) {
//     case 'Sunday':
//       return 0;
//     case 'Monday':
//       return 1;
//     case 'Tuesday':
//       return 2;
//     case 'Wednesday':
//       return 3;
//     case 'Thursday':
//       return 4;
//     case 'Friday':
//       return 5;
//     case 'Saturday':
//       return 6;
//   }
// }

function dutyMatchesDutyFilter(dutyCode: string, dutyFilter: string): Boolean {
  if (dutyFilter == '*') {
    return true;
  }
  else if (dutyFilter.substr(dutyFilter.length - 1, 1) == '*') {
    return dutyCode.substring(0, dutyFilter.length - 1) == dutyFilter.substring(0, dutyFilter.length - 1);
  }
  else {
    return dutyCode == dutyFilter;
  }
}
