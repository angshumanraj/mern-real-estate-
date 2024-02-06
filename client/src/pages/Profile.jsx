import { useSelector } from "react-redux";

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <div>
      <h1 className="text-3xl font-semibold my-7"></h1>
      <form className="max-w-md mx-auto flex flex-col gap-3 items-center">
        <img
          src={currentUser.avatar}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        ></img>
        <input
          type="text"
          placeholder="Username"
          id="username"
          className="border p-2 rounded-lg w-full"
        ></input>
        <input
          type="email"
          placeholder="Email"
          id="email"
          className="border p-2 rounded-lg w-full"
        ></input>
        <input
          type="password"
          placeholder="Password"
          id="password"
          className="border p-2 rounded-lg w-full"
        ></input>
        <button
          className="bg-slate-800 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:hover:opacity-80 w-full"
        >
          Update
        </button>
        <div className="flex justify-between mt-5 w-full">
          <span className="text-red-700 cursor-pointer">Delete Account</span>
          <span className="text-green-500 cursor-pointer">Sign Out</span>
        </div>
      </form>
    </div>
  );
};

export default Profile;
