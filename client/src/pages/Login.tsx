import { useAuthStore } from "../stores/useAuthStore";
import useAxios from "../hooks/useAxios";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  loginSchema,
  type LoginFormInputs,
} from "../utility/zod-schema/loginSchema";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Login = () => {
  const { fetchData } = useAxios();
  const setUser = useAuthStore((state) => state.setUser);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    resetField,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormInputs) => {
    const { username, password } = data;

    try {
      const response = await fetchData({
        url: "/user/login",
        method: "post",
        data: { username, password },
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("hi", response.data);

      setUser({
        username: response.data.username,
      });

      toast.success("Login successful", {
        autoClose: 2000,
        position: "bottom-right",
        theme: "colored",
      });
    } catch (error: any) {
      console.log("Login error:", error?.response?.data?.message);

      if (error?.response?.data?.message) {
        const msg = error?.response?.data?.message;

        if (msg === "User not found") {
          reset();
          return setError("username", { message: "username not found" });
        } else if (msg === "Invalid password") {
          resetField("password");
          return setError("password", { message: "Password is wrong" });
        }
      } else {
        return toast.error("An error occurred during login", {
          autoClose: 2000,
          position: "bottom-right",
          theme: "colored",
        });
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-0 md:p-4">
      <motion.div
        className="w-full sm:max-w-full md:max-w-md sm:h-dvh md:max-h-fit"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <div className="bg-white rounded-b-md shadow-lg p-8 backdrop-blur-sm bg-opacity-90 w-full h-dvh md:h-fit ">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
            <p className="text-gray-600 mt-2">Sign in to access your account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              id="login-user-name-input"
              name="username"
              register={register}
              errors={errors}
              label={{ content: "Username" }}
              type="text"
              required={true}
            />

            <Input
              id="login-password-field"
              name="password"
              register={register}
              errors={errors}
              label={{ content: "Password" }}
              type="password"
              required={true}
            />

            <div className="pt-2">
              <Button
                type="submit"
                activeText="Login"
                disableText="Login..."
                isLoading={isSubmitting}
                disabled={isSubmitting}
              />
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/auth/register"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
