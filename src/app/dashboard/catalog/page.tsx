"use client"

import { Checkbox } from "@/components/ui/checkbox"
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import React, { useState } from "react";
import {Check, ChevronsUpDown, Ellipsis} from "lucide-react";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";

const drinks = [
    {
        drinkID: "8",
        name: "The DWB",
        ingredients: "Testing.",
    },
    {
        drinkID: "9",
        name: "The DWB",
        ingredients: "Testing.",
    },
]

const ingredients = [
    {
        value: "1",
        label: "Whiskey",
    },
    {
        value: "2",
        label: "Vodka",
    },
    {
        value: "3",
        label: "Tequila",
    },
]

export default function Catalog() {

    const [masterSelection, setMasterSelection] = useState<{ [key: string]: boolean }>({});
    const [isMasterChecked, setIsMasterChecked] = useState(false);
    const [selectedNum, setSelectedNum] = useState(0);

    const handleDrinkCheckChange = (drinkID: string, isChecked: boolean) => {
        setMasterSelection((prev) => {
            const updatedSelection = { ...prev, [drinkID]: isChecked };
            const selectedCount = Object.values(updatedSelection).filter((value) => value).length;
            setSelectedNum(selectedCount); // Update the selected count
            setIsMasterChecked(selectedCount === drinks.length); // Sync master checkbox
            return updatedSelection;
        });
    };
    const handleMasterCheckChange = (isChecked: boolean) => {
        setIsMasterChecked(isChecked); // Update master checkbox state

        if(isChecked==true){
            setSelectedNum(drinks.length);
        }
        if(isChecked==false){
            setSelectedNum(0);
        }

        setMasterSelection(() => {
            const updatedSelection: { [key: string]: boolean } = {}; // Explicitly type the object
            for (const drink of drinks) {
                updatedSelection[drink.drinkID] = isChecked;
            }
            return updatedSelection;
        });
    };


    return (
        <Table className={"container mt-10 !border border-gray-300 rounded-lg overflow-hidden"}>
            <TableHeader className={""}>
                <TableRow>
                    <TableHead className=""><Checkbox
                        checked={isMasterChecked}
                        onCheckedChange={(isChecked => handleMasterCheckChange(isChecked as boolean))}
                    /></TableHead>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ingredients</TableHead>
                    <TableHead></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {drinks.map((drink) => {
                    const isSelected = masterSelection[drink.drinkID];
                    return (
                        <TableRow key={drink.drinkID}
                                  className={`${isSelected ? '!bg-muted' : ''} transition-colors`}>
                            <TableCell><Checkbox
                                className={""}
                                checked={masterSelection[drink.drinkID]}
                                onCheckedChange={(isChecked) => handleDrinkCheckChange(drink.drinkID, isChecked as boolean)}
                            /></TableCell>
                            <TableCell className="font-medium">{drink.drinkID}</TableCell>
                            <TableCell>{drink.name}</TableCell>
                            <TableCell>{drink.ingredients}</TableCell>
                            <TableCell>
                                <Sheet>
                                    <SheetTrigger>
                                        <Ellipsis
                                            size={20}
                                        />
                                    </SheetTrigger>
                                    <SheetContent className={"z-50"}>
                                        <SheetHeader>
                                            <SheetTitle>Edit {drink.name}</SheetTitle>
                                            <SheetDescription>
                                                Make changes to your drink here. Click save when complete.
                                            </SheetDescription>
                                        </SheetHeader>
                                        <div className="grid gap-4 py-4">
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="name" className="text-right">
                                                    Name
                                                </Label>
                                                <Input id="name" value={drink.name} className="col-span-3"/>
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="id" className="text-right">
                                                    ID
                                                </Label>
                                                <Input id="id" value={drink.drinkID} className="col-span-3"/>
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="Ingredient" className="text-right">
                                                    Ingredient
                                                </Label>
                                                {/*<Input id="ingredientValue" value="0.5 FlOz" className="col-span-1"/>*/}
                                                <IngredientDropdown/>
                                            </div>
                                            {/*<div className="grid grid-cols-4 items-center gap-4">*/}
                                            {/*    <Label htmlFor="ingredient" className="text-right">*/}
                                            {/*        Ingredients*/}
                                            {/*    </Label>*/}
                                            {/*    <div className={""}>*/}
                                            {/*        <Input id="ingredientNum" value="0.5 fOz" className="col-span-3"/>*/}
                                            {/*        /!*<IngredientDropdown/>*!/*/}
                                            {/*    </div>*/}
                                            {/*</div>*/}
                                        </div>
                                        <SheetFooter>
                                            <SheetClose asChild>
                                                <Button type="submit">Save changes</Button>
                                            </SheetClose>
                                        </SheetFooter>
                                    </SheetContent>
                                </Sheet>
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
            <TableFooter>
                <TableRow>
                    <TableCell className={"text-sm text-muted-foreground"} colSpan={5}>{selectedNum} of {drinks.length} drink(s) selected.</TableCell>
                </TableRow>
            </TableFooter>
        </Table>

    )
}

export function IngredientDropdown() {
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState("")

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                >
                    {value
                        ? ingredients.find((ingredient) => ingredient.value === value)?.label
                        : "Select ingredient..."}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Search framework..." />
                    <CommandList>
                        <CommandEmpty>No framework found.</CommandEmpty>
                        <CommandGroup>
                            {ingredients.map((ingredient) => (
                                <CommandItem
                                    key={ingredient.value}
                                    value={ingredient.value}
                                    onSelect={(currentValue) => {
                                        setValue(currentValue === value ? "" : currentValue)
                                        setOpen(false)
                                    }}
                                >
                                    {ingredient.label}
                                    <Check
                                        className={cn(
                                            "ml-auto",
                                            value === ingredient.value ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}