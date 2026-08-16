import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { Switch } from "@/components/ui/switch"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import { Tag } from "@/types/order"
import { AddTagProps } from "../hooks/use-tags"
import { Loader2 } from "lucide-react"
import { FeaturedStylePicker } from "./featured-style-picker"

const formSchema = z.object({
    name: z.string().nonempty("Name is required"),
    is_featured: z.boolean().default(false),
    image: z.any().optional(),
    theme: z.string().default("winter"),
    icon: z.string().nullable().default(null),
    tagline: z.string().nullable().default(null),
})

type FormValues = z.infer<typeof formSchema>

type AddTagDialogProps = {
    addTag: (tag: AddTagProps) => Promise<Tag>
    children: React.ReactNode
}

export default function AddTagDialog({ addTag, children }: AddTagDialogProps) {
    const [open, setOpen] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            is_featured: false,
            theme: "winter",
            icon: null,
            tagline: null,
        },
    })
    const router = useRouter()

    async function onSubmit(values: FormValues) {
        try {
            setSubmitting(true)

            const newTag: AddTagProps = {
                name: values.name,
                is_featured: values.is_featured,
                image: values.image?.[0] || null,
                theme: values.theme,
                icon: values.icon,
                tagline: values.tagline,
            }

            const tag = await addTag(newTag)

            form.reset()
            setOpen(false)
            router.push(`/dashboard/tags?id=${tag.id}`)
            toast({
                title: "Tag Created",
                description: "The tag has been successfully added.",
                variant: "default",
            })
        } catch (error) {
            console.error(error)
            toast({
                title: "Error",
                description: "Failed to create tag",
                variant: "destructive",
            })
        } finally {
            setSubmitting(false)
        }
    }

    const {
        handleSubmit,
        control,
        watch,
        setValue,
    } = form

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Tag</DialogTitle>
                    <DialogDescription>
                        Create a new tag drinks can be labeled with.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tag Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Ex: Winter... or Bourbon..."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={control}
                            name="image"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tag Image</FormLabel>
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

                        <FormField
                            control={control}
                            name="is_featured"
                            render={() => (
                                <FormItem className="flex items-center justify-between rounded-md border p-3">
                                    <div>
                                        <FormLabel>Featured</FormLabel>
                                        <p className="text-xs text-gray-500">
                                            Drinks with this tag get a highlighted section on the menu.
                                        </p>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={watch("is_featured")}
                                            onCheckedChange={(checked) => setValue("is_featured", checked)}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        {watch("is_featured") && (
                            <FeaturedStylePicker
                                theme={watch("theme")}
                                icon={watch("icon")}
                                tagline={watch("tagline")}
                                onThemeChange={(theme) => setValue("theme", theme)}
                                onIconChange={(icon) => setValue("icon", icon)}
                                onTaglineChange={(tagline) => setValue("tagline", tagline)}
                            />
                        )}

                        <Button type="submit" disabled={submitting}>
                            {submitting ? <Loader2 className="animate-spin" /> : "Add Tag"}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
