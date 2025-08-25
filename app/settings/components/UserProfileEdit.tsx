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
import {
  User,
  Heart,
  Camera,
  Save,
  X,
  Loader2,
  Shield,
  Pill,
  Stethoscope,
  Scale,
  Thermometer,
  Brain,
  Cigarette,
  Wine,
  Dumbbell,
  AlertCircle,
  FileText,
  Activity,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { redirect } from "next/navigation";
import LoadingScreen from "@/components/LoadingScreen";
import { updateUserProfile } from "@/actions";
import ProfilePageImage from "@/app/profile/components/ProfilePageImage";
import DeleteAccountConfirmation from "./DeleteAccount";

interface EditUserProfileProps {
  user: UserType;
}

export default function UserProfileEdit({ user }: EditUserProfileProps) {
  const [showDeleteAccountPopUp, setShowDeleteAccountPopUp] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);
  const [isDeletingAccount, setisDeletingAccount] = useState(false);
  
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
    chronicConditions: user.chronicConditions || [],
    medications: user.medications || [],
    surgeries: user.surgeries || [],
    immunizations: user.immunizations || [],
    bloodPressure: user.bloodPressure || "",
    heartRate: user.heartRate || "",
    respiratoryRate: user.respiratoryRate || "",
    temperature: user.temperature || "",
    height: user.height || "",
    weight: user.weight || "",
    smoker: user.smoker,
    alcoholUse: user.alcoholUse,
    exerciseFrequency: user.exerciseFrequency || "",
    mentalHealthConcerns: user.mentalHealthConcerns || [],
    notes: user.notes || "",
    emailNotifications: user.emailNotifications,
    smsReminders: user.smsReminders,
    twoFactorEnabled: user.twoFactorEnabled,
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
    chronicConditions: user.chronicConditions || [],
    medications: user.medications || [],
    surgeries: user.surgeries || [],
    immunizations: user.immunizations || [],
    bloodPressure: user.bloodPressure || "",
    heartRate: user.heartRate || "",
    respiratoryRate: user.respiratoryRate || "",
    temperature: user.temperature || "",
    height: user.height || "",
    weight: user.weight || "",
    smoker: user.smoker,
    alcoholUse: user.alcoholUse,
    exerciseFrequency: user.exerciseFrequency || "",
    mentalHealthConcerns: user.mentalHealthConcerns || [],
    notes: user.notes || "",
    emailNotifications: user.emailNotifications,
    smsReminders: user.smsReminders,
    twoFactorEnabled: user.twoFactorEnabled,
  });

  const initialState = { success: false };
  const [state, formAction] = useActionState(updateUserProfile, initialState);
  const [profileImage, setProfileImage] = useState<string | undefined>(pfp);
  const [uploadedPublicId, setUploadedPublicId] = useState<string | null>(null);
  const [allergyInput, setAllergyInput] = useState("");
  const [chronicConditionInput, setChronicConditionInput] = useState("");
  const [medicationInput, setMedicationInput] = useState("");
  const [surgeryInput, setSurgeryInput] = useState("");
  const [immunizationInput, setImmunizationInput] = useState("");
  const [mentalHealthInput, setMentalHealthInput] = useState("");

  const handleInputChange = (
    field: string,
    value: string | boolean | string[] | null
  ) => {
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
  }, []);

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

  const addChronicCondition = () => {
    if (
      chronicConditionInput.trim() &&
      !formData.chronicConditions.includes(chronicConditionInput.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        chronicConditions: [
          ...prev.chronicConditions,
          chronicConditionInput.trim(),
        ],
      }));
      setChronicConditionInput("");
    }
  };

  const removeChronicCondition = (condition: string) => {
    setFormData((prev) => ({
      ...prev,
      chronicConditions: prev.chronicConditions.filter((c) => c !== condition),
    }));
  };

  const addMedication = () => {
    if (
      medicationInput.trim() &&
      !formData.medications.includes(medicationInput.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        medications: [...prev.medications, medicationInput.trim()],
      }));
      setMedicationInput("");
    }
  };

  const removeMedication = (medication: string) => {
    setFormData((prev) => ({
      ...prev,
      medications: prev.medications.filter((m) => m !== medication),
    }));
  };

  const addSurgery = () => {
    if (
      surgeryInput.trim() &&
      !formData.surgeries.includes(surgeryInput.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        surgeries: [...prev.surgeries, surgeryInput.trim()],
      }));
      setSurgeryInput("");
    }
  };

  const removeSurgery = (surgery: string) => {
    setFormData((prev) => ({
      ...prev,
      surgeries: prev.surgeries.filter((s) => s !== surgery),
    }));
  };

  const addImmunization = () => {
    if (
      immunizationInput.trim() &&
      !formData.immunizations.includes(immunizationInput.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        immunizations: [...prev.immunizations, immunizationInput.trim()],
      }));
      setImmunizationInput("");
    }
  };

  const removeImmunization = (immunization: string) => {
    setFormData((prev) => ({
      ...prev,
      immunizations: prev.immunizations.filter((i) => i !== immunization),
    }));
  };

  const addMentalHealthConcern = () => {
    if (
      mentalHealthInput.trim() &&
      !formData.mentalHealthConcerns.includes(mentalHealthInput.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        mentalHealthConcerns: [
          ...prev.mentalHealthConcerns,
          mentalHealthInput.trim(),
        ],
      }));
      setMentalHealthInput("");
    }
  };

  const removeMentalHealthConcern = (concern: string) => {
    setFormData((prev) => ({
      ...prev,
      mentalHealthConcerns: prev.mentalHealthConcerns.filter(
        (c) => c !== concern
      ),
    }));
  };

  const handleSave = () => {
    const currentFormData = {
      ...formData,
      allergies: [...formData.allergies],
      chronicConditions: [...formData.chronicConditions],
      medications: [...formData.medications],
      surgeries: [...formData.surgeries],
      immunizations: [...formData.immunizations],
      mentalHealthConcerns: [...formData.mentalHealthConcerns],
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
    form.append(
      "chronicConditions",
      JSON.stringify(formData.chronicConditions)
    );
    form.append("medications", JSON.stringify(formData.medications));
    form.append("surgeries", JSON.stringify(formData.surgeries));
    form.append("immunizations", JSON.stringify(formData.immunizations));
    form.append("bloodPressure", formData.bloodPressure);
    form.append("heartRate", formData.heartRate.toString());
    form.append("respiratoryRate", formData.respiratoryRate.toString());
    form.append("temperature", formData.temperature.toString());
    form.append("height", formData.height.toString());
    form.append("weight", formData.weight.toString());
    form.append("smoker", formData.smoker?.toString() || "");
    form.append("alcoholUse", formData.alcoholUse?.toString() || "");
    form.append("exerciseFrequency", formData.exerciseFrequency);
    form.append(
      "mentalHealthConcerns",
      JSON.stringify(formData.mentalHealthConcerns)
    );
    form.append("notes", formData.notes);

    startTransition(() => {
      formAction(form);
    });
  };

  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  return (
    <div className="min-h-screen p-4">
      {isPending && <LoadingScreen message="Updating your profile..." />}
      {isDeletingAccount && (
              <LoadingScreen message="Deleting your profile..." />
            )}
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
                  className="bg-blue-600 hover:bg-blue-700 text-white"
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
                    <SelectTrigger className="mt-1 h-10! w-full">
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

            <Separator />

            {/* Medical History Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Medical History
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Chronic Conditions */}
                <div>
                  <Label className="text-sm font-medium text-gray-950 dark:text-gray-300 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    Chronic Conditions
                  </Label>
                  <div className="mt-1 space-y-2">
                    <div className="flex gap-2">
                      <Input
                        value={chronicConditionInput}
                        onChange={(e) =>
                          setChronicConditionInput(e.target.value)
                        }
                        placeholder="Add chronic condition"
                        onKeyPress={(e) =>
                          e.key === "Enter" && addChronicCondition()
                        }
                      />
                      <Button
                        type="button"
                        onClick={addChronicCondition}
                        variant="outline"
                      >
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.chronicConditions.map((condition) => (
                        <div
                          key={condition}
                          className="bg-red-100 text-red-800 px-2 py-1 rounded-md text-sm flex items-center gap-1"
                        >
                          {condition}
                          <button
                            type="button"
                            onClick={() => removeChronicCondition(condition)}
                            className="text-red-600 hover:text-red-800"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Current Medications */}
                <div>
                  <Label className="text-sm font-medium text-gray-950 dark:text-gray-300 flex items-center gap-2">
                    <Pill className="w-4 h-4 text-blue-500" />
                    Current Medications
                  </Label>
                  <div className="mt-1 space-y-2">
                    <div className="flex gap-2">
                      <Input
                        value={medicationInput}
                        onChange={(e) => setMedicationInput(e.target.value)}
                        placeholder="Add medication"
                        onKeyPress={(e) => e.key === "Enter" && addMedication()}
                      />
                      <Button
                        type="button"
                        onClick={addMedication}
                        variant="outline"
                      >
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.medications.map((medication) => (
                        <div
                          key={medication}
                          className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm flex items-center gap-1"
                        >
                          {medication}
                          <button
                            type="button"
                            onClick={() => removeMedication(medication)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Surgery History */}
                <div>
                  <Label className="text-sm font-medium text-gray-950 dark:text-gray-300 flex items-center gap-2">
                    <Stethoscope className="w-4 h-4 text-purple-500" />
                    Surgery History
                  </Label>
                  <div className="mt-1 space-y-2">
                    <div className="flex gap-2">
                      <Input
                        value={surgeryInput}
                        onChange={(e) => setSurgeryInput(e.target.value)}
                        placeholder="Add surgery"
                        onKeyPress={(e) => e.key === "Enter" && addSurgery()}
                      />
                      <Button
                        type="button"
                        onClick={addSurgery}
                        variant="outline"
                      >
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.surgeries.map((surgery) => (
                        <div
                          key={surgery}
                          className="bg-purple-100 text-purple-800 px-2 py-1 rounded-md text-sm flex items-center gap-1"
                        >
                          {surgery}
                          <button
                            type="button"
                            onClick={() => removeSurgery(surgery)}
                            className="text-purple-600 hover:text-purple-800"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Immunizations */}
                <div>
                  <Label className="text-sm font-medium text-gray-950 dark:text-gray-300 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-500" />
                    Immunizations
                  </Label>
                  <div className="mt-1 space-y-2">
                    <div className="flex gap-2">
                      <Input
                        value={immunizationInput}
                        onChange={(e) => setImmunizationInput(e.target.value)}
                        placeholder="Add immunization"
                        onKeyPress={(e) =>
                          e.key === "Enter" && addImmunization()
                        }
                      />
                      <Button
                        type="button"
                        onClick={addImmunization}
                        variant="outline"
                      >
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.immunizations.map((immunization) => (
                        <div
                          key={immunization}
                          className="bg-green-100 text-green-800 px-2 py-1 rounded-md text-sm flex items-center gap-1"
                        >
                          {immunization}
                          <button
                            type="button"
                            onClick={() => removeImmunization(immunization)}
                            className="text-green-600 hover:text-green-800"
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

            <Separator />

            {/* Vital Signs Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Vital Signs & Physical Measurements
              </h3>

              <div className="grid md:grid-cols-3 gap-6">
                {/* Physical Measurements */}
                <div>
                  <Label
                    htmlFor="height"
                    className="text-sm font-medium text-gray-950 dark:text-gray-300 flex items-center gap-2"
                  >
                    <Scale className="w-4 h-4" />
                    Height (cm)
                  </Label>
                  <Input
                    id="height"
                    type="number"
                    value={formData.height}
                    onChange={(e) =>
                      handleInputChange("height", e.target.value)
                    }
                    placeholder="170"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="weight"
                    className="text-sm font-medium text-gray-950 dark:text-gray-300 flex items-center gap-2"
                  >
                    <Scale className="w-4 h-4" />
                    Weight (kg)
                  </Label>
                  <Input
                    id="weight"
                    type="number"
                    value={formData.weight}
                    onChange={(e) =>
                      handleInputChange("weight", e.target.value)
                    }
                    placeholder="70"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="bloodPressure"
                    className="text-sm font-medium text-gray-950 dark:text-gray-300"
                  >
                    Blood Pressure
                  </Label>
                  <Input
                    id="bloodPressure"
                    value={formData.bloodPressure}
                    onChange={(e) =>
                      handleInputChange("bloodPressure", e.target.value)
                    }
                    placeholder="120/80"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="heartRate"
                    className="text-sm font-medium text-gray-950 dark:text-gray-300"
                  >
                    Heart Rate (bpm)
                  </Label>
                  <Input
                    id="heartRate"
                    type="number"
                    value={formData.heartRate}
                    onChange={(e) =>
                      handleInputChange("heartRate", e.target.value)
                    }
                    placeholder="72"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="respiratoryRate"
                    className="text-sm font-medium text-gray-950 dark:text-gray-300"
                  >
                    Respiratory Rate (/min)
                  </Label>
                  <Input
                    id="respiratoryRate"
                    type="number"
                    value={formData.respiratoryRate}
                    onChange={(e) =>
                      handleInputChange("respiratoryRate", e.target.value)
                    }
                    placeholder="16"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="temperature"
                    className="text-sm font-medium text-gray-950 dark:text-gray-300 flex items-center gap-2"
                  >
                    <Thermometer className="w-4 h-4" />
                    Temperature (°C)
                  </Label>
                  <Input
                    id="temperature"
                    type="number"
                    step="0.1"
                    value={formData.temperature}
                    onChange={(e) =>
                      handleInputChange("temperature", e.target.value)
                    }
                    placeholder="36.5"
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Lifestyle Factors Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Dumbbell className="w-5 h-5" />
                Lifestyle Factors
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-950 dark:text-gray-300 flex items-center gap-2">
                      <Cigarette className="w-4 h-4" />
                      Smoking Status
                    </Label>
                    <Select
                      value={
                        formData.smoker === null
                          ? "Not specified"
                          : formData.smoker?.toString()
                      }
                      onValueChange={(value) =>
                        handleInputChange(
                          "smoker",
                          value === "Not specified" ? null : value === "true"
                        )
                      }
                    >
                      <SelectTrigger className="mt-1 w-full">
                        <SelectValue placeholder="Select smoking status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Not specified">
                          Not specified
                        </SelectItem>
                        <SelectItem value="false">Non-smoker</SelectItem>
                        <SelectItem value="true">Smoker</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-950 dark:text-gray-300 flex items-center gap-2">
                      <Wine className="w-4 h-4" />
                      Alcohol Use
                    </Label>
                    <Select
                      value={
                        formData.alcoholUse === null
                          ? "Not specified"
                          : formData.alcoholUse?.toString()
                      }
                      onValueChange={(value) =>
                        handleInputChange(
                          "alcoholUse",
                          value === "Not specified" ? null : value === "true"
                        )
                      }
                    >
                      <SelectTrigger className="mt-1 w-full">
                        <SelectValue placeholder="Select alcohol use" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Not specified">
                          Not specified
                        </SelectItem>
                        <SelectItem value="false">No</SelectItem>
                        <SelectItem value="true">Yes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label
                      htmlFor="exerciseFrequency"
                      className="text-sm font-medium text-gray-950 dark:text-gray-300"
                    >
                      Exercise Frequency
                    </Label>
                    <Select
                      value={formData.exerciseFrequency}
                      onValueChange={(value) =>
                        handleInputChange("exerciseFrequency", value)
                      }
                    >
                      <SelectTrigger className="mt-1 w-full">
                        <SelectValue placeholder="Select exercise frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Daily">Daily</SelectItem>
                        <SelectItem value="Weekly">Weekly</SelectItem>
                        <SelectItem value="Monthly">Monthly</SelectItem>
                        <SelectItem value="Rarely">Rarely</SelectItem>
                        <SelectItem value="Never">Never</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-950 dark:text-gray-300 flex items-center gap-2">
                    <Brain className="w-4 h-4" />
                    Mental Health Concerns
                  </Label>
                  <div className="mt-1 space-y-2">
                    <div className="flex gap-2">
                      <Input
                        value={mentalHealthInput}
                        onChange={(e) => setMentalHealthInput(e.target.value)}
                        placeholder="Add mental health concern"
                        onKeyPress={(e) =>
                          e.key === "Enter" && addMentalHealthConcern()
                        }
                      />
                      <Button
                        type="button"
                        onClick={addMentalHealthConcern}
                        variant="outline"
                      >
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.mentalHealthConcerns.map((concern) => (
                        <div
                          key={concern}
                          className="bg-orange-100 text-orange-800 px-2 py-1 rounded-md text-sm flex items-center gap-1"
                        >
                          {concern}
                          <button
                            type="button"
                            onClick={() => removeMentalHealthConcern(concern)}
                            className="text-orange-600 hover:text-orange-800"
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

            <Separator />

            {/* Medical Notes Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Medical Notes
              </h3>

              <div>
                <Label
                  htmlFor="notes"
                  className="text-sm font-medium text-gray-950 dark:text-gray-300"
                >
                  Additional Notes
                </Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="Any additional medical information, symptoms, or notes..."
                  className="mt-1 min-h-[100px]"
                />
              </div>
            </div>

            {state?.success && (
              <p className="text-green-600 text-sm mt-2 text-center">
                Profile updated successfully!
              </p>
            )}

            <Separator />
            {/* Action Buttons */}
            <div className="w-full flex  gap-4 sm:flex-row flex-col justify-between items-center">
              <Button
                onClick={() => {
                  setShowDeleteAccountPopUp(true);
                }}
                className="bg-red-500 w-full sm:w-fit order-last sm:order-first font-bold text-white"
              >
                Delete Account
              </Button>
              <div className="flex justify-end gap-4 items-center">
                <Button onClick={onCancel} variant="outline">
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      {showDeleteAccountPopUp && (
        <DeleteAccountConfirmation
        setIsDeleting={setisDeletingAccount}
          onClose={() => setShowDeleteAccountPopUp(false)}
        />
      )}
    </div>
  );
}
