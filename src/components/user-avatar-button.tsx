import { User } from "lucide-react";
import { Button } from "./ui/button";

import { useState } from "react";
import { DropdownMenu, DropdownMenuItem, DropdownMenuContent, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";

export default function UserAvatarButton() {

    const { user, signOut } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleLogout = () => {
        // Add your logout logic here
        console.log("User logged out");
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button size="icon" className="bg-white bg-opacity-10 hover:bg-white hover:bg-opacity-20 rounded-md" onClick={() => setDropdownOpen(!dropdownOpen)}>
                    <User className="w-4 h-4 text-gray-300" />
                </Button>
            </DropdownMenuTrigger>
            {dropdownOpen && (
                <DropdownMenuContent>
                    <DropdownMenuItem onClick={handleLogout}>
                        Log Out
                    </DropdownMenuItem>
                </DropdownMenuContent>
            )}
        </DropdownMenu>
    );
}