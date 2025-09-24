import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";
import { AuthContext } from "../../context/AuthContext";

const ProfilePage = () => {
  const { authUser, updateProfile } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();
  const [name, setName] = useState(authUser.fullName);
  const [bio, setBio] = useState(authUser.bio);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!selectedImage) {
        await updateProfile({ fullName: name, bio });
        navigate("/");
        return;
      } else {
        const reader = new FileReader();
        reader.readAsDataURL(selectedImage);
        reader.onload = async () => {
          try {
            const base64Image = reader.result;
            await updateProfile({
              profilePic: base64Image,
              fullName: name,
              bio,
            });
            navigate("/");
          } catch (err) {
            console.error("Error while updating profile", err);
          } finally {
            setLoading(false);
          }
        };
        return;
      }
    } catch (err) {
      console.error("Error while updating profile", err);
    } finally {
      if (!selectedImage) setLoading(false);
    }
  };
  return (
    <div>
      <div className="min-h-screen bg-cover bg-no-repeat flex items-center justify-center">
        <div className="w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-5 p-10 flex-1"
          >
            <h3 className="text-lg">Profile Details</h3>
            <label
              htmlFor="avatar"
              className="flex items-center gap-3 cursor-pointer"
            >
              <input
                onChange={(e) => setSelectedImage(e.target.files[0])}
                type="file"
                id="avatar"
                accept=".png, .jpg, .jpeg"
                hidden
              />
              <img
                src={
                  selectedImage
                    ? URL.createObjectURL(selectedImage)
                    : assets.avatar_icon
                }
                alt="Profile Image"
                className={`w-12 h-12 ${selectedImage && "rounded-full"}`}
              />
              Upload Profile Image
            </label>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              type="text"
              required
              placeholder="Your name"
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
            <textarea
              placeholder="Write profile bio"
              required
              className="p-2 border border-gray-500 rounded-md focus:outline-md focus:ring-2 focus:ring-violet-500"
              rows={4}
              onChange={(e) => setBio(e.target.value)}
              value={bio}
            ></textarea>

            {/* button to submit the form */}
            <button
              type="submit"
              disabled={loading}
              className={`bg-gradient-to-r from-purple-400 to-violet-600 text-white p-2 rounded-full text-lg cursor-pointer ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="h-6 w-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                  {/* <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    ></path>
                  </svg> */}
                  Saving...
                </div>
              ) : (
                "Save"
              )}
            </button>
          </form>
          <img
            className={`max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10 ${
              selectedImage && "rounded-full"
            }`}
            src={authUser?.profilePic || assets.logo_icon}
            alt="profile_logo_icon"
          />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
