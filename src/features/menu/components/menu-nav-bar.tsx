import { DialogPanel } from "@headlessui/react";
import { Dialog } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { CreditCard } from "lucide-react";
const navigation = [
    { name: 'Order', href: '#' },
    { name: 'Full Menu', href: '#' },
]

export default function MenuNavBar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="bg-gray-200 shadow-md">
            <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-center p-3 lg:px-8">
                <div className="flex lg:flex-1">
                    <a href="#" className="">
                        <span className="sr-only">Seven Martinis</span>
                        <img alt="" src="7MPrimaryCropped.png"
                            className="h-14 max-w-fit" />
                    </a>
                </div>
                {/* <div className="flex lg:hidden">
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(true)}
                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-[#002143]"
                    >
                        <span className="sr-only">Open main menu</span>
                        <Bars3Icon aria-hidden="true" className="size-6" />
                    </button>
                </div>
                <div className="hidden lg:flex lg:gap-x-12">
                    {navigation.map((item) => (
                        <a key={item.name} href={item.href} className="text-sm/6 font-semibold text-[#002143]">
                            {item.name}
                        </a>
                    ))}
                </div>
                <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                    <a href="#" className="text-sm/6 font-semibold text-[#002143]">
                        Log in <span aria-hidden="true">&rarr;</span>
                    </a>
                </div> */}
            </nav>
            {/* <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
                <div className="fixed inset-0 z-10" />
                <DialogPanel
                    className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-[#d4d4d3] px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                    <div className="flex items-center justify-between">
                        <a href="#" className="-m-1.5 p-1.5">
                            <span className="sr-only">Your Company</span>
                            <img
                                alt=""
                                src="7Mprimary.png"
                                className="h-20 w-auto"
                            />
                        </a>
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(false)}
                            className="-m-2.5 rounded-md p-2.5 text-gray-700"
                        >
                            <span className="sr-only">Close menu</span>
                            <XMarkIcon aria-hidden="true" className="size-6 text-[#002143]" />
                        </button>
                    </div>
                    <div className="mt-6 flow-root">
                        <div className="-my-6 divide-y divide-gray-500/10">
                            <div className="space-y-2 py-6">
                                {navigation.map((item) => (
                                    <a
                                        key={item.name}
                                        href={item.href}
                                        className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-[#002143] hover:bg-gray-50"
                                    >
                                        {item.name}
                                    </a>
                                ))}
                            </div>

                            <div className="py-6">
                                <button
                                    type="button"
                                    className="inline-flex items-center gap-x-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    <CreditCard aria-hidden="true" className="-ml-0.5 size-5" />
                                    Tip Your Bartender
                                </button>
                            </div>
                        </div>
                        <div className="pt-3">
                            <button
                                type="button"
                                className="inline-flex items-center gap-x-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em"
                                    viewBox="0 0 512 512">
                                    <path fill="currentColor"
                                        d="M444.17 32H70.28C49.85 32 32 46.7 32 66.89V441.6c0 20.31 17.85 38.4 38.28 38.4h373.78c20.54 0 35.94-18.2 35.94-38.39V66.89C480.12 46.7 464.6 32 444.17 32M278 387H174.32l-41.57-248.56l90.75-8.62l22 176.87c20.53-33.45 45.88-86 45.88-121.87c0-19.62-3.36-33-8.61-44l82.63-16.72c9.56 15.78 13.86 32 13.86 52.57c-.01 65.5-55.92 150.59-101.26 210.33" />
                                </svg>
                                Tip Your Bartender
                            </button>
                        </div>
                    </div>
                </DialogPanel>
            </Dialog> */}
        </header>
    )
}