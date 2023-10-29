import React from 'react'
import Flex from '../Flex'
import Heading from '../Heading'
import Pragraph from '../Pragraph'
import ImageComp from '../ImageComp'
import { BiDotsVertical } from 'react-icons/bi'
import { useSelector } from 'react-redux'

const MessagesBox = () => {
  const chatWith = useSelector((state) => state.activeChat.value) ;
  return (
    <div>
      <Flex className="messageHead">
        <Flex className="whoActiveSms">
          <div className="messageImageDiv">
            <ImageComp className="activeSmsImage" imageSrc={chatWith?.activeImage} />
          </div>
          <div>
            <Heading tagName="h2" className="currantMessageName" title={chatWith?.activeName}>
              <Pragraph className="messageHeadingOnline" title="online" />
            </Heading>
          </div>
        </Flex>
        <BiDotsVertical />
      </Flex>
    </div>
  )
}

export default MessagesBox