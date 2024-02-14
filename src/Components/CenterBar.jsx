/* eslint-disable react-refresh/only-export-components */
import Notification from './Notification';
// import { CiCalendar } from "react-icons/ci";
import { useState, useEffect } from 'react';
import Input from './Input';
import { CiSearch } from "react-icons/ci";
import { useSelector } from 'react-redux';
import { selectSocket } from '../../Utilities/socketSlice';

const sendToDatabase = async (agent, id) => {
    try {
        console.log("agennt up here", agent)

        const url = `http://localhost:9000/api/v1/message/${id}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(agent)
        });
        if (!response.ok) throw new Error('HTTP error! status: ${response.status}');
        const data = await response.json()
        return data
    } catch (error) {
        console.log(error.message)
    }
}

export const getDate = () => {
    const date = new Date();
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dayOfWeek = daysOfWeek[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    return `${dayOfWeek}, ${day} ${month}`;
};

export default function CenterBar() {
    // const [isDate, setDate] = useState('');
    const socket =  useSelector(selectSocket);
    const [messages, setMessages] = useState([]);
    const [agents, setAgents ] = useState([])
    const [ allMessages, setAllmessages ] = useState([])
    
    useEffect(() => {
        if (socket && socket.socket) {
            const handleMessage = (data) => {
                console.log("data found", data)
                console.log("Event received: ", data);
                setMessages(prevMessages => [...prevMessages, data]);
            };
    
            socket.socket.on('messages', handleMessage);
    
            return () => {
                socket.socket.off('messages', handleMessage);
            };
        } else {
            console.log("Socket connection not found");
        }
    }, [socket]);
    

    useEffect(() => {
        const getAgents = async () => {
            try {
                const url = "http://localhost:9000/api/v1/agents"
                const response = await fetch(url, {
                    method: 'GET'
                })
                if (!response.ok) throw new Error('HTTP error! status: ${response.status}');
                const data = await response.json()
                setAgents(data.data)
            } catch (error) {
                console.log(error.message);
                return;
            }
        }
        getAgents()
    },[])

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
                if(data.data.length > 0){
                    setAllmessages(data.data);
                    console.log("data found", data.data)
                }else {
                    console.log("no data found")
                    return;
                }
            } catch (error) {
                console.log(error.message);
            }
        };
        getMessages();
    }, []);

    
    const handleOnAcceptClicked = async (id) => {
        console.log(id);
        const user = localStorage.getItem("user")

        const data = {
            agent:  user,
        }

        const filteredMessages = messages.filter(message => message._id !== id);
        
        setMessages([...filteredMessages]);
        const res = await sendToDatabase(data, id);
        console.log(res)
    }

    return (
        <div className='w-full h-full flex flex-col'>
            <div className='top-center flex flex-row items-center w-full h-20 shadow-lg px-3 justify-between'>
                <div className="flex -space-x-4 rtl:space-x-reverse">
                    {agents.map((agent, index) => {
                        const initials = agent.username.split(' ').map(word => word[0]).join('');
                        return (
                            <div key={index} className="flex items-center justify-center w-10 h-10 border-[1px] border-[#037ea1] bg-[#baeffd] rounded-full dark:border-gray-800">
                                {agent.profileImage ? (
                                    <img
                                        className="w-10 h-10 border-2 border-white rounded-full dark:border-gray-800"
                                        src={agent.profileImage}
                                        alt=""
                                    />
                                ) : (
                                    <p className="text-lg font-semibold">{initials}</p>
                                )}
                            </div>
                        );
                    })}
                </div>
                <Input
                    ContainerStyles={"w-[30rem] h-10"}
                    IconBefore={CiSearch} 
                    placeholder={"search here"}
                    IconStyleBefore={"text-xl"}
                />
            </div>
            <div className='content-container h-full overflow-y-auto no-scrollbar p-3 flex flex-col gap-3 bg[red]'>
                {allMessages.map((allMessage, index) => {
                    return(
                        allMessage.agent ? (
                            null
                        ) : (
                            <Notification
                                key={index}
                                sender={allMessage._id}
                                date={allMessage.date}
                                content={allMessage.content}
                                render={allMessage.render}
                                containerStyles={allMessage.urgency === "Regular" ? 'border-[#db0000] bg-[#ffdcdc]' : 'border-[#0f61be] bg-[#d7f2ff]'}
                                onAcceptClicked={()=>handleOnAcceptClicked(allMessage._id)}
                            />
                        )
                    )
                })}
                {messages.map((item, index) => {
                    return (
                        item.agent ? (
                            null
                        ) : (
                            <Notification
                                key={index}
                                username={item.username}
                                date={item.date}
                                content={item.content}
                                render={item.render}
                                containerStyles={item.urgency === "Urgent" ? 'border-[#db0000] bg-[#ffdcdc]' : 'border-[#0f61be] bg-[#d7f2ff]'}
                                onAcceptClicked={()=>handleOnAcceptClicked(item._id)}
                            />
                        )
                    );
                })}
            </div>
        </div>
    );
}
