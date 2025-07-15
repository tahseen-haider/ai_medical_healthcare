import type { UserType } from "@/lib/definitions";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Phone, Calendar, Shield, Settings, Edit3 } from "lucide-react";
import ProfilePageImage from "./ProfilePageImage";
import Link from "next/link";

export default function AdminProfile({ user }: { user: UserType }) {
  const pfp = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${user.pfp}`;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString("en-GB");
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
        <Card className="overflow-hidden gap-0 rounded-sm bg-white dark:bg-dark-4">
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <div className="w-32 h-32 rounded-lg overflow-hidden bg-gray-200">
                  {pfp && <ProfilePageImage image={pfp} size={128} />}
                </div>
              </div>
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {user.name}
                    </h1>
                    <p className="text-blue-600 font-medium">
                      System Administrator
                    </p>
                    {age && (
                      <p className="text-gray-600 dark:text-gray-400 mt-1">
                        {age} years old
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-3">
                      <Badge
                        variant="default"
                        className="bg-light-4 dark:bg-light-1"
                      >
                        Super Admin
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-green-600 border-green-600"
                      >
                        Active
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-blue-600 border-blue-600"
                      >
                        Full Access
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Admin since{" "}
                      {user.createdAt.toLocaleDateString("en-GB")}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Link
                      href="/settings"
                      className="rounded-lg p-2 flex items-center justify-center font-bold text-[14px] text-white dark:text-black text-center bg-light-4 dark:bg-white"
                    >
                      <Edit3 className="inline mr-2" />
                      Edit Profile
                    </Link>
                    <Link
                      href="/admin/dashboard"
                      className="rounded-lg p-2 flex items-center justify-center font-bold text-[14px] text-white bg-light-4 dark:bg-dark-1"
                    >
                      <Settings className="w-4 h-4 mr-2 inline" />
                      Admin Dashboard
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="pt-0 p-6 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
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
                          {formatDate(user.dob)} {age && `(${age} years old)`}
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

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Admin Details
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Admin Level
                    </span>
                    <Badge
                      variant="default"
                      className="bg-light-4 dark:bg-light-1"
                    >
                      Super Admin
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Admin Since
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
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Last Login
                    </span>
                    <span className="text-sm text-gray-900 dark:text-gray-100">
                      {user.lastLogin
                        ? (() => {
                            const loginDate = new Date(user.lastLogin);
                            const now = new Date();
                            const login = new Date(
                              loginDate.getFullYear(),
                              loginDate.getMonth(),
                              loginDate.getDate()
                            );
                            const today = new Date(
                              now.getFullYear(),
                              now.getMonth(),
                              now.getDate()
                            );
                            const diffInMs = today.getTime() - login.getTime();
                            const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
                            if (diffInDays === 0) return "Today";
                            if (diffInDays === 1) return "Yesterday";
                            if (diffInDays < 7) return `${diffInDays} days ago`;
                            return loginDate.toLocaleDateString("en-GB", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            });
                          })()
                        : "N/A"}
                    </span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-950 dark:text-gray-300">
                    Permissions
                  </h4>
                  <div className="space-y-2">
                    {["User Management", "System Settings", "Data Export"].map(
                      (perm) => (
                        <div
                          key={perm}
                          className="flex justify-between items-center"
                        >
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {perm}
                          </span>
                          <Badge
                            variant="outline"
                            className="text-green-600 border-green-600"
                          >
                            {perm === "Data Export" ? "Enabled" : "Full Access"}
                          </Badge>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>

            <hr />

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-blue-500" />
                    System Access
                  </h3>
                </CardHeader>
                <CardContent className="space-y-3">
                  {["Database Access", "API Access", "Audit Logs"].map(
                    (item) => (
                      <div key={item} className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {item}
                        </span>
                        <Badge
                          variant="outline"
                          className="text-green-600 border-green-600"
                        >
                          {item === "Audit Logs" ? "Read/Write" : "Full Access"}
                        </Badge>
                      </div>
                    )
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-red-500" />
                    Security Settings
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
                      {user.twoFactorEnabled ? "Enabled" : "Required"}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Account Verified
                    </span>
                    <Badge variant={user.is_verified ? "outline" : "secondary"}>
                      {user.is_verified ? "Verified" : "Pending"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Last Login
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {user.lastLogin
                        ? (() => {
                            const loginDate = new Date(user.lastLogin);
                            const now = new Date();
                            const login = new Date(
                              loginDate.getFullYear(),
                              loginDate.getMonth(),
                              loginDate.getDate()
                            );
                            const today = new Date(
                              now.getFullYear(),
                              now.getMonth(),
                              now.getDate()
                            );
                            const diffInMs = today.getTime() - login.getTime();
                            const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
                            if (diffInDays === 0) return "Today";
                            if (diffInDays === 1) return "Yesterday";
                            if (diffInDays < 7) return `${diffInDays} days ago`;
                            return loginDate.toLocaleDateString("en-GB", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            });
                          })()
                        : "N/A"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
