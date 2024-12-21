import MenuItem from "./menu-item";


export default function MenuList({ menuItems }: { menuItems: any[] }) {
    return (
        <div className="p-2 grid grid-cols-1 md:grid-cols-2 gap-2 lg:grid-cols-3">
            {menuItems.map((item) => (
                <MenuItem key={item.id} item={item} />
            ))}
        </div>
    )
}