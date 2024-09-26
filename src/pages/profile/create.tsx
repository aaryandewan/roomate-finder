// pages/profile/create.tsx
import { useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useRouter } from "next/router";

const ProfileCreate: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();

  // Define state for the form fields
  const [age, setAge] = useState<number>(18);
  const [gender, setGender] = useState<string>("Male");
  const [occupation, setOccupation] = useState<string>("");
  const [hobbies, setHobbies] = useState<string>("");
  const [expectedRent, setExpectedRent] = useState<number>(0);
  const [instagramHandle, setInstagramHandle] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [additionalPhotos, setAdditionalPhotos] = useState<FileList | null>(
    null
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Handle file uploads (you'll need to implement this)
    // For now, we'll assume the images are uploaded and we get URLs back
    const profilePictureUrl = "uploaded_profile_picture_url";
    const additionalPhotosUrls = ["uploaded_additional_photo_url"];

    const data = {
      age,
      gender,
      occupation,
      hobbies: hobbies.split(",").map((hobby) => hobby.trim()),
      expectedRent,
      instagramHandle,
      phoneNumber,
      profilePicture: profilePictureUrl,
      additionalPhotos: additionalPhotosUrls,
      isProfileComplete: true,
    };

    try {
      await axios.put("/api/users/" + session?.user?.id, data);
      router.push("/");
    } catch (error) {
      console.error(error);
    }
  };

  if (!session) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-xl font-bold mb-4">Complete Your Profile</h1>
      <form onSubmit={handleSubmit}>
        {/* Age */}
        <label className="block mb-2">
          Age:
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(parseInt(e.target.value))}
            className="w-full border px-2 py-1"
            required
          />
        </label>
        {/* Gender */}
        <label className="block mb-2">
          Gender:
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full border px-2 py-1"
            required
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </label>
        {/* Occupation */}
        <label className="block mb-2">
          Occupation:
          <input
            type="text"
            value={occupation}
            onChange={(e) => setOccupation(e.target.value)}
            className="w-full border px-2 py-1"
          />
        </label>
        {/* Hobbies */}
        <label className="block mb-2">
          Hobbies (comma-separated):
          <input
            type="text"
            value={hobbies}
            onChange={(e) => setHobbies(e.target.value)}
            className="w-full border px-2 py-1"
          />
        </label>
        {/* Expected Rent */}
        <label className="block mb-2">
          Expected Rent:
          <input
            type="number"
            value={expectedRent}
            onChange={(e) => setExpectedRent(parseInt(e.target.value))}
            className="w-full border px-2 py-1"
            required
          />
        </label>
        {/* Instagram Handle */}
        <label className="block mb-2">
          Instagram Handle:
          <input
            type="text"
            value={instagramHandle}
            onChange={(e) => setInstagramHandle(e.target.value)}
            className="w-full border px-2 py-1"
          />
        </label>
        {/* Phone Number */}
        <label className="block mb-2">
          Phone Number:
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full border px-2 py-1"
          />
        </label>
        {/* Profile Picture */}
        <label className="block mb-2">
          Profile Picture:
          <input
            type="file"
            onChange={(e) =>
              setProfilePicture(e.target.files ? e.target.files[0] : null)
            }
            accept="image/*"
            className="w-full"
            required
          />
        </label>
        {/* Additional Photos */}
        <label className="block mb-2">
          Additional Photos:
          <input
            type="file"
            onChange={(e) =>
              setAdditionalPhotos(e.target.files ? e.target.files : null)
            }
            accept="image/*"
            multiple
            className="w-full"
          />
        </label>
        {/* Submit Button */}
        <button
          type="submit"
          className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
        >
          Save Profile
        </button>
      </form>
    </div>
  );
};

export default ProfileCreate;
