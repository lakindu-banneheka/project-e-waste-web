'use server';

import startDb from "@/lib/db";
import RecoveredItemsModel from "@/models/recoveredItemsModel";
import { RecoveredItems, RecoveredItems_BaseType } from "@/types/recovered-items";

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
