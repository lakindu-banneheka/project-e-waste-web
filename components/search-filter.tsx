import React, { useEffect } from "react";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { CalendarIcon, ChevronDown, FilterIcon } from "lucide-react";
import { Table } from "@tanstack/react-table";
import { Input } from "./ui/input";
// import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
// import { Form, FormControl } from "./ui/form";
// import { Calendar } from "./ui/calendar";
// import { format } from 'date-fns';
// import { z } from "zod";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { FormFieldSimpleDatePicker } from "./forms/form-field-datepicker";
// import { formatDate } from "@/utils/dateUtils";


interface SearchFilterComponentProps<T> {
    table: Table<T>;
}

// const FormSchema = z.object({
//     receivedDate: z.date(),
// });
// type FormSchemaType = z.infer<typeof FormSchema>;

export const SearchFilterComponent = <T,>({ table }: SearchFilterComponentProps<T>) => {
    // const form = useForm<z.infer<typeof FormSchema>>({
    //     resolver: zodResolver(FormSchema),
    //     defaultValues: {
    //         receivedDate: new Date(),
    //     },
    // });

    const [activeFilter, setActiveFilter] = React.useState('name');
    const [filterBy, setFilterBy] = React.useState(
        table.getAllColumns()
            .filter(col => col.id !== 'select' ) // Filter out the 'select' column
            .filter(col => col.id !== 'actions' )
            .filter(col => col.id !== 'receivedDate' )
            .map(col => 
                (col.id === activeFilter
                    ? { name: col.id, status: true }
                    : { name: col.id, status: false }
                )
            )
    );
    const [searchText, setSearchText] = React.useState<string>("");
    // const [selectedDate, setSelectedDate] = React.useState<string>(formatDate(form.getValues().receivedDate));

    // useEffect(() => {
    //     // console.log(form.getValues().receivedDate);
    //     // if(activeFilter == 'receivedDate'){
    //         setSearchText(formatDate(form.getValues().receivedDate))
    //     // }
    // },[form.getValues().receivedDate, activeFilter])

    React.useEffect(() => {
        filterBy.forEach(col => {
            if (col.status) {
                let valueToSet = searchText.toLowerCase();
                // if (col.name === 'receivedDate' && form.getValues().receivedDate) {
                //     valueToSet = selectedDate;
                // }
                table.getColumn(col.name)?.setFilterValue(valueToSet);
            }
        });
    }, [searchText, filterBy, table, ]);
    

    return (
        <div className="flex space-x-4" >
            {/* { activeFilter == 'receivedDate'
                ? <>
                <Form {...form}>
                    <FormFieldSimpleDatePicker<FormSchemaType>
                        control={form.control}
                        name="receivedDate"
                        // label="Received Date"
                    /> 
                </Form>
                
                </>

                :<Input
                    placeholder="Search..."
                    value={searchText}
                    onChange={(event) =>
                    setSearchText(event.target.value)
                    }
                    className="max-w-sm"
                />
            } */}

            <Input
                placeholder="Search..."
                value={searchText}
                onChange={(event) =>
                setSearchText(event.target.value)
                }
                className="max-w-sm"
            />
            
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="ml-auto">
                        <FilterIcon /> <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    {filterBy.map(column => (
                        <DropdownMenuCheckboxItem
                            key={column.name}
                            className="capitalize"
                            checked={column.status}
                            onCheckedChange={(value) => {
                                setFilterBy(
                                    filterBy.map(col =>
                                        col.name === column.name
                                            ? { ...col, status: true }
                                            : { ...col, status: false }
                                    )
                                )
                                setActiveFilter(column.name);
                            }}
                        >
                            {column.name}
                        </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};
