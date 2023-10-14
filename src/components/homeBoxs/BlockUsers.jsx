import React, { useEffect, useState } from 'react'
import Heading from '../Heading'
import Flex from '../Flex'
import { BiDotsVertical } from 'react-icons/bi'
import ImageComp from '../ImageComp'
import Pragraph from '../Pragraph'
import Button from '@mui/material/Button';
import { getDatabase, ref, onValue, set, push, remove } from "firebase/database";
import { useSelector } from 'react-redux'

const BlockUsers = () => {
  const logdinData = useSelector((state) => state.logdin.value) ;
  const db = getDatabase() ;
  const bolckUserRef = ref(db,"blockFriends") ;
  const friendsRef = ref(db,"friends") ;

  const [blockUserArr, setBlockUserArr] = useState([]) ;

  useEffect(()=>{
    onValue(bolckUserRef,snapshot => {
      const arr = []
      snapshot.forEach(item => {
        // console.log(item.val());
        if (item.val().blockBy == logdinData.uid) {
          arr.push({...item.val(),itemId:item.key})
        }
      })
      setBlockUserArr(arr)
    })
    // console.log(blockUserArr);

  },[])

  const unblockHandler = (item) => {
    set(push(friendsRef),{
      senderName: logdinData.displayName,
      senderId: logdinData.uid,
      senderImage: logdinData.photoURL,
      reciverName: item.blockToName,
      reciverId: item.blockTo,
      reciverImage: item.blockToImage
    }).then(() => {
      remove(ref(db,"blockFriends/"+item.itemId))
    })
    // console.log(item);
  }

  return (
    <>
      <div className="userBox">
        <Flex className="boxHeadingParrent">
            <Heading tagName="h4" className="" title="blocked users" />
            <div><BiDotsVertical /></div>
        </Flex>
        <div className="userParrent">

          {
            blockUserArr.map((item, index)=>{
                return (
                    <div key={index} className="users">
                        <Flex className="user">
                            <Flex className="userLeft">
                                <div className="userImageDiv">
                                    <ImageComp className="userImage" imageSrc={item.blockToImage} />
                                </div>
                                <div>
                                    <Heading tagName="h5" className="userNameHeading" title={item.blockToName}>
                                        <Pragraph className="userNameSubHeading" title="today 30:300 PM" />
                                    </Heading>
                                </div>
                            </Flex>
                            <Flex className="userRight">
                                <Button onClick={()=>unblockHandler(item)} style={{background:"green"}} className="userBtn" variant="contained">unblock</Button>
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

export default BlockUsers