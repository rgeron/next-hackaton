import { getUserProfile } from "@/app/actions/profile";
import { ProfileForm } from "@/components/profile-form";

export default async function ProfilePage() {
  const { data: profile } = await getUserProfile();

  return (
    <main className="min-h-screen w-full py-4 sm:py-8">
      <div className="container mx-auto px-2 sm:px-6 lg:px-8 max-w-[90rem] space-y-6">
        <h1 className="text-2xl font-bold text-center">
          Complete your profile
        </h1>
        <ProfileForm initialData={profile} />
      </div>
    </main>
  );
}
