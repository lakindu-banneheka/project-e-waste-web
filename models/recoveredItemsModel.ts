// RecoveredItems Schema
import { Schema, model, models, Model, Document } from "mongoose";
import { InventoryAction, ItemType, Status } from "@/types/recovered-items";
import { RecoveryLogs } from "@/types/recovered-items";
import { v4 as uuidv4 } from 'uuid';

// Interface for the RecoveredItems document
interface RecoveredItemsDocument extends Document {
    type: ItemType; // Item type based on enum
    description: string; // Description of the item
    count: number; // Quantity of items
    characteristics: Record<string, any>; // Characteristics object (flexible type based on item type)
    recoveryLogs: RecoveryLogs[]; // Array of recovery logs
    status: Status;
}

// Schema for recovery logs
const RecoveryLogsSchema = new Schema<RecoveryLogs>({
    id: { 
        type: String, 
        default: () => uuidv4() // Auto-generate a UUID
    },
    inventoryAction: { type: String, enum: InventoryAction, required: true },
    approvedBy: {type: String, required: false},
    recoveredBy: {type: String, required: true},
    ewaste_unit_id: { type: String, required: true },
    recovered_date: { type: Date, required: true },
    no_of_items: { type: Number, required: true },
    status: {type: String, enum: Status, default: Status.PENDING}
    // failure_reasons: { type: [String], default: [] }, // Array of failure reason IDs
});

// Schema for recovered items
const RecoveredItemsSchema = new Schema<RecoveredItemsDocument>(
    {
        type: { type: String, enum: Object.values(ItemType), required: true }, // Enum validation
        description: { type: String, required: true },
        count: { type: Number, required: true, default: 1 },
        characteristics: { type: Schema.Types.Mixed, required: true }, // Flexible type for characteristics
        recoveryLogs: { type: [RecoveryLogsSchema], default: [] }, // Array of recovery logs
        status: {type: String, enum: Status, default: Status.PENDING}
    },
    { timestamps: true }
);

// Export the model
const RecoveredItemsModel =
    models.RecoveredItems || model<RecoveredItemsDocument>("RecoveredItems", RecoveredItemsSchema);

export default RecoveredItemsModel as Model<RecoveredItemsDocument>;
