import React, { useEffect } from 'react'
import "./Sidebar.css"
import { useSelector, useDispatch } from 'react-redux'
import ImageComp from '../ImageComp';
import Heading from '../Heading';
import List from '../List';
import { ListItem } from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LiaHomeSolid } from 'react-icons/lia'
import { AiFillMessage } from 'react-icons/ai'
import { IoMdNotificationsOutline } from 'react-icons/io'
import { FiSettings } from 'react-icons/fi'
import { RiLogoutBoxRLine } from 'react-icons/ri'
import { whoLogdin } from '../../features/user/logdinSlice';

const Sidebar = () => {
  const locationPath = useLocation() ;
  const navigate = useNavigate() ;
  const dicpatch = useDispatch() ;
  // useEffect(()=>{})
  // console.log(locationPath.pathname);
  const logdinData = useSelector((state)=>state.logdin.value) ;
  // console.log(logdinData);
  
  const logoutHandler = () => {
    localStorage.removeItem("user") ;
    dicpatch(whoLogdin(null))
    navigate("/")

  }
  return (
    <div className='sidebar'>
        <div className="logdProfilePicDiv">
            <ImageComp className="logdProfilePic" imageSrc={logdinData?.photoURL} />
        </div>
        <Heading tagName="h2" className="logdProfileName" title={logdinData?.displayName} />
        <List className="sidebarIcons">
          <ListItem className={locationPath.pathname == "/home" ? "active" : ""}>
            <Link className="sidebarIcon" to="/home">
              <LiaHomeSolid />
            </Link>
          </ListItem>
          <ListItem className={locationPath.pathname == "/message" ? "active" : ""}>
            <Link className="sidebarIcon" to="/message">
              <AiFillMessage />
            </Link>
          </ListItem>
          <ListItem className={locationPath.pathname == "/notification" ? "active" : ""}>
            <Link className="sidebarIcon" to="/notification">
              <IoMdNotificationsOutline />
            </Link>
          </ListItem>
          <ListItem className={locationPath.pathname == "/settings" ? "active" : ""}>
            <Link className="sidebarIcon" to="/settings">
              <FiSettings />
            </Link>
          </ListItem>
          <ListItem onClick={logoutHandler}>
            <Link className="sidebarIcon">
              <RiLogoutBoxRLine />
            </Link>
          </ListItem>
        </List>
    </div>
  )
}

export default Sidebar