/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import LeftBar from '../Components/LeftBar'
import Input from '../Components/Input'
import { CiSearch } from "react-icons/ci";
import Person from '../assets/person.jpeg'
import { MdOutlineQuickreply } from "react-icons/md";
import { HiOutlineArrowUpCircle } from "react-icons/hi2";
import { GoPaperclip } from "react-icons/go";
import Proptypes from 'prop-types'
import { Modal, Button } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { IoCloseOutline } from "react-icons/io5";
import { CiMail } from 'react-icons/ci'
import { useSelector } from 'react-redux';
import { selectSocket } from '../../Utilities/socketSlice';

const getSpecificMessage = async(id) => {
    try {
        const url = `http://localhost:9000/api/v1/message/${id}`
        const response = await fetch(url, {
            method: 'GET'
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data)
        return data
        
    } catch (error) {
        console.log('error', error)
        return;
    }
}

const Notifs = ({ onClick, name, message, date, notifStyles}) => {
    return(
        <div 
            className={ `${notifStyles} w-full flex flex-row min-h-16 gap-2 p-2 border-b-[1px] cursor-pointer bg-[#edfaff] rounded-sm`}
            onClick={onClick}
        >
            <section className='prof-image'>
                <div className='h-full flex items-center justify-center'>
                    <img
                        src={Person}
                        className='h-10 w-10 rounded-full'
                    />
                </div>
            </section>
            <section className='flex flex-col w-full'>
                <div className='flex flex-row item-center justify-between w-full'>
                    <small className='max-w-20 text-[15px] font-semibold'>{name}</small>
                    <small>{date}</small>
                </div>
                <div>
                <small className='text-ellipsis text-pretty overflow-hidden line-clamp-1'> 
                    {message}
               </small>
                </div>
            </section>
        </div>
    )
}

Notifs.prototype = {
    onClick: Proptypes.func,
}

const ResponseModal = ({ show, onClose, sender, message, date}) => {
    const [isModal, setModal] = useState(false);
    const [isResponse, setResponse] = useState('');
    const [isMessage, setMessage] = useState('');
    const [resDate, setResDate] = useState('');
    const socket = useSelector(selectSocket);

    const saveResponse = async () => {
        const agentResponse = {
            content: isMessage,
            sender: localStorage.getItem("user"),
            recipient: localStorage.getItem("message_sender"),
            socketId: localStorage.getItem("recipient_token"),
            agent: localStorage.getItem("socket_id")
        };

        try {
            const url = "http://localhost:9000/api/v1/response";
            const response = await fetch(url, {
                method: 'POST',
                body: JSON.stringify(agentResponse),
                headers: { 'Content-Type': 'application/json' }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (socket) {
                socket.socket.emit("agent_respond", data.data);
                // Remove the event listener after emitting
                socket.socket.off("agent_respond");
            } else {
                console.log('no socket');
            }
            setResponse(data.data);
            setResDate(data.data.createdAt);
        } catch (error) {
            console.log(error);
        } finally {
            setMessage('');
        }
    };

    return (
        <>
            <QuickReplyModal show={isModal} onClose={() => setModal(false)} selected={(item) => setMessage(item)} />
            <div className={`modal fixed top-0 left-0 right-0 bottom-0 flex items-center ${show ? 'block' : 'hidden'}`} style={{ backgroundColor: "rgba(0, 0, 0, .15)"}}>
                <div className='bg-white w-[40rem] flex flex-col items-center justify-between h-3/4 shadow-md rounded-md' style={{  margin: "0 auto" }}>
                    <div className='flex flex-row items-center justify-between rounded-t-md  p-2 bg-red-400 w-full'>
                        <p>{sender}</p>
                        <IoCloseOutline
                            size={25} 
                            color='#0092cc' 
                            className='cursor-pointer' 
                            onClick={onClose}
                        /> 
                    </div>
                    <div className='w-full bg-[red] h-full px-5'>
                        <div className='bg-white h-full shadow-inner flex flex-col p-2 overflow-y-auto no-scrollbar gap-2'>
                            <div className='flex flex-col border-l-2 bg-[#d7f2ff] border-[#0a7aeb] p-2'>
                                <p className='text-sm font-bold text-[#068fff'>{message}</p>
                                <small>{date}</small>
                            </div>
                            {isResponse && (
                                <div className='flex flex-col border-r-2 bg-[#d7f2ff] border-[#0a7aeb] p-2'>
                                    <p className='text-sm font-bold text-[#068fff'>{isResponse.sender}</p>
                                    <p>{isResponse.content}</p>
                                    <small>{isResponse.createdAt}</small>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className='w-full p-2 shadow-3xl bg-[red]'>
                        <Input
                            placeholder={"Type message here"}
                            IconAfter={() => (
                                <div className='flex flex-row gap-2 px-2 items-center'>
                                    {[
                                        <HiOutlineArrowUpCircle key="upArrow" size={23} onClick={() => saveResponse()}/>,
                                    ]}
                                </div>
                            )}
                            IconBefore={() => (
                                <div className='flex flex-row gap-4 px-2 items-center h-full'>
                                    <GoPaperclip size={20}/>
                                    <MdOutlineQuickreply key="quickReply" size={18} onClick={() => setModal(true)} />
                                </div>
                            )}
                            ContainerStyles={"border-none"}
                            InputStyles={"pl-5"}
                            value={isMessage}
                            onChange={(item) => {setMessage(item.target.value)}}
                        />
                    </div>
                </div>
            </div>
        </>
        
    );
};


const Messages = () => {
    const [myMessages, setMessages] = useState([]);
    const [ isModal, setModal ] = useState(false)
    const [ isSender, setSender ] = useState('')
    const [ isInbox, setInbox ] = useState('')
    const [ isDate, setDate ] = useState('')

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

    const myId = localStorage.getItem("user");

    const handleOpened = async (item) => {
        setModal(true)
        const data = await getSpecificMessage(item._id)
        setSender(data.data.sender)
        setInbox(data.data.content)
        setDate(data.data.createdAt)
        localStorage.setItem("recipient_token", item.socketId)
        localStorage.setItem("message_sender", item.sender)
    }
    
    return (
        <>
            <ResponseModal
                show={isModal}
                onClose={()=>setModal(false)}
                sender={isSender}
                message={isInbox}
                date={isDate}
            />
            <div className='w-full h-full flex flex-col shadow-lg '>
                <div className='p-3 flex flex-col bg-[#83dfff]'>
                    <p>Chats</p>
                    <Input
                        placeholder={"search chats here"}
                        IconBefore={CiSearch}
                    />
                </div>
                <div className='flex flex-col overflow-y-auto no-scrollbar p-5'>
                    {myMessages.map((item, index) => 
                        item.agent === myId && (
                            <Notifs
                                key={index}
                                name={item.username}
                                date={new Date(item.createdAt).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}
                                message={item.content}
                                notifStyles={item.urgency === 'Urgent' ? "bg-[red]" : ""}
                                onClick={() => handleOpened(item)}
                            />
                        )
                    )}
                </div>
            </div>
        </>
    );
};



const QuickReplyModal = ({ show, onClose, selected }) => {
    const quickResponses = [
      "Thank you for reaching out! How can I assist you today?",
      "Hi there! I'm here to help. What's on your mind?",
      "Hello! How can I make your experience better today?",
      "Thanks for contacting us. How may I assist you?",
      "Hi! I'm ready to help with any questions or concerns you have.",
      "Welcome! Let me know how I can assist you today.",
      "Hello! What can I do to help resolve your issue?",
      "Thanks for getting in touch. How can I support you?",
      "Hi there! How can I provide assistance to you right now?",
      "Welcome to our support center! How may I assist you today?",
      "Hello! Let's work together to find a solution for you.",
      "Thanks for reaching out. How can I make things right for you?",
      "Hi! I'm here to listen and help. What's going on?",
      "Welcome! How can I assist you with your inquiry?",
      "Hello! I'm here to provide quick and efficient assistance.",
      "Thanks for contacting us. How can I be of service to you?",
      "Hi there! Let's tackle this issue together. What's the matter?",
      "Hello! How can I help resolve any concerns you have?",
      "Thanks for reaching out to us. How can I assist you today?",
      "Hi! I'm here to ensure your experience is as smooth as possible. What do you need help with?"
    ];
  
    const handleResponseClick = (response) => {
      console.log("Selected response:", response);
      selected(response)
      onClose();
    };
  
    return (
        <Modal
            show={show}
            onClose={onClose}
            dismissible
            className='w-[50%] p-10'
            style={{ margin: "0px auto" }}
        >
            <Modal.Header className='bg-[#d6f2ff] p-2 flex flex-row items-center rounded-t-ms'>
                <p>Quick Responses</p>
            </Modal.Header>
            <Modal.Body className='max-h-[20rem] overflow-y-auto no-scrollbar'>
                {quickResponses.map((response, index) => (
                    <button key={index} className="quick-response-btn border-b-[1px] p-2 w-full flex items-start " onClick={() => handleResponseClick(response)}>
                        {response}
                    </button>
                ))}
            </Modal.Body>
            <Modal.Footer className='bg-[#d6f2ff] h-10 p-2'>
                <Button onClick={onClose} className='text-[#085ec5]'>Cancel</Button>
            </Modal.Footer>
      </Modal>
    );
};

const RightBar = () => {
    const [agents, setAgents] = useState([])
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
    return(
        <div className='flex flex-col w-[30rem] shadow-lg'>
            <div className='agents-container flex flex-col max-h-[40rem] overflow-y-auto no-scrollbar'>
                <div className='bg-[#32d0fe] h-20 flex flex-row items-center px-2'>
                    <p>Agents</p>
                </div>
                <div className='flex flex-col gap-2 p-1'>
                    {agents.map((agent, index) => {
                        const initials = agent.username.split(' ').map(word => word[0]).join('');
                        return(
                            <div key={index} className='flex flex-row items-center gap-2 rounded-md hover:bg-[#effaff] py-2 cursor-pointer px-2'>
                                <div className='flex flex-row items-center justify-center'>
                                    <div className='flex flex-col items-center justify-center h-10 w-10 rounded-full'>
                                        <p>{initials}</p>
                                    </div>
                                </div>
                                <div className='w-full flex flex-col'>
                                    <small className='font-semibold text-md'>{agent.username}</small>
                                    <small>{agent.email}</small>
                                </div>
                                <CiMail size={25}/>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default function Inbox() {
  return (
    <div className='h-screen w-screen flex flex-row'>
        <LeftBar/>
        <Messages/>
        <RightBar/>
    </div>
  )
}
