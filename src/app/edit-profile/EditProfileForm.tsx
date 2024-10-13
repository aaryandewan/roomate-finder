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
import axios from "axios"; // For API calls
import { useSession } from "next-auth/react"; // To get user session
import { useToast } from "@/hooks/use-toast"; // For toast notifications

const formSchema = z.object({
  location: z.string().min(2, {
    message: "Location must be at least 2 characters.",
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

export default function EditProfileForm({ user }: { user: any }) {
  const { data: session } = useSession(); // Get the session
  const { toast } = useToast(); // To show toast notifications

  // Pre-fill the form with existing data
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: user.location || "", // Pre-fill with user's location
      expectedRent: user.expectedRent || "", // Pre-fill with expected rent
      phoneNumber: user.phoneNumber || "", // Pre-fill with phone number
      instagramHandle: user.instagramHandle || "", // Pre-fill with Instagram handle
    },
  });

  const [profileImage, setProfileImage] = useState(
    user.profilePicture || "/placeholder.svg"
  );
  const [imageFile, setImageFile] = useState<File | null>(null); // To hold the selected image file

  // Function to handle image selection
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file); // Store the image file to upload later
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string); // Preview the image
      };
      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    let profilePictureUrl = user.profilePicture; // Keep existing picture if no new picture is uploaded

    // If a new image is selected, upload it to S3
    if (imageFile) {
      try {
        // Get the signed URL from the backend
        const { data: signedUrlData } = await axios.get("/api/upload");

        // Use the signed URL to upload the image file to S3
        await axios.put(signedUrlData.url, imageFile, {
          headers: {
            "Content-Type": imageFile.type,
            // "x-amz-acl": "public-read",
          }, // Set the correct content type
        });

        // Save the image URL from S3 (without the signed part)
        profilePictureUrl = signedUrlData.url.split("?")[0];
      } catch (error) {
        toast({
          title: "Error",
          description: "There was an issue uploading the profile picture.",
          variant: "destructive",
        });
        console.error("Error uploading image:", error);
        return;
      }
    }

    // Update the user's profile with the new data and profile picture URL
    axios
      .put(`/api/users/${session?.user?.id}`, {
        ...values,
        profilePicture: profilePictureUrl, // Include the image URL in the profile update
      })
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
