import { accountActivation, signin, signout } from "../services/auth.service";
import { useToast } from "../../../hooks/use-toast";
import { useGlobalMutation } from "../../../state/query-client/hooks";

export const useSigninMutation = () => {
  const { toast } = useToast();

  return useGlobalMutation({
    mutationKey: ["signin"],
    mutationFn: signin,
    onSuccess: () => {
      toast({
        color: "blue",
        title: "Sucesss",
        description: "You are sucessfully logged in",
      });
    },
    onError: ({
      error,
    }: {
      status: number;
      error: { error: string; error_description: string };
    }) => {
      toast({
        variant: "destructive",
        color: "blue",
        title: "Error",
        description: error.error,
      });
    },
  });
};

export const useSignoutMutation = () => {
  return useGlobalMutation({
    mutationKey: ["signout"],
    mutationFn: signout,
  });
};

export const useAccountActivation = () => {
  const { toast } = useToast();
  return useGlobalMutation({
    mutationKey: ["accountActivation"],
    mutationFn: accountActivation,
    onSuccess: () => {
      toast({
        color: "blue",
        title: "Sucesss",
        description: "You are sucessfully acctivated your account",
      });
    },
    onError: ({
      error,
    }: {
      status: number;
      error: { isSuccess: boolean; errors: { Code: string } };
    }) => {
      toast({
        variant: "destructive",
        color: "blue",
        title: "Error",
        description: error.errors.Code,
      });
    },
  });
};