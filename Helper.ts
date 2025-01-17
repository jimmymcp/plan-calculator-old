
/// <reference path="./Run.ts" />

function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Plan')
    .addItem('Insert Duties', 'insertDuties')
    .addItem('Insert Away Dates', 'insertAwayDates')
    .addItem('Insert Away Date Constraints', 'insertAwayDateContraints')
    .addItem('Update Duty Constraints', 'updateDutyConstraints')
    .addItem('Update Candidates for Duties', 'updateCandidatesForDuties2')
    .addItem('Calculate Plan', 'calculatePlan')
    .addItem('Write Away Date Summary', 'awayDateSummary')
    .addToUi();
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

function getFirstGivenDayOfWeekAfterDate(dayOfWeek: string, date: Date): Date {
  const dayOfWeekEnum = getDayOfWeekFromString(dayOfWeek);
  while (date.getDay() !== dayOfWeekEnum) {
    date = addDaysToDate(1, date);
  }

  return date;
}

function getDayOfWeekFromString(day: string): DayOfWeek | undefined {
  switch (day.toLowerCase()) {
    case 'sunday':
      return DayOfWeek.Sunday;
    case 'monday':
      return DayOfWeek.Monday;
    case 'tuesday':
      return DayOfWeek.Tuesday;
    case 'wednesday':
      return DayOfWeek.Wednesday;
    case 'thursday':
      return DayOfWeek.Thursday;
    case 'friday':
      return DayOfWeek.Friday;
    case 'saturday':
      return DayOfWeek.Saturday;
    default:
      return undefined;
  }
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
  if (!sheet) {
    return;
  }

  sheet.clear();
  const headers = Object.keys(dataArray[0]);
  sheet.appendRow(headers);
  sheet.getRange(1, 1).setFontWeight('bold');
  
  for (var i = 1; i < dataArray.length; i++) {
    const row = headers.map(header => dataArray[i][header]);
    sheet.appendRow(row);
  }
}

function readArrayFromSheet(sheetName: string): any[] {
  Logger.log('Reading sheet: ' + sheetName);
  var sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) {
    return [];
  }

  return sheet.getRange(1, 1, sheet.getLastRow(), sheet.getLastColumn()).getValues();
}

function readTypeFromSheet<T>(sheetName: string): T[] {
  Logger.log('Reading sheet: ' + sheetName);
  var sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) {
    return [];
  }

  let data = sheet.getLastRow() > 0 ? sheet.getRange(1, 1, sheet.getLastRow(), sheet.getLastColumn()).getValues() : [];
  const headers = data.shift();
  return data.map(row => {
    const obj: any = {};
    for (let i = 0; i < row.length; i++) {
      obj[headers![i]] = row[i];
    }
    return obj as T;
  });
}