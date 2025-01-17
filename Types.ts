type Member = {
    Code: string,
    FirstName: string,
    LastName: string,
    Duties: DutySetup[]
}

enum ConstraintMemberType {
    SpecificMember,
    Anyone
}

type ConstraintSetup = {
    EntryNo: number,
    Description: Text,
    MemberType: ConstraintMemberType,
    MemberCode: string,
    WhenDoingDuty: string,
    ConstrainedMember: string,
    ConstrainedDuty: string,
    ConstraintPeriodInDays: number
}

enum DayOfWeek {
    Sunday = 0,
    Monday = 1,
    Tuesday = 2,
    Wednesday = 3,
    Thursday = 4,
    Friday = 5,
    Saturday = 6
}

type DutySetup = {
    Code: string,
    Description: string,
    Recurring: Boolean,
    RecurringDay: string
}

type Duty = {
    DutyNo: number,
    DutyCode: string,
    Description: string,
    Date: Date,
    Member: string,
    Candidates: string,
    NoOfCandidates: number
}

enum AwayType {
    '',
    'Away',
    'Rather Not'
}

type AwayDate = {
    Date: Date,
    Member: string,
    AwayType: AwayType
}

type DutyConstraint = {
    DutyNo: number,
    DutyCode: string,
    Date: Date
    MemberCode: string,
    Reason: string,
}