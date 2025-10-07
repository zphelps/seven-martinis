
export default function InquiriesAddressedPage() {
    return (
        <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-8">
            <div className="max-w-3xl w-full space-y-12">
                {/* Page Heading */}
                <h1 className="text-center text-4xl font-bold font-cormorant tracking-wide">
                    Inquiries Addressed
                </h1>

                {/* FAQ Items */}
                <div className="space-y-8">
                    <FAQ
                        question="How does one gain entry to Seven Martinis?"
                        answer="Entrance is by invitation only, through a concealed passage on the lower level of the Phelps Residence. Those in the know will find their way — seek where the wood whispers and the panels part."
                    />

                    <FAQ
                        question="What is the attire?"
                        answer="Cocktail attire is common, but certainly not required. We have seen suits and denim at the same table, both enjoying a second round."
                    />

                    <FAQ
                        question="What time does the evening conclude?"
                        answer="Seven Martinis does not observe the dreadful modern practice of 'last call.' The bar remains open so long as bodies remain inside — dead or alive."
                    />

                    <FAQ
                        question="Is photography permitted?"
                        answer="Discretion is always advised. A snapshot or two may be indulged, but remember: the best moments live in memory and in the telling of the story."
                    />

                    <FAQ
                        question="May I bring a guest?"
                        answer="Your invitation admits you, and should you wish to bring company, ensure their name is whispered in advance. Secrets are best kept, but never sloppily shared."
                    />
                </div>
            </div>
        </div>
    )
}

function FAQ({ question, answer }: { question: string; answer: string }) {
    return (
        <div className="text-left">
            <h2 className="font-cormorant text-xl font-bold mb-2">
                {question}
            </h2>
            <p className="font-cormorant text-neutral-700 leading-relaxed text-med">{answer}</p>
        </div>
    )
}
