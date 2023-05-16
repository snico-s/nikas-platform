import GoogleSignInButton from "@/components/google-sign-in-button"

const SignInPage = () => {
  return (
    <section className="flex min-h-full overflow-hidden pt-16 sm:py-28">
      <div className="mx-auto flex w-full max-w-2xl flex-col px-4 sm:px-6">
        <div className="relative mt-12 sm:mt-16">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Sign in to your account
          </h1>
        </div>
        <div className="py-2">
          <GoogleSignInButton />
        </div>
      </div>
    </section>
  )
}

export default SignInPage
