/* eslint-disable react/jsx-key */
import Logo from '../assets/logo.png'
import { BsPatchExclamation } from "react-icons/bs";
import { TbMessage2Bolt } from "react-icons/tb";
import { VscAccount } from "react-icons/vsc";
import { IoIosNotificationsOutline } from "react-icons/io";
export default function SideBar() {
    return (
        <div className='w-[12%] bg-[#d6f2ff] flex flex-col items-center h-screen shadow-md gap-10'>
            <img
                src={Logo}
                alt='logo'
                className='w-[6rem] m-5'
            />
            <nav className='nav-container flex flex-col h-full w-full items-center justify-between'>
                <ul className="flex flex-col w-full items-center justify-center gap-2">
                    {
                        [
                            ["Messages", <BsPatchExclamation size={20} color='#0e315d' />],
                            ["Urgent", <TbMessage2Bolt size={20} color='#0e315d' />],
                            ["Inbox", <IoIosNotificationsOutline size={25} color='#0e315d' />]
                        ].map(([title, icon], index) => (
                            <li key={index} className='links flex flex-row items-center gap-2 px-5 py-3 w-full cursor-pointer'>
                                {icon}
                                <p className='font-semibold text- text-[#0e315d]'>{title}</p>
                            </li>
                        ))
                    }
                </ul>
                <ul className="flex flex-col w-full items-center justify-center gap-2">
                    <li className='links flex flex-row items-center gap-2 px-5 py-3 w-full cursor-pointer'>
                        <VscAccount/>
                        Account
                    </li>
                </ul>
            </nav>
        </div>
    )
}
