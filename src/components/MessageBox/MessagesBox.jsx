import React from 'react'
import Flex from '../Flex'
import Heading from '../Heading'
import Pragraph from '../Pragraph'
import ImageComp from '../ImageComp'

const MessagesBox = () => {
  return (
    <div>
      <Flex className="messageHead">
        <Flex>
          <div className="messageImageDiv">
            <ImageComp imageSrc={""} />
          </div>
          <Heading tagName="h2" className="currantMessageName" title={""}>
            <Pragraph className="messageHeadingOnline" title="online" />
          </Heading>
        </Flex>
      </Flex>
    </div>
  )
}

export default MessagesBox