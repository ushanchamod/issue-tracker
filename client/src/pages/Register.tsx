import useAxios from "../hooks/useAxios";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  registerSchema,
  type registerFormInputs,
} from "../utility/zod-schema/loginSchema";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Register = () => {
  const { fetchData } = useAxios();
  const navigation = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<registerFormInputs>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: registerFormInputs) => {
    const { username, email, firstName, lastName, password, confirmPassword } =
      data;

    try {
      await fetchData({
        url: "/user/register",
        method: "post",
        data: {
          username,
          email,
          firstName,
          lastName,
          password,
          confirmPassword,
        },
        headers: { "Content-Type": "application/json" },
      });

      toast.success("Registration successful", {
        autoClose: 2000,
        position: "bottom-right",
        theme: "colored",
      });

      navigation("/auth/login");
    } catch (error: any) {
      console.log("Registration error:", error);

      if (error?.response?.data?.message === "Username already exists") {
        setError("username", { message: "Use different username" });
      } else if (error?.response?.data?.message === "Email already exists") {
        setError("email", { message: "Use different email" });
      } else {
        toast.error("An error occurred during registration", {
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
            <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
            <p className="text-gray-600 mt-2">Register to get started</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                id="firstName-input"
                name="firstName"
                register={register}
                errors={errors}
                label={{ content: "First Name" }}
                required
                autoFocus
              />
              <Input
                id="lastName-input"
                name="lastName"
                register={register}
                errors={errors}
                label={{ content: "Last Name" }}
              />
            </div>

            <Input
              id="email-input"
              name="email"
              register={register}
              errors={errors}
              label={{ content: "Email" }}
              type="email"
              required
            />

            <Input
              id="username-input"
              name="username"
              register={register}
              errors={errors}
              label={{ content: "Username" }}
              required
            />

            <Input
              id="password-input"
              name="password"
              register={register}
              errors={errors}
              label={{ content: "Password" }}
              type="password"
              required
            />

            <Input
              id="confirmPassword-input"
              name="confirmPassword"
              register={register}
              errors={errors}
              label={{ content: "Confirm Password" }}
              type="password"
              required
            />

            <Button
              type="submit"
              activeText="Register"
              disableText="Registering..."
              isLoading={isSubmitting}
              disabled={isSubmitting}
            />
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/auth/login"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
