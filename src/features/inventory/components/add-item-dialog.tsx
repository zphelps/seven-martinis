import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage
} from "@/components/ui/form"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import { InventoryItem } from "./columns"
import { AddInventoryItemProps } from "../hooks/use-inventory"
import { Loader2 } from "lucide-react"
const formSchema = z.object({
    name: z.string().nonempty("Name is required"),
    type: z.string().nonempty("Type is required"),
    stock: z.string().nonempty("Stock level is required"),
    image: z.any().optional(),
})

type FormValues = z.infer<typeof formSchema>

type AddItemDialogProps = {
    addInventoryItem: (item: AddInventoryItemProps) => Promise<InventoryItem>
    children: React.ReactNode
}

export default function AddItemDialog({ addInventoryItem, children }: AddItemDialogProps) {
    const [open, setOpen] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            type: "",
            stock: "",
        },
    })
    const router = useRouter()

    async function onSubmit(values: FormValues) {
        try {
            setSubmitting(true)

            const newItem: AddInventoryItemProps = {
                name: values.name,
                type: values.type,
                stock: values.stock,
                image: values.image?.[0] || null,
            }

            const item = await addInventoryItem(newItem)

            form.reset()
            setOpen(false)
            router.push(`/dashboard/inventory?id=${item.id}`)
        } catch (error) {
            console.error(error)
            toast({
                title: "Error",
                description: "Failed to create item",
                variant: "destructive",
            })
        } finally {
            setSubmitting(false)
            toast({
                title: "Item Created",
                description: "The item has been successfully added to the inventory.",
                variant: "default",
            })
        }
    }

    const {
        handleSubmit,
        control,
        setValue,
        formState: { errors },
    } = form

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Item</DialogTitle>
                    <DialogDescription>
                        Add an item to the inventory.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Item Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Ex: Vodka... or Gin..."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={control}
                            name="type"
                            render={() => (
                                <FormItem>
                                    <FormLabel>Type</FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={(value: string) => setValue("type", value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="garnish" className="hover:bg-gray-100">Garnish</SelectItem>
                                                <SelectItem value="liquor" className="hover:bg-gray-100">Liquor</SelectItem>
                                                <SelectItem value="liqueur" className="hover:bg-gray-100">Liqueur</SelectItem>
                                                <SelectItem value="bitters" className="hover:bg-gray-100">Bitters</SelectItem>
                                                <SelectItem value="juice" className="hover:bg-gray-100">Juice</SelectItem>
                                                <SelectItem value="syrup" className="hover:bg-gray-100">Syrup</SelectItem>
                                                <SelectItem value="fruit" className="hover:bg-gray-100">Fruit</SelectItem>
                                                <SelectItem value="other" className="hover:bg-gray-100">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    {errors.type && <FormMessage>{errors.type.message}</FormMessage>}
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={control}
                            name="stock"
                            render={() => (
                                <FormItem>
                                    <FormLabel>Stock Level</FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={(value: string) => setValue("stock", value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select stock level" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="full" className="hover:bg-gray-100">Full</SelectItem>
                                                <SelectItem value="low" className="hover:bg-gray-100">Low</SelectItem>
                                                <SelectItem value="out" className="hover:bg-gray-100">Out</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    {errors.stock && (
                                        <FormMessage>{errors.stock.message}</FormMessage>
                                    )}
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={control}
                            name="image"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Item Image</FormLabel>
                                    <FormControl>
                                        <Input
                                            id="image"
                                            type="file"
                                            accept="image/*"
                                            onChange={(event) => {
                                                field.onChange(event.target.files)
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" disabled={submitting}>
                            {submitting ? <Loader2 className="animate-spin" /> : "Add Item"}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
