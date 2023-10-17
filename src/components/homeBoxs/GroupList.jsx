import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Heading from '../Heading'
import Flex from '../Flex'
import { BiDotsVertical } from 'react-icons/bi'
import ImageComp from '../ImageComp'
import Pragraph from '../Pragraph'
import { getDatabase, ref, onValue, set, push, remove } from "firebase/database";
import { useSelector } from 'react-redux'
import TextField from '@mui/material/TextField';
import { BiPlus } from 'react-icons/bi'

const GroupList = () => {
  const db = getDatabase() ;
  const groupRef = ref(db,"groups")
  const sentGroupRef = ref(db,"groupMembersRequest")
  // const groupMembersRef = ref(db,"groupMembers")
  
  const [groupsArr, setGroupsArr] = useState([]) ;
  const [groupJoinArr, setGroupJoinArr] = useState([]) ;
  const [groupMembersRequestArr, setGroupMembersRequestArr] = useState([]) ;

  useEffect(()=>{
    onValue(ref(db,"groups") , (snapshot) =>{
      const arr = [] ;
      snapshot.forEach(item => {
        arr.push({...item.val(),groupId:item.key})
      })
      setGroupsArr(arr)
    })
    onValue(ref(db,"groupMembersRequest") , (snapshot) =>{
      const arr = [] ;
      snapshot.forEach(item => {
        if (item.val().memberId == logdinData.uid) {
          arr.push({...item.val(),reqGroupId:item.key})
          // console.log(item.val().groupId);
        }
      })
      setGroupMembersRequestArr(arr)
    })
    onValue(ref(db,"groupMembers") , (snapshot) =>{
      const arr = [] ;
      snapshot.forEach(item => {
        if (item.val().memberId == logdinData.uid) {

          arr.push(item.val().groupId)
          // console.log(item.val().groupId);
        }
      })
      setGroupJoinArr(arr)
    })
  },[])

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "50%",
    bgcolor: 'background.paper',
    border: '2px solid #5F35F5',
    boxShadow: 24,
    p: 4,
  };
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const logdinData = useSelector((state) => state.logdin.value)

  const [createGroupData, setCreateGroupData] = useState({
    groupName:"",
    groupTagName:""
  })


  const changeHandler = (e) => {
    setCreateGroupData({
      ...createGroupData,
      [e.target.name] : e.target.value
    })
    // console.log(createGroupData);
  }


  const createGroupHandler = (item) => {
    set(push(groupRef),{
      ...createGroupData,
      adminId:logdinData.uid,
      adminName:logdinData.displayName,
      groupImage: "https://firebasestorage.googleapis.com/v0/b/bpchatnet-279e3.appspot.com/o/groupAvatar.jpg?alt=media&token=4aad376c-a30a-4fab-bf51-a449bbaef2c7&_gl=1*zizi4u*_ga*MTEzMzY1MzA1OS4xNjg2OTk0MzI2*_ga_CW55HF8NVT*MTY5NzE4ODE4OS4xNC4xLjE2OTcxODk4ODQuNTcuMC4w"
    }).then(() => {
      setOpen(false)
    })
  }
  
  const sentGroupForMember = (item) => {
    // console.log(item);
    set(push(sentGroupRef),{
      adminId:item.adminId,
      groupId:item.groupId,
      memberId: logdinData.uid,
      memberImage: logdinData.photoURL,
      memberName: logdinData.displayName,
    })
  }
  const cancelGroupForMember = (cancelGid) => {
    // console.log(item);
    groupMembersRequestArr.map(item => {
      if (item.memberId == logdinData.uid && item.groupId == cancelGid) {
        // console.log(item.reqGroupId);
        remove(ref(db,"groupMembersRequest/" + item.reqGroupId))
      }
      // console.log("forT",cancelGid);
      // console.log(item);
    })
    // set(push(sentGroupRef),{
    //   adminId:item.adminId,
    //   groupId:item.groupId,
    //   memberId: logdinData.uid,
    //   memberImage: logdinData.photoURL,
    //   memberName: logdinData.displayName,
    // })
  }
  
  return (
    <>
      <div className="userBox">
        <Flex className="boxHeadingParrent">
            <Heading tagName="h4" className="" title="group list" />
            <div><BiDotsVertical /></div>
        </Flex>
        <div>
          <Button onClick={handleOpen} className="modalBtn" variant="contained">create a new group</Button>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2">Create Group</Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                <div className="myGroupModal">
                  <TextField onChange={changeHandler} name="groupName" className="regInput" type='text' id="outlined-basic" label="Group Name" variant="outlined" />
                  <TextField onChange={changeHandler} name="groupTagName" className="regInput" type='text' id="outlined-basic" label="Group Tag Name" variant="outlined" />
                  <Button onClick={createGroupHandler} className="regBtn" variant="contained">Create</Button>
                </div>
              </Typography>
            </Box>
          </Modal>
        </div>
        <div className="userParrent">

          {
            groupsArr.map((item, index)=>{
              return (
                <div key={index} className="users">
                    <Flex className="user">
                        <Flex className="userLeft">
                          <div className="userImageDiv">
                            <ImageComp className="userImage" imageSrc={item.groupImage} />
                          </div>
                          <div>
                            <Heading tagName="h5" className="userNameHeading" title={item.groupName}>
                              <Pragraph className="userNameSubHeading" title="today 30:300 PM" />
                            </Heading>
                          </div>
                        </Flex>
                        <Flex className="userRight">
                          {
                            groupMembersRequestArr.find(el => el.groupId == item.groupId) ?
                              <Button onClick={()=>cancelGroupForMember(item.groupId)} color="error" className="userBtn" variant="contained">cancel</Button>
                            : groupJoinArr.includes(item.groupId) ?
                              <Button color="success" className="userBtn" variant="contained">join</Button>
                            : item.adminId == logdinData.uid ?
                              <Button color="success" className="userBtn" variant="contained">my group</Button>
                            :
                              <Button onClick={()=>sentGroupForMember(item)} className="userBtn" variant="contained"><BiPlus /></Button>

                          }
                        </Flex>
                    </Flex>
                </div>
              )
            })
          }
        </div>
      </div>
    
    </>
  )
}

export default GroupList