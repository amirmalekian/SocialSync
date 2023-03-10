import "./profile.scss";
import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import TwitterIcon from "@mui/icons-material/Twitter";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Posts from "../../components/posts/Posts";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import Update from "../../components/update/Update";

const Profile = () => {
  const [openUpdate, setOpenUpdate] = useState(false);
  const { user } = useContext(AuthContext);

  const userId = parseInt(useLocation().pathname.split("/")[2]);

  const { isLoading, error, data } = useQuery(["user"], () =>
    makeRequest.get(`/users/find/${userId}`).then((response) => {
      return response.data;
    })
  );

  const { isLoading: rIsLoading, data: relationshipData } = useQuery(
    ["relationship"],
    () =>
      makeRequest
        .get(`/relationships?followedUserId=${userId}`)
        .then((response) => {
          return response.data;
        })
  );

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (following: any) => {
      if (following)
        return makeRequest.delete(`/relationships?userId=${userId}`);
      return makeRequest.post("/relationships", { userId });
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["relationship"] });
    },
  });

  const handleFollow = () => {
    mutation.mutate(relationshipData?.includes(user?.id));
  };

  return (
    <div className="profile">
      {isLoading ? (
        "Loading"
      ) : (
        <>
          <div className="profile__images">
            <img
              src={`/upload/${data?.coverImg}`}
              alt=""
              className="profile__images-cover"
            />
            <img
              src={`/upload/${data?.profileImg}`}
              alt=""
              className="profile__images-profileImg"
            />
          </div>
          <div className="profile__container">
            <div className="profile__container__userInfo">
              <div className="profile__container__userInfo-left">
                <a href="https://facebook.com">
                  <FacebookTwoToneIcon fontSize="large" />
                </a>
                <a href="https://instagram.com">
                  <InstagramIcon fontSize="large" />
                </a>
                <a href="https://twitter.com">
                  <TwitterIcon fontSize="large" />
                </a>
                <a href="https://linkedin.com">
                  <LinkedInIcon fontSize="large" />
                </a>
                <a href="https://pinterest.com">
                  <PinterestIcon fontSize="large" />
                </a>
              </div>
              <div className="profile__container__userInfo-center">
                <span>{data?.name}</span>
                <div className="profile__container__userInfo_center-info">
                  <div className="profile__container__userInfo_center-item">
                    <PlaceIcon />
                    <span>{data?.city}</span>
                  </div>
                  <div className="profile__container__userInfo_center-item">
                    <LanguageIcon />
                    <span>{data?.website}</span>
                  </div>
                </div>
                {rIsLoading ? (
                  "Loading"
                ) : userId === user?.id ? (
                  <button onClick={() => setOpenUpdate(true)}>update</button>
                ) : (
                  <button onClick={handleFollow}>
                    {relationshipData?.includes(user?.id)
                      ? "Following"
                      : "Follow"}
                  </button>
                )}
              </div>
              <div className="profile__container__userInfo-right">
                <EmailOutlinedIcon />
                <MoreVertIcon />
              </div>
            </div>
            <Posts userId={userId} />
          </div>
        </>
      )}
      {openUpdate && <Update setOpenUpdate={setOpenUpdate} user={data} />}
    </div>
  );
};

export default Profile;
