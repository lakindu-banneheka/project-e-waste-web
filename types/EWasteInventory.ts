import { failureReason } from "./failure-reason";

export enum EWasteInventoryCondition {
    REPARABLE = "reparable", 
    NON_REPARABLE = "non-reparable"
};

export enum EWasteInventoryType {
    DOMESTIC = "DOMESTIC",
    OFFICE = "OFFICE",
    AUTOMOBILE = "AUTOMOBILE",
    INDUSTRIAL = "INDUSTRIAL",
    MEDICAL = "MEDICAL"
}

export interface EWasteInventory_Base {
    name: string;
    description: string;
    condition: EWasteInventoryCondition;
    type: EWasteInventoryType;
    source: string;
    receivedDate: Date;
    acceptedPerson: string;
    enteredBy: string;
    failureReason: string[]; // Fail reason id[]
};

export interface EWasteInventory extends EWasteInventory_Base {
    _id: string;
}

// Id
// Name: 
// Description: 
// condition: [ reparable, Non-reparable ]
// Source:
// Type: [DOMESTIC, OFFICE, AUTOMOBILE, INDUSTRIAL, MEDICAL] 
// Received date: 
// Timestamp : { created date&time, update date&time }
// Accepted person: <userID []>
// Entered By: <user ID>
// Failure reason: <falier_reasonID[]> 
