import {useRef, useEffect, useState} from 'react'
import dp from '../assets/dp.png'
import moment from 'moment'

function Post({ id, author, content, like, comment, image, createdAt }) {
  let [more, setMore] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      const el = contentRef.current;
      if (el.scrollHeight > el.clientHeight) {
        setShowReadMore(true);
      }
    }
  }, [content]);


  return (
    <div className="bg-white min-h-[200px] p-[10px]">
      <div className='flex items-start gap-[10px]'>
        <div className='w-[60px] h-[60px] rounded-full overflow-hidden flex items-center justify-center cursor-pointer'>
          <img src={author.profilePic || dp} alt="" />
        </div>

        <div>
          <div className='text-[22px] font-bold'>
            {`${author.firstName} ${author.lastName}`}
          </div>
          <div className='text-[16px]'>
            {author.headline}
          </div>
          <div className='text-[16px]'>
            {moment(createdAt).fromNow()}
          </div>
        </div>

        <div>
          {/*Button*/}
        </div>
      </div>

      <div
        ref={contentRef}
        className={`pl-[40px] pr-[10px] mt-2 transition-all duration-200
          ${more ? '' : 'max-h-[100px] overflow-hidden'}
        `}
      >
        {content}
      </div>

      {/* Read More */}
      {showReadMore && (
        <div
          className="font-semibold text-blue-600 pl-[40px] cursor-pointer"
          onClick={() => setMore(!more)}
        >
          {more ? 'Read less' : 'Read more'}
        </div>
      )}

  

      {image && <div className="w-[100%] pl-[40px] pr-[10px] mt-[7px] h-[300px] flex justify-center items-center">
        <img src = {image} className="h-full w-full rounded-lg"/>
      </div>}

    </div>
  )
}

export default Post
