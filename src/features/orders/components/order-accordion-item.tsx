import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { OrderItem } from "@/types/order";

interface OrderAccordionItemProps {
    index: number;
    order_item: OrderItem;
}

export const OrderAccordionItem = ({ index, order_item }: OrderAccordionItemProps) => {

    return (
        <AccordionItem value={index.toString()}>
            <AccordionTrigger>
                <p className="font-bold text-sm">
                    {order_item.quantity}x {order_item.name}
                </p>
            </AccordionTrigger>
            <AccordionContent>
                <div className="">
                    <p className="font-bold text-sm">Instructions:</p>
                    <p className="text-sm whitespace-pre-wrap">
                        {order_item.instructions}
                    </p>
                </div>
            </AccordionContent>
        </AccordionItem>
    )
}