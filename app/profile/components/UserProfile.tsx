import type { UserType } from "@/lib/definitions";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Clock,
  FileText,
  Shield,
  Edit3,
  Activity,
  Pill,
  Stethoscope,
  Scale,
  Thermometer,
  Brain,
  Cigarette,
  Wine,
  Dumbbell,
  AlertCircle,
  TrendingUp,
  FileHeart,
} from "lucide-react";
import ProfilePageImage from "./ProfilePageImage";
import Link from "next/link";

export default function UserProfile({ user }: { user: UserType }) {
  const pfp = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${user.pfp}`;
  const totalAppointments = user.appointmentsAsPatient.length;
  const upcomingAppointments = user.appointmentsAsPatient.filter(
    (apt) => apt.status === "CONFIRMED" || apt.status === "PENDING"
  ).length;
  const completedAppointments = user.appointmentsAsPatient.filter(
    (apt) => apt.status === "COMPLETED"
  ).length;

  const formatDate = (dateString: string | Date | null) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString();
  };

  const formatDateTime = (dateTime: Date | null) => {
    if (!dateTime) return "N/A";
    const date = new Date(dateTime);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "default";
      case "CONFIRMED":
        return "outline";
      case "PENDING":
        return "secondary";
      case "CANCELLED":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const calculateAge = (dob: string | null | undefined) => {
    if (!dob) return null;
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const calculateBMI = (height: number | null, weight: number | null) => {
    if (!height || !weight) return null;
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    return Math.round(bmi * 10) / 10;
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: "Underweight", color: "text-blue-600" };
    if (bmi < 25) return { category: "Normal", color: "text-green-600" };
    if (bmi < 30) return { category: "Overweight", color: "text-yellow-600" };
    return { category: "Obese", color: "text-red-600" };
  };

  const getVitalStatus = (
    value: number | null,
    normal: { min: number; max: number }
  ) => {
    if (!value) return { status: "Unknown", color: "text-gray-500" };
    if (value < normal.min) return { status: "Low", color: "text-blue-600" };
    if (value > normal.max) return { status: "High", color: "text-red-600" };
    return { status: "Normal", color: "text-green-600" };
  };

  const age = calculateAge(user.dob);
  const bmi = calculateBMI(user.height ?? null, user.weight ?? null);
  const bmiCategory = bmi ? getBMICategory(bmi) : null;

  // Normal ranges for vital signs
  const heartRateStatus = getVitalStatus(user.heartRate ?? null, {
    min: 60,
    max: 100,
  });
  const respiratoryRateStatus = getVitalStatus(user.respiratoryRate ?? null, {
    min: 12,
    max: 20,
  });
  const temperatureStatus = getVitalStatus(user.temperature ?? null, {
    min: 36.1,
    max: 37.2,
  });

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        <Card className="overflow-hidden rounded-sm bg-white dark:bg-dark-4">
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-6">
              {/* Profile Image */}
              <div className="flex-shrink-0">
                <div className="w-32 h-32 rounded-lg overflow-hidden bg-gray-200">
                  {pfp && <ProfilePageImage image={pfp} size={128} />}
                </div>
              </div>

              {/* Basic Info */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {user.name}
                    </h1>
                    <p className="text-blue-600 font-medium">Patient</p>
                    {age && (
                      <p className="text-gray-600 dark:text-gray-400 mt-1">
                        {age} years old
                      </p>
                    )}

                    {/* Account Status */}
                    <div className="flex items-center gap-2 mt-3">
                      <Badge
                        variant={user.is_verified ? "default" : "secondary"}
                      >
                        {user.is_verified ? "Verified Account" : "Unverified"}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-green-600 border-green-600"
                      >
                        Active
                      </Badge>
                    </div>

                    {/* Member Since */}
                    <p className="text-sm text-gray-500 mt-2">
                      Member since{" "}
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2">
                    <Link
                      href="/settings"
                      className="rounded-lg p-2 flex items-center justify-center font-bold text-[14px] text-white dark:text-black text-center bg-light-4 dark:bg-white"
                    >
                      <Edit3 className="inline mr-2" />
                      Edit Profile
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="w-full justify-start rounded-none border-b bg-transparent h-12">
                <TabsTrigger
                  value="profile"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none"
                >
                  Profile
                </TabsTrigger>
                <TabsTrigger
                  value="medical"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none"
                >
                  Medical History
                </TabsTrigger>
                <TabsTrigger
                  value="vitals"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none"
                >
                  Vital Signs
                </TabsTrigger>
                <TabsTrigger
                  value="appointments"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none"
                >
                  Appointments
                </TabsTrigger>
              </TabsList>

              {/* Profile Tab */}
              <TabsContent value="profile" className="p-6 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Personal Information
                    </h3>

                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Mail className="w-4 h-4 mt-1 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-950 dark:text-gray-300">
                            Email
                          </p>
                          <p className="text-sm text-blue-600">{user.email}</p>
                        </div>
                      </div>

                      {user.phone && (
                        <div className="flex items-start gap-3">
                          <Phone className="w-4 h-4 mt-1 text-gray-500" />
                          <div>
                            <p className="text-sm font-medium text-gray-950 dark:text-gray-300">
                              Phone
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {user.phone}
                            </p>
                          </div>
                        </div>
                      )}

                      {user.dob && (
                        <div className="flex items-start gap-3">
                          <Calendar className="w-4 h-4 mt-1 text-gray-500" />
                          <div>
                            <p className="text-sm font-medium text-gray-950 dark:text-gray-300">
                              Date of Birth
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {formatDate(user.dob)}{" "}
                              {age && `(${age} years old)`}
                            </p>
                          </div>
                        </div>
                      )}

                      {user.gender && (
                        <div className="flex items-start gap-3">
                          <User className="w-4 h-4 mt-1 text-gray-500" />
                          <div>
                            <p className="text-sm font-medium text-gray-950 dark:text-gray-300">
                              Gender
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {user.gender}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Account Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Account Details
                    </h3>

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Account Status
                        </span>
                        <Badge
                          variant={user.is_verified ? "outline" : "secondary"}
                        >
                          {user.is_verified ? "Verified" : "Unverified"}
                        </Badge>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Member Since
                        </span>
                        <span className="text-sm text-gray-900 dark:text-gray-100">
                          {formatDate(user.createdAt.toISOString())}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          User ID
                        </span>
                        <span className="text-sm text-gray-900 dark:text-gray-100 font-mono">
                          {user.id.slice(0, 8)}...
                        </span>
                      </div>

                      {user.ai_tokens_used !== null && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            AI Tokens Used
                          </span>
                          <span className="text-sm text-gray-900 dark:text-gray-100">
                            {user.ai_tokens_used}
                          </span>
                        </div>
                      )}

                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Last Login
                        </span>
                        <span className="text-sm text-gray-900 dark:text-gray-100">
                          {formatDateTime(user.lastLogin ?? null)}
                        </span>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-950 dark:text-gray-300">
                        Preferences
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Email Notifications
                          </span>
                          <Badge
                            variant="outline"
                            className="text-green-600 border-green-600"
                          >
                            {user.emailNotifications ? "Enabled" : "Disabled"}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            SMS Reminders
                          </span>
                          <Badge
                            variant="outline"
                            className="text-green-600 border-green-600"
                          >
                            {user.smsReminders ? "Enabled" : "Disabled"}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Two-Factor Auth
                          </span>
                          <Badge
                            variant="outline"
                            className="text-green-600 border-green-600"
                          >
                            {user.twoFactorEnabled ? "Enabled" : "Disabled"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Lifestyle Factors */}
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        <Dumbbell className="w-5 h-5 text-blue-500" />
                        Lifestyle Factors
                      </h3>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                          <Cigarette className="w-4 h-4" />
                          Smoking Status
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {user.smoker === null
                            ? "Not specified"
                            : user.smoker
                            ? "Smoker"
                            : "Non-smoker"}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                          <Wine className="w-4 h-4" />
                          Alcohol Use
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {user.alcoholUse === null
                            ? "Not specified"
                            : user.alcoholUse
                            ? "Yes"
                            : "No"}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                          <Dumbbell className="w-4 h-4" />
                          Exercise Frequency
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {user.exerciseFrequency || "Not specified"}
                        </span>
                      </div>

                      {user.mentalHealthConcerns?.length ? (
                        <div>
                          <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2 mb-2">
                            <Brain className="w-4 h-4" />
                            Mental Health Concerns
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {user.mentalHealthConcerns.map((concern, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs"
                              >
                                {concern}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">
                          No mental health concerns reported.
                        </p>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        <FileHeart className="w-5 h-5 text-red-500" />
                        Quick Health Overview
                      </h3>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Blood Type
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {user.bloodType || "Not specified"}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Last Checkup
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {formatDateTime(user.lastCheckUp ?? null)}
                        </span>
                      </div>

                      {(user.allergies ?? []).length > 0 && (
                        <div>
                          <span className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">
                            Allergies
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {(user.allergies ?? []).map((allergy, index) => (
                              <Badge
                                key={index}
                                variant="destructive"
                                className="text-xs"
                              >
                                {allergy}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {bmi && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            BMI
                          </span>
                          <span
                            className={`text-sm font-medium ${bmiCategory?.color}`}
                          >
                            {bmi} ({bmiCategory?.category})
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Notes Section */}
                {user.notes && (
                  <Card>
                    <CardHeader>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-gray-500" />
                        Medical Notes
                      </h3>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        {user.notes}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Medical History Tab */}
              <TabsContent value="medical" className="p-6 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Chronic Conditions */}
                  <Card>
                    <CardHeader>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-red-500" />
                        Chronic Conditions
                      </h3>
                    </CardHeader>
                    <CardContent>
                      {(user.chronicConditions ?? []).length > 0 ? (
                        <div className="space-y-2">
                          {(user.chronicConditions ?? []).map(
                            (condition, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-2 p-2 bg-red-50 dark:bg-red-900/20 rounded"
                              >
                                <AlertCircle className="w-4 h-4 text-red-500" />
                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                  {condition}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 italic">
                          No chronic conditions recorded
                        </p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Current Medications */}
                  <Card>
                    <CardHeader>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        <Pill className="w-5 h-5 text-blue-500" />
                        Current Medications
                      </h3>
                    </CardHeader>
                    <CardContent>
                      {(user.medications ?? []).length > 0 ? (
                        <div className="space-y-2">
                          {(user.medications ?? []).map((medication, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded"
                            >
                              <Pill className="w-4 h-4 text-blue-500" />
                              <span className="text-sm text-gray-700 dark:text-gray-300">
                                {medication}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 italic">
                          No medications recorded
                        </p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Surgery History */}
                  <Card>
                    <CardHeader>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        <Stethoscope className="w-5 h-5 text-purple-500" />
                        Surgery History
                      </h3>
                    </CardHeader>
                    <CardContent>
                      {(user.surgeries ?? []).length > 0 ? (
                        <div className="space-y-2">
                          {(user.surgeries ?? []).map((surgery, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 p-2 bg-purple-50 dark:bg-purple-900/20 rounded"
                            >
                              <Stethoscope className="w-4 h-4 text-purple-500" />
                              <span className="text-sm text-gray-700 dark:text-gray-300">
                                {surgery}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 italic">
                          No surgeries recorded
                        </p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Immunizations */}
                  <Card>
                    <CardHeader>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-green-500" />
                        Immunizations
                      </h3>
                    </CardHeader>
                    <CardContent>
                      {(user.immunizations ?? []).length > 0 ? (
                        <div className="space-y-2">
                          {(user.immunizations ?? []).map(
                            (immunization, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-900/20 rounded"
                              >
                                <Shield className="w-4 h-4 text-green-500" />
                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                  {immunization}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 italic">
                          No immunizations recorded
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Vital Signs Tab */}
              <TabsContent value="vitals" className="p-6 space-y-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Physical Measurements */}
                  <Card>
                    <CardHeader>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        <Scale className="w-5 h-5 text-blue-500" />
                        Physical Measurements
                      </h3>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Height
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {user.height ? `${user.height} cm` : "Not recorded"}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Weight
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {user.weight ? `${user.weight} kg` : "Not recorded"}
                        </span>
                      </div>

                      {bmi && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            BMI
                          </span>
                          <span
                            className={`text-sm font-medium ${bmiCategory?.color}`}
                          >
                            {bmi} ({bmiCategory?.category})
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Vital Signs */}
                  <Card>
                    <CardHeader>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-red-500" />
                        Vital Signs
                      </h3>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Blood Pressure
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {user.bloodPressure || "Not recorded"}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Heart Rate
                        </span>
                        <span
                          className={`text-sm font-medium ${heartRateStatus.color}`}
                        >
                          {user.heartRate
                            ? `${user.heartRate} bpm (${heartRateStatus.status})`
                            : "Not recorded"}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Respiratory Rate
                        </span>
                        <span
                          className={`text-sm font-medium ${respiratoryRateStatus.color}`}
                        >
                          {user.respiratoryRate
                            ? `${user.respiratoryRate} /min (${respiratoryRateStatus.status})`
                            : "Not recorded"}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Temperature & Blood Type */}
                  <Card>
                    <CardHeader>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        <Thermometer className="w-5 h-5 text-orange-500" />
                        Additional Vitals
                      </h3>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Temperature
                        </span>
                        <span
                          className={`text-sm font-medium ${temperatureStatus.color}`}
                        >
                          {user.temperature
                            ? `${user.temperature}°C (${temperatureStatus.status})`
                            : "Not recorded"}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Blood Type
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {user.bloodType || "Not recorded"}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Last Updated
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {formatDateTime(user.lastCheckUp ?? null)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Vital Signs Trends */}
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-500" />
                      Vital Signs Reference Ranges
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 text-sm">
                      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          Heart Rate
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">
                          Normal: 60-100 bpm
                        </p>
                      </div>
                      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          Blood Pressure
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">
                          Normal: &lt;120/80 mmHg
                        </p>
                      </div>
                      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          Respiratory Rate
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">
                          Normal: 12-20 /min
                        </p>
                      </div>
                      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          Temperature
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">
                          Normal: 36.1-37.2°C
                        </p>
                      </div>
                      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                           Body Mass Index (BMI)
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">
                          Normal: 18.5-24.9 kg/m²
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Appointments Tab */}
              <TabsContent value="appointments" className="p-6">
                <div className="space-y-6">
                  {/* Appointment Statistics */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {totalAppointments}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Total
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          {upcomingAppointments}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Upcoming
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {completedAppointments}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Completed
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-red-600">
                          {
                            user.appointmentsAsPatient.filter(
                              (apt) => apt.status === "CANCELLED"
                            ).length
                          }
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Cancelled
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Appointments List */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        All Appointments
                      </h3>
                      <Link
                        href="/appointment"
                        className="rounded-lg p-2 flex items-center font-bold text-[14px] text-white bg-blue-600 hover:bg-blue-700"
                      >
                        <Calendar className="w-4 h-4 mr-2 inline" />
                        Book Appointment
                      </Link>
                    </div>

                    <div className="space-y-3">
                      {user.appointmentsAsPatient.map((appointment) => (
                        <Card key={appointment.id} className="py-4">
                          <CardContent>
                            <div className="flex justify-between items-start">
                              <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                                  <FileText className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900 dark:text-gray-100">
                                    {appointment.reasonForVisit}
                                  </p>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Dr.{" "}
                                    {appointment.doctorId
                                      ? "Assigned"
                                      : "To be assigned"}
                                  </p>
                                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                    <div className="flex items-center gap-1">
                                      <Calendar className="w-4 h-4" />
                                      {appointment.preferredDate}
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Clock className="w-4 h-4" />
                                      {appointment.preferredTime}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <Badge
                                  variant={getStatusColor(appointment.status)}
                                >
                                  {appointment.status}
                                </Badge>
                                <p className="text-xs text-gray-500 mt-1">
                                  {new Date(
                                    appointment.createdAt
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}

                      {user.appointmentsAsPatient.length === 0 && (
                        <Card>
                          <CardContent className="p-8 text-center">
                            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                              No appointments yet
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                              Book your first appointment to get started with
                              your healthcare journey.
                            </p>
                            <Link
                              href="/appointment"
                              className="rounded-lg p-2 flex w-fit mx-auto items-center font-bold text-[14px] text-white bg-blue-600 hover:bg-blue-700"
                            >
                              <Calendar className="w-4 h-4 mr-2 inline" />
                              Book your first appointment
                            </Link>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
