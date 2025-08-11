import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Stethoscope, User, Calendar } from "lucide-react"
import ProfilePageImage from "@/app/profile/components/ProfilePageImage"
import { getDoctorsForDoctorSection } from "@/actions/doctor.action"

interface Doctor {
  id: string
  name: string
  email: string
  pfp: string | null
  doctorProfile: {
    doctorType: string
    specialization: string | null
    qualifications: string | null
    experience: number | null
    bio: string | null
    clinicName: string | null
    clinicAddress: string | null
    consultationFee: number | null
    availableDays: string[]
    availableTimes: string | null
    ratings: number | null
    totalReviews: number | null
    isApproved: boolean
  } | null
}

export default async function OurDoctorsSection() {
  const doctors: Doctor[] = await getDoctorsForDoctorSection()

  const renderStars = (rating: number | null) => {
    if (!rating) return null
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-3 h-3 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
          />
        ))}
        <span className="ml-1 text-xs font-medium text-gray-600 dark:text-gray-400">{rating.toFixed(1)}</span>
      </div>
    )
  }

  const getDoctorTypeColor = (type: string) => {
    switch (type) {
      case "SPECIALIST":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "SURGEON":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "GENERAL":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-200"
    }
  }

  return (
    <section className="flex w-full px-2 sm:px-6 py-14">
      <div className="w-full max-w-[1440px] mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
              <Stethoscope className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <h2 className="font-ubuntu font-bold text-3xl sm:text-4xl text-gray-900 dark:text-white mb-4">
            Meet Our Doctors
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Our team of experienced and qualified doctors are here to provide you with the best medical care
          </p>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {doctors.map((doctor) => (
            <Link key={doctor.id} href={`/profile/${doctor.id}`} className="group">
              <Card className="h-full transition-all duration-300 dark:shadow-dark hover:-translate-y-1 bg-white dark:bg-dark-4 border-[1px] border-gray-300 dark:border-none">
                <CardContent className="p-6">
                  {/* Doctor Image */}
                  <div className="flex justify-center mb-4">
                    <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                      {doctor.pfp ? (
                        <ProfilePageImage
                          image={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${doctor.pfp}`}
                          size={80}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-blue-100 dark:bg-blue-900">
                          <User className="w-10 h-10 text-blue-400" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Doctor Info */}
                  <div className="text-center space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {doctor.name}
                      </h3>
                      {doctor.doctorProfile?.specialization && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {doctor.doctorProfile.specialization}
                        </p>
                      )}
                    </div>

                    {/* Doctor Type Badge */}
                    {doctor.doctorProfile?.doctorType && (
                      <div className="flex justify-center">
                        <Badge
                          variant="secondary"
                          className={`text-xs ${getDoctorTypeColor(doctor.doctorProfile.doctorType)}`}
                        >
                          {doctor.doctorProfile.doctorType}
                        </Badge>
                      </div>
                    )}

                    {/* Rating */}
                    {doctor.doctorProfile?.ratings && (
                      <div className="flex justify-center">{renderStars(doctor.doctorProfile.ratings)}</div>
                    )}

                    {/* Experience */}
                    {doctor.doctorProfile?.experience && (
                      <div className="flex items-center justify-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                        <Calendar className="w-3 h-3" />
                        <span>{doctor.doctorProfile.experience} years experience</span>
                      </div>
                    )}

                    {/* Clinic Info */}
                    {doctor.doctorProfile?.clinicName && (
                      <div className="flex items-center justify-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">{doctor.doctorProfile.clinicName}</span>
                      </div>
                    )}

                    {/* Consultation Fee */}
                    {doctor.doctorProfile?.consultationFee && (
                      <div className="text-center">
                        <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                          Rs. {doctor.doctorProfile.consultationFee} consultation
                        </span>
                      </div>
                    )}

                    {/* Availability Status */}
                    <div className="flex justify-center">
                      {doctor.doctorProfile?.isApproved ? (
                        <Badge variant="outline" className="text-green-600 border-green-600 text-xs">
                          Available
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">
                          Pending Approval
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {doctors.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Stethoscope className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Doctors Available</h3>
            <p className="text-gray-600 dark:text-gray-400">
              We're currently updating our doctor listings. Please check back soon.
            </p>
          </div>
        )}

        {/* Call to Action */}
        {doctors.length > 0 && (
          <div className="text-center mt-12">
            <Link
              href="/appointment"
              className="inline-flex items-center gap-2 px-8 py-4 bg-light-4 dark:bg-dark-2 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-dark dark:shadow-light transform hover:-translate-y-0.5"
            >
              <Calendar className="w-5 h-5" />
              Book an Appointment
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
