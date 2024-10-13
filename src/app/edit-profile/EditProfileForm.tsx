"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import axios from "axios"; // For API calls
import { useSession } from "next-auth/react"; // To get user session
import { useToast } from "@/hooks/use-toast"; // For toast notifications

const formSchema = z.object({
  location: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
  hobbies: z.array(z.string()).min(1, {
    message: "Please select at least one hobby.",
  }),
  expectedRent: z.string().regex(/^\d+$/, {
    message: "Expected rent must be a number.",
  }),
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, {
    message: "Please enter a valid phone number.",
  }),
  instagramHandle: z.string().regex(/^@?[\w.]+$/, {
    message: "Please enter a valid Instagram handle.",
  }),
});

const hobbyOptions = [
  "Gymming",
  "Cycling",
  "Dining Out",
  "Reading",
  "Traveling",
  "Photography",
  "Cooking",
  "Hiking",
  "Painting",
  "Gaming",
  "Yoga",
  "Dancing",
  "Gardening",
];

export default function EditProfileForm({ user }: { user: any }) {
  const { data: session } = useSession(); // Get the session
  const { toast } = useToast(); // To show toast notifications

  // Pre-fill the form with existing data
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: user.location || "", // Pre-fill with user's location
      hobbies: user.hobbies || [], // Pre-fill with user's hobbies
      expectedRent: user.expectedRent || "", // Pre-fill with expected rent
      phoneNumber: user.phoneNumber || "", // Pre-fill with phone number
      instagramHandle: user.instagramHandle || "", // Pre-fill with Instagram handle
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Call the API to update the user's profile
    axios
      .put(`/api/users/${session?.user?.id}`, values) // Use session to get user ID
      .then((response) => {
        toast({
          title: "Profile Updated",
          description: "Your profile has been successfully updated.",
        });
        console.log("Profile updated:", response.data);
      })
      .catch((error) => {
        toast({
          title: "Error",
          description:
            "There was an issue updating your profile. Please try again.",
          variant: "destructive",
        });
        console.error("Error updating profile:", error);
      });
  }

  const [profileImage, setProfileImage] = useState(user.profilePicture || "/placeholder.svg");

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Edit Your Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex flex-col items-center">
            <Avatar className="w-32 h-32 mb-4">
              <AvatarImage src={profileImage} alt="Profile picture" />
              <AvatarFallback>UP</AvatarFallback>
            </Avatar>
            <Label
              htmlFor="picture"
              className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
            >
              Update Picture
            </Label>
            <Input
              id="picture"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your location" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="hobbies"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hobbies</FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        <ScrollArea className="h-20 w-full border rounded-md p-2">
                          <div className="flex flex-wrap gap-2">
                            {field.value.map((hobby) => (
                              <Badge
                                key={hobby}
                                variant="secondary"
                                className="bg-secondary text-secondary-foreground hover:bg-secondary/80 cursor-pointer"
                                onClick={() => {
                                  const newValue = field.value.filter(
                                    (h) => h !== hobby
                                  );
                                  form.setValue("hobbies", newValue);
                                }}
                              >
                                {hobby} ✕
                              </Badge>
                            ))}
                          </div>
                        </ScrollArea>
                        <ScrollArea className="h-20 w-full border rounded-md p-2">
                          <div className="flex flex-wrap gap-2">
                            {hobbyOptions
                              .filter((hobby) => !field.value.includes(hobby))
                              .map((hobby) => (
                                <Badge
                                  key={hobby}
                                  variant="outline"
                                  className="bg-background hover:bg-secondary/80 cursor-pointer"
                                  onClick={() => {
                                    const newValue = [...field.value, hobby];
                                    form.setValue("hobbies", newValue);
                                  }}
                                >
                                  {hobby}
                                </Badge>
                              ))}
                          </div>
                        </ScrollArea>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="expectedRent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expected Rent</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter expected rent"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="instagramHandle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instagram Handle</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your Instagram handle"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Save Changes
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
