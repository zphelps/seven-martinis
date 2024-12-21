import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Order } from "@/types/order";

interface OrderDialogProps {
    children: React.ReactNode;
    order: Order;
}
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

export default function OrderDialog({ children, order }: OrderDialogProps) {

    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{order.customer_name}</DialogTitle>
                </DialogHeader>

                <Accordion type="single" collapsible className="focus:outline-none">
                    {order.items.map((item: any, index: number) => (
                        <AccordionItem key={index} value={index.toString()}>
                            <AccordionTrigger>
                                <p>{item.quantity}x {item.name} (#{item.drink_number})</p>
                            </AccordionTrigger>
                            <AccordionContent>
                                <p className="whitespace-pre-wrap">{item.recipe}</p>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </DialogContent>
        </Dialog>
    )
}