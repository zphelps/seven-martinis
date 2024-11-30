"use client"

import MenuList from "@/features/menu/components/menu-list";
import useMenu from "@/features/menu/hooks/use-menu";


export default function Menu() {
    const { menuItems, loading, error } = useMenu();

    return (
        <div className="container mx-auto">
            {loading && <div>Loading...</div>}
            {error && <div>{error}</div>}
            {!loading && !error && <MenuList menuItems={menuItems} />}
        </div>
    )
}
