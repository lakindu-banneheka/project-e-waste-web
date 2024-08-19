import React from "react";
import { TableCell, TableRow } from "../ui/table";
import { Skeleton } from "../ui/skeleton";




export const tableLoadingAnimation = ({noOfCols, noOfRows}: {noOfCols: number, noOfRows: number}) => {
    return (
        <>
            {
                Array(noOfRows).fill(null).map((_, index) => (
                    <TableRow 
                        key={index}
                    >
                        {Array(noOfCols).fill(null).map((_, index1) => (
                            <TableCell
                                key={index1}
                            >
                                <Skeleton className="h-6 w-full" />
                            </TableCell>
                        ))}
                    </TableRow>
                ))
            }
        </>
    );
} 