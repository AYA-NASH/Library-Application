import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm, useController, Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useAuthActions } from "../../api/hooks/useAuthActions";
import { parseApiError } from "../../errors/parseApiError";
import GoogleAuthButton from "../Utils/GoogleAuthButton";

import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const formSchema = z
    .object({
        username: z
            .string()
            .min(1, "Add your name.")
            .min(3, "Username must be at least 3 characters long."),
        email: z.string().min(1, "Add your email address.").email("Invalid email format."),
        password: z
            .string()
            .min(1, "Enter your password.")
            .min(4, "Password must be at least 4 characters long.")
            .max(20, "Password must not exceed 20 characters.")
            .regex(/^\S*$/, "Password cannot contain spaces."),
        confirmPassword: z.string().min(1, "Confirm your password."),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match.",
        path: ["confirmPassword"],
    });

type SignupFormInputs = z.infer<typeof formSchema>;

// Note: If you extracted this into a shared UI component from the Login page, 
// you can import it here instead of redefining it. 
// You would just need to make it generic: <T extends FieldValues>
interface FormInputProps {
    name: keyof SignupFormInputs;
    control: Control<SignupFormInputs>;
    label: string;
    type?: string;
    placeholder?: string;
}

function FormInput({ name, control, label, type = "text", placeholder }: FormInputProps) {
    const { 
        field, 
        fieldState: { invalid, error } 
    } = useController({ name, control });

    return (
        <Field data-invalid={invalid}>
            <FieldLabel htmlFor={name}>{label}</FieldLabel>
            <Input 
                id={name} 
                type={type} 
                placeholder={placeholder} 
                aria-invalid={invalid} 
                {...field} 
            />
            {invalid && error && <FieldError errors={[error]} />}
        </Field>
    );
}

const SignupPage = () => {
    const { register: userRegister, isRegistering } = useAuthActions();
    const [serverError, setServerError] = useState("");

    const { handleSubmit, control } = useForm<SignupFormInputs>({
        resolver: zodResolver(formSchema),
        defaultValues: { username: "", email: "", password: "", confirmPassword: "" },
    });

    const onSubmit = async (data: SignupFormInputs) => {
        setServerError("");
        try {
            await userRegister(data);
        } catch (err: unknown) {
            setServerError(parseApiError(err).message);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
            <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-md">
                <h2 className="mb-1 text-center text-2xl font-bold tracking-tight text-foreground">
                    Create Your Account
                </h2>
                <p className="mb-6 text-center text-sm text-muted-foreground">
                    Sign up to get started
                </p>

                <form
                    className="flex flex-col gap-4"
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                >
                    <FormInput 
                        name="email" 
                        control={control} 
                        label="Email" 
                        placeholder="Enter your email" 
                    />
                    <FormInput 
                        name="username" 
                        control={control} 
                        label="Username" 
                        placeholder="Choose a username" 
                    />
                    <FormInput 
                        name="password" 
                        control={control} 
                        label="Password" 
                        type="password" 
                        placeholder="Create a password" 
                    />
                    <FormInput 
                        name="confirmPassword" 
                        control={control} 
                        label="Confirm Password" 
                        type="password" 
                        placeholder="Confirm your password" 
                    />

                    {serverError && (
                        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-center text-sm text-destructive">
                            {serverError}
                        </p>
                    )}

                    <Button type="submit" className="w-full" disabled={isRegistering}>
                        {isRegistering ? "Creating Account…" : "Sign Up"}
                    </Button>
                </form>

                <div className="relative my-5 flex items-center gap-3">
                    <div className="h-px flex-1 bg-border" />
                    <span className="text-xs text-muted-foreground">or continue with</span>
                    <div className="h-px flex-1 bg-border" />
                </div>

                <GoogleAuthButton />

                <p className="mt-5 text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link to="/login" className="font-medium text-primary underline-offset-4 hover:underline">
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default SignupPage;