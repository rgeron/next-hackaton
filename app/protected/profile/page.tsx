import { CreateTeamForm } from "@/components/create-team-form";
import { ProfileForm } from "@/components/profile-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function ProfilePage() {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <Dialog>
        <DialogTrigger asChild>
          <Button>Create a Team</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Your Team</DialogTitle>
          </DialogHeader>
          <CreateTeamForm />
        </DialogContent>
      </Dialog>

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
