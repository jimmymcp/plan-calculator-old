/// <reference path="./Helper.ts" />
/// <reference path="./Run.ts" />

let dutyNo: number = 0;

function clearDuties() {
  const sheet = spreadsheet.getSheetByName('Duties');
  sheet!.clear();
}

function createDuties(dutySetups: DutySetup[]) {
  var sheet = spreadsheet.getSheetByName('Duties');
  if (!sheet) {
    return;
  }

  dutySetups.forEach(dutySetup => {
    if (dutySetup.Recurring) {
      populateRecurringDuty(dutySetup);
    }
  });

  duties = duties.sort((a, b) => a.DutyNo - b.DutyNo);
}

function populateRecurringDuty(dutySetup: DutySetup) {
  let dutyDate = getFirstGivenDayOfWeekAfterDate(dutySetup.RecurringDay, getStartDate());
  const endDate = getEndDate();

  while (dutyDate <= endDate) {
    dutyNo++;
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
