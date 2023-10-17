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

const MyGroups = () => {

  const db = getDatabase() ;
  
  const logdinData = useSelector((state) => state.logdin.value)
  
  const [myGroupsArr, setMyGroupsArr] = useState([]) ;
  const [groupMembersRequestArr, setGroupMembersRequestArr] = useState([]) ;
  const [groupMembersArr, setGroupMembersArr] = useState([]) ;

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
  const [openRl, setOpenRl] = useState(false);
  const [openMl, setOpenMl] = useState(false);
  const handleOpenRl = (gItem) => {
    onValue(ref(db,"groupMembersRequest") , (snapshot) =>{
      const arr = [] ;
      snapshot.forEach(item => {
        if (item.val().adminId == logdinData.uid && gItem.groupId == item.val().groupId) {
          arr.push({...item.val(),reqGroupId:item.key})
          // console.log(item.val().groupId);
        }
      })
      setGroupMembersRequestArr(arr)
      // console.log(arr);
    })
    setOpenRl(true) ;
    
  };
  const handleOpenMl = (gItem) => {
    onValue(ref(db,"groupMembers") , (snapshot) =>{
      const arr = [] ;
      snapshot.forEach(item => {
        if (item.val().adminId == logdinData.uid && gItem.groupId == item.val().groupId) {
          arr.push({...item.val(),reqGroupId:item.key})
          // console.log(item.val().groupId);
        }
      })
      setGroupMembersArr(arr)
      // console.log(arr);
      // console.log(groupMembersArr);
    })

    setOpenMl(true)
  };
  const handleClose = () => {
    setOpenRl(false)
    setOpenMl(false)
  };
  
  useEffect(()=>{
    onValue(ref(db,"groups"),snapshot => {
      const arr = [] ;
      snapshot.forEach(item => {
        if (item.val().adminId == logdinData.uid) {
          arr.push({...item.val(),groupId:item.key})
          
        }
      })
      // console.log(arr);
      setMyGroupsArr(arr)
      
    })
    

  },[])

  const groupRequestDeleteHandler = (deleteReqId) => {
    remove(ref(db, "groupMembersRequest/" + deleteReqId))
  }
  
  const groupRequestAcceptHandler = (acceptReq) => {
    set(push(ref(db, "groupMembers")),{
      ...acceptReq
    }).then(() => {
      remove(ref(db, "groupMembersRequest/" + acceptReq.reqGroupId))
    })
  }
  
  const groupMemberDeleteHandler = (deleteMemberId) => {
    remove(ref(db, "groupMembers/" + deleteMemberId))
  }

  return (
    <>
      <div className="userBox">
        <Flex className="boxHeadingParrent">
            <Heading tagName="h4" className="" title="my groups" />
            <div><BiDotsVertical /></div>
        </Flex>
        <div>
          <Modal
            open={openRl || openMl}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2">{`Group ${openRl ? "Request" : openMl? "Member" : ""} List`}</Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                <div className="myGroupModal">
                <div className="userParrent">

                  {
                    openRl ?
                      groupMembersRequestArr.map((item, index)=>{
                        return (
                          <div key={index} className="users">
                            <Flex className="user">
                              <Flex className="userLeft">
                                <div className="userImageDiv">
                                  <ImageComp className="userImage" imageSrc={item.memberImage} />
                                </div>
                                <div>
                                  <Heading tagName="h5" className="userNameHeading" title={item.memberName}>
                                      <Pragraph className="userNameSubHeading" title="today 30:300 PM" />
                                  </Heading>
                                </div>
                              </Flex>
                              <Flex className="userRight">
                                {/* <Button onClick={handleOpen}className="modalBtn" variant="contained">create a new group</Button> */}
                                <Button onClick={()=>groupRequestAcceptHandler(item)}  color="success" className="userBtn" variant="contained">accept</Button>
                                <Button onClick={() => groupRequestDeleteHandler(item.reqGroupId)} color="error" className="userBtn" variant="contained">delete</Button>
                              </Flex>
                            </Flex>
                          </div>
                        )
                      })
                    
                    : openMl ?
                      groupMembersArr.map((item, index)=>{
                        return (
                          <div key={index} className="users">
                            <Flex className="user">
                              <Flex className="userLeft">
                                <div className="userImageDiv">
                                  <ImageComp className="userImage" imageSrc={item.memberImage} />
                                </div>
                                <div>
                                  <Heading tagName="h5" className="userNameHeading" title={item.memberName}>
                                      <Pragraph className="userNameSubHeading" title="today 30:300 PM" />
                                  </Heading>
                                </div>
                              </Flex>
                              <Flex className="userRight">
                                {/* <Button onClick={handleOpen}className="modalBtn" variant="contained">create a new group</Button> */}
                                {/* <Button onClick={()=>groupRequestAcceptHandler(item)}  color="success" className="userBtn" variant="contained">accept</Button> */}
                                <Button onClick={() => groupMemberDeleteHandler(item.reqGroupId)} color="error" className="userBtn" variant="contained">delete</Button>
                              </Flex>
                            </Flex>
                          </div>
                        )
                      })
                    :""
                  }
                </div>

                </div>
              </Typography>
            </Box>
          </Modal>
        </div>
        <div className="userParrent">

          {
            myGroupsArr.map((item, index)=>{
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
                            <Button onClick={() => handleOpenRl(item)} color="info" className="userBtn" variant="contained">r l</Button>
                    {/* <Button onClick={handleOpen}className="modalBtn" variant="contained">create a new group</Button> */}
                            <Button onClick={()=>handleOpenMl(item)} color="info" className="userBtn" variant="contained">m l</Button>
                        </Flex>
                    </Flex>
                </div>
              )
            })
          }
        </div>
      </div>
    </>
  );
}

export default MyGroups