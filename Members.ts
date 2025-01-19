/// <reference path="./Helper.ts" />
/// <reference path="./Run.ts" />

function getNoOfMembers() {
  return members.length;
}

function readMembers(): Member[] {
  let members: Member[] = [];

  const memberArray: any[] = readArrayFromSheet('Members');
  memberArray.forEach((row, index) => {
    if (index === 0) {
      return; //column headers, we need them later for the duty codes
    }

    //duties start at column G (zero-based 6)
    let memberDuties: DutySetup[] = [];
    for (let column = 6; column < row.length; column++) {
      if (row[column] === 'Yes') {
        let filteredDuties: DutySetup[] = dutySetups.filter(duty => {
          return duty.Code == memberArray[0][column]
        });
        if (filteredDuties.length > 0) {
          memberDuties.push(filteredDuties[0]);
        }
      }
    }

    let member: Member = {
      Code: row[0],
      FirstName: row[1],
      LastName: row[2],
      Duties: memberDuties
    }
    members.push(member);
  });

  return members
}

function getMemberFromName(firstName: string, surname: string): Member {
  const filteredMembers = members.filter(member => {
    return member.FirstName === firstName && member.LastName === surname;
  });

  if (filteredMembers.length === 0) {
    throw `Cannot find ${firstName} ${surname}`;
  }
  return filteredMembers[0];
}

function getMembersByDuty(duty: Duty): Member[] {
  return members.filter(member => {
    return member.Duties.filter(memberDuty => memberDuty.Code === duty.DutyCode).length > 0;
  });
}