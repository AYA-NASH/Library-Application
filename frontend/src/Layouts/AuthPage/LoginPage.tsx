import { Link } from "react-router-dom";
import { useState } from "react";
import { useForm, useController, Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useAuthActions } from "../../api/hooks/useAuthActions";
import { parseApiError } from "../../errors/parseApiError";
import GoogleAuthButton from "../Utils/GoogleAuthButton";

import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
    email: z.string().min(1, "Enter your email.").email("Invalid email format."),
    password: z.string().min(1, "Enter your password."),
});

type LoginFormInputs = z.infer<typeof formSchema>;

interface FormInputProps {
    name: keyof LoginFormInputs;
    control: Control<LoginFormInputs>;
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

const LoginPage = () => {
    const { login, isLoggingIn } = useAuthActions();
    const [serverError, setServerError] = useState("");

    const { handleSubmit, control } = useForm<LoginFormInputs>({
        resolver: zodResolver(formSchema),
        defaultValues: { email: "", password: "" },
    });

    const onSubmit = async (data: LoginFormInputs) => {
        setServerError("");
        try {
            await login(data);
        } catch (err: unknown) { 
            setServerError(parseApiError(err).message);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
            <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-md">
                <h2 className="mb-1 text-center text-2xl font-bold tracking-tight text-foreground">
                    Welcome Back
                </h2>
                <p className="mb-6 text-center text-sm text-muted-foreground">
                    Sign in to continue to your account
                </p>

                <form
                    className="flex flex-col gap-4"
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                >
                    <FormInput 
                        name="email" 
                        control={control} 
                        label="Email address" 
                        placeholder="Enter your email" 
                    />
                    <FormInput 
                        name="password" 
                        control={control} 
                        label="Password" 
                        type="password" 
                        placeholder="Enter your password" 
                    />

                    {serverError && (
                        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-center text-sm text-destructive">
                            {serverError}
                        </p>
                    )}

                    <Button type="submit" className="w-full" disabled={isLoggingIn}>
                        {isLoggingIn ? "Signing in…" : "Sign In"}
                    </Button>
                </form>

                <div className="relative my-5 flex items-center gap-3">
                    <div className="h-px flex-1 bg-border" />
                    <span className="text-xs text-muted-foreground">or continue with</span>
                    <div className="h-px flex-1 bg-border" />
                </div>

                <GoogleAuthButton />

                <p className="mt-5 text-center text-sm text-muted-foreground">
                    Need an account?{" "}
                    <Link to="/signup" className="font-medium text-primary underline-offset-4 hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;