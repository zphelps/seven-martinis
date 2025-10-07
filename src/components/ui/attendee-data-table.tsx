"use client";

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import {createClient} from "@/utils/supabase/client";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface Attendee {
    id: number;
    name: string;
    phoneNumber: string | null;
    guestNum: number | null;
    eventDate: string | null; // stored as YYYY-MM-DD
}

export function AttendeesDataTable() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [attendees, setAttendees] = useState<Attendee[]>([]);
    const [dates, setDates] = useState<string[]>([]);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // Table column definitions
    const columns: ColumnDef<Attendee>[] = [
        {
            accessorKey: "name",
            header: "Name",
            cell: ({ row }: { row: { original: Attendee } }) => (
                <div className="font-medium text-neutral-900 dark:text-neutral-100">
                    {row.original.name}
                </div>
            ),
        },
        {
            accessorKey: "guestNum",
            header: "Party Size",
            cell: ({ row }: { row: { original: Attendee } }) => (
                <div className="text-neutral-700 dark:text-neutral-300">
                    {row.original.guestNum ?? "-"}
                </div>
            ),
        },
        {
            accessorKey: "phoneNumber",
            header: "Phone Number",
            cell: ({ row }: { row: { original: Attendee } }) => (
                <div className="text-neutral-700 dark:text-neutral-300">
                    {row.original.phoneNumber ?? "-"}
                </div>
            ),
        },
    ];

    const table = useReactTable({
        data: attendees,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    // --- Fetch all unique event dates ---
    useEffect(() => {
        const fetchDates = async () => {
            type DateRow = { eventDate: string | null };
            const { data, error } = await createClient()
                .from("attendees")
                .select("eventDate")
                .order("eventDate", { ascending: true });

            if (!error && data) {
                const uniqueDates = Array.from(
                    new Set(data.map((row: DateRow) => row.eventDate))
                ).filter(Boolean) as string[];
                setDates(uniqueDates);
            }
            // console.log(data)
        };

        fetchDates();
    }, []);

    // --- Fetch attendees for selected date ---
    useEffect(() => {
        const fetchAttendees = async () => {
            setLoading(true);

            let query = createClient()
                .from("attendees")
                .select("id, name, phoneNumber, guestNum, eventDate")
                .order("name", { ascending: true });

            if (selectedDate) {
                query = query.eq("eventDate", selectedDate);
            }

            const { data, error } = await query;

            if (error) {
                console.error("Error fetching attendees:", error);
                setAttendees([]);
            } else {
                setAttendees((data as Attendee[]) || []);
            }

            setLoading(false);
        };

        fetchAttendees();
    }, [selectedDate]);

    console.log(dates)
    // --- UI ---
    return (
        <div className="flex flex-col rounded-lg border w-full h-full mr-2 shadow bg-white dark:bg-neutral-950">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-4 py-3">
                <h2 className="font-semibold text-lg text-neutral-800 dark:text-neutral-100">
                    Attendees
                </h2>

                <div className="flex items-center space-x-2">
                    <Select
                        value={selectedDate ?? ""}
                        onValueChange={(value) =>
                            setSelectedDate(value === "all" ? null : value)
                        }
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue
                                placeholder={
                                    selectedDate ? selectedDate : "All Dates"
                                }
                            />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Dates</SelectItem>
                            {dates.map((date) => (
                                <SelectItem key={date} value={date}>
                                    {new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
                                        month: "long",
                                        day: "numeric",
                                        year: "numeric",
                                        timeZone: "America/New_York",
                                    })}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <Separator />

            {/* Table */}
            {loading ? (
                <div className="flex justify-center items-center py-10 text-neutral-500">
                    <Loader2 className="animate-spin mr-2 h-4 w-4" /> Loading attendees...
                </div>
            ) : (
                <Table wrapperClassName="overflow-y-auto h-full">
                    <TableHeader className="sticky top-0 bg-gray-50 dark:bg-neutral-900">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No attendees found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            )}
        </div>
    );
}
