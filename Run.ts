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
  awayDates = readTypeFromSheet<AwayDate>('Away Date Data');
}

function insertDuties() {
  readSheets();
  duties = [];
  createDuties(dutySetups);
  writeArrayToSheet(duties, 'Duties');
}

function insertAwayDates() {
  readSheets();
  writeArrayToSheet(readAwayDates(), 'Away Date Data');
}

function insertAwayDateContraints() {
  readSheets();
  createConstraintsForAwayDates();
  writeArrayToSheet(dutyConstraints, 'Duty Constraint', false);
}

//for duties that have already been planned (manually) then update the constraints placed on other duties by the ones that have been planned
function updateDutyConstraints() {
  readSheets();
  duties.filter(duty => duty.Member !== '').forEach(duty => {
    updateConstraintsForDuty(duty);
  });

  writeArrayToSheet(dutyConstraints, 'Duty Constraint', false);
}

function updateCandidatesForAllDuties() {
  readSheets();
  updateCandidatesForDuties();
  writeArrayToSheet(duties, 'Duties', false);
}

function calculatePlan() {
  planDuties();
  writeArrayToSheet(dutyConstraints, 'Duty Constraint');
  writeArrayToSheet(duties, 'Duties', false);
}

function awayDateSummary() {
  throw 'Not implemented';
  // awayDateArray = readArrayFromSheet('Away Date Data');
  // writeAwayDateSummary();
}
