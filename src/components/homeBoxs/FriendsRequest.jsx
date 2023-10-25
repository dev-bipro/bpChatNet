import React, { useEffect, useState } from 'react'
import Heading from '../Heading'
import Flex from '../Flex'
import { BiDotsVertical } from 'react-icons/bi'
import ImageComp from '../ImageComp'
import Pragraph from '../Pragraph'
import Button from '@mui/material/Button';
import { getDatabase, ref, onValue, set, push, remove } from "firebase/database";
import { useSelector } from 'react-redux'


const FriendsRequest = () => {
  const logdinData = useSelector((state)=>state.logdin.value)
  const db = getDatabase() ;
  const friendRequestRef = ref(db, "friendRequest") ;
  const friendsRef = ref(db, "friends") ;

  const [friendRequestArr,setFriendRequestArr] = useState([])

  useEffect(()=>{
    onValue(friendRequestRef, snapshot => {
      const arr = [] ;
      // console.log(snapshot);
      snapshot.forEach((item) => {
        // console.log({...item.val()});
        if (item.val().reciverId == logdinData.uid) {

          arr.push({...item.val(),itemId:item.key})
        }

      })
      setFriendRequestArr(arr)
      // console.log(friendRequestArr);
    })
  },[])

  const sentFRAccpetHandler =(item) => {
    set(ref(db,"friends/"+(item.reciverId+item.senderId)),{
      ...item
    }).then(()=>{
      remove(ref(db,"friendRequest/"+item.itemId))
    })
  }
  const sentFRDeleteHandler =(item) => {
    remove(ref(db,"friendRequest/"+item))
  }

  return (
    <>
      <div className="userBox">
        <Flex className="boxHeadingParrent">
            <Heading tagName="h4" className="" title="friend request" />
            <div><BiDotsVertical /></div>
        </Flex>
        <div className="userParrent">

          {
            friendRequestArr.map((item, index)=>{
                return (
                    <div key={index} className="users">
                        <Flex className="user">
                            <Flex className="userLeft">
                                <div className="userImageDiv">
                                    <ImageComp className="userImage" imageSrc={item.senderImage} />
                                </div>
                                <div>
                                    <Heading tagName="h5" className="userNameHeading" title={item.senderName}>
                                        <Pragraph className="userNameSubHeading" title="today 30:300 PM" />
                                    </Heading>
                                </div>
                            </Flex>
                            <Flex className="userRight">
                                <Button onClick={()=>sentFRAccpetHandler(item)} style={{background:"green"}} className="userBtn" variant="contained">a</Button>
                                <Button onClick={()=>sentFRDeleteHandler(item.itemId)} style={{background:"red"}} className="userBtn" variant="contained">d</Button>
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

export default FriendsRequest