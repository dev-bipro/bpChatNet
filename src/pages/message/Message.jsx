import React from 'react'
import './Message.css'
import Grid from '@mui/material/Grid';
import Friends from '../../components/homeBoxs/Friends';
import MyJoinGroups from '../../components/MessageBox/MyJoinGroups'
import MessagesBox from '../../components/MessageBox/MessagesBox';

const Message = () => {
  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Friends />
          <MyJoinGroups />
        </Grid>
        <Grid item xs={8}>
          <MessagesBox />
        </Grid>
      </Grid>
    </div>
  )
}

export default Message