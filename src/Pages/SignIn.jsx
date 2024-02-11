import Input from '../Components/Input';
import { AiOutlineMail, AiOutlineEyeInvisible, AiOutlineEye } from 'react-icons/ai';
import { FiLock } from 'react-icons/fi';
import Button from '../Components/Button';
import { useState } from 'react';
import { Oval } from 'react-loader-spinner';
import Logo from '../assets/logo.png';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import { login, failed } from '../../Utilities/authSlice';

const connectToSocket = (token) => {
    console.log(token)
    const socket = io("http://localhost:9000", {
        auth: {
            token: token
        }
    })

    socket.on('connect', () => {
        console.log("connected to socket", socket.id)
    })
}

export default function SignIn() {
    const [isLoading, setIsLoading] = useState(false);
    const [isPassword, setPasswordVisibility] = useState(false);
    const [isDisabled, setDisabled] = useState(false);
    const [isValiedInputs, setValiedInputs] = useState(false);
    const isEye = isPassword ? AiOutlineEyeInvisible : AiOutlineEye;

    const dispatch = useDispatch()

    const handlePassword = () => {
        setPasswordVisibility(!isPassword);
    };

    const formik = useFormik({
        initialValues:{
            username: "",
            email: "",
            password: ""
        },
    
        onSubmit: async (values) => {
            setIsLoading(true);
            setDisabled(true);
            if( !values.email || !values.password){
                setValiedInputs(true);
                setIsLoading(false);
                setDisabled(false);
                return;
            }
            try {

                const response = await fetch("http://localhost:9000/api/v1/login", {
                    method: 'POST',
                    body: JSON.stringify(values), 
                    headers: {'Content-Type': 'application/json'}
                });

                if (!response.ok) {
                    throw new Error('Failed to create an account');
                }
    
                const data = await response.json();
                dispatch(login({ user: data.data._id, token: data.token }))
                localStorage.setItem("user", data.data._id)
                connectToSocket(data.token);
            } catch (error) {
                console.error('Error signing up:', error.message);
                alert(error.message);
                dispatch(failed())
            } finally {
                setIsLoading(false);
                setDisabled(false);
            }
        }
    });


    return (
        <div className='flex flex-col items-center justify-center w-screen h-screen bg-[#e0f6fe]'>
            <form onSubmit={formik.handleSubmit} autoComplete='off' className="signup-form h-3/4 gap-5 flex flex-col w-[30rem] items-center p-10 bg-[#7de3fc] rounded-md shadow-sm">
                <img src={Logo} alt="Logo" className='h-20'/>
                <Input
                    placeholder={"Enter email"}
                    IconBefore={AiOutlineMail}
                    type={'email'}
                    ContainerStyles={" w-full border-[#076885] h-[2.2rem]"}
                    IconStyleBefore={"text-[#076885] text-xl"}
                    InputStyles={"pl-2 bg-[#7de3fc]"}
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onFocus={() => setValiedInputs(false)}
                    disabled={isDisabled}
                    name={"email"}
                />
                <Input
                    placeholder={"Enter password.."}
                    ContainerStyles={"w-full text-md border-[#076885] h-[2.5rem]"}
                    IconBefore={FiLock}
                    type={isPassword ? "text" : "password" }
                    IconAfter={isEye}
                    IconStyleBefore={"text-[#076885] text-xl"}
                    onIconAfterClicked={handlePassword}
                    IconStyleAfter={"text-[#076885] text-2xl"}
                    InputStyles={"bg-[#7de3fc]"}
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    disabled={isDisabled}
                    name={"password"}
                />
                {isValiedInputs && <small className='text-[red] text-sm'>please provide all the values</small>}
                <Link to="/forgotpass" className="hover:cursor-pointer hover:text-primary self-end">
                    Forgot Password?
                </Link>
                <Button
                    type="submit"
                    text={'Log in'}
                    textStyles={`font-semibold uppercase ${isLoading ? 'hidden' : ''} text-white`}
                    ContainerStyle={"signUpBtn bg-[#076885]"}
                    renderChildren={<Oval height={25} strokeWidth={5} secondaryColor='white' color='white' visible={isLoading} />}
                />
                <Link to={'/signup'} className='cursor-pointer'>
                    Dont have an account? Sign Up..
                </Link>
            </form>
        </div>
    );
}
