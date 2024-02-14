/* eslint-disable react/prop-types */
import profile from '../assets/person.jpeg'
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';


export const InboxMessages = ({ name, time, content, handleClick }) => {
    return(
        <div onClick={handleClick} className="agent-profile flex flex-row border-b-[1px] cursor-pointer items-center h-[4rem] w-full gap-2 p-1">
            <div className="image-contain flex flex-col">
                <div className='w-12 h-12 rounded-full'>
                    <img
                        src={profile}
                        alt='profile image'
                        className='w-full h-full rounded-full bg-cover border-[1px] border-[#F12E5E]'
                    />
                </div>
                
            </div>
            <div className='h-full w-full flex flex-col'>
                <div className='flex flex-row items-center justify-between p-1'>
                    <small className='text-md font-bold'>{name}</small>
                    <small className='flex flex-right self-end text-md'>
                        {time}
                    </small>
                </div>
                <small className='px-1 truncate max-w-60'>
                    {content}
                </small>
                
            </div>
        </div>
    )
}



export default function RightBar() {
    const [messages, setMessages]  = useState([]);

    useEffect(() => {
        const getMessages = async () => {
            try {
                const url = "http://localhost:9000/api/v1/message";
                const response = await fetch(url, {
                    method: 'GET'
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setMessages(data.data);
            } catch (error) {
                console.log(error.message);
            }
        };
        getMessages();
    }, []);

    const handleMessageClick = (id) => {
        alert(id)
    }

    return (
        <div className='flex flex-col h-screen w-[40%] shadow-lg no-scrollbar gap-2'>
            <div className='h-16 px-2 flex flex-row items-center justify-between'>
                <p className='text-md font-semibold '>Your messages</p>
                <Link to={'/your_inbox'} className='text-[#083849] text-sm'>See All</Link>
            </div>
            <div className='flex flex-col items-center max-h-[20rem] overflow-y-auto no-scrollbar px-2'>
                {messages.map((item, index) => (
                    item.agent === localStorage.getItem('user') ? (
                        <InboxMessages 
                            key={index} 
                            name={item.username}
                            time={new Date(item.createdAt).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })} 
                            content={item.content}
                            handleClick={() => handleMessageClick(item._id)}
                        />
                    ): (null)
                ))}
            </div>
        </div>
    );
}

