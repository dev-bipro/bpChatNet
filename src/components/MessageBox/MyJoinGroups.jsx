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

const MyJoinGroups = () => {
    const db = getDatabase() ;
    const groupRef = ref(db,"groups")
//   const sentGroupRef = ref(db,"groupMembersRequest")
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const logdinData = useSelector((state) => state.logdin.value)
//   const groupMembersRef = ref(db,"groupMembers")

    const [myGroupsArr, setMyGroupsArr] = useState([]) ;
//   const [groupMembersRequestArr, setGroupMembersRequestArr] = useState([]) ;

    useEffect(()=>{
        onValue(ref(db,"groups") , (snapshot) =>{
        const arr = [] ;
        snapshot.forEach(item => {
            if (item.val().adminId == logdinData.uid || item.val().memberId == logdinData.uid) {

                arr.push({...item.val(),groupId:item.key})
            }
        })
        setMyGroupsArr(arr)
        })
    },[])

    console.log(myGroupsArr);





    


  
  return (
    <>
      <div className="userBox">
        <Flex className="boxHeadingParrent">
            <Heading tagName="h4" className="" title="group list" />
            <div><BiDotsVertical /></div>
        </Flex>

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

                            <Button onClick={""} className="userBtn" variant="contained"><BiPlus /></Button>


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

export default MyJoinGroups