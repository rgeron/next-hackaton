"use client";

import { updateUserProfile } from "@/app/actions/profile";
import { SearchSkills } from "@/components/search-skills";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const schools = ["X", "HEC", "ENSAE", "Centrale", "ENSTA"] as const;

const technicalSkills = [
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Python",
  "Git",
  "REST APIs",
  "GraphQL",
  "SQL",
  "NoSQL",
  "Machine Learning",
  "Data Science",
  "Blockchain",
] as const;

const businessSkills = [
  "Project Management",
  "Product Management",
  "Business Strategy",
  "Marketing",
  "Sales",
] as const;

const allSkills = [...technicalSkills, ...businessSkills] as const;

const profileSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  school: z.enum(schools),
  bio: z.string().optional(),
  phone_number: z.string().optional().or(z.literal("")),
  skills: z.array(z.string()).default([]),
  looking_for_a_team: z.boolean().default(false),
  links: z.object({
    github: z.string().url().optional().or(z.literal("")),
    linkedin: z.string().url().optional().or(z.literal("")),
  }),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function ProfileForm(props: { initialData?: ProfileFormValues | null }) {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: props.initialData?.full_name || "",
      school: props.initialData?.school || "X",
      bio: props.initialData?.bio || "",
      phone_number: props.initialData?.phone_number ?? "",
      skills: props.initialData?.skills || [],
      looking_for_a_team: props.initialData?.looking_for_a_team ?? false,
      links: {
        github: props.initialData?.links?.github || "",
        linkedin: props.initialData?.links?.linkedin || "",
      },
    },
  });

  const selectedSkills = form.watch("skills");

  const toggleSkill = (skill: (typeof allSkills)[number]) => {
    const current = form.getValues("skills");
    const updated = current.includes(skill)
      ? current.filter((s) => s !== skill)
      : [...current, skill];
    form.setValue("skills", updated);
  };

  async function onSubmit(data: ProfileFormValues) {
    const result = await updateUserProfile(data);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success("Profile updated successfully");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FormField
            control={form.control}
            name="full_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="school"
            render={({ field }) => (
              <FormItem>
                <FormLabel>School</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your school" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {schools.map((school) => (
                      <SelectItem key={school} value={school}>
                        {school}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input
                    placeholder="+33 6 12 34 56 78"
                    type="tel"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us about yourself"
                  className="resize-none min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="skills"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel>Skills</FormLabel>
              <SearchSkills
                selectedSkills={field.value}
                onSkillsChange={field.onChange}
              />
              <FormDescription>Search and select your skills</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="links.github"
            render={({ field }) => (
              <FormItem>
                <FormLabel>GitHub Profile</FormLabel>
                <FormControl>
                  <Input placeholder="https://github.com/username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="links.linkedin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>LinkedIn Profile</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://linkedin.com/in/username"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="looking_for_a_team"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={!field.value}
                  onCheckedChange={(checked) => field.onChange(!checked)}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>I want to create my own team</FormLabel>
              </div>
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit">Update Profile</Button>
        </div>
      </form>
    </Form>
  );
}
