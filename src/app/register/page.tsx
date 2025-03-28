import Link from "next/link";
import RegisterForm from "./_components/RegiterForm";
import { auth } from "~/server/auth";
import { redirect } from "next/navigation";

export default async function Register() {
  const session = await auth();

  if (session?.user) {
    redirect("/workflow");
  }
  return (
    <section
      className="relative flex h-screen items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/images/login-bg.webp')" }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(46.33deg,_rgba(33,33,33,0.839216)_0%,_rgba(66,66,66,0.239216)_178.98%)]"></div>

      <div className="relative mt-auto grid h-fit w-full grid-cols-1 px-2 md:grid-cols-2">
        {/* Left Side Content */}
        <section className="mx-auto hidden flex-col justify-center text-white md:flex">
          <img
            src="/images/logo.png"
            alt="HighBridge Logo"
            width={273.66}
            height={64}
            className="mt-28"
          />
          <div className="font-zen my-auto w-full max-w-sm">
            <h2 className="text-[39.06px] font-bold">Building the Future...</h2>
            <p className="mt-2 text-base">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
        </section>

        {/* Right Side Login Form */}
        <section className="bg-popover mx-auto w-full max-w-[460px] rounded-t-3xl p-10 shadow-lg">
          <div>
            <h3 className="text-sm leading-[22.5px] font-medium">WELCOME!</h3>
            <h2 className="text-[26px] leading-[44px] font-semibold">
              Register a new Account
            </h2>
          </div>

          <RegisterForm />
          <div className="relative my-4 flex items-center">
            <div className="border-border flex-grow border-t"></div>
            <span className="px-3.5 text-[13px] font-bold text-[#212121]">
              Or
            </span>
            <div className="border-border flex-grow border-t"></div>
          </div>

          <div className="flex flex-col gap-2">
            <button className="flex h-12 items-center rounded-xl border border-[#EEEEEE] px-12">
              <img
                src="/icons/google.png"
                width={18}
                height={18}
                alt="Google"
              />
              <span className="w-full text-center text-[12.8px] text-[#616161]">
                Log In with Google
              </span>
            </button>
            <button className="flex h-12 items-center rounded-xl border border-[#EEEEEE] px-12">
              <img
                src="/icons/facebook.png"
                width={18}
                height={18}
                alt="Google"
              />
              <span className="w-full text-center text-[12.8px] text-[#616161]">
                Log In with Facebook
              </span>
            </button>
            <button className="flex h-12 items-center rounded-xl border border-[#EEEEEE] px-12">
              <img src="/icons/apple.png" width={18} height={18} alt="Google" />
              <span className="w-full text-center text-[12.8px] text-[#616161]">
                Log In with Apple
              </span>
            </button>
          </div>

          <p className="mt-8 mb-4 text-center text-[12.8px] text-[#212121]">
            Already have an account?{" "}
            <Link href="/login" className="font-bold underline">
              LOGIN
            </Link>
          </p>
        </section>
      </div>
    </section>
  );
}
