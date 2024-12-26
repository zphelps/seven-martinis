import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { useRecipe } from "@/features/recipe/hooks/use-recipe";
import { OrderItem } from "@/types/order";

interface OrderAccordionItemProps {
    index: number;
    order_item: OrderItem;
}

export const OrderAccordionItem = ({ index, order_item }: OrderAccordionItemProps) => {
    const { recipe } = useRecipe({ menu_item_id: order_item.menu_item_id });

    console.log(recipe);

    return (
        <AccordionItem value={index.toString()}>
            <AccordionTrigger>
                <p className="font-bold text-sm">
                    {order_item.quantity}x {order_item.name}
                </p>
            </AccordionTrigger>
            <AccordionContent>
                {recipe && order_item.menu_item_id === recipe.menu_item_id && <div className="flex">
                    <div className="w-1/2 border-r border-gray-200 ">
                        <p className="font-bold text-sm">Ingredients:</p>
                        {recipe?.ingredients.map((ingredient: any) => (
                            <p key={ingredient.id} className="text-sm">
                                {ingredient.quantity}{ingredient.unit} {ingredient.inventory_item.name}
                            </p>
                        ))}
                    </div>
                    <div className="w-1/2 pl-2.5">
                        <p className="font-bold text-sm">Instructions:</p>
                        <p className="text-sm whitespace-pre-wrap">{order_item.instructions}</p>
                    </div>
                </div>}
            </AccordionContent>
        </AccordionItem>
    )
}