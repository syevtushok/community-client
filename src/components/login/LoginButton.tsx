import React from "react";
import {LoadingSpinner} from "./LoadingSpinner.tsx";
import {GoogleIcon} from "../../icons/icons.tsx";
import {LoginButtonProps} from "../../types/login.ts";

export const LoginButton: React.FC<LoginButtonProps> = ({isLoading, onClick}) => (
    <button
        onClick={onClick}
        disabled={isLoading}
        className={`
      group relative flex w-full justify-center rounded-md 
      bg-blue-600 px-4 py-3 text-sm font-semibold text-white
      hover:bg-blue-500 focus-visible:outline 
      focus-visible:outline-2 focus-visible:outline-offset-2 
      focus-visible:outline-blue-500
      disabled:bg-blue-800 disabled:text-blue-100 disabled:cursor-not-allowed
      transition-colors duration-200
      border border-blue-500
    `}
    >
        {isLoading ? (
            <div className="flex items-center">
                <LoadingSpinner/>
                Signing in...
            </div>
        ) : (
            <div className="flex items-center">
                <GoogleIcon/>
                Sign in with Google
            </div>
        )}
    </button>
);
