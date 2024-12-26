import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useRecipe } from "@/features/recipe/hooks/use-recipe";
import { Order } from "@/types/order";
import { OrderAccordionItem } from "./order-accordion-item";

interface OrderAccordionProps {
    order: Order;
}

export const OrderAccordion = ({ order }: OrderAccordionProps) => {

    return (
        <Accordion type="single" collapsible className="focus:outline-none">
            {order.items.map((item: any, index: number) => (
                <OrderAccordionItem index={index} key={index} order_item={item} />
            ))}
        </Accordion>
    )
}