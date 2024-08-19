'use server'

import startDb from "@/lib/db";
import InventoryModel from "@/models/inventoryModel";
import { EWasteInventory_Base } from "@/types/EWasteInventory";

export interface CreateInventoryItem extends EWasteInventory_Base {

}

export interface Res_InventoryItem extends EWasteInventory_Base {
    _id: string;
}

export const createNewInventoryItem = async ({inventoryItem}: {inventoryItem: CreateInventoryItem}) => {
    await startDb();

    const newItem = await InventoryModel.create({...inventoryItem});
    console.log(newItem)
    return JSON.stringify(newItem._id);
};

export const getAllInventoryItems = async (): Promise<Res_InventoryItem[]> => {
    await startDb();
    const res: Res_InventoryItem[] = await InventoryModel.find({}).lean();
    const inventoryItems = res.map(item => ({
        ...item,
        _id: item._id.toString(),
    }));
    return inventoryItems as Res_InventoryItem[];
}

export const getInventoryItemById = async ({id}: {id:String}) => {
    await startDb();
    
    const item = await InventoryModel.findById(id);
    return item;
}

