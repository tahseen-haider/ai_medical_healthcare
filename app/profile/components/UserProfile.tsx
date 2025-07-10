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
  Heart,
  Activity,
  FileText,
  Shield,
} from "lucide-react";
import ProfilePageImage from "./ProfilePageImage";
import EditButton from "./editButton";
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

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString();
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

  const age = calculateAge(user.dob);

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
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
                    <EditButton />
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
                  value="appointments"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none"
                >
                  Appointments
                </TabsTrigger>
              </TabsList>

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
                        <Card key={appointment.id}>
                          <CardContent className="p-4">
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
                            Enabled
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <hr />
                {/* Health Summary */}
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        <Heart className="w-5 h-5 text-red-500" />
                        Health Summary
                      </h3>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Blood Type
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {user.bloodType || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Allergies
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {(user.allergies?.length ?? 0) > 0
                            ? user.allergies!.map((allergy, index) => (
                                <span key={index}>
                                  {allergy}
                                  {index < user.allergies!.length - 1
                                    ? ", "
                                    : ""}
                                </span>
                              ))
                            : "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Last Checkup
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {user.lastCheckUp
                            ?.toLocaleDateString()
                            .split("T")[1] || "N/A"}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-green-500" />
                        Account Security
                      </h3>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Two-Factor Auth
                        </span>
                        <Badge
                          variant="outline"
                          className="text-green-600 border-green-600"
                        >
                          Enabled
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Email Verified
                        </span>
                        <Badge
                          variant={user.is_verified ? "outline" : "secondary"}
                        >
                          {user.is_verified ? "Verified" : "Pending"}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Last Login
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {user.lastLogin?.toLocaleDateString().split("T")[1] ||
                            "N/A"}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
