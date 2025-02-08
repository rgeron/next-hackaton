"use client";

import { createTeam } from "@/app/actions/team";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Team } from "@/lib/types/database.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const JOB_OPTIONS = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "UI/UX Designer",
  "Product Manager",
  "Data Scientist",
  "DevOps Engineer",
  "Mobile Developer",
  "Marketing Specialist",
  "Business Developer",
] as const;

const formSchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().min(10).max(500),
  project_type: z.enum([
    "physical product",
    "website",
    "mobile app",
    "software",
  ]),
  looking_for: z.array(z.enum([...JOB_OPTIONS])).min(1),
});

export function CreateTeamForm() {
  const router = useRouter();
  const [createdTeam, setCreatedTeam] = useState<Team | null>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      project_type: "website",
      looking_for: [],
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { error, data } = await createTeam(values);

    if (error) {
      toast.error(error);
      return;
    }

    toast.success("Team created successfully!");
    setCreatedTeam(data);
    router.refresh();
  }

  const copyInviteLink = () => {
    if (!createdTeam) return;
    const inviteLink = `${window.location.origin}/invite/${createdTeam.id}`;
    navigator.clipboard.writeText(inviteLink);
    toast.success("Invite link copied to clipboard!");
  };

  if (createdTeam) {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="font-semibold">Team Created!</h3>
          <p className="text-sm text-muted-foreground">
            Your team has been created successfully. Share the invite link with
            your teammates.
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Team Details</h4>
            <Button onClick={copyInviteLink} variant="outline" size="sm">
              Copy Invite Link
            </Button>
          </div>
          <div className="rounded-lg border p-3 space-y-3">
            <div>
              <span className="text-sm font-medium">Name:</span>
              <span className="text-sm ml-2">{createdTeam.name}</span>
            </div>
            <div>
              <span className="text-sm font-medium">Project Type:</span>
              <span className="text-sm ml-2">{createdTeam.project_type}</span>
            </div>
            <div>
              <span className="text-sm font-medium">Looking for:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {createdTeam.looking_for.map((role) => (
                  <span
                    key={role}
                    className="text-xs px-2 py-1 bg-secondary rounded-md"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Team Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter team name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your team and project"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="project_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select project type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="physical product">
                    Physical Product
                  </SelectItem>
                  <SelectItem value="website">Website</SelectItem>
                  <SelectItem value="mobile app">Mobile App</SelectItem>
                  <SelectItem value="software">Software</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="looking_for"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Looking For (select multiple)</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(value) => {
                    const currentValues = Array.isArray(field.value)
                      ? field.value
                      : [];
                    if (!currentValues.includes(value as any)) {
                      field.onChange([...currentValues, value]);
                    }
                  }}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Add team roles" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {JOB_OPTIONS.map((job) => (
                      <SelectItem key={job} value={job}>
                        {job}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              {field.value && field.value.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {field.value.map((value) => (
                    <div
                      key={value}
                      className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-md"
                    >
                      <span>{value}</span>
                      <button
                        type="button"
                        onClick={() => {
                          field.onChange(
                            field.value.filter((v) => v !== value)
                          );
                        }}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Create Team
        </Button>
      </form>
    </Form>
  );
}
