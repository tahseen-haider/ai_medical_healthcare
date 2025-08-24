"use client"

import { useState, useTransition } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  User,
  Mail,
  Phone,
  Calendar,
  Clock,
  FileText,
  Shield,
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
  Plus,
  Save,
  History,
  MessageSquare,
} from "lucide-react"
import { DoctorRemark, UserType } from "@/lib/definitions"
import { addDoctorRemark, getPatientRemarks } from "@/actions/doctor.action"

interface PatientProfileProps {
  patient: UserType
  currentDoctorId?: string // ID of the currently logged-in doctor
}

export default function PatientProfile({ patient, currentDoctorId }: PatientProfileProps) {
  const [newRemark, setNewRemark] = useState("")
  const [isAddingRemark, setIsAddingRemark] = useState(false)
  const [remarks, setRemarks] = useState<DoctorRemark[]>([])
  const [isRemarksDialogOpen, setIsRemarksDialogOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const formatDate = (dateString: string | Date | null) => {
    if (!dateString) return "Not specified"
    return new Date(dateString).toLocaleDateString("en-GB")
  }

  const formatDateTime = (dateTime: Date | null) => {
    if (!dateTime) return "N/A"
    const date = new Date(dateTime)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) return "Today"
    if (diffInDays === 1) return "Yesterday"
    if (diffInDays < 7) return `${diffInDays} days ago`
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`
    return `${Math.floor(diffInDays / 365)} years ago`
  }

  const handleAddRemark = () => {
    if (!newRemark.trim() || !currentDoctorId) return

    startTransition(async () => {
      const result = await addDoctorRemark(patient.id, currentDoctorId, newRemark)
      if (result.success) {
        setNewRemark("")
        setIsAddingRemark(false)
        // Refresh remarks if dialog is open
        if (isRemarksDialogOpen) {
          await loadRemarks()
        }
      } else {
        // Handle error (you might want to show a toast notification)
        console.error("Failed to add remark:", result.error)
      }
    })
  }

  const loadRemarks = async () => {
    const patientRemarks = await getPatientRemarks(patient.id)
    setRemarks(patientRemarks)
  }

  const handleViewHistory = async () => {
    setIsRemarksDialogOpen(true)
    await loadRemarks()
  }

  // ... existing code for calculations and status functions ...

  const totalAppointments = patient.appointmentsAsPatient.length
  const upcomingAppointments = patient.appointmentsAsPatient.filter(
    (apt) => apt.status === "CONFIRMED" || apt.status === "PENDING",
  ).length
  const completedAppointments = patient.appointmentsAsPatient.filter((apt) => apt.status === "COMPLETED").length

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "default"
      case "CONFIRMED":
        return "outline"
      case "PENDING":
        return "secondary"
      case "CANCELLED":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const calculateAge = (dob: string | null | undefined) => {
    if (!dob) return null
    const today = new Date()
    const birthDate = new Date(dob)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  const calculateBMI = (height: number | null, weight: number | null) => {
    if (!height || !weight) return null
    const heightInMeters = height / 100
    const bmi = weight / (heightInMeters * heightInMeters)
    return Math.round(bmi * 10) / 10
  }

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: "Underweight", color: "text-blue-600" }
    if (bmi < 25) return { category: "Normal", color: "text-green-600" }
    if (bmi < 30) return { category: "Overweight", color: "text-yellow-600" }
    return { category: "Obese", color: "text-red-600" }
  }

  const getVitalStatus = (value: number | null, normal: { min: number; max: number }) => {
    if (!value) return { status: "Unknown", color: "text-gray-500" }
    if (value < normal.min) return { status: "Low", color: "text-blue-600" }
    if (value > normal.max) return { status: "High", color: "text-red-600" }
    return { status: "Normal", color: "text-green-600" }
  }

  const age = calculateAge(patient.dob)
  const bmi = calculateBMI(patient.height ?? null, patient.weight ?? null)
  const bmiCategory = bmi ? getBMICategory(bmi) : null

  // Normal ranges for vital signs
  const heartRateStatus = getVitalStatus(patient.heartRate ?? null, {
    min: 60,
    max: 100,
  })
  const respiratoryRateStatus = getVitalStatus(patient.respiratoryRate ?? null, {
    min: 12,
    max: 20,
  })
  const temperatureStatus = getVitalStatus(patient.temperature ?? null, {
    min: 36.1,
    max: 37.2,
  })

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        <Card className="overflow-hidden rounded-sm bg-white dark:bg-gray-900">
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-6">
              {/* Profile Image */}
              <div className="flex-shrink-0">
                <div className="w-32 h-32 rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center">
                  {patient.pfp ? (
                    <img
                      src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${patient.pfp}`}
                      alt={patient.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-16 h-16 text-gray-400" />
                  )}
                </div>
              </div>

              {/* Basic Info */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{patient.name}</h1>
                    <p className="text-gray-600 dark:text-gray-400 font-medium">Patient ID: {patient.id.slice(0, 8)}</p>
                    {age && (
                      <p className="text-gray-600 dark:text-gray-400 mt-1">
                        {age} years old • {patient.gender || "Gender not specified"}
                      </p>
                    )}

                    {/* Account Status */}
                    <div className="flex items-center gap-2 mt-3">
                      <Badge variant={patient.is_verified ? "default" : "secondary"}>
                        {patient.is_verified ? "Verified Patient" : "Unverified"}
                      </Badge>
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        Active
                      </Badge>
                      {patient.bloodType && (
                        <Badge variant="outline" className="text-red-600 border-red-600">
                          {patient.bloodType}
                        </Badge>
                      )}
                    </div>

                    {/* Member Since */}
                    <p className="text-sm text-gray-500 mt-2">
                      Patient since {patient.createdAt.toLocaleDateString("en-GB")}
                    </p>
                  </div>

                  {/* Doctor Action Buttons */}
                  <div className="flex flex-col gap-2">
                    {currentDoctorId && (
                      <Button onClick={() => setIsAddingRemark(!isAddingRemark)} className="flex items-center gap-2 bg-light-4 dark:bg-gray-50">
                        <Plus className="w-4 h-4" />
                        Add Remark
                      </Button>
                    )}
                    <Dialog open={isRemarksDialogOpen} onOpenChange={setIsRemarksDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="flex items-center gap-2 bg-transparent"
                          onClick={handleViewHistory}
                        >
                          <History className="w-4 h-4" />
                          View History
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh]">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <MessageSquare className="w-5 h-5" />
                            Doctor Remarks History
                          </DialogTitle>
                        </DialogHeader>
                        <ScrollArea className="max-h-[60vh] pr-4">
                          {remarks.length > 0 ? (
                            <div className="space-y-4">
                              {remarks.map((remark) => (
                                <Card key={remark.id} className="p-4">
                                  <div className="flex items-start gap-3">
                                    <Avatar className="w-10 h-10">
                                      <AvatarImage
                                        src={
                                          remark.doctor.pfp
                                            ? `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${remark.doctor.pfp}`
                                            : undefined
                                        }
                                        alt={remark.doctor.name}
                                      />
                                      <AvatarFallback>
                                        {remark.doctor.name
                                          .split(" ")
                                          .map((n) => n[0])
                                          .join("")
                                          .toUpperCase()}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-semibold text-sm">{remark.doctor.name}</h4>
                                        {remark.doctor.doctorProfile && (
                                          <Badge variant="outline" className="text-xs">
                                            {remark.doctor.doctorProfile.specialization ||
                                              remark.doctor.doctorProfile.doctorType}
                                          </Badge>
                                        )}
                                      </div>
                                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                        {formatDateTime(remark.createdAt)}
                                      </p>
                                      <p className="text-sm text-gray-900 dark:text-gray-100 leading-relaxed">
                                        {remark.content}
                                      </p>
                                    </div>
                                  </div>
                                </Card>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-8">
                              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                                No remarks yet
                              </h3>
                              <p className="text-gray-600 dark:text-gray-400">
                                No doctor remarks have been added for this patient.
                              </p>
                            </div>
                          )}
                        </ScrollArea>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            </div>

            {/* Add Remark Section */}
            {isAddingRemark && currentDoctorId && (
              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Add Doctor's Remark
                </h3>
                <Textarea
                  placeholder="Enter your medical notes, observations, or recommendations for this patient..."
                  value={newRemark}
                  onChange={(e) => setNewRemark(e.target.value)}
                  className="mb-3"
                  rows={4}
                />
                <div className="flex gap-2">
                  <Button
                    onClick={handleAddRemark}
                    className="flex items-center gap-2"
                    disabled={isPending || !newRemark.trim()}
                  >
                    <Save className="w-4 h-4" />
                    {isPending ? "Saving..." : "Save Remark"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsAddingRemark(false)
                      setNewRemark("")
                    }}
                    disabled={isPending}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardHeader>

          {/* ... existing code for tabs content ... */}
          <CardContent className="p-0">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full justify-start rounded-none border-b bg-transparent h-12">
                <TabsTrigger
                  value="overview"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none"
                >
                  Overview
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

              {/* Overview Tab */}
              <TabsContent value="overview" className="p-6 space-y-6">
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
                          <p className="text-sm font-medium text-gray-950 dark:text-gray-300">Email</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{patient.email}</p>
                        </div>
                      </div>

                      {patient.phone && (
                        <div className="flex items-start gap-3">
                          <Phone className="w-4 h-4 mt-1 text-gray-500" />
                          <div>
                            <p className="text-sm font-medium text-gray-950 dark:text-gray-300">Phone</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{patient.phone}</p>
                          </div>
                        </div>
                      )}

                      {patient.dob && (
                        <div className="flex items-start gap-3">
                          <Calendar className="w-4 h-4 mt-1 text-gray-500" />
                          <div>
                            <p className="text-sm font-medium text-gray-950 dark:text-gray-300">Date of Birth</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {formatDate(patient.dob)} {age && `(${age} years old)`}
                            </p>
                          </div>
                        </div>
                      )}

                      {patient.gender && (
                        <div className="flex items-start gap-3">
                          <User className="w-4 h-4 mt-1 text-gray-500" />
                          <div>
                            <p className="text-sm font-medium text-gray-950 dark:text-gray-300">Gender</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{patient.gender}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quick Health Summary */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                      <FileHeart className="w-5 h-5 text-red-500" />
                      Quick Health Summary
                    </h3>

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Blood Type</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {patient.bloodType || "Not specified"}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Last Checkup</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {formatDateTime(patient.lastCheckUp ?? null)}
                        </span>
                      </div>

                      {bmi && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">BMI</span>
                          <span className={`text-sm font-medium ${bmiCategory?.color}`}>
                            {bmi} ({bmiCategory?.category})
                          </span>
                        </div>
                      )}

                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Chronic Conditions</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {(patient.chronicConditions ?? []).length || "None"}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Current Medications</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {(patient.medications ?? []).length || "None"}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Known Allergies</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {(patient.allergies ?? []).length || "None"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Critical Alerts */}
                {((patient.allergies ?? []).length > 0 || (patient.chronicConditions ?? []).length > 0) && (
                  <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
                    <CardHeader>
                      <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5" />
                        Critical Medical Information
                      </h3>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {(patient.allergies ?? []).length > 0 && (
                        <div>
                          <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">Allergies</h4>
                          <div className="flex flex-wrap gap-2">
                            {(patient.allergies ?? []).map((allergy, index) => (
                              <Badge key={index} variant="destructive" className="text-xs">
                                {allergy}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {(patient.chronicConditions ?? []).length > 0 && (
                        <div>
                          <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">Chronic Conditions</h4>
                          <div className="flex flex-wrap gap-2">
                            {(patient.chronicConditions ?? []).map((condition, index) => (
                              <Badge key={index} variant="outline" className="text-xs border-red-300 text-red-700">
                                {condition}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Doctor's Notes */}
                {patient.notes && (
                  <Card>
                    <CardHeader>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-gray-500" />
                        Medical Notes
                      </h3>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{patient.notes}</p>
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
                      {(patient.chronicConditions ?? []).length > 0 ? (
                        <div className="space-y-2">
                          {(patient.chronicConditions ?? []).map((condition, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 p-2 bg-red-50 dark:bg-red-900/20 rounded"
                            >
                              <AlertCircle className="w-4 h-4 text-red-500" />
                              <span className="text-sm text-gray-700 dark:text-gray-300">{condition}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 italic">No chronic conditions recorded</p>
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
                      {(patient.medications ?? []).length > 0 ? (
                        <div className="space-y-2">
                          {(patient.medications ?? []).map((medication, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded"
                            >
                              <Pill className="w-4 h-4 text-blue-500" />
                              <span className="text-sm text-gray-700 dark:text-gray-300">{medication}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 italic">No medications recorded</p>
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
                      {(patient.surgeries ?? []).length > 0 ? (
                        <div className="space-y-2">
                          {(patient.surgeries ?? []).map((surgery, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 p-2 bg-purple-50 dark:bg-purple-900/20 rounded"
                            >
                              <Stethoscope className="w-4 h-4 text-purple-500" />
                              <span className="text-sm text-gray-700 dark:text-gray-300">{surgery}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 italic">No surgeries recorded</p>
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
                      {(patient.immunizations ?? []).length > 0 ? (
                        <div className="space-y-2">
                          {(patient.immunizations ?? []).map((immunization, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-900/20 rounded"
                            >
                              <Shield className="w-4 h-4 text-green-500" />
                              <span className="text-sm text-gray-700 dark:text-gray-300">{immunization}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 italic">No immunizations recorded</p>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Lifestyle Factors */}
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                      <Dumbbell className="w-5 h-5 text-blue-500" />
                      Lifestyle Factors
                    </h3>
                  </CardHeader>
                  <CardContent className="grid md:grid-cols-3 gap-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                        <Cigarette className="w-4 h-4" />
                        Smoking
                      </span>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {patient.smoker === null ? "Not specified" : patient.smoker ? "Yes" : "No"}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                        <Wine className="w-4 h-4" />
                        Alcohol
                      </span>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {patient.alcoholUse === null ? "Not specified" : patient.alcoholUse ? "Yes" : "No"}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                        <Dumbbell className="w-4 h-4" />
                        Exercise
                      </span>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {patient.exerciseFrequency || "Not specified"}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Mental Health */}
                {(patient.mentalHealthConcerns ?? []).length > 0 && (
                  <Card>
                    <CardHeader>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        <Brain className="w-5 h-5 text-purple-500" />
                        Mental Health Concerns
                      </h3>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {(patient.mentalHealthConcerns ?? []).map((concern, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {concern}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
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
                        <span className="text-sm text-gray-600 dark:text-gray-400">Height</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {patient.height ? `${patient.height} cm` : "Not recorded"}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Weight</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {patient.weight ? `${patient.weight} kg` : "Not recorded"}
                        </span>
                      </div>

                      {bmi && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">BMI</span>
                          <span className={`text-sm font-medium ${bmiCategory?.color}`}>
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
                        <span className="text-sm text-gray-600 dark:text-gray-400">Blood Pressure</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {patient.bloodPressure || "Not recorded"}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Heart Rate</span>
                        <span className={`text-sm font-medium ${heartRateStatus.color}`}>
                          {patient.heartRate ? `${patient.heartRate} bpm (${heartRateStatus.status})` : "Not recorded"}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Respiratory Rate</span>
                        <span className={`text-sm font-medium ${respiratoryRateStatus.color}`}>
                          {patient.respiratoryRate
                            ? `${patient.respiratoryRate} /min (${respiratoryRateStatus.status})`
                            : "Not recorded"}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Temperature & Additional */}
                  <Card>
                    <CardHeader>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        <Thermometer className="w-5 h-5 text-orange-500" />
                        Additional Vitals
                      </h3>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Temperature</span>
                        <span className={`text-sm font-medium ${temperatureStatus.color}`}>
                          {patient.temperature
                            ? `${patient.temperature}°C (${temperatureStatus.status})`
                            : "Not recorded"}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Blood Type</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {patient.bloodType || "Not recorded"}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Last Updated</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {formatDateTime(patient.lastCheckUp ?? null)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Vital Signs Reference Ranges */}
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
                        <p className="font-medium text-gray-900 dark:text-gray-100">Heart Rate</p>
                        <p className="text-gray-600 dark:text-gray-400">Normal: 60-100 bpm</p>
                      </div>
                      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
                        <p className="font-medium text-gray-900 dark:text-gray-100">Blood Pressure</p>
                        <p className="text-gray-600 dark:text-gray-400">Normal: &lt;120/80 mmHg</p>
                      </div>
                      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
                        <p className="font-medium text-gray-900 dark:text-gray-100">Respiratory Rate</p>
                        <p className="text-gray-600 dark:text-gray-400">Normal: 12-20 /min</p>
                      </div>
                      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
                        <p className="font-medium text-gray-900 dark:text-gray-100">Temperature</p>
                        <p className="text-gray-600 dark:text-gray-400">Normal: 36.1-37.2°C</p>
                      </div>
                      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
                        <p className="font-medium text-gray-900 dark:text-gray-100">BMI</p>
                        <p className="text-gray-600 dark:text-gray-400">Normal: 18.5-24.9 kg/m²</p>
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
                        <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">{totalAppointments}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Total</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-orange-600">{upcomingAppointments}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Upcoming</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-green-600">{completedAppointments}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-red-600">
                          {patient.appointmentsAsPatient.filter((apt) => apt.status === "CANCELLED").length}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Cancelled</div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Appointments List */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Appointment History</h3>

                    <div className="space-y-3">
                      {patient.appointmentsAsPatient.map((appointment) => (
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
                                    Patient: {appointment.fullname}
                                  </p>
                                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                    <div className="flex items-center gap-1">
                                      <Calendar className="w-4 h-4" />
                                      {appointment.preferredDate.toLocaleDateString("en-GB")}
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Clock className="w-4 h-4" />
                                      {appointment.preferredTime}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <Badge variant={getStatusColor(appointment.status)}>{appointment.status}</Badge>
                                <p className="text-xs text-gray-500 mt-1">
                                  {new Date(appointment.createdAt).toLocaleDateString("en-GB")}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}

                      {patient.appointmentsAsPatient.length === 0 && (
                        <Card>
                          <CardContent className="p-8 text-center">
                            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                              No appointments found
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">This patient has no appointment history.</p>
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
  )
}
