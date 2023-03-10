import "./comments.scss";
import {
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactFragment,
  ReactPortal,
  useContext,
  useState,
} from "react";
import { AuthContext } from "../../context/authContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import moment from "moment";

const Comments = ({ postId }: any) => {
  const [desc, setDesc] = useState("");
  const { user } = useContext(AuthContext);

  const { isLoading, error, data } = useQuery(["comments"], () =>
    makeRequest.get(`/comments?postId=${postId}`).then((response) => {
      return response.data;
    })
  );

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newComment: any) => {
      return makeRequest.post("/comments", newComment);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
  });

  const handleClick = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    mutation.mutate({ desc, postId });
    setDesc("");
  };

  return (
    <div className="comments">
      <div className="comment__write">
        <img src={`/upload/${user?.profileImg}`} alt="" />
        <input
          type="text"
          placeholder="write a comment"
          onChange={(e) => setDesc(e.target.value)}
          value={desc}
        />
        <button onClick={handleClick}>Send</button>
      </div>
      {error
        ? "Something went wrong"
        : isLoading
        ? "Loading"
        : data.map(
            (comment: {
              id: Key | null | undefined;
              profileImg: string | undefined;
              name:
                | string
                | number
                | boolean
                | ReactElement<any, string | JSXElementConstructor<any>>
                | ReactFragment
                | ReactPortal
                | null
                | undefined;
              desc:
                | string
                | number
                | boolean
                | ReactElement<any, string | JSXElementConstructor<any>>
                | ReactFragment
                | ReactPortal
                | null
                | undefined;
              createdAt: Date;
            }) => (
              <div className="comment" key={comment.id}>
                <div className="comment__profile-picture">
                  <img src={`/upload/${comment.profileImg}`} alt="" />
                </div>
                <div className="comment__content">
                  <span className="comment__content__name">
                    {comment?.name}
                  </span>
                  <p className="comment__content__desc">{comment?.desc}</p>
                </div>
                <span className="comment__date">
                  {moment(comment.createdAt).fromNow()}
                </span>
              </div>
            )
          )}
    </div>
  );
};

export default Comments;
