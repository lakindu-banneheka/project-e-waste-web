'use server'

import startDb from "@/lib/db";
import InventoryModel from "@/models/inventoryModel";
import { EWasteInventory, EWasteInventory_Base } from "@/types/EWasteInventory";

export interface CreateInventoryItem extends EWasteInventory_Base {

}

export interface Res_InventoryItem extends EWasteInventory {
    
}

export const createNewInventoryItem = async ({inventoryItem}: {inventoryItem: CreateInventoryItem}) => {
    await startDb();

    const newItem = await InventoryModel.create({...inventoryItem});
    return JSON.stringify(newItem._id);
};

export const getAllInventoryItems = async (): Promise<Res_InventoryItem[]> => {
    try {
        await startDb();
        const res: Res_InventoryItem[] = await InventoryModel.find({}).lean();
        const inventoryItems = res.map(item => ({
            ...item,
            _id: item._id.toString(),
        }));
        return inventoryItems as Res_InventoryItem[];
    } catch (error) {
        console.error('Error finding inventory items:', error);
        throw new Error(`Failed to find inventory items`);
    }
    
}

export const getInventoryItemById = async ({id}: {id:String}) => {
    try{
        await startDb();
        const res: Res_InventoryItem | null = await InventoryModel.findById(id).lean();

        if (!res) {
            throw new Error(`Inventory item with ID ${id} not found.`);
        }
        const item = {...res, _id: res?._id.toString()}
        return item;
    } catch (error) {
        console.error('Error finding inventory item:', error);
        throw new Error(`Failed to find inventory item`);
    }
}

export const updateInventoryItemById = async ({ item }: { item: EWasteInventory }) => {
    try {
        await startDb();
        const res = await InventoryModel.findByIdAndUpdate(item._id, { ...item });
        if (!res) {
            throw new Error(`Inventory item with ID ${item._id} not found.`);
        }
        return JSON.stringify(res._id);
    } catch (error) {
        console.error('Error updating inventory item:', error);
        throw new Error(`Failed to update inventory item`);
    }
};

export const deleteInventoryItemById = async ({ id }: { id: string }) => {
    try {
        await startDb();
        const res = await InventoryModel.findByIdAndDelete(id);
        if (!res) {
            throw new Error(`Inventory item with ID ${id} not found.`);
        }
        return JSON.stringify(res._id);
    } catch (error) {
        console.error('Error deleting inventory item:', error);
        throw new Error(`Failed to delete inventory item`);
    }
};