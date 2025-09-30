import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion";

export const FAQs = () => {


    return(
        <div className="w-full flex md:flex-row flex-col items-stretch bg-light border border-accent/30">
            <div className="md:w-[413px] w-full bg-muted px-[40px] py-[60px]">
                <span className="text-4xl" style={{fontFamily:'Harlow'}} >Redeeming a Hotel & Spa Resorts Voucher FAQ</span>
            </div>
            <Accordion type="single" collapsible className="w-full mx-auto">
                <AccordionItem value="q1">
                    <AccordionTrigger className="text-xl">I have a Hotel & Spa Resorts gift voucher, how do I redeem it?</AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-2">
                    <p>Hotel & Spa Resorts gift vouchers can be redeemed exclusively through our website, <a className="underline" href="https://www.hotelandsparesorts.com">www.hotelandsparesorts.com</a>, at the time of booking.</p>
                    <p className="mt-2">You can redeem your voucher in two ways:</p>
                    <p><strong>Book a Hotel Stay:</strong> Search for your perfect getaway and select your chosen escape. Enter your voucher code at checkout. If the cost exceeds your voucher value, you can pay the balance securely by card.</p>
                    <p><strong>Book a Package:</strong> Explore our exclusive packages at <a className="underline" href="https://www.hotelandsparesorts.com/packages">www.hotelandsparesorts.com/packages</a> and submit a request form directly from the package listing. Please note that forms are requests only – the property will confirm availability with you and assist in finalising your booking.</p>
                    <p>For additional help, you can ask our AI Concierge anything at the top of this page.</p>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="q2">
                    <AccordionTrigger className="text-xl">Can I present the gift voucher at a hotel at check in or check out?</AccordionTrigger>
                    <AccordionContent>
                    Hotel & Spa Resorts gift vouchers are not designed to be redeemed at check-in or check-out without being declared at the time of booking. To redeem your voucher, it must be applied during the booking process on our website, <a className="underline" href="www.hotelandsparesorts.com">www.hotelandsparesorts.com</a> and not through any direct hotel or third-party sites. If you need assistance with this process, please feel free to ask our AI Concierge anything at the top of this page.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="q3">
                    <AccordionTrigger className="text-xl">My stay costs more than the value of my gift voucher, can I pay the balance with my card?</AccordionTrigger>
                    <AccordionContent>
                    Yes, you can pay the balance with your card. When redeeming your gift voucher on our website, <a className="underline" href="https://www.hotelandsparesorts.com">www.hotelandsparesorts.com</a>, the system will automatically apply the voucher value to your booking. Any remaining balance can then be settled using a credit or debit card during the checkout process.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="q4">
                    <AccordionTrigger className="text-xl">My stay costs less than the value of my gift voucher, will the balance stay on my voucher?</AccordionTrigger>
                    <AccordionContent>
                    Yes. Any remaining balance will stay on your voucher and can be used towards another booking at any time during its five year validity. You can check your current voucher balance at any time in the My Account section of our website by creating an account and entering your voucher code.
                    </AccordionContent>
                </AccordionItem>
                
            </Accordion>
        </div>
    )
}