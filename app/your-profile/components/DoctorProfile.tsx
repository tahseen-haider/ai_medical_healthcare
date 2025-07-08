import type { UserType } from "@/lib/definitions";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Star,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Clock,
  User,
  Stethoscope,
  GraduationCap,
  Building,
  DollarSign,
  MessageCircle,
  UserPlus,
} from "lucide-react";
import EditButton from "./editButton";
import ProfilePageImage from "./ProfilePageImage";

export default function DoctorProfile({
  user,
  pfp,
}: {
  user: UserType;
  pfp: string | undefined;
}) {
  const doctorProfile = user.doctorProfile;
  const totalAppointments = user.appointmentsAsDoctor.length;
  const pendingAppointments = user.appointmentsAsDoctor.filter(
    (apt) => apt.status === "PENDING"
  ).length;
  const completedAppointments = user.appointmentsAsDoctor.filter(
    (apt) => apt.status === "COMPLETED"
  ).length;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString();
  };

  const renderStars = (rating: number | null) => {
    if (!rating) return null;
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < Math.floor(rating)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-2 text-sm font-medium">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="overflow-hidden rounded-sm bg-white dark:bg-dark-4">
          <CardHeader className="">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Profile Image */}
              <div className="flex-shrink-0">
                <div className="w-32 h-32 rounded-lg overflow-hidden bg-gray-200">
                  {pfp ? (
                    <ProfilePageImage image={pfp} size={128} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-100">
                      <User className="w-16 h-16 text-blue-400" />
                    </div>
                  )}
                </div>
              </div>

              {/* Basic Info */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {user.name}
                    </h1>
                    <p className="text-blue-600 font-medium">
                      {doctorProfile?.doctorType || "Doctor"}
                    </p>
                    {doctorProfile?.specialization && (
                      <p className="text-gray-600 dark:text-gray-400 mt-1">
                        {doctorProfile.specialization}
                      </p>
                    )}

                    {/* Rating */}
                    {doctorProfile?.ratings && (
                      <div className="flex items-center gap-2 mt-2">
                        {renderStars(doctorProfile.ratings)}
                        {doctorProfile.totalReviews && (
                          <span className="text-sm text-gray-500">
                            ({doctorProfile.totalReviews} reviews)
                          </span>
                        )}
                      </div>
                    )}

                    {/* Verification Status */}
                    <div className="flex items-center gap-2 mt-3">
                      <Badge
                        variant={user.is_verified ? "default" : "secondary"}
                      >
                        {user.is_verified ? "Verified" : "Pending Verification"}
                      </Badge>
                      {doctorProfile?.isApproved && (
                        <Badge
                          variant="outline"
                          className="text-green-600 border-green-600"
                        >
                          Approved
                        </Badge>
                      )}
                    </div>
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
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="w-full justify-start rounded-none border-b bg-transparent h-12">
                <TabsTrigger
                  value="about"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none"
                >
                  About
                </TabsTrigger>
                <TabsTrigger
                  value="appointments"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none"
                >
                  Appointments
                </TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="p-6 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Professional Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                      <Stethoscope className="w-5 h-5" />
                      Professional Information
                    </h3>

                    <div className="space-y-3">
                      {doctorProfile?.qualifications && (
                        <div className="flex items-start gap-3">
                          <GraduationCap className="w-4 h-4 mt-1 text-gray-500" />
                          <div>
                            <p className="text-sm font-medium text-gray-950 dark:text-gray-300">
                              Qualifications
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {doctorProfile.qualifications}
                            </p>
                          </div>
                        </div>
                      )}

                      {doctorProfile?.experience && (
                        <div className="flex items-start gap-3">
                          <Clock className="w-4 h-4 mt-1 text-gray-500" />
                          <div>
                            <p className="text-sm font-medium text-gray-950 dark:text-gray-300">
                              Experience
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {doctorProfile.experience} years
                            </p>
                          </div>
                        </div>
                      )}

                      {doctorProfile?.consultationFee && (
                        <div className="flex items-start gap-3">
                          <DollarSign className="w-4 h-4 mt-1 text-gray-500" />
                          <div>
                            <p className="text-sm font-medium text-gray-950 dark:text-gray-300">
                              Consultation Fee
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              ${doctorProfile.consultationFee}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Bio */}
                    {doctorProfile?.bio && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-950 dark:text-gray-300 mb-2">
                          About
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                          {doctorProfile.bio}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Contact & Clinic Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                      <Building className="w-5 h-5" />
                      Contact Information
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

                      {doctorProfile?.clinicName && (
                        <div className="flex items-start gap-3">
                          <Building className="w-4 h-4 mt-1 text-gray-500" />
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-300">
                              Clinic
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {doctorProfile.clinicName}
                            </p>
                          </div>
                        </div>
                      )}

                      {doctorProfile?.clinicAddress && (
                        <div className="flex items-start gap-3">
                          <MapPin className="w-4 h-4 mt-1 text-gray-500" />
                          <div>
                            <p className="text-sm font-medium text-gray-950 dark:text-gray-300">
                              Address
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {doctorProfile.clinicAddress}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Personal Details */}
                    <Separator />
                    <h4 className="text-sm font-medium text-gray-950 dark:text-gray-300">
                      Personal Details
                    </h4>
                    <div className="space-y-2">
                      {user.dob && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Date of Birth
                          </span>
                          <span className="text-sm text-gray-900 dark:text-gray-100">
                            {formatDate(user.dob)}
                          </span>
                        </div>
                      )}
                      {user.gender && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Gender</span>
                          <span className="text-sm text-gray-900 dark:text-gray-100">
                            {user.gender}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Availability */}
                {doctorProfile?.availableDays &&
                  doctorProfile.availableDays.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-4">
                        <Calendar className="w-5 h-5" />
                        Availability
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {doctorProfile.availableDays.map((day) => (
                          <Badge key={day} variant="outline">
                            {day}
                          </Badge>
                        ))}
                      </div>
                      {doctorProfile.availableTimes && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                          Times: {doctorProfile.availableTimes}
                        </p>
                      )}
                    </div>
                  )}
              </TabsContent>

              <TabsContent value="appointments" className="p-6">
                <div className="space-y-6">
                  {/* Appointment Statistics */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {totalAppointments}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Total Appointments
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-yellow-600">
                          {pendingAppointments}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Pending</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {completedAppointments}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
                      </CardContent>
                    </Card>
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
