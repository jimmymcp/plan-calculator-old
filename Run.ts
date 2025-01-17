/// <reference path="./Away.ts" />
/// <reference path="./Duties.ts" />
/// <reference path="./Helper.ts" />
/// <reference path="./Members.ts" />

const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
let members: Member[] = [];
let dutySetups: DutySetup[] = [];
let duties: Duty[] = [];
let dutyConstraints: DutyConstraint[] = [];
let awayDates: AwayDate[] = [];
let constraintSetups: ConstraintSetup[] = [];

function readSheets() {
  dutySetups = readTypeFromSheet<DutySetup>('Duty Setup');
  duties = readTypeFromSheet<Duty>('Duties');
  members = readMembers();
  constraintSetups = readTypeFromSheet<ConstraintSetup>('Constraint Setup');
  dutyConstraints = readTypeFromSheet<DutyConstraint>('Duty Constraint');
}

function insertDuties() {
  readSheets();
  duties = [];
  createDuties(dutySetups);
  writeArrayToSheet(duties, 'Duties');
}

function insertAwayDates() {
  writeArrayToSheet(readAwayDates(), 'Away Date Data');
}

function insertAwayDateContraints() {
  awayDates = readAwayDates();
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
