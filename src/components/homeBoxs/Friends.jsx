import React, { useEffect, useState } from 'react'
import Heading from '../Heading'
import Flex from '../Flex'
import { BiDotsVertical } from 'react-icons/bi'
import ImageComp from '../ImageComp'
import Pragraph from '../Pragraph'
import Button from '@mui/material/Button';
import { getDatabase, ref, onValue, set, push, remove } from "firebase/database";
import { useDispatch, useSelector } from 'react-redux'
import { activeChatNow } from '../../features/activeChat/activeChat'
import { whoLogdin } from '../../features/user/logdinSlice'

const Friends = () => {
  const logdinData = useSelector((state) => state.logdin.value)
  const db = getDatabase() ;
  const friendsRef = ref(db,"friends") ;
  const dispach = useDispatch() ;
  console.log(useSelector((state) => state.logdin));

  const [friendsArr, setFriendsArr] = useState([]) ;

  useEffect(()=>{
    onValue(friendsRef, snapshot =>{
      // console.log(snapshot);
      const arr = [] ;
      snapshot.forEach((item)=>{
        // console.log(item.val());
        if (item.val().reciverId == logdinData.uid || item.val().senderId == logdinData.uid) {
          arr.push({...item.val(),itemId:item.key})
        }
      })
      setFriendsArr(arr)
    })
    // console.log(friendsArr);
  },[])

  const friendDeleteHandler = (itemId) => {
    remove(ref(db,"friends/"+itemId))
  }
  const friendBlockHandler = (item) => {
    const friendsBlockRef = ref(db,"blockFriends/"+(item.reciverId+item.senderId)) ;
    // console.log(item);
    if (item.reciverId == logdinData.uid) {
      set(friendsBlockRef,{
        blockBy : logdinData.uid,
        blockByImage : logdinData.photoURL,
        blockByName : logdinData.displayName,
        blockTo : item.senderId,
        blockToImage : item.senderImage,
        blockToName : item.senderName,
      }).then(()=>{
        remove(ref(db,"friends/"+item.itemId))
      })
    }else{
      set(friendsBlockRef,{
        blockBy : logdinData.uid,
        blockByImage : logdinData.photoURL,
        blockByName : logdinData.displayName,
        blockTo : item.reciverId,
        blockToImage : item.reciverImage,
        blockToName : item.reciverName,
      }).then(()=>{
        remove(ref(db,"friends/"+item.itemId))
      })
      
    }
  }

  const activeChatHandler = (item) => {
    console.log(item);
    if (item.reciverId == logdinData.uid) {
      dispach(activeChatNow({
        type : "single",
        activeId : item.senderId,
        activeName : item.senderName,
        activeImage : item.senderImage,
      }))

    }else{
      dispach(activeChatNow({
        type : "single",
        activeId : item.reciverId,
        activeName : item.reciverName,
        activeImage : item.reciverImage,
      }))

    }
  }

  return (
    <div className="userBox">
        <Flex className="boxHeadingParrent">
            <Heading tagName="h4" className="" title="friend list" />
            <div><BiDotsVertical /></div>
        </Flex>
        <div className="userParrent">

          {
            friendsArr.map((item, index)=>{
              return (
                <div key={index} onClick={()=> activeChatHandler(item)} className="users">
                    <Flex className="user">
                        <Flex className="userLeft">
                            <div className="userImageDiv">
                                <ImageComp className="userImage" imageSrc={logdinData.uid == item.senderId?item.reciverImage:item.senderImage} />
                            </div>
                            <div>
                                <Heading tagName="h5" className="userNameHeading" title={logdinData.uid == item.senderId?item.reciverName:item.senderName}>
                                    <Pragraph className="userNameSubHeading" title="today 30:300 PM" />
                                </Heading>
                            </div>
                        </Flex>
                        <Flex className="userRight">
                            <Button onClick={()=>friendDeleteHandler(item.itemId)} style={{background:"red"}} className="userBtn" variant="contained">d</Button>
                            <Button onClick={()=>friendBlockHandler(item)} className="userBtn" variant="contained">block</Button>
                        </Flex>
                    </Flex>
                </div>
              )
            })
          }
        </div>
    </div>
  )
}

export default Friends