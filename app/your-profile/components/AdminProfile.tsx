import { UserType } from '@/lib/definitions';

export default function AdminProfile({
  user,
}: {
  user: UserType;
}) {
  const pfp = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${user.pfp}`
  return (
    <div>AdminProfile</div>
  )
}
