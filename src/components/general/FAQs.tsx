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
                <span className="text-5xl" style={{fontFamily:'Harlow'}} >Redeeming a Hotel & Spa Resorts Voucher FAQ</span>
            </div>
            <Accordion type="single" collapsible className="w-full mx-auto">
                <AccordionItem value="q1">
                    <AccordionTrigger>What is your refund policy?</AccordionTrigger>
                    <AccordionContent>
                    We offer a full refund up to 7 days before your stay begins.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="q2">
                    <AccordionTrigger>Do you offer group discounts?</AccordionTrigger>
                    <AccordionContent>
                    Yes, we provide discounts for bookings of 5 rooms or more.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="q3">
                    <AccordionTrigger>Can I change my booking later?</AccordionTrigger>
                    <AccordionContent>
                    Changes can be made up to 48 hours before your scheduled arrival.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="q1">
                    <AccordionTrigger>What is your refund policy?</AccordionTrigger>
                    <AccordionContent>
                    We offer a full refund up to 7 days before your stay begins.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="q2">
                    <AccordionTrigger>Do you offer group discounts?</AccordionTrigger>
                    <AccordionContent>
                    Yes, we provide discounts for bookings of 5 rooms or more.
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )
}