import React, { useEffect, useRef, useState } from 'react'
import "./Login.css"
import Flex from '../../../components/Flex'
import Heading from '../../../components/Heading'
import Pragraph from '../../../components/Pragraph'
import ImageComp from '../../../components/ImageComp'
import myLogo from '../../../assets/myLogo.svg'
import loginImage from '../../../assets/loginImage.jpg'
import googleLogin from '../../../assets/googleLogin.svg'
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import { Link, useNavigate } from "react-router-dom";
import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai'
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider,signInWithPopup } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import { useDispatch, useSelector } from 'react-redux'
import { whoLogdin } from '../../../features/user/logdinSlice'
import { toast } from 'react-toastify' ;
import { Hearts } from  'react-loader-spinner' ;

const Login = () => {
    const auth = getAuth() ;
    const db = getDatabase() ;
    const googleProvider = new GoogleAuthProvider() ;
    const dispatch = useDispatch() ;
    const navigate = useNavigate() ;
    const [passwordShow,setPasswordShow] = useState(false) ;
    const logdinData = useSelector((state)=> state.logdin.value);

    const emailRef = useRef() ;
    const passwordRef = useRef() ;

    // const emailTag = emailRef.current.children[1].children[0] ;
    // const passwordTag = passwordRef.current.children[1].children[0] ;

    const [loadTxt,setLoadTxt] = useState([])
    const [btnLoad,setBtnLoad] = useState(true) ;

    // console.log(emailRef.current);
    // console.log(passwordRef.current.children[1].children[0]);

    const [emailError,setEmailError] = useState("")
    const [passwordError,setPasswordError] = useState("")
    
    useEffect(()=>{
        logdinData && navigate("/home")
    })

    const [formData,setFormData] = useState({
        email:"" ,
        password: ""
    })

    const changeHandler = (e) => {
        if (e.target.name == "email") {setEmailError("")}
        else if (e.target.name == "password") {setPasswordError("")} ;
        setFormData({
            ...formData,
            [e.target.name] : e.target.value
        })
    }

    const googleLoginHandler = ()=>{
        signInWithPopup(auth, googleProvider).then((user)=>{
          console.log(user.user);
          localStorage.setItem('user',JSON.stringify(user.user)) ;
          set(ref(db,"users/"+user.user.uid), {
            fullName: user.user.displayName,
            email: user.user.email,
            photoURL : user.user.photoURL
          }).then(()=>{
            toast.success('🦄 Login done!', {
              position: "top-left",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });
    
            dispatch(whoLogdin(user.user))
            setTimeout(()=>{
              navigate('/home')
            },3500)
          })
    
        })
    }

    const clickHandler = () => {

        if(!formData.email || !formData.password){
            if (!formData.email) {
                setEmailError("please type your email !")
            }
            if (!formData.password) {
                setPasswordError("please type your password !")
            }

        }else {
            const validEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ ;
            
            if (validEmail.test(formData.email) && formData.password.length > 5) {

                setBtnLoad(false)
                let textForLoad = 'BP is Checking'
                let textForLoadArr = textForLoad.split('') ;
                let count = -1 ;
                
                
                const stopInterval = setInterval(()=>{
                    count++
                    loadTxt.push(textForLoadArr[count])
                    setLoadTxt([...loadTxt])
                },300)

                setTimeout(()=>{
                    clearInterval(stopInterval)
                    setLoadTxt([])
                    setBtnLoad(true)

                    signInWithEmailAndPassword(auth, formData.email, formData.password).then((user)=>{
                        // console.log(user.user);
                        // if (user.user.emailVerified) {
                            
                            toast.success('Login Done 😺', {
                                position: "top-left",
                                autoClose: 3000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                                theme: "dark",
                            });
                            setTimeout(()=>{
                                localStorage.setItem("user",JSON.stringify(user.user))
                                dispatch(whoLogdin(user.user))
                                navigate("/home")
                            },3500)
            
                        // }
            
                        
                    }).catch((error) => {
                        const errorCode = error.code;
                        const errorMessage = error.message;
                        console.log({errorMessage});
                        if (errorMessage.includes("invalid-login")){
                          
                          toast.info('Please check your email password ', {
                            position: "bottom-center",
                            autoClose: 3000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "dark",
                          });
                        }
                    })
                },4300)
                
            }else {
                
                if(!validEmail.test(formData.email)) {
                    setEmailError("please type a valid mail !")
                }
                if (formData.password.length < 6) {
                    setPasswordError("sort password")
                }
            }
        }

        

        
    }
  return (
    <>
        <Flex className="regContent">
            <div className="regLeft">
                <div className="regLeftContent">
                    <div className='regLogoDiv'>
                        <ImageComp className="regLogo" imageSrc={myLogo} alt="" />
                    </div>
                    {/* <div className="regHeadingContent"> */}
                        <Heading tagName="h2" className="regHeading" title="get started with easily register">
                            <Pragraph className="regSubHeading" title="free register and you can enjoy it" />
                        </Heading>
                    {/* </div> */}
                    <Button onClick={googleLoginHandler} className="googleLoginBtn" variant="contained">google login</Button>
                    <div className="regInputs">
                        <TextField onChange={changeHandler} ref={emailRef} name='email' type='email' className="regInput" id="outlined-basic" label="Email Address" variant="outlined" />
                        {
                            emailError && <Alert variant="outlined" severity="error">{emailError}</Alert>
                        }
                        <div className="passwordInput">
                            <TextField onChange={changeHandler} ref={passwordRef} name='password' type={passwordShow?"text":"password"} className="regInput" id="outlined-basic" label="Password" variant="outlined" />
                            <div className="passwordEyes">
                                {
                                    passwordShow ?
                                    <AiFillEye onClick={()=>setPasswordShow(false)} />
                                    :
                                    <AiFillEyeInvisible onClick={()=>setPasswordShow(true)} />
                                }
                            </div>
                        </div>
                        {
                            passwordError && <Alert variant="outlined" severity="error">{passwordError}</Alert>
                        }

                        {
                            !btnLoad ?
                                <Button className='regBtn loadBtn' disabled variant="contained">
                                    {
                                        loadTxt.join("")
                                        
                                    }
                                    <Hearts 
                                        height="23"
                                        width="45"
                                        color="#fff"
                                        ariaLabel="hearts-loading"
                                        wrapperStyle={{}}
                                        wrapperClass="loadBtnLoader"
                                        visible={true}
                                    />
                                </Button>
                            :
                                <Button onClick={clickHandler} className="regBtn" variant="contained">sign in</Button>
                        }

                        <Link to="/forgetpassword">forgot password</Link>
                        <Pragraph className="navigatePage">Already  have an account ? <Link to="/registration">sign up</Link></Pragraph>
                    </div>
                </div>
            </div>
            <div className="regRight">
                <ImageComp className="loginImageClass" imageSrc={loginImage} />
            </div>
        </Flex>
    </>
  )
}

export default Login