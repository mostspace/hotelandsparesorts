import { Button } from "./ui/button"
import { Input } from "./ui/input"

export const Footer = () => {

    const footerLinks = [
        {title:'DEALS', options:[
            {title:"Overnight Breaks",link:""},
            {title:"Day Packages",link:""},
            {title:"Spa Treatments",link:""}
        ]},
        {title:'VOUCHERS', options:[
            {title:"Shop Spa Vouchers",link:""},
            {title:"How it Works",link:""},
            {title:"Where can I Redeem?",link:""},
            {title:"Verify a Voucher",link:""},
            {title:"Terms & Conditions",link:""},
        ]},
        {title:'FIND A SPA', options:[
            {title:"Spas in Dublin",link:""},
            {title:"Spas in Cork",link:""},
            {title:"Spas in Galway",link:""},
            {title:"Spas in Limerick",link:""},
            {title:"Spa Hotels",link:""},
            {title:"Welness Retreats",link:""},
        ]},
        {title:'PARTNERS', options:[
            {title:"Partner Login",link:""},
            {title:"Become a Partner",link:""},
        ]},
        {title:'ABOUT US', options:[
            {title:"Contact Us",link:""},
            {title:"Insider Tips",link:""},
            {title:"Cookies & Privacy Policy",link:""},
        ]}

    ]



    const displayLinks = () => {

        var compArray:any = []

        footerLinks.forEach(section => {
            
            let secTitle = section.title
            let secOptions = section.options

            var subArray:any = []
            secOptions.forEach(option => {
                subArray.push(<span className="font-normal text-xl hover:text-muted cursor-pointer">{option.title}</span>)
            });

            compArray.push(<div className="flex flex-col gap-5 items-start">
                <span className="font-normal text-[32px]">{secTitle}</span>
                <div className="flex flex-col gap-3 items-start">
                    {subArray}
                </div>
            </div>)
        });

        console.log("COMA", compArray)

        return compArray
    }


    return <div className="w-full flex flex-col">
        <div className="w-full px-[120px] py-[90px] bg-muted">

            <div className="w-full flex flex-row item-end justify-between">
                
                <div className="flex flex-col gap-3 items-start max-w-[638px]">
                    <span className="text-5xl font-normal">WIN a stylish break every month worth more than €250!</span>
                    <span className="text-xl font-normal">Be the first to know about our latest deals, offers & competitions.
                    Winners will be announced on our Instagram page monthly.</span>
                </div>

                <div className="flex flex-col max-w-[638px] gap-3">
                    <div className="w-full flex flex-row gap-5 items-center">
                        <Input placeholder="Your Email Address" className="text-lg text-accent font-medium placeholder:text-lg placeholder:text-accent placeholder:font-medium"/>
                        <Button className="h-[65px] w-[209px] bg-accent text-lg font-bold">SIGN UP</Button>
                    </div>

                    <div>By signing up you are agreeing to receive our newsletter bi-monthly. Learn more
                    about how hotelandspavouchers.ie collects and uses <span className="font-bold cursor-pointer">your data.</span></div>
                </div>
            </div>

        </div>


        <div className="w-full px-[120px] py-[90px] bg-[#774D46] flex flex-col gap-10 items-start">
            
            <div className="w-full flex flex-row item-start gap-[140px] text-light">
                {displayLinks()}
            </div>

            <div className="w-full h-px bg-accent"/>

            <div className="flex flex-row gap-5">
                <div className="w-[92px] h-[92px] rounded-full bg-accent p-[16px] cursor-pointer hover:bg-accent/70">
                    <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60" fill="none">
                        <path d="M29.8414 17.6719C22.434 17.6719 16.2964 23.7036 16.2964 31.2168C16.2964 38.7301 22.3281 44.7618 29.8414 44.7618C37.3546 44.7618 43.3863 38.6243 43.3863 31.2168C43.3863 23.8094 37.2488 17.6719 29.8414 17.6719ZM29.8414 39.8941C25.0795 39.8941 21.1641 35.9788 21.1641 31.2168C21.1641 26.4549 25.0795 22.5396 29.8414 22.5396C34.6033 22.5396 38.5186 26.4549 38.5186 31.2168C38.5186 35.9788 34.6033 39.8941 29.8414 39.8941Z" fill="white"/>
                        <path d="M43.9155 20.4232C45.6103 20.4232 46.9842 19.0493 46.9842 17.3544C46.9842 15.6596 45.6103 14.2856 43.9155 14.2856C42.2206 14.2856 40.8467 15.6596 40.8467 17.3544C40.8467 19.0493 42.2206 20.4232 43.9155 20.4232Z" fill="white"/>
                        <path d="M51.8519 9.41797C49.1005 6.56083 45.1852 5.07935 40.7408 5.07935H18.9418C9.73547 5.07935 3.5979 11.2169 3.5979 20.4233V42.1164C3.5979 46.6666 5.07938 50.582 8.04234 53.4391C10.8995 56.1905 14.709 57.5661 19.0476 57.5661H40.6349C45.1852 57.5661 48.9947 56.0846 51.746 53.4391C54.6032 50.6878 56.0847 46.7725 56.0847 42.2222V20.4233C56.0847 15.9788 54.6032 12.1693 51.8519 9.41797ZM51.4286 42.2222C51.4286 45.5026 50.2646 48.1481 48.3598 49.9471C46.455 51.746 43.8095 52.6984 40.6349 52.6984H19.0476C15.873 52.6984 13.2275 51.746 11.3228 49.9471C9.41801 48.0423 8.46562 45.3968 8.46562 42.1164V20.4233C8.46562 17.2487 9.41801 14.6032 11.3228 12.6984C13.1217 10.8995 15.873 9.94707 19.0476 9.94707H40.8466C44.0212 9.94707 46.6667 10.8995 48.5714 12.8042C50.3704 14.709 51.4286 17.3545 51.4286 20.4233V42.2222Z" fill="white"/>
                    </svg>
                </div>

                <div className="w-[92px] h-[92px] rounded-full bg-accent p-[16px] cursor-pointer hover:bg-accent/70">
                    <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60" fill="none">
                        <path d="M42.7882 23.0071H34.6972V17.7007C34.6972 15.7078 36.018 15.2432 36.9483 15.2432C37.8765 15.2432 42.658 15.2432 42.658 15.2432V6.48235L34.7946 6.45166C26.0655 6.45166 24.079 12.9858 24.079 17.1673V23.0071H19.0308V32.0347H24.079C24.079 43.6203 24.079 57.5797 24.079 57.5797H34.6972C34.6972 57.5797 34.6972 43.4827 34.6972 32.0347H41.8622L42.7882 23.0071Z" fill="white"/>
                    </svg>
                </div>

                <div className="w-[92px] h-[92px] rounded-full bg-accent p-[16px] cursor-pointer hover:bg-accent/70">
                    <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60" fill="none">
                        <path d="M55.9193 15.9437C54.0027 16.7956 51.94 17.3703 49.7757 17.6275C51.9855 16.3045 53.6799 14.2091 54.4789 11.7093C52.412 12.9359 50.1239 13.8259 47.6865 14.3064C45.736 12.2279 42.9558 10.9282 39.8792 10.9282C33.9727 10.9282 29.1837 15.7172 29.1837 21.6248C29.1837 22.4619 29.2779 23.2779 29.461 24.0621C20.571 23.6155 12.6886 19.3578 7.41279 12.8861C6.49204 14.4652 5.96499 16.3024 5.96499 18.2646C5.96499 21.9751 7.85306 25.2496 10.7233 27.1673C8.97066 27.1112 7.32072 26.6296 5.87821 25.8285C5.87715 25.8729 5.87715 25.9184 5.87715 25.9639C5.87715 31.1455 9.56438 35.4678 14.4581 36.452C13.5606 36.6954 12.6156 36.8267 11.6398 36.8267C10.9497 36.8267 10.2798 36.76 9.62682 36.634C10.9889 40.8832 14.9386 43.9767 19.6185 44.0625C15.9578 46.9316 11.3466 48.6419 6.33435 48.6419C5.47181 48.6419 4.61986 48.5911 3.78271 48.4916C8.51769 51.5279 14.1395 53.2975 20.1794 53.2975C39.8549 53.2975 50.6128 36.9992 50.6128 22.8641C50.6128 22.4005 50.6033 21.938 50.5832 21.4787C52.6723 19.9738 54.4863 18.0889 55.9193 15.9437Z" fill="white"/>
                    </svg>
                </div>

            </div>

        </div>
    </div>
}