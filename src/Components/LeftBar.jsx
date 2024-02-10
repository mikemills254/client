/* eslint-disable react/jsx-key */
import Logo from '../assets/logo.png'
import { BsPatchExclamation } from "react-icons/bs";
import { TbMessage2Bolt } from "react-icons/tb";
import { VscAccount } from "react-icons/vsc";
import { IoIosNotificationsOutline } from "react-icons/io";
import { Link } from 'react-router-dom';
export default function SideBar() {
    return (
        <div className='w-[12%] bg-[#83dfff] flex flex-col items-center h-screen shadow-md gap-10'>
            <img
                src={Logo}
                alt='logo'
                className='w-[6rem] m-5'
            />
            <nav className='nav-container flex flex-col h-full w-full items-center justify-between'>
                <ul className="flex flex-col w-full items-center justify-center gap-2">
                    {
                        [
                            ["Messages", <BsPatchExclamation size={20} color='#0e315d' /> , "/dashboard"],
                            ["Urgent", <TbMessage2Bolt size={20} color='#0e315d' />, "/urgent_messages"],
                            ["Inbox", <IoIosNotificationsOutline size={25} color='#0e315d' />, "/your_inbox"]
                        ].map(([title, icon, to], index) => (
                            <Link key={index} to={to} className='links flex flex-row items-center gap-2 px-5 py-3 w-full cursor-pointer'>
                                {icon}
                                <p className='font-semibold text- text-[#0e315d]'>{title}</p>
                            </Link>
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
