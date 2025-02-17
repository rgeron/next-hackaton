"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Team } from "@/lib/types/database.types";
import { createClient } from "@/utils/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const applicationSchema = z.object({
  why_participate: z
    .string()
    .min(
      100,
      "Please explain why you want to participate (min. 100 characters)"
    ),
  team_strengths: z
    .string()
    .min(100, "Please describe your team's strengths (min. 100 characters)"),
});

type ApplicationFormValues = z.infer<typeof applicationSchema>;

export function TeamApplicationForm(props: { team: Team }) {
  const router = useRouter();
  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      why_participate: "",
      team_strengths: "",
    },
  });

  async function onSubmit(data: ApplicationFormValues) {
    try {
      const supabase = createClient();

      const { error } = await supabase.from("hackathon_applications").insert([
        {
          team_id: props.team.id,
          ...data,
          status: "pending",
        },
      ]);

      if (error) throw error;

      toast.success("Application submitted successfully!");
      router.push("/protected/team");
    } catch (error) {
      toast.error("Failed to submit application. Please try again.");
      console.error("Application submission error:", error);
    }
  }

  return (
    <div className="space-y-8">
      {/* Display existing team information */}
      <Card>
        <CardHeader>
          <CardTitle>Team Information</CardTitle>
          <CardDescription>Current information about your team</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Team Name</h4>
            <p className="text-sm text-muted-foreground">{props.team.name}</p>
          </div>

          <div>
            <h4 className="font-medium mb-2">Project Description</h4>
            <p className="text-sm text-muted-foreground">
              {props.team.description}
            </p>
          </div>

          <div>
            <h4 className="font-medium mb-2">Project Type</h4>
            <Badge variant="secondary">{props.team.project_type}</Badge>
          </div>

          <div>
            <h4 className="font-medium mb-2">
              Team Members ({props.team.members.length}/{props.team.max_members}
              )
            </h4>
            <div className="space-y-2">
              {props.team.members.map((member, index) => (
                <div key={index} className="text-sm">
                  <span className="font-medium">{member.name}</span>
                  <span className="text-muted-foreground">
                    {" "}
                    - {member.role}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Looking For</h4>
            <div className="flex flex-wrap gap-2">
              {props.team.looking_for.map((skill, index) => (
                <Badge key={index} variant="outline">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Application form for new information */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="why_participate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Why do you want to participate?</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us why you want to participate in the HEC Hackathon..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Explain your motivation for participating in the hackathon
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="team_strengths"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Team Strengths</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe your team's strengths and experiences..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Highlight your team's key strengths and relevant experience
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/protected/team")}
            >
              Cancel
            </Button>
            <Button type="submit">Submit Application</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
