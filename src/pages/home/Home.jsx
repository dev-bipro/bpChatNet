import React, { useEffect } from 'react'
import './Home.css'
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import GroupList from '../../components/homeBoxs/GroupList';
import Friends from '../../components/homeBoxs/Friends';
import UserList from '../../components/homeBoxs/UserList';
import BlockUsers from '../../components/homeBoxs/BlockUsers';
import FriendsRequest from '../../components/homeBoxs/FriendsRequest';
import MyGroups from '../../components/homeBoxs/MyGroups';

const Home = () => {
  const logdinData = useSelector((state)=> state.logdin.value) ;
  const navigate = useNavigate() ;
  useEffect(()=>{
    !logdinData && navigate("/")
  },[])
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <GroupList />
          <FriendsRequest />
        </Grid>
        <Grid item xs={4}>
          <Friends />
          <MyGroups />
        </Grid>
        <Grid item xs={4}>
          <UserList />
          <BlockUsers />
        </Grid>
      </Grid>
        {/* <Button variant="text">Text</Button>
        <Button variant="contained">Contained</Button> */}
    </>
  )
}

export default Home