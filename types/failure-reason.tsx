export interface FailureReason_Base {
    type: [];
    description: string;
    checkedDate: string;
}; 

export interface failureReason extends FailureReason_Base {
    id: string;
};

// Fail_reason
// Id
// Type [  ] // need to final a way to add types
// Description
// Date checked
// Time-stamp
