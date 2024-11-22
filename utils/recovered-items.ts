import { ItemCharacteristicsMap } from "@/types/recovered-items";

interface InputProps {
    type: string; 
    characteristics: ItemCharacteristicsMap[keyof ItemCharacteristicsMap];
    // characteristics: Record<string, string | number>;

}

export const generateSummary = ({type,characteristics}: InputProps): string => {
    const details = Object.entries(characteristics)
        .map(([key, value]) => `${key}: ${value}`)
        .join(", ");

    const fullSummary = `${details}`;

    // If the full summary exceeds 100 characters, truncate it
    if (fullSummary.length > 100) {
        return `${fullSummary.slice(0, 97)}...`; // Add "..." to indicate truncation
    }

    return fullSummary;
};