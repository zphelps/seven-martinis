import MenuItem from "./menu-item";


export default function MenuList({ menuItems }: { menuItems: any[] }) {
    return (
        <div>
            {menuItems.map((item) => (
                <MenuItem key={item.id} item={item} />
            ))}
        </div>
    )
}