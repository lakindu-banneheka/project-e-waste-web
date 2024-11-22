'use server';

import startDb from "@/lib/db";
import RecoveredItemsModel from "@/models/recoveredItemsModel";
import { InventoryAction, RecoveredItems, RecoveredItems_BaseType, RecoveryLogs } from "@/types/recovered-items";

// Extend the base type to include additional properties for server logic
export interface NewRecoveredItem extends RecoveredItems_BaseType {};
export interface Res_RecoveredItem extends RecoveredItems {}

// Add a new recovered item
export const addRecoveredItem = async ({ recoveredItemData }: { recoveredItemData: RecoveredItems_BaseType }) => {
    try {
        await startDb();
        const newRecoveredItem: NewRecoveredItem = {
            ...recoveredItemData,
        };
        const newItem = await RecoveredItemsModel.create({ ...newRecoveredItem });
        if (!newItem) {
            throw new Error('Failed to add new recovered item.');
        }
        return JSON.stringify(newItem._id);
    } catch (error) {
        console.error('Failed to add new recovered item: ', error);
    }
};

// Get all recovered items
export const getAllRecoveredItems = async (): Promise<Res_RecoveredItem[] | undefined> => {
    try {
        await startDb();
        const res: Res_RecoveredItem[] = await RecoveredItemsModel.find({}).lean();
        if (!res) {
            throw new Error('Failed to retrieve recovered items.');
        }
        const items = res.map(item => ({
            ...item,
            _id: item._id.toString(),
        }));
        return items as Res_RecoveredItem[];
    } catch (error) {
        console.error('Failed to retrieve recovered items: ', error);
    }
};

// Get a recovered item by ID
export const getRecoveredItemById = async ({ id }: { id: string }) => {
    try {
        await startDb();
        const res: Res_RecoveredItem | null = await RecoveredItemsModel.findById(id).lean();
        if (!res) {
            throw new Error('Failed to find the recovered item by ID.');
        }
        const item = { ...res, _id: res._id.toString() };
        return item as Res_RecoveredItem;
    } catch (error) {
        console.error('Failed to find the recovered item by ID: ', error);
    }
};

// Update a recovered item by ID
export const updateRecoveredItemById = async ({ item }: { item: RecoveredItems }) => {
    try {
        await startDb();
        const res = await RecoveredItemsModel.findByIdAndUpdate(item._id, { ...item, updatedAt: new Date() });
        if (!res) {
            throw new Error('Failed to update the recovered item.');
        }
        return JSON.stringify(res._id);
    } catch (error) {
        console.error('Failed to update the recovered item: ', error);
    }
};

// add new recovery log by Recovered item ID
export const addRecoveryLog = async ({
    recoveredItemId,
    log
}: {
    recoveredItemId: string;
    log: RecoveryLogs;
}) => {
    try {
        await startDb();
        const _data: Res_RecoveredItem | null = await RecoveredItemsModel.findById(recoveredItemId).lean();
        if (!_data) {
            throw new Error('Failed to find the recovered item by ID.');
        }
        const item = { ..._data, _id: _data._id.toString() };
        let count = item.count;

        if(log.inventoryAction === InventoryAction.ReleaseItem && log.no_of_items > item.count){
            throw new Error('Insufficient items.');
        } else if(log.inventoryAction === InventoryAction.ReleaseItem){
            count -= log.no_of_items;
        } else if(log.inventoryAction === InventoryAction.AddItem){
            count += log.no_of_items;
        }

        // Update the logs array by pushing a new log
        const res = await RecoveredItemsModel.findByIdAndUpdate(
            recoveredItemId,
            { 
                $push: { recoveryLogs: log }, // Push the new log into the logs array
                updatedAt: new Date(), // Update the updatedAt field
                count: count // update the count of the items
            },
            { new: true } // Return the updated document
        );

        if (!res) {
            throw new Error('Failed to update the recovered item.');
        }

        return JSON.stringify(res._id); // Return the updated item ID as a string
    } catch (error) {
        console.error('Failed to update the recovered item: ', error);
        throw error; // Re-throw the error for upstream handling
    }
};


// Delete a recovered item by ID
export const deleteRecoveredItemById = async ({ id }: { id: string }) => {
    try {
        await startDb();
        const res = await RecoveredItemsModel.findByIdAndDelete(id);
        if (!res) {
            throw new Error('Failed to delete the recovered item.');
        }
        return JSON.stringify(res._id);
    } catch (error) {
        console.error('Failed to delete the recovered item: ', error);
    }
};
