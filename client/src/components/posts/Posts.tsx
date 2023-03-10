import Post from "../post/Post";
import "./posts.scss";
import post1 from "../../assets/posts/cat1.jpg";
import post2 from "../../assets/posts/cat2.jpg";
import w1 from "../../assets/users/w1.jpg";
import m1 from "../../assets/users/m1.jpg";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";

interface PostsProps {
  userId?: number;
}

const Posts = ({ userId }: PostsProps) => {
  const { isLoading, error, data } = useQuery(["posts"], () =>
    makeRequest.get(`/posts?userId=${userId}`).then((response) => {
      return response.data;
    })
  );

  return (
    <div className="posts">
      {error
        ? "Something went wrong!"
        : isLoading
        ? "Loading"
        : data.map((post: Post | null) => <Post post={post} key={post?.id} />)}
    </div>
  );
};

export default Posts;
