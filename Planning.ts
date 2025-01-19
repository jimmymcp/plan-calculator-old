/// <reference path="./Duties.ts" />
/// <reference path="./Helper.ts" />
/// <reference path="./Members.ts" />
/// <reference path="./Run.ts" />

function updateCandidatesForDuties() {
  duties.filter(duty => duty.Member === '').forEach(duty => {
    updateCandidatesForDuty(duty);
  });
}

function updateCandidatesForDuty(duty: Duty) {
  let candidates: Member[] = getCandidatesForDuty(duty);
  duty.Candidates = candidates.map(candidate => candidate.Code).join(',');
  duty.NoOfCandidates = candidates.length;
}

function getCandidatesForDuty(duty: Duty): Member[] {
  let candidates: Member[] = [];
  //find members that can do this duty
  getMembersByDuty(duty).forEach(member => {
    //if there isn't a reason that the member can't do the duty then add them to the list of candidates
    if (dutyConstraints.filter(dutyConstraint => {
      return dutyConstraint.MemberCode === member.Code && dutyConstraint.DutyNo === duty.DutyNo;
    }).length === 0) {
      candidates.push(member);
    }
  });

  return candidates;
}

function getMostConstrainedDuty(): Duty | undefined {
  //find the duty with the fewest candidates (but more than 0)
  const sortedDuties = duties.filter(duty => duty.NoOfCandidates > 0).sort((a, b) => a.NoOfCandidates - b.NoOfCandidates);
  if (sortedDuties.length > 0) {
    return sortedDuties[0];
  }
  else {
    return undefined;
  }
}

function planDuties() {
  const dutiesToPlan = 25;
  let dutiesPlanned = 0;
  let duty = getMostConstrainedDuty();
  while (duty && dutiesPlanned < dutiesToPlan) {
    planDuty(duty);
    dutiesPlanned++;
    duty = getMostConstrainedDuty();
  }
}

function planDuty(duty: Duty) {
  const candidates: Member[] = getCandidatesForDuty(duty);

  //find the candidate which is already doing this duty the fewest times
  const sortedCandidates = candidates.sort((a, b) => {
    return duties.filter(duty => duty.Member === a.Code).length - duties.filter(duty => duty.Member === b.Code).length;
  });

  duty.Member = sortedCandidates[0].Code;
  Logger.log(`Planned duty ${duty.DutyNo} ${duty.DutyCode} for ${duty.Member}`);

  updateConstraintsForDuty(duty);
}

//now that a duty has been planned, update the constraints which apply to other duties
//i.e. which candidates can not do duties now that this duty has been planned
function updateConstraintsForDuty(duty: Duty) {
  Logger.log(`Update contraints for duty ${duty.DutyNo} ${duty.DutyCode}`);

  //find duty constraints that apply to this duty
  const constraintSetupsForDuty = getConstraintSetupForDuty(duty);
  constraintSetupsForDuty.forEach(constraintSetupForDuty => {
    const constrainstStartDate = addDaysToDate(constraintSetupForDuty.ConstraintPeriodInDays * -1, duty.Date);
    const constrainstEndDate = addDaysToDate(constraintSetupForDuty.ConstraintPeriodInDays, duty.Date);

    //find the other duties that are constrained by this duty
    duties.filter(duty => {
      if (!dutyMatchesDutyFilter(duty.DutyCode, constraintSetupForDuty.ConstrainedDuty)) {
        return false;
      }

      return (duty.Date >= constrainstStartDate && duty.Date <= constrainstEndDate);
    }).forEach(constrainedDuty => {
      //find the member that is constrained by this duty (it may not be the same person doing the duty)
      const constrainedMember = constraintSetupForDuty.ConstrainedMember !== '' ? constraintSetupForDuty.ConstrainedMember : duty.Member;

      //only add the constraint if it doesn't already exist
      if (dutyConstraints.filter(dutyConstraint => {
        return dutyConstraint.DutyNo === constrainedDuty.DutyNo && dutyConstraint.MemberCode === constrainedMember;
      }).length > 0) {
        return;
      }

      //only add the constraint if the constrained member is a candidate for the duty
      if (getCandidatesForDuty(constrainedDuty).filter(candidate => candidate.Code === constrainedMember).length === 0) {
        return;
      }

      dutyConstraints.push({
        DutyNo: constrainedDuty.DutyNo,
        DutyCode: constrainedDuty.DutyCode,
        Date: constrainedDuty.Date,
        MemberCode: constrainedMember,
        Reason: `${duty.Member} ${duty.Description} on ${duty.Date.toLocaleDateString()}`
      });
      updateCandidatesForDuty(constrainedDuty);
    });
  });
}

function getConstraintSetupForDuty(duty: Duty): ConstraintSetup[] {
  return constraintSetups.filter(dutyConstraint => {
    //if this constraint applies to a specific member then check that the duty is for that member
    if (dutyConstraint.MemberType == ConstraintMemberType.SpecificMember) {
      if (dutyConstraint.MemberCode != duty.Member) {
        return false;
      }
    }

    //does the duty code on the constrainst match the duty that is being planned?
    if (!dutyMatchesDutyFilter(duty.DutyCode, dutyConstraint.WhenDoingDuty)) {
      return false;
    }

    return true;
  });
}
