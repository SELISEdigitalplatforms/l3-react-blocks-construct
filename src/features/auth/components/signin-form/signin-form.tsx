import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import {
  signinFormDefaultValue,
  signinFormType,
  signinFormValidationSchema,
} from "./utils";
import { zodResolver } from "@hookform/resolvers/zod";
// src/features/auth/components/signin-form/signin-form.tsx
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../../components/ui/form";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import { UCheckbox } from "../../../../components/core/uCheckbox";
import { UPasswordInput } from "../../../../components/core/u-password-input";
import { useSigninMutation } from "../../hooks/useAuth";
import { useAuthStore } from "../../../../state/store/auth";



export const SigninForm = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const form = useForm<signinFormType>({
    defaultValues: signinFormDefaultValue,
    resolver: zodResolver(signinFormValidationSchema),
  });

  const { isPending, mutateAsync } = useSigninMutation();

  const onSubmitHandler = async (values: signinFormType) => {
    try {
      const res = await mutateAsync(values);
      login(res.access_token, res.refresh_token);
      navigate("/");
    } catch (_error) {
      // Error handling can be added here
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmitHandler)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>User name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your user name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <UPasswordInput {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-between items-center">
          <UCheckbox
            label="Remember me"
            labelClassName="text-gray-400 hover:text-primary"
          />
          <Link to="/reset-password" className="ml-auto inline-block text-sm text-primary">
            Forgot password?
          </Link>
        </div>
        <div className="flex gap-10">
          <Button
            className="flex-1 font-extrabold"
            size="lg"
            type="submit"
            loading={isPending}
            disabled={isPending}
          >
            Login
          </Button>
          <Button
            className="flex-1 font-extrabold border-primary text-primary"
            variant="outline"
            size="lg"
            onClick={() => navigate('/signup')}
          >
            Sign up
          </Button>
        </div>
      </form>
    </Form>
  );
};