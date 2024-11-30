
export default function MenuItem({ item }: { item: any }) {
    return (
        <div>
            <h3>{item.name}</h3>
            <p>{item.description}</p>
        </div>
    )
}