/// <reference path="./Away.ts" />
/// <reference path="./Duties.ts" />
/// <reference path="./Helper.ts" />
/// <reference path="./Members.ts" />

//globals
const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
const dutySetups: DutySetup[] = readArrayFromSheet('Duty Setup') as unknown as DutySetup[];
const awayDates: AwayDate[] = readAwayDates();
const members: Member[] = readMembers();
const constraintSetups: ConstraintSetup[] = readArrayFromSheet('Constraint Setup') as unknown as ConstraintSetup[];
let duties: Duty[] = readArrayFromSheet('Duties') as unknown as Duty[];
let dutyConstraints: DutyConstraint[] = readArrayFromSheet('Duty Constraint') as unknown as DutyConstraint[];

function insertDuties() {
  clearDuties();
  populateDuties(dutySetups);
  writeArrayToSheet(duties, 'Duties');
}

function insertAwayDates() {
  writeArrayToSheet(readAwayDates(), 'Away Date Data');
}

function insertAwayDateContraints() {
  populateConstraintsForAwayDates();
  writeArrayToSheet(dutyConstraints, 'Duty Constraint');
}

//for duties that have already been planned (manually) then update the constraints placed on other duties by the ones that have been planned
function updateDutyConstraints() {
  Logger.clear();

  duties.filter(duty => duty.Member != '').forEach(duty => {
    updateConstraintsForDuty(duty);
  });

  writeArrayToSheet(dutyConstraints, 'Duty Constraint');
}

function updateCandidatesForDuties2() {
  updateCandidatesForDuties();
  writeArrayToSheet(duties, 'Duties');
}

function calculatePlan() {
  planDuties();
  writeArrayToSheet(dutyConstraints, 'Duty Constraint');
  writeArrayToSheet(duties, 'Duties');
}

function awayDateSummary() {
  throw 'Not implemented';
  // awayDateArray = readArrayFromSheet('Away Date Data');
  // writeAwayDateSummary();
}
