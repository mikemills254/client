/* eslint-disable react/prop-types */
import { BsCheck2All } from "react-icons/bs";

export default function Notification({ sender, date, containerStyles, onAcceptClicked}) {

    return (
        <div className={`${containerStyles} notification border-[1px] border-[#085ec5] min-h-[5rem] max-h-[8rem] p-2 rounded-md flex flex-row items-center justify-between shadow-sm cursor-pointer`}>
            <section className="h-full items-center justify-center flex p-2">
                <div className="w-12 h-12 rounded-full bg-[#b5eaff] text-[#085ec5] font-bold text-md uppercase flex items-center justify-center">
                    <p>CQ</p>
                </div>
            </section>
            <section className="w-full h-full flex flex-col">
                <p className="font-semibold text-md text-[#085ec5]">{sender}</p>
                <p className="text-sm">{date}</p>
                <small>12:30pm</small>
            </section>
            <section className="p-1 h-full flex items-center">
                <button type="button" onClick={onAcceptClicked} className="flex flex-row items-center justify-center gap-2 border-[1px] bg-[#068fff] text-white p-1 px-2 rounded-md font-sm">
                    <BsCheck2All size={20}/>
                    <small>Accept</small>
                </button>
            </section>
        </div>
    );
}
