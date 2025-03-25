import Link from "next/link";
import { Button } from "@/components/ui/button";
import Confetti from "../../magicui/confetti";
import { StepCompleteProps } from "@/types/register/registerTypes";

export const StepComplete = ({ formError, confettiRef }: StepCompleteProps) => {
  return (
    <div className="w-full max-md:h-full flex flex-col justify-center items-center">
      {formError ? (
        <>
          <h2 className="text-base font-semibold leading-7 text-red-900">
            Oops !!!!
          </h2>
          <div className="mt-1 px-4 text-center text-sm leading-6 text-gray-600">
            <span className="font-black text-md">{formError}</span>
            <br />
            Please try again to register your account to start managing your
            account. If the problem persists, don&apos;t hesitate to contact us
            for help or try again later.
          </div>
          <Button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex my-5 items-center justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Try Again
          </Button>
        </>
      ) : (
        <>
          <span className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-6xl md:text-8xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10">
            Complete
          </span>
          <p className="my-6 px-4 text-center text-sm leading-6 text-gray-600">
            Thank you for your submission. You can now log in with your
            credentials to begin managing your team.
          </p>
          <Confetti
            ref={confettiRef}
            className="absolute left-0 top-0 z-0 size-full"
            onMouseEnter={() => {
              confettiRef.current?.fire({});
            }}
          />
          <Link
            href="/login"
            className="inline-flex z-50 my-5 items-center justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Log in
          </Link>
        </>
      )}
    </div>
  );
};
