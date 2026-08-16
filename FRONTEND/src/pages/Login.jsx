import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Building2, Lock, User, Eye, EyeOff } from "lucide-react";
import { motion } from "motion/react";

function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log("Username:", username);
        console.log("Password:", password);
         navigate("/dashboard");
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white flex">

            {/* Left side */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900">

                {/* Background decoration */}
                <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
                <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />

                <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10 flex flex-col justify-center px-16 xl:px-24"
                >
                    <div className="mb-8 flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500">
                            <Building2 size={26} />
                        </div>

                        <span className="text-xl font-semibold tracking-wide">
                            EstateHub
                        </span>
                    </div>

                    <h1 className="max-w-xl text-5xl font-bold leading-tight xl:text-6xl">
                        Manage your
                        <span className="text-emerald-400"> properties </span>
                        with confidence.
                    </h1>

                    <p className="mt-6 max-w-lg text-lg leading-8 text-slate-400">
                        Manage real estate projects, plots, bookings and property
                        information from one centralized platform.
                    </p>
                    <div className="mt-10 flex flex-wrap gap-3">
                        <div className="rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-3">
                            <p className="text-sm font-medium text-white">
                                Project Management
                            </p>
                            <p className="mt-1 text-xs text-slate-400">
                                Manage real estate projects
                            </p>
                        </div>

                        <div className="rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-3">
                            <p className="text-sm font-medium text-white">
                                Plot Tracking
                            </p>
                            <p className="mt-1 text-xs text-slate-400">
                                Track plot availability
                            </p>
                        </div>

                        <div className="rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-3">
                            <p className="text-sm font-medium text-white">
                                Secure Access
                            </p>
                            <p className="mt-1 text-xs text-slate-400">
                                Role-based access control
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Right side */}
            <div className="flex w-full items-center justify-center px-6 py-12 lg:w-1/2">

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="w-full max-w-md"
                >
                    {/* Mobile logo */}
                    <div className="mb-10 flex items-center justify-center gap-3 lg:hidden">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500">
                            <Building2 size={24} />
                        </div>

                        <span className="text-xl font-semibold">
                            EstateHub
                        </span>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-3xl font-bold">
                            Welcome back
                        </h2>

                        <p className="mt-2 text-slate-400">
                            Login in to access your dashboard.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">

    {/* Username */}
    <div>
        <label
            htmlFor="username"
            className="mb-2 block text-sm font-medium text-slate-300"
        >
            Username
        </label>

        <div className="relative">
            <User
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 py-3.5 pl-12 pr-4 text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
        </div>
    </div>


    {/* Password */}
    <div>
        <label
            htmlFor="password"
            className="mb-2 block text-sm font-medium text-slate-300"
        >
            Password
        </label>

        <div className="relative">
            <Lock
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 py-3.5 pl-12 pr-12 text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />

            <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-300"
            >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
            </button>
        </div>

        <div className="mt-2 flex justify-end">
            <button
                type="button"
                className="text-sm text-emerald-400 transition hover:text-emerald-300"
            >
                Forgot password?
            </button>
        </div>
    </div>


    {/* Login button */}
    <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        className="w-full rounded-xl bg-emerald-500 py-3.5 font-semibold text-slate-950 transition hover:bg-emerald-400"
    >
        Login
    </motion.button>

</form>



                </motion.div>
            </div>
        </div>
    );
}

export default Login;