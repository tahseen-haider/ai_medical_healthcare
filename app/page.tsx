import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'


export default async function Home() {
  const prisma = new PrismaClient().$extends(withAccelerate())

  const newPatient = await prisma.patient.create({
    data: {
      name: "John Doe",
      email: "john@doe.com",
      birthDate: new Date("2002-11-30")
    }
  });

  console.log("Patient Created: ", newPatient)
  return (
    <div>
      HOME PAGE
    </div>
  );
}
