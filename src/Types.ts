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
    Sunday,
    Monday,
    Tuesday,
    Wednesday,
    Thursday,
    Friday,
    Saturday
}

type DutySetup = {
    Code: string,
    Description: string,
    Date: Date,
    Recurring: Boolean,
    RecurringDay: DayOfWeek
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
    MemberCode: string,
    Reason: string
}