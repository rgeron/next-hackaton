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
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
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
  max_members: z.number().min(2).max(5),
});

export function CreateTeamForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      project_type: "website",
      looking_for: [],
      max_members: 5,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { error, data } = await createTeam(values);

    if (error) {
      toast.error(error);
      return;
    }

    toast.success("Team created successfully!");
    router.refresh();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 border-2 rounded-xl p-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            name="project_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
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
            name="max_members"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maximum Team Size</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(parseInt(value))}
                  defaultValue={field.value.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select max team size" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {[2, 3, 4, 5].map((size) => (
                      <SelectItem key={size} value={size.toString()}>
                        {size} members
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-6">
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
        </div>

        <Button type="submit" className="w-full">
          Create Team
        </Button>
      </form>
    </Form>
  );
}
