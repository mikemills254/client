/* eslint-disable react-refresh/only-export-components */
import Notification from './Notification'
import { CiCalendar } from "react-icons/ci";
import {useState, useEffect} from 'react';
import Input from './Input';
import { CiSearch } from "react-icons/ci";

export const getDate = () => {
    const date = new Date();

    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const dayOfWeek = daysOfWeek[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];

    return `${dayOfWeek}, ${day} ${month}`;
}
  

export default function CenterBar() {
    const [ isDate, setDate ] = useState('')

    useEffect(() => {
        const date = getDate()
        setDate(date)
    }, [isDate])
    
    return (
        <div className='w-full h-full flex flex-col'>
            <div className='top-center flex flex-row items-center w-full h-12 shadow-lg px-3 justify-between'>
                
                <Input
                    ContainerStyles={"w-[30rem] h-10"}
                    IconBefore={CiSearch} 
                    placeholder={"search here"}
                    IconStyleBefore={"text-xl"}
                />
                <div className="today flex flex-row items-center gap-2 border-[1px] rounded-md px-3 py-1">
                    <CiCalendar/>
                    <small>{isDate}</small>
                </div>

            </div>
            <div className='content-container h-full overflow-y-auto no-scrollbar p-3 flex flex-col gap-3'>
            <Notification/>
            <Notification/>
            <Notification/>
            <Notification/>
            <Notification/>
            <Notification/>
            <Notification/>
            <Notification/>
            <Notification/>
            <Notification/>
            <Notification/>
            <Notification/>
            <Notification/>
            <Notification/>
            <Notification/>
            <Notification/>
            <Notification/>
            <Notification/>
            <Notification/> 
            </div>
            
        </div>
    )
}
