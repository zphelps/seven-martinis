"use client"
import React, { useMemo, useState } from "react";
import { useSidebar } from "@/components/ui/sidebar";
import {AttendeesDataTable} from "@/components/ui/attendee-data-table";


export default function Dashboard() {

    const { open, toggleSidebar } = useSidebar();
    return (
        <div className="container-lg mx-0 mb-2.5 space-y-4">
            <AttendeesDataTable/>
        </div >
    );
}

