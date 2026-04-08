// "use client";

// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import * as z from "zod";
// import { authClient } from "@/lib/auth-client"; // Your client from earlier
// import { SignUp05 } from "@/components/signup-05"; // The shadcn component
// import { toast } from "sonner"; // Or your preferred toast library

// // Validation schema
// const formSchema = z.zod({
//   name: z.string().min(2),
//   email: z.string().email(),
//   password: z.string().min(8),
// });

// export default function SignupPage() {
//   const handleSignUp = async (values: z.infer<typeof formSchema>) => {
//     const { data, error } = await authClient.signUp.email(
//       {
//         email: values.email,
//         password: values.password,
//         name: values.name,
//         callbackURL: "/dashboard", // Where to go after success
//       },
//       {
//         onRequest: () => {
//           toast.loading("Creating your account...");
//         },
//         onSuccess: () => {
//           toast.success("Welcome! Check your MongoDB, you're officially in.");
//         },
//         onError: (ctx) => {
//           toast.error(ctx.error.message);
//         },
//       },
//     );
//   };

//   // Pass handleSignUp to your SignUp05 component's onSubmit prop
//   return (
//     <div className="flex h-screen w-full items-center justify-center">
//       <SignUp05 onSubmit={handleSignUp} />
//     </div>
//   );
// }
