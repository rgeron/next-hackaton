import { ProfileForm } from "@/components/profile-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ProfilePage() {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Complete Your Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileForm />
        </CardContent>
      </Card>
    </div>
  );
}

export default ProfilePage;
