import Sidebar from "@/components/Sidebar";
import ProfileView from "../components/profile/Profile-view";

const Profile = () =>
{
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <main className="flex-1 bg-background">
          <div className="container mx-auto px-6 py-8">
            <ProfileView />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;