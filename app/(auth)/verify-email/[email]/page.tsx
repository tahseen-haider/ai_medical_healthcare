interface Props {
  params: { email: string };
}

export default async function VerifyEmailPage({ params }: { params: { email: string } }) {
  const decodedEmail = decodeURIComponent(params.email);

  return (
    <div>
      <h1>Verify Email</h1>
      <p>We sent a verification code to: {decodedEmail}</p>
    </div>
  );
}
