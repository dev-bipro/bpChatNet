import React, { useState, useEffect } from 'react'
import "./Registration.css"
import Flex from '../../../components/Flex'
import Heading from '../../../components/Heading'
import Pragraph from '../../../components/Pragraph'
import ImageComp from '../../../components/ImageComp'
import myLogo from '../../../assets/myLogo.svg'
import regImage from '../../../assets/regImage.jpg'
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import { Link, useNavigate } from "react-router-dom";
import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai'
import { toast } from 'react-toastify';
import { Hearts } from  'react-loader-spinner' ;
import { getAuth, createUserWithEmailAndPassword, updateProfile, sendEmailVerification} from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import { useSelector } from 'react-redux'


const Registration = () => {
    const auth = getAuth() ;
    const db = getDatabase() ;
    const navigate = useNavigate() ;
    const [passwordShow,setPasswordShow] = useState(false) ;
    const [loadTxt,setLoadTxt] = useState([])
    const [btnLoad,setBtnLoad] = useState(true) ;

    const logdinData = useSelector((state)=> state.logdin.value);
    
    useEffect(()=>{
        logdinData && navigate("/home")
    })

    const [formData,setFormData] = useState({
        fullName:"",
        email:"",
        password:""
    })
    const [nemeError,setNameError] = useState("")
    const [emailError,setEmailError] = useState("")
    const [passwordError,setPasswordError] = useState("")

    const changeHandler = (e)=>{
        setFormData({
            ...formData,
            [e.target.name] : e.target.value
        })
        if (e.target.name == "fullName") {
            setNameError("")
        }
        if (e.target.name == "email") {
            setEmailError("")
        }
        if (e.target.name == "password") {
            setPasswordError("")
        }
    }
    

    const clickHandler = ()=>{
        // console.log("ami click hocchi");
        // toast.success('🦄 Wow so easy!', {
        //     position: "top-left",
        //     autoClose: 5000,
        //     hideProgressBar: false,
        //     closeOnClick: true,
        //     pauseOnHover: true,
        //     draggable: true,
        //     progress: undefined,
        //     theme: "dark",
        // });

        if(!formData.fullName || !formData.email || !formData.password){
            if (!setFormData.fullName) {
                setNameError("please type your name !")
            }
            if (!setFormData.email) {
                setEmailError("please type your email !")
            }
            if (!setFormData.password) {
                setPasswordError("please type your password !")
            }

        }else {
            const validEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ ;
            
            if (formData.fullName.length > 2 && formData.fullName.split("").find((element) => isNaN(element -1)) && validEmail.test(formData.email) && formData.password.length > 5) {

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

                  createUserWithEmailAndPassword(auth, formData.email, formData.password).then((user)=>{
                      updateProfile(auth.currentUser, {
                          displayName: formData.fullName,
                          photoURL: "https://firebasestorage.googleapis.com/v0/b/bpchatnet-279e3.appspot.com/o/avatar.jpg?alt=media&token=83d4b918-dcb7-4c47-97d4-19dbda4c9d1d&_gl=1*5krtlj*_ga*MTEzMzY1MzA1OS4xNjg2OTk0MzI2*_ga_CW55HF8NVT*MTY5Njk1OTU3MC4zLjEuMTY5Njk2MDY4NS4xOC4wLjA."
                      }).then(()=>{
                          set(ref(db,"users/"+user.user.uid),{
                              fullName: formData.fullName,
                              email: formData.email,
                              photoURL: "https://firebasestorage.googleapis.com/v0/b/bpchatnet-279e3.appspot.com/o/avatar.jpg?alt=media&token=83d4b918-dcb7-4c47-97d4-19dbda4c9d1d&_gl=1*5krtlj*_ga*MTEzMzY1MzA1OS4xNjg2OTk0MzI2*_ga_CW55HF8NVT*MTY5Njk1OTU3MC4zLjEuMTY5Njk2MDY4NS4xOC4wLjA."
                          }).then(()=>{
                              sendEmailVerification(auth.currentUser).then(() => {
                                  toast.success('Wow so easy 😺', {
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
                                        navigate("/")
                                    },3500)
                              });
                          })
                      })
                  }).catch((error) => {
                      const errorCode = error.code;
                      const errorMessage = error.message;
                      if (errorMessage.includes("email-already")){
                        
                        toast.info('You have alredy an count 😺', {
                          position: "bottom-center",
                          autoClose: 3000,
                          hideProgressBar: false,
                          closeOnClick: true,
                          pauseOnHover: true,
                          draggable: true,
                          progress: undefined,
                          theme: "dark",
                        });
                        setTimeout(()=>{
                          navigate('/')
                        },3500)
                      }
                  })
                },4300)
                
            }else {
                if (formData.fullName.length < 3 || formData.fullName.split("").find((element) => !isNaN(element -1))) {
                    // let a = formData.fullName.split("")
                    // console.log(a.find(el)=> el);
                    if (formData.fullName.length < 3){
                        setNameError("Enter your name minimum 3 letter's !")
                    }else if(formData.fullName.split("").find((element) => !isNaN(element -1))) {
                        setNameError("Enter a valid name !")
                    }
                }
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
                    <div className="regInputs">
                        <TextField onChange={changeHandler} name='fullName' type='text' className="regInput" id="outlined-basic" label="Full Name " variant="outlined" />
                        {
                            nemeError && <Alert variant="outlined" severity="error">{nemeError}</Alert>
                        }
                        <TextField onChange={changeHandler} name='email' type='email' className="regInput" id="outlined-basic" label="Email Address" variant="outlined" />
                        {
                            emailError && <Alert variant="outlined" severity="error">{emailError}</Alert>
                        }
                        <div className="passwordInput">
                            <TextField onChange={changeHandler} name='password' type={passwordShow?"text":"password"} className="regInput" id="outlined-basic" label="Password" variant="outlined" />
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
                            <Button onClick={clickHandler} className="regBtn" variant="contained">sign up</Button>
                        }
                        <Pragraph className="navigatePage">Already  have an account ? <Link to="/">Sign In</Link></Pragraph>
                    </div>
                </div>
            </div>
            <div className="regRight">
                <ImageComp className="regImageClass" imageSrc={regImage} />
            </div>
        </Flex>
    </>
  )
}

export default Registration