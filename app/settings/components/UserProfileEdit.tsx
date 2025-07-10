"use client";

import type React from "react";
import type { UserType } from "@/lib/definitions";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useActionState, useEffect, useState, useTransition } from "react";
import { User, Heart, Camera, Save, X, Loader2 } from "lucide-react";
import { redirect } from "next/navigation";
import LoadingScreen from "@/components/LoadingScreen";
import ProfilePageImage from "@/app/profile/components/ProfilePageImage";
import { updateUserProfile } from "@/actions";

interface EditUserProfileProps {
  user: UserType;
}

export default function UserProfileEdit({ user }: EditUserProfileProps) {
  const [isPending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);
  const pfp = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${user.pfp}`;

  const initialFormData = {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone || "",
    dob: user.dob || "",
    gender: user.gender || "",
    bloodType: user.bloodType || "",
    allergies: user.allergies || [],
    emailNotifications: user.emailNotifications ?? true,
    smsReminders: user.smsReminders ?? true,
    twoFactorEnabled: user.twoFactorEnabled ?? false,
  };

  const initialPfp = pfp;

  function isEqual(a: any, b: any): boolean {
    return JSON.stringify(a) === JSON.stringify(b);
  }

  const onCancel = async () => {
    if (!state.success && uploadedPublicId) {
      await fetch("/api/delete-image", {
        method: "POST",
        body: JSON.stringify({ public_id: uploadedPublicId }),
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
    redirect("/profile");
  };

  const [formData, setFormData] = useState({
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone || "",
    dob: user.dob || "",
    gender: user.gender || "",
    bloodType: user.bloodType || "",
    allergies: user.allergies || [],
    emailNotifications: user.emailNotifications ?? true,
    smsReminders: user.smsReminders ?? true,
    twoFactorEnabled: user.twoFactorEnabled ?? false,
  });

  const initialState = { success: false };
  const [state, formAction] = useActionState(updateUserProfile, initialState);
  const [profileImage, setProfileImage] = useState<string | undefined>(pfp);
  const [uploadedPublicId, setUploadedPublicId] = useState<string | null>(null);
  const [allergyInput, setAllergyInput] = useState("");

  const handleInputChange = (
    field: string,
    value: string | boolean | string[]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    const handleUnload = () => {
      if (!state.success && uploadedPublicId) {
        navigator.sendBeacon(
          "/api/delete-image",
          JSON.stringify({ public_id: uploadedPublicId })
        );
      }
    };
    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, [uploadedPublicId, state.success]);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_PROFILE_UPLOAD_PRESET!
    );
    formData.append("folder", "profile_images");

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      setUploading(false);
      const data = await res.json();
      if (data.secure_url && data.public_id) {
        const cloudinaryUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${data.public_id}`;
        setProfileImage(cloudinaryUrl);
        setUploadedPublicId(data.public_id);
      } else {
        console.error("Cloudinary upload failed", data);
      }
    } catch (error) {
      console.error("Image upload error:", error);
    }
  };

  const addAllergy = () => {
    if (
      allergyInput.trim() &&
      !formData.allergies.includes(allergyInput.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        allergies: [...prev.allergies, allergyInput.trim()],
      }));
      setAllergyInput("");
    }
  };

  const removeAllergy = (allergy: string) => {
    setFormData((prev) => ({
      ...prev,
      allergies: prev.allergies.filter((a) => a !== allergy),
    }));
  };

  const handleSave = () => {
    const currentFormData = {
      ...formData,
      allergies: [...formData.allergies],
    };
    const currentPfp = profileImage;

    const initialDataToCompare = {
      ...initialFormData,
      pfp: initialPfp,
    };
    const currentDataToCompare = {
      ...currentFormData,
      pfp: currentPfp,
    };

    if (isEqual(currentDataToCompare, initialDataToCompare)) {
      alert("No changes made to save.");
      return;
    }

    const form = new FormData();
    form.append("id", formData.id);
    form.append("name", formData.name);
    form.append("email", formData.email);
    form.append("phone", formData.phone);
    form.append("dob", formData.dob);
    form.append("gender", formData.gender);
    form.append("pfp", profileImage?.split("/image/upload/")[1] || "");
    form.append("bloodType", formData.bloodType);
    form.append("allergies", JSON.stringify(formData.allergies));
    form.append("emailNotifications", formData.emailNotifications.toString());
    form.append("smsReminders", formData.smsReminders.toString());
    form.append("twoFactorEnabled", formData.twoFactorEnabled.toString());

    startTransition(() => {
      formAction(form);
    });
  };

  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  return (
    <div className="min-h-screen p-4">
      {isPending && <LoadingScreen message="Updating your profile..." />}
      <div className="max-w-4xl mx-auto">
        <Card className="overflow-hidden rounded-sm bg-white dark:bg-dark-4">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Edit Profile
              </h1>
              <div className="flex gap-2">
                <Button
                  onClick={handleSave}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
                <Button onClick={onCancel} variant="outline">
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          </CardHeader>

          {state?.success && (
            <p className="text-green-600 text-sm mt-2 text-center">
              Profile updated successfully!
            </p>
          )}

          <CardContent className="p-6 space-y-8">
            {/* Profile Image Section */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-gray-200">
                  {uploading && (
                    <div className="absolute w-full h-full bg-gray-700/50 flex justify-center backdrop-blur-[1px] items-center">
                      <Loader2 size={50} className="animate-spin" />
                    </div>
                  )}
                  {profileImage ? (
                    <ProfilePageImage image={profileImage} size={128} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-100">
                      <User className="w-16 h-16 text-blue-400" />
                    </div>
                  )}
                  <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                    <Camera className="w-6 h-6 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Basic Information */}
              <div className="flex-1 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label
                      htmlFor="name"
                      className="text-sm font-medium text-gray-950 dark:text-gray-300"
                    >
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="email"
                      className="text-sm font-medium text-gray-950 dark:text-gray-300"
                    >
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label
                      htmlFor="phone"
                      className="text-sm font-medium text-gray-950 dark:text-gray-300"
                    >
                      Phone
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      placeholder="+1 (555) 123-4567"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="dob"
                      className="text-sm font-medium text-gray-950 dark:text-gray-300"
                    >
                      Date of Birth
                    </Label>
                    <Input
                      id="dob"
                      type="date"
                      value={formData.dob}
                      onChange={(e) => handleInputChange("dob", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="gender"
                    className="text-sm font-medium text-gray-950 dark:text-gray-300"
                  >
                    Gender
                  </Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) =>
                      handleInputChange("gender", value)
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                      <SelectItem value="Prefer not to say">
                        Prefer not to say
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Separator />

            {/* Health Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Health Information
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label
                    htmlFor="bloodType"
                    className="text-sm font-medium text-gray-950 dark:text-gray-300"
                  >
                    Blood Type
                  </Label>
                  <Select
                    value={formData.bloodType}
                    onValueChange={(value) =>
                      handleInputChange("bloodType", value)
                    }
                  >
                    <SelectTrigger className="mt-1 h-10!">
                      <SelectValue placeholder="Select blood type" />
                    </SelectTrigger>
                    <SelectContent>
                      {bloodTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-950 dark:text-gray-300">
                    Allergies
                  </Label>
                  <div className="mt-1 space-y-2">
                    <div className="flex gap-2">
                      <Input
                        value={allergyInput}
                        onChange={(e) => setAllergyInput(e.target.value)}
                        placeholder="Add allergy"
                        onKeyPress={(e) => e.key === "Enter" && addAllergy()}
                      />
                      <Button
                        type="button"
                        onClick={addAllergy}
                        variant="outline"
                      >
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.allergies.map((allergy) => (
                        <div
                          key={allergy}
                          className="bg-red-100 text-red-800 px-2 py-1 rounded-md text-sm flex items-center gap-1"
                        >
                          {allergy}
                          <button
                            type="button"
                            onClick={() => removeAllergy(allergy)}
                            className="text-red-600 hover:text-red-800"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {state?.success && (
              <p className="text-green-600 text-sm mt-2 text-center">
                Profile updated successfully!
              </p>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-6 border-t">
              <Button onClick={onCancel} variant="outline">
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
