import { getUserProfile } from "@/app/actions/profile";
import { ProfileForm } from "@/components/profile-form";

export default async function ProfilePage() {
  const { data: profile } = await getUserProfile();

  return (
    <main className="min-h-screen w-full py-4 sm:py-8">
      <div className="container mx-auto px-2 sm:px-6 lg:px-8 max-w-[90rem]">
        <div className="bg-card p-4 sm:p-6 rounded-lg border-2">
          <ProfileForm initialData={profile} />
        </div>
      </div>
    </main>
  );
}
