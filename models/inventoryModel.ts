import { Model, models, model } from "mongoose";
import { Document, Schema } from "mongoose";
import { EWasteInventory_Base } from "@/types/EWasteInventory";



interface InventoryDocument extends EWasteInventory_Base, Document {

}

interface Methods {

}

const inventorySchema = new Schema<InventoryDocument, {}, Methods>({
    name: {type: String, required: true},
    description: {type: String, required: true},
    condition: {type: String, required: true},
    type: {type: String, required: true},
    source: {type: String, required: true},
    receivedDate: {type: Date, required: true},
    acceptedPerson: {type: String, required: true},
    enteredBy: {type: String, required: true},
    failureReason: [{type: String, required: true}],
},{timestamps: true});

const InventoryModel = models.Inventory || model("Inventory", inventorySchema);
export default InventoryModel as Model<InventoryDocument, {}, Methods>;