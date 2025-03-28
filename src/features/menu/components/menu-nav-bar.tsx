import { DialogPanel } from "@headlessui/react";
import { Dialog } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import { CreditCard, PlusIcon, MartiniIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

const navigation = [
    { name: 'Order', href: '#' },
    { name: 'Full Menu', href: '#' },
]

export default function MenuNavBar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [tab, setTab] = useState<string | undefined>(undefined);
    const searchParams = useSearchParams();
    const router = useRouter();

    const handleTabChange = (tab: string) => {
        setTab(tab);
        router.push(`/menu?tab=${tab}`);
    }

    useEffect(() => {
        const tab = searchParams.get('tab') || "menu";
        setTab(tab);
    }, [searchParams]);

    return (
        <header className="bg-gray-200 sticky top-0 z-10">
            <nav aria-label="Global" className="mx-auto flex items-center justify-between max-w-7xl px-2.5">
                <div className="flex justify-center p-3 lg:mb-0">
                    <a href="#" className="">
                        <span className="sr-only">Seven Martinis</span>
                        <img alt="" src="7MPrimaryCropped.png"
                            className="h-12 max-w-fit" />
                    </a>
                </div>
                <div className="flex items-center gap-4">
                    <Tabs value={tab} className="w-full max-w-sm">
                        <TabsList className="grid w-full grid-cols-2 bg-gray-200">
                            <TabsTrigger
                                value="menu"
                                onClick={() => handleTabChange('menu')}
                                className="data-[state=active]:bg-white data-[state=active]:text-primary"
                            >
                                Menu
                            </TabsTrigger>
                            <TabsTrigger
                                value="orders"
                                onClick={() => handleTabChange('orders')}
                                className="data-[state=active]:bg-white data-[state=active]:text-primary"
                            >
                                Orders
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                    <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                        onClick={() => window.open('https://venmo.com/caylan-fields', '_blank')}
                    >
                        <CreditCard className="h-4 w-4" />
                        Tip
                    </Button>
                </div>
            </nav>
        </header>
    )
}