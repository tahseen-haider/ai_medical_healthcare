"use client";

import type React from "react";

import type { UserType } from "@/lib/definitions";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useActionState, useEffect, useState, useTransition } from "react";
import {
  User,
  Stethoscope,
  GraduationCap,
  Building,
  DollarSign,
  Clock,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Camera,
  Save,
  X,
  Loader2,
} from "lucide-react";
import ProfilePageImage from "@/app/profile/components/ProfilePageImage";
import { updateDoctorProfile } from "@/actions/doctor.action";
import { redirect } from "next/navigation";
import LoadingScreen from "@/components/LoadingScreen";

interface EditProfileProps {
  user: UserType;
}

export default function DoctorProfileEdit({ user }: EditProfileProps) {
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
    doctorType: user.doctorProfile?.doctorType || "general",
    specialization: user.doctorProfile?.specialization || "",
    qualifications: user.doctorProfile?.qualifications || "",
    experience: user.doctorProfile?.experience?.toString() || "",
    bio: user.doctorProfile?.bio || "",
    clinicName: user.doctorProfile?.clinicName || "",
    clinicAddress: user.doctorProfile?.clinicAddress || "",
    consultationFee: user.doctorProfile?.consultationFee?.toString() || "",
    availableDays: user.doctorProfile?.availableDays || [],
    availableTimes: user.doctorProfile?.availableTimes || "",
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
    doctorType: user.doctorProfile?.doctorType || "general",
    specialization: user.doctorProfile?.specialization || "",
    qualifications: user.doctorProfile?.qualifications || "",
    experience: user.doctorProfile?.experience?.toString() || "",
    bio: user.doctorProfile?.bio || "",
    clinicName: user.doctorProfile?.clinicName || "",
    clinicAddress: user.doctorProfile?.clinicAddress || "",
    consultationFee: user.doctorProfile?.consultationFee?.toString() || "",
    availableDays: user.doctorProfile?.availableDays || [],
    availableTimes: user.doctorProfile?.availableTimes || "",
  });

  const initialState = { success: false };

  const [state, formAction] = useActionState(updateDoctorProfile, initialState);
  const [profileImage, setProfileImage] = useState<string | undefined>(pfp);
  const [uploadedPublicId, setUploadedPublicId] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
      if (state.success) window.location.href = "/profile";
    }, [state.success]);
    
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

  const handleDayToggle = (day: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      availableDays: checked
        ? [...prev.availableDays, day]
        : prev.availableDays.filter((d) => d !== day),
    }));
  };

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

  const handleSave = () => {
    const currentFormData = {
      ...formData,
      availableDays: [...formData.availableDays], // avoid reference mismatch
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
    form.append("doctorType", formData.doctorType);
    form.append("specialization", formData.specialization);
    form.append("qualifications", formData.qualifications);
    form.append("experience", formData.experience);
    form.append("bio", formData.bio);
    form.append("clinicName", formData.clinicName);
    form.append("clinicAddress", formData.clinicAddress);
    form.append("consultationFee", formData.consultationFee);
    form.append("availableTimes", formData.availableTimes);
    form.append("availableDays", JSON.stringify(formData.availableDays));

    startTransition(() => {
      formAction(form);
    });
  };

  const doctorTypes = [
    { value: "general", label: "General" },
    { value: "cardiologist", label: "Cardiologist" },
    { value: "dermatologist", label: "Dermatologist" },
    { value: "pediatrician", label: "Pediatrician" },
    { value: "neurologist", label: "Neurologist" },
    { value: "psychiatrist", label: "Psychiatrist" },
    { value: "dentist", label: "Dentist" },
    { value: "surgeon", label: "Surgeon" },
    { value: "gynecologist", label: "Gynecologist" },
    { value: "orthopedist", label: "Orthopedist" },
  ];
  const weekDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

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
                      htmlFor="doctorType"
                      className="text-sm font-medium text-gray-950 dark:text-gray-300"
                    >
                      Doctor Type
                    </Label>
                    <Select
                      value={formData.doctorType}
                      onValueChange={(value) =>
                        handleInputChange("doctorType", value)
                      }
                    >
                      <SelectTrigger className="mt-1 h-10! py-0">
                        <SelectValue placeholder="Select doctor type" />
                      </SelectTrigger>
                      <SelectContent>
                        {doctorTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="specialization"
                    className="text-sm font-medium text-gray-950 dark:text-gray-300"
                  >
                    Specialization
                  </Label>
                  <Input
                    id="specialization"
                    value={formData.specialization}
                    onChange={(e) =>
                      handleInputChange("specialization", e.target.value)
                    }
                    placeholder="e.g., Cardiology, Pediatrics"
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Professional Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Stethoscope className="w-5 h-5" />
                Professional Information
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label
                      htmlFor="qualifications"
                      className="text-sm font-medium text-gray-950 dark:text-gray-300 flex items-center gap-2"
                    >
                      <GraduationCap className="w-4 h-4" />
                      Qualifications
                    </Label>
                    <Input
                      id="qualifications"
                      value={formData.qualifications}
                      onChange={(e) =>
                        handleInputChange("qualifications", e.target.value)
                      }
                      placeholder="e.g., MD, PhD, MBBS"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="experience"
                      className="text-sm font-medium text-gray-950 dark:text-gray-300 flex items-center gap-2"
                    >
                      <Clock className="w-4 h-4" />
                      Experience (years)
                    </Label>
                    <Input
                      id="experience"
                      type="number"
                      value={formData.experience}
                      onChange={(e) =>
                        handleInputChange("experience", e.target.value)
                      }
                      placeholder="0"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="consultationFee"
                      className="text-sm font-medium text-gray-950 dark:text-gray-300 flex items-center gap-2"
                    >
                      <DollarSign className="w-4 h-4" />
                      Consultation Fee ($)
                    </Label>
                    <Input
                      id="consultationFee"
                      type="number"
                      value={formData.consultationFee}
                      onChange={(e) =>
                        handleInputChange("consultationFee", e.target.value)
                      }
                      placeholder="0.00"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="bio"
                    className="text-sm font-medium text-gray-950 dark:text-gray-300"
                  >
                    Bio
                  </Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    placeholder="Tell patients about yourself, your approach to medicine, and your experience..."
                    rows={6}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Contact & Clinic Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Building className="w-5 h-5" />
                Contact & Clinic Information
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label
                      htmlFor="email"
                      className="text-sm font-medium text-gray-950 dark:text-gray-300 flex items-center gap-2"
                    >
                      <Mail className="w-4 h-4" />
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

                  <div>
                    <Label
                      htmlFor="phone"
                      className="text-sm font-medium text-gray-950 dark:text-gray-300 flex items-center gap-2"
                    >
                      <Phone className="w-4 h-4" />
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
                      htmlFor="clinicName"
                      className="text-sm font-medium text-gray-950 dark:text-gray-300 flex items-center gap-2"
                    >
                      <Building className="w-4 h-4" />
                      Clinic Name
                    </Label>
                    <Input
                      id="clinicName"
                      value={formData.clinicName}
                      onChange={(e) =>
                        handleInputChange("clinicName", e.target.value)
                      }
                      placeholder="Your clinic or hospital name"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label
                      htmlFor="clinicAddress"
                      className="text-sm font-medium text-gray-950 dark:text-gray-300 flex items-center gap-2"
                    >
                      <MapPin className="w-4 h-4" />
                      Clinic Address
                    </Label>
                    <Textarea
                      id="clinicAddress"
                      value={formData.clinicAddress}
                      onChange={(e) =>
                        handleInputChange("clinicAddress", e.target.value)
                      }
                      placeholder="Full address of your clinic"
                      rows={3}
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
            </div>

            <Separator />

            {/* Availability */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Availability
              </h3>

              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-950 dark:text-gray-300 mb-3 block">
                    Available Days
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {weekDays.map((day) => (
                      <div key={day} className="flex items-center space-x-2">
                        <Checkbox
                          id={day}
                          checked={formData.availableDays.includes(day)}
                          onCheckedChange={(checked) =>
                            handleDayToggle(day, checked as boolean)
                          }
                        />
                        <Label
                          htmlFor={day}
                          className="text-sm text-gray-700 dark:text-gray-300"
                        >
                          {day}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="availableTimes"
                    className="text-sm font-medium text-gray-950 dark:text-gray-300"
                  >
                    Available Times
                  </Label>
                  <Input
                    id="availableTimes"
                    value={formData.availableTimes}
                    onChange={(e) =>
                      handleInputChange("availableTimes", e.target.value)
                    }
                    placeholder="e.g., 9:00 AM - 5:00 PM"
                    className="mt-1"
                  />
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
