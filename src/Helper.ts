
/// <reference path="./Run.ts" />

function onOpen() {
  initUI();
}

function initUI() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var menuEntries: any = [];
  menuEntries.push({ name: "Insert Duties", functionName: "insertDuties" } as never);
  menuEntries.push({ name: "Insert Away Dates", functionName: "insertAwayDates" } as never);
  menuEntries.push({ name: "Insert Away Date Constraints", functionName: "insertAwayDateContraints" } as never);
  menuEntries.push({ name: "Update Duty Constraints", functionName: "updateDutyConstraints" } as never)
  menuEntries.push({ name: "Update Candidates for Duties", functionName: "updateCandidatesForDuties2" } as never);
  menuEntries.push({ name: "Calculate Plan", functionName: "calculatePlan" } as never);
  menuEntries.push({ name: "Write Away Date Summary", functionName: "awayDateSummary" } as never);
  spreadsheet.addMenu('Plan', menuEntries);
}

function getStartDate(): Date {
  const sheet = spreadsheet.getSheetByName('Options');
  const dateString = sheet!.getRange(1, 2).getValue();
  const startDate = new Date(dateString);
  return startDate;
}

function getEndDate(): Date {
  const sheet = spreadsheet.getSheetByName('Options');
  const dateString = sheet!.getRange(2, 2).getValue();
  const endDate = new Date(dateString);
  return endDate;
}

function getFirstGivenDayOfWeekAfterDate(dayOfWeek: DayOfWeek, date: Date): Date {
  while (date.getDay() != dayOfWeek) {
    date = addDaysToDate(1, date);
  }

  return date;
}

function addDaysToDate(days: number, date: Date): Date {
  let newDate = new Date(date);
  newDate.setTime(newDate.getTime() + 86400000 * days);
  newDate.setTime(newDate.getTime() + 43200000); //add half a day
  newDate.setHours(0); //and set the hour to zero (to account for daylight savings)
  return newDate;
}

function datesAreEqual(date1: Date, date2: Date): boolean {
  if ((date1.getDate() == date2.getDate()) && (date1.getMonth() == date2.getMonth()) && (date1.getFullYear() && date2.getFullYear())) {
    return true;
  }
  else {
    return false;
  }
}

function writeArrayToSheet(dataArray: any[], sheetName: string) {
  const sheet = spreadsheet.getSheetByName(sheetName);
  for (var i = 0; i < dataArray.length; i++) {
    for (var j = 0; j < dataArray[i].length; j++) {
      sheet!.getRange(i + 1, j + 1).setValue(dataArray[i][j]);
    }
  }
}
 
function readArrayFromSheet(sheetName: string): any[][] {
  var sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) {
    return [];
  }

  if (sheet.getLastRow() > 0) {
    return sheet.getRange(1, 1, sheet.getLastRow(), sheet.getLastColumn()).getValues();
  }
  else {
    return [];
  }
}