import { Button } from "../../../components/ui/button";
import { SigninForm } from "../../../features/auth/components/signin-form";

export function SigninPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="text-primary">
        <h2 className="text-5xl">Hello,</h2>
        <h1 className="text-7xl font-bold">Welcome!</h1>
      </div>
      <SigninForm />
      <div>
        <div className="flex items-center gap-4 my-8">
          <div className="flex-1">
            <hr className="h-[2px] bg-gray-200 border-0 rounded" />
          </div>
          <div className="text-primary">Or login with</div>
          <div className="flex-1">
            <hr className="h-[2px] bg-gray-200 border-0 rounded" />
          </div>
        </div>
        <div className="flex items-center gap-8">
          <Button
            className="flex-1 border-red-500 text-red-500 font-semibold"
            variant="outline"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24px"
              height="24px"
              fill="red"
            >
              <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032 s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2 C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
            </svg>
            Google
          </Button>
          <Button
            className="flex-1 border-blue-600 text-blue-600"
            variant="outline"
          >
            {/* <Facebook /> */}
            Facebook
          </Button>
        </div>
      </div>
    </div>
  );
}