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
      const dutiesToConstrain = duties.filter(duty => duty.DutyCode === memberDuty.Code && datesAreEqual(duty.Date, awayDate.Date));
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

function insertAwayDateSummary() {
  let awayDateSummary: AwayDateSummary[] = [];
  let startDate = getFirstGivenDayOfWeekAfterDate('sunday', getStartDate());
  const endDate = getEndDate();
  while (startDate <= endDate) {
    //get a comma separated list of members who are away on this date
    const membersAway = awayDates.filter(awayDate => datesAreEqual(awayDate.Date, startDate)).map(awayDate => awayDate.Member).join(',');
    awayDateSummary.push({ Date: startDate, Members: membersAway });
    startDate = addDaysToDate(7, startDate)
  }

  writeArrayToSheet(awayDateSummary, 'Away Date Summary', true);
}