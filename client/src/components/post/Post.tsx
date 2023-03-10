import "./post.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import Comments from "../comments/Comments";
import moment from "moment";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { AuthContext } from "../../context/authContext";

interface Post {
  id: number;
  name: string;
  userId: number;
  profileImg: string;
  desc: string;
  img: string;
  createdAt: Date;
}

const Post: React.FC<{ post: Post | null }> = ({ post }) => {
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const { user } = useContext(AuthContext);

  const { isLoading, error, data } = useQuery(["likes", post?.id], () =>
    makeRequest.get(`/likes?postId=${post?.id}`).then((response) => {
      return response.data;
    })
  );

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (liked: any) => {
      if (liked) return makeRequest.delete(`/likes?postId=${post?.id}`);
      return makeRequest.post("/likes", { postId: post?.id });
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["likes"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (postId: any) => {
      return makeRequest.delete(`/posts/${postId}`);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const handleLike = () => {
    mutation.mutate(data?.includes(user?.id));
  };

  const handleDelete = () => {
    deleteMutation.mutate(post?.id);
  };

  return (
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="userInfo">
            <img src={`/upload/${post?.profileImg}`} alt="" />
            <div className="details">
              <Link
                to={`/profile/${post?.userId}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span className="name">{post?.name}</span>
              </Link>
              <span className="date">{moment(post?.createdAt).fromNow()}</span>
            </div>
          </div>
          <MoreHorizIcon onClick={() => setMenuOpen(!menuOpen)} />
          {menuOpen && post?.userId === user?.id && (
            <button onClick={handleDelete}>Delete</button>
          )}
        </div>
        <div className="content">
          <p>{post?.desc}</p>
          <img src={`/upload/${post?.img}`} alt="" />
        </div>
        <div className="info">
          <div className="item">
            {isLoading ? (
              "Loading"
            ) : data?.includes(user?.id) ? (
              <FavoriteOutlinedIcon
                style={{ color: "red" }}
                onClick={handleLike}
              />
            ) : (
              <FavoriteBorderOutlinedIcon onClick={handleLike} />
            )}
            {data?.length} Likes
          </div>
          <div className="item" onClick={() => setCommentsOpen(!commentsOpen)}>
            <TextsmsOutlinedIcon />
            12 Comments
          </div>
          <div className="item">
            <ShareOutlinedIcon />
            Share
          </div>
        </div>
        {commentsOpen && <Comments postId={post?.id} />}
      </div>
    </div>
  );
};

export default Post;
