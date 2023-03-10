import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import "./stories.scss";
import story1 from "../../assets/stories/3.jpg";
import story2 from "../../assets/stories/4.jpg";
import story3 from "../../assets/stories/1.jpg";
import story4 from "../../assets/stories/2.jpg";

const Stories = () => {
  const { user } = useContext(AuthContext);

  // Temporarily Use Dummy Data
  const stories = [
    {
      id: 1,
      name: "John Doe",
      img: story1,
    },
    {
      id: 2,
      name: "John Doe",
      img: story2,
    },
    {
      id: 3,
      name: "John Doe",
      img: story3,
    },
    {
      id: 4,
      name: "John Doe",
      img: story4,
    },
  ];

  return (
    <div className="stories">
      <div className="story">
        <img src={`/upload/${user?.profileImg}`} alt="" />
        <span>{user?.username}</span>
        <button>+</button>
      </div>
      {stories.map((story) => (
        <div className="story" key={story.id}>
          <img src={story.img} alt="" />
          <span>{story.name}</span>
        </div>
      ))}
    </div>
  );
};

export default Stories;