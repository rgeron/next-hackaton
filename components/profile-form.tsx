"use client";

import { updateUserProfile } from "@/app/actions/profile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
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
  skills: z.array(z.enum(allSkills)).default([]),
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
      skills: props.initialData?.skills || [],
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us about yourself"
                  className="resize-none"
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
          render={() => (
            <FormItem>
              <FormLabel>Skills</FormLabel>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Technical Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {technicalSkills.map((skill) => (
                      <Badge
                        key={skill}
                        variant={
                          selectedSkills.includes(skill)
                            ? "default"
                            : "secondary"
                        }
                        className={cn(
                          "cursor-pointer select-none",
                          selectedSkills.includes(skill) &&
                            "bg-primary text-primary-foreground"
                        )}
                        onClick={() => toggleSkill(skill)}
                      >
                        {skill}
                        {selectedSkills.includes(skill) && (
                          <X className="ml-1 h-3 w-3" />
                        )}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Business Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {businessSkills.map((skill) => (
                      <Badge
                        key={skill}
                        variant={
                          selectedSkills.includes(skill)
                            ? "default"
                            : "secondary"
                        }
                        className={cn(
                          "cursor-pointer select-none",
                          selectedSkills.includes(skill) &&
                            "bg-primary text-primary-foreground"
                        )}
                        onClick={() => toggleSkill(skill)}
                      >
                        {skill}
                        {selectedSkills.includes(skill) && (
                          <X className="ml-1 h-3 w-3" />
                        )}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <FormDescription>
                Click on skills to add/remove them from your profile
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

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

        <Button type="submit">Update Profile</Button>
      </form>
    </Form>
  );
}
