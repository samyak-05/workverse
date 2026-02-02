import { useRef, useEffect, useState, useContext } from 'react'
import dp from '../assets/dp.png'
import { AiOutlineLike } from "react-icons/ai";
import { IoMdSend } from "react-icons/io";
import { BiLike, BiSolidLike } from "react-icons/bi";
import { FaRegCommentDots } from "react-icons/fa";
import { authDataContext } from '../context/AuthContext'
import { userDataContext } from '../context/UserContext'
import moment from 'moment'
import axios from 'axios'
import { io } from 'socket.io-client'
import ConnectionButton from './ConnectionButton';

let socket = io(import.meta.env.VITE_SERVER_URL);

function Post({ id, author, content, like, comments, image, createdAt }) {
  let [more, setMore] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);
  const contentRef = useRef(null);

  let { userData, getProfile } = useContext(userDataContext)
  let { serverUrl } = useContext(authDataContext);

  let [likes, setLikes] = useState(like || []);
  let [commentContent, setCommentContent] = useState('');
  let [comment, setComment] = useState(comments || []);
  let [showComment, setShowComment] = useState(false);

  useEffect(() => {
    setComment(comments || []);
  }, [comments]);

  const likePost = async () => {
    if (!serverUrl || !userData?._id) return;

    try {
      const res = await axios.get(
        serverUrl + `/api/post/like/${id}`,
        { withCredentials: true }
      );
      setLikes(res.data.like);
    } catch (err) {
      console.log(err);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentContent.trim() || !serverUrl || !userData?._id) return;

    try {
      const res = await axios.post(
        serverUrl + `/api/post/comment/${id}`,
        { content: commentContent },
        { withCredentials: true }
      );
      setComment(res.data.comments);
      setCommentContent('');
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const handleLikeUpdated = ({ postId, likes }) => {
      if (postId === id) setLikes(likes);
    };

    const handleCommentUpdated = ({ postId, comments }) => {
      if (postId === id) setComment(comments);
    };

    socket.on("likeUpdated", handleLikeUpdated);
    socket.on("commentUpdated", handleCommentUpdated);

    return () => {
      socket.off("likeUpdated", handleLikeUpdated);
      socket.off("commentUpdated", handleCommentUpdated);
    };
  }, [id]);

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

      {/* HEADER */}
      <div className="flex items-start gap-[10px] min-w-0">
        <div
          className="w-[60px] h-[60px] rounded-full overflow-hidden shrink-0 cursor-pointer"
          onClick={() => author?.username && getProfile(author.username)}
        >
          <img
            src={author?.profilePic || dp}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col min-w-0 flex-1">
          <div className="text-[22px] font-bold truncate">
            {author?.firstName} {author?.lastName}
          </div>
          <div className="text-[16px] text-gray-700 truncate">
            {author?.headline}
          </div>
          <div className="text-[14px] text-gray-500">
            {moment(createdAt).fromNow()}
          </div>
        </div>

        <div className="ml-auto mr-[20px] shrink-0">
          {userData?._id && userData._id !== author?._id && (
            <ConnectionButton userId={author._id} />
          )}
        </div>
      </div>

      {/* CONTENT */}
      <div
        ref={contentRef}
        className={`pl-[40px] pr-[10px] mt-2 transition-all duration-200
          ${more ? '' : 'max-h-[100px] overflow-hidden'}
        `}
      >
        {content}
      </div>

      {showReadMore && (
        <div
          className="font-semibold text-blue-600 pl-[40px] cursor-pointer"
          onClick={() => setMore(!more)}
        >
          {more ? 'Read less' : 'Read more'}
        </div>
      )}

      {image && (
        <div className="w-full pl-[40px] pr-[10px] mt-[7px] h-[300px]">
          <img src={image} className="h-full w-full rounded-lg object-cover" />
        </div>
      )}

      {/* COUNTS */}
      <div className="flex justify-between pr-[10px] pl-[40px] mt-[10px]">
        <div className="text-[18px]">
          <AiOutlineLike className="text-blue-400 inline-block mr-[4px]" />
          {likes.length}
        </div>
        <div className="text-[18px]">
          {comment.length} Comments
        </div>
      </div>

      <div className="w-full bg-gray-300 h-[1px] mt-[10px]"></div>

      {/* ACTIONS - FIXED ALIGNMENT */}
      <div className="flex items-center gap-[40px] px-[40px] py-[10px]">
        <div onClick={likePost} className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded-md">
          {!likes.includes(userData?._id) ? (
            <><BiLike size={20} /> Like</>
          ) : (
            <><BiSolidLike size={20} className="text-blue-600" /> <span className="text-blue-600 font-semibold">Liked</span></>
          )}
        </div>

        <div
          className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded-md"
          onClick={() => setShowComment(!showComment)}
        >
          <FaRegCommentDots size={20} /> Comment
        </div>
      </div>

      <div className="w-full bg-gray-300 h-[1px]"></div>

      {/* COMMENTS */}
      {showComment && (
        <div>
          <form className="w-full px-[20px] mt-[10px]" onSubmit={handleComment}>
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Write a comment..."
                className="w-full border rounded-full py-[8px] pl-[20px] pr-[45px] outline-none"
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">
                <IoMdSend size={20} />
              </button>
            </div>
          </form>

          <div className="flex flex-col gap-[10px] mt-4">
            {comment.map((cmt, index) => (
              <div key={index} className="border-b p-[10px]">
                <div className="flex items-center gap-[10px]">
                  <img
                    src={cmt.author?.profilePic || dp}
                    className="w-[30px] h-[30px] rounded-full object-cover"
                  />
                  <div className="font-bold">
                    {cmt.author?.firstName} {cmt.author?.lastName}
                  </div>
                  <div className="text-gray-400 ml-auto">
                    {moment(cmt.createdAt).fromNow()}
                  </div>
                </div>
                <div className="pl-[40px]">{cmt.content}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Post;