import React, { useEffect, useState } from 'react'
import Heading from '../Heading'
import Flex from '../Flex'
import { BiDotsVertical } from 'react-icons/bi'
import ImageComp from '../ImageComp'
import Pragraph from '../Pragraph'
import Button from '@mui/material/Button';
import { BiPlus } from 'react-icons/bi'
import { getDatabase, ref, onValue, set, push } from "firebase/database";
import { useSelector } from 'react-redux'

const UserList = () => {
    const logdinData = useSelector((state)=> state.logdin.value)
    const db = getDatabase() ;
    
    
    const [userListArr,setUserListArr] = useState([]) ;
    const [friendRequestArr,setFriendRequestArr] = useState([]) ;
    const [friendsArr,setFriendsArr] = useState([]) ;
    const [blockUserArr, setBlockUserArr] = useState([]) ;
    
    useEffect(()=>{

        const userListRef = ref(db,"users") ;
        const friendRequestRef = ref(db, "friendRequest") ;
        const friendsRef = ref(db, "friends") ;
        const bolckUserRef = ref(db,"blockFriends") ;
      

        onValue(userListRef, (snapshot) => {
            let arr = [] ;
            snapshot.forEach((item)=>{
                if (logdinData.uid != item.key) {
                    // console.log(item.val());
                    arr.push({...item.val(),userId:item.key})

                }
            })
            setUserListArr(arr)
        });

        onValue(friendRequestRef, snapshot => {
            const arr = [] ;
            // console.log(snapshot);
            snapshot.forEach((item) => {
              // console.log({...item.val()});
              if (item.val().reciverId == logdinData.uid || item.val().senderId == logdinData.uid) {
      
                arr.push({...item.val(),itemId:item.key})
              }
      
            })
            setFriendRequestArr(arr)
            // console.log(friendRequestArr);
        })
        onValue(friendsRef, snapshot => {
            const arr = [] ;
            // console.log(snapshot);
            snapshot.forEach((item) => {
            //   console.log({...item.val()});
              if (item.val().reciverId == logdinData.uid || item.val().senderId == logdinData.uid) {
      
                arr.push(item.val().reciverId+item.val().senderId)
              }
      
            })
            setFriendsArr(arr)
            // console.log(friendsArr);
        })
        onValue(bolckUserRef,snapshot => {
            const arr = []
            snapshot.forEach(item => {
              // console.log(item.val());
              if (item.val().blockBy == logdinData.uid || item.val().blockTo == logdinData.uid) {
                arr.push(item.val().blockBy + item.val().blockTo)
              }
            })
            setBlockUserArr(arr)
        })
    },[])

    const sentFRHandler = (targetData) => {
        set(push(ref(db,"friendRequest")),{
            senderName: logdinData.displayName,
            senderId: logdinData.uid,
            senderImage: logdinData.photoURL,
            reciverName: targetData.fullName,
            reciverId: targetData.userId,
            reciverImage: targetData.photoURL
        })
        // console.log(targetData);
    }
    // console.log(userListArr);
  return (
    <div className="userBox">
        <Flex className="boxHeadingParrent">
            <Heading tagName="h4" className="" title="user list" />
            <div><BiDotsVertical /></div>
        </Flex>
        <div className="userParrent">

            {
                userListArr.map((item,index)=>{
                    return (
                        <div key={index} className="users">
                            <Flex className="user">
                                <Flex className="userLeft">
                                    <div className="userImageDiv">
                                        <ImageComp className="userImage" imageSrc={item.photoURL} />
                                    </div>
                                    <div>
                                        <Heading tagName="h5" className="userNameHeading" title={item.fullName}>
                                            <Pragraph className="userNameSubHeading" title="today 30:300 PM" />
                                        </Heading>
                                    </div>
                                </Flex>
                                <Flex className="userRight">
                                    {
                                        friendRequestArr.find((el) => el.reciverId == item.userId || el.senderId == item.userId) ?
                                            <Button className="userBtn" style={{background:"pink"}} variant="contained">p</Button>
                                        : friendsArr.includes(logdinData.uid + item.userId) || friendsArr.includes(item.userId + logdinData.uid) ?
                                            <Button className="userBtn" style={{background:"blue"}} variant="contained">f</Button>
                                        : blockUserArr.includes(logdinData.uid + item.userId) ?
                                            <Button className="userBtn" style={{background:"red"}} variant="contained">b</Button>
                                        : blockUserArr.includes(item.userId + logdinData.uid) ?
                                            ""
                                        :
                                            <Button onClick={()=>sentFRHandler(item)} className="userBtn" variant="contained"><BiPlus /></Button>
                                    }
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

export default UserList