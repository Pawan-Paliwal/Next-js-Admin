"use client"
import Button from "../atoms/Button";
import Link from "next/link";
import { useModalStore } from "@/store/modalStore";
import MySelect from "@/components/frontendcomponents/molecules/MySelect"
import "@/uploads/styles/component/component.css"
import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { useLoginWithJavaMutation, useLazyGetUserRolesQuery, useSaveActiveRoleMutation } from "@/store/frontendSlice/apiSlice";
import {
    setSimpleAuthCookies,
    setInstitutionAuthCookies,
    setEmployeePhase1Cookies,
    setEmployeePhase2Cookies,
    setEmployeePhase3Cookies,
    setEmployeeAllCookies,
    isUserLoggedIn
} from "@/utils/cookieService";

const optionsCity = [
    { value: "New Delhi", label: "New Delhi"},
    { value: "Gurgaon", label: "Gurgaon"},
    { value: "Faridabad", label: "Faridabad"},
]

const AUTHORITIES = ["HOSPITAL", "EMPLOYEE", "SUB_HOSPITAL", "CUSTOMER", "INSTITUTION"];

export default function SigninPop({length = 4, onComplete}){
    const isSigninOpen = useModalStore((state) => state.isSigninOpen)
    const closeSignin = useModalStore((state) => state.closeSignin)
    const inputRefs = useRef([])
    const [city, setCity] = useState(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loginWithJava] = useLoginWithJavaMutation();
    const [getUserRoles] = useLazyGetUserRolesQuery();
    const [saveActiveRole] = useSaveActiveRoleMutation();
    const [availableRoles, setAvailableRoles] = useState([]);
    const [selectedRole, setSelectedRole] = useState(null);
    const [tokenResponse, setTokenResponse] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [formOpen, isFormOpen] = useState({
        signinForm: true,
        forgetUserForm: false,
        forgetPassForm: false,
        loginOtpForm: false,
        signupForm: false,
        enterotpForm: false,
        roleSelectionForm: false
    })
    const openForm = (formName) => {
        isFormOpen({
            signinForm: false,
            forgetUserForm: false,
            forgetPassForm: false,
            loginOtpForm: false,
            signupForm: false,
            enterotpForm: false,
            roleSelectionForm: false,
            [formName]: true,
        });
    };

    const handleOtp = (e, index) => {
        const input = e.target;
        const value = input.value;
        const isValidInput = value.match(/[0-9a-z]/i);

        input.value = "";
        input.value = isValidInput ? value[0] : "";

        if(isValidInput && index < length -1){
            inputRefs.current[index + 1]?.focus();
        }
        if(e.key === "Backspace" && index > 0 && !input.value){
            inputRefs.current[index - 1]?.focus()
        }

        if(index === length - 1 && isValidInput){
            const otp = inputRefs.current.map((ref) => ref.value).join("");
            onComplete?.(otp);
        }
    }

    const handlePaste = (e)=> {
        e.preventDefault();
        const pasted = (e.clipboardData || window.clipboardData).getData("text");
        for (let i = 0; i < length; i++) {
        if (pasted[i]?.match(/[0-9a-z]/i)) {
            inputRefs.current[i].value = pasted[i];
            inputRefs.current[i].dispatchEvent(new Event("keyup", { bubbles: true }));
            }
        }
    }

    // Helper function to get redirect URL based on EMPLOYEE role
    const getEmployeeRedirectUrl = (role) => {
        if (role === "MARKETING" || role === "BD") {
            return process.env.NEXT_PUBLIC_NEW_WEBAPP_REDIRECTION_URL;
        }
        return process.env.NEXT_PUBLIC_WEBAPP_REDIRECTION_URL;
    };

    const handleSignIn = async () => {
        if (!email || !email.trim()) {
            toast.error("Please enter your email address");
            return;
        }
        if (!password || !password.trim()) {
            toast.error("Please enter your password");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error("Please enter a valid email address");
            return;
        }

        setIsLoading(true);

        let loginSuccessful = false;
        let successResponse = null;
        let successAuthority = null;

        for (const authority of AUTHORITIES) {
            try {
                const response = await loginWithJava({
                    email: email,
                    password: password,
                    authority: authority
                }).unwrap();

                loginSuccessful = true;
                successResponse = response;
                successAuthority = authority;
                break;
            } catch (error) {
                continue;
            }
        }

        if (!loginSuccessful) {
            toast.error("Invalid credentials.");
            setIsLoading(false);
            return;
        }

        // Handle successful login based on authority
        try {
            if (successAuthority === "CUSTOMER") {
                setSimpleAuthCookies(successResponse, email, successAuthority);
                toast.success("Login Successful!");
                window.open(process.env.NEXT_PUBLIC_WEBAPP_REDIRECTION_URL, '_self');
            } else if (successAuthority === "HOSPITAL") {
                setSimpleAuthCookies(successResponse, email, successAuthority);
                toast.success("Login Successful!");
                setTimeout(() => {
                    window.open(process.env.NEXT_PUBLIC_WEBAPP_REDIRECTION_URL, '_self');
                }, 1200);
            } else if (successAuthority === "SUB_HOSPITAL") {
                setSimpleAuthCookies(successResponse, email, successAuthority);
                toast.success("Login Successful!");
                setTimeout(() => {
                    window.open(process.env.NEXT_PUBLIC_WEBAPP_REDIRECTION_URL, '_self');
                }, 1200);
            } else if (successAuthority === "INSTITUTION") {
                setInstitutionAuthCookies(successResponse, email);
                toast.success("Login Successful!");
                window.open(process.env.NEXT_PUBLIC_NEW_WEBAPP_REDIRECTION_URL, '_self');
            } else if (successAuthority === "EMPLOYEE") {
                setEmployeePhase1Cookies(successResponse, email);

                const rolesResponse = await getUserRoles().unwrap();
                const roles = rolesResponse?.data?.role || [];

                if (roles.length === 0) {
                    toast.error("No roles found for this employee.");
                    setIsLoading(false);
                    return;
                }

                if (roles.length === 1) {
                    const singleRole = roles[0].authority;
                    // Set Phase 2 cookies first
                    setEmployeePhase2Cookies(roles, successResponse.tokenExpiryDateTime);
                    
                    try {
                        await saveActiveRole({ roleName: singleRole }).unwrap();
                        
                        setEmployeePhase3Cookies(singleRole, successResponse.tokenExpiryDateTime);
                        toast.success("Login Successful!");
                        
                        // Redirect based on role
                        const redirectUrl = getEmployeeRedirectUrl(singleRole);
                        window.open(redirectUrl, '_self');
                    } catch (error) {
                        console.error("Failed to save active role:", error);
                        toast.error(error?.data?.message || "Failed to set active role. Please try again.");
                        setIsLoading(false);
                    }
                } else {
                    setEmployeePhase2Cookies(roles, successResponse.tokenExpiryDateTime);
                    setAvailableRoles(roles);
                    setTokenResponse(successResponse);
                    setIsLoading(false);
                    openForm("roleSelectionForm");
                }
            }
        } catch (error) {
            console.error("Error during authentication flow:", error);
            toast.error("An error occurred during login. Please try again.");
            setIsLoading(false);
        }
    };

    const handleRoleSelection = async () => {
        if (!selectedRole) {
            toast.error("Please select a role");
            return;
        }

        // Extract the role value (MySelect returns {value, label} object)
        const roleValue = typeof selectedRole === 'object' ? selectedRole.value : selectedRole;
        
        setIsLoading(true);
        
        try {
            await saveActiveRole({ roleName: roleValue }).unwrap();
            
            // On success, set Phase 3 cookies
            setEmployeePhase3Cookies(roleValue, tokenResponse.tokenExpiryDateTime);
            toast.success("Login Successful!");
            
            // Redirect based on selected role
            const redirectUrl = getEmployeeRedirectUrl(roleValue);
            window.open(redirectUrl, '_self');
        } catch (error) {
            console.error("Failed to save active role:", error);
            toast.error(error?.data?.message || "Failed to set active role. Please try again.");
            setIsLoading(false);
        }
    };

    // Check login status on component mount (page load)
    useEffect(() => {
        const loggedIn = isUserLoggedIn();
        setIsLoggedIn(loggedIn);
    }, []);

    // Reset form when modal opens
    useEffect(() => {
        if (isSigninOpen) {
            openForm("signinForm");
            setAvailableRoles([]);
            setSelectedRole(null);
            setTokenResponse(null);
            setEmail("");
            setPassword("");
        }
    }, [isSigninOpen]);

    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);
    return(
        <div className={`model signin-pop ${isSigninOpen ? "is-open" : ""}`}>
            <button className="close" onClick={() => {
                openForm("signinForm");
                setAvailableRoles([]);
                setSelectedRole(null);
                setTokenResponse(null);
                setEmail("");
                setPassword("");
                closeSignin();
            }}>
                <svg
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M0.75 0.75L23.25 23.25M0.75 23.25L23.25 0.75"
                        stroke="black"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </button>
            <button className="backBtn" onClick={() => openForm("signinForm")}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 2048 2048">
                    <path fill="#000" d="M2048 1088H250l787 787l-90 90L6 1024L947 83l90 90l-787 787h1798z"></path>
                </svg>
            </button>
            <div className="model-body">
                <div className={`signin_wrapper ${formOpen.signinForm ? "open" : ""}`}>
                    <div className="title">
                        <h2>Sign In</h2>
                    </div>
                    <div className="form">
                        <div className="form-grid">
                            <div className="form-group border">
                                <label htmlFor="email">Email Address*</label>
                                <input 
                                    type="email" 
                                    name="email" 
                                    className="form-control" 
                                    placeholder="Email Address*" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <div className="error">Invalid</div>
                            </div>
                            <div className="form-group border has-password-toggle">
                                <label htmlFor="password">Password*</label>
                                <input 
                                    type={showPassword ? "text" : "password"}
                                    name="password" 
                                    className="form-control" 
                                    placeholder="Password*" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button 
                                    type="button" 
                                    className="password-toggle-btn"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                                            <line x1="1" y1="1" x2="23" y2="23"/>
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                            <circle cx="12" cy="12" r="3"/>
                                        </svg>
                                    )}
                                </button>
                                <div className="error">Invalid</div>
                            </div>
                            <div className="sbmt-btn-div">
                                <Button 
                                    buttonText={isLoading ? "Please wait..." : "Sign In"} 
                                    onClick={handleSignIn}
                                    disabled={isLoading}
                                />
                            </div>
                            {/* <div className="forget_wrap">
                                <button type="button" className="forget_cred" onClick={() => openForm("forgetUserForm")}>Forgot Username?</button>
                                <button type="button" className="forget_cred" onClick={() => openForm("forgetPassForm")}>Forgot Password?</button>
                            </div>
                            <div className="opt_wrap">
                                <button type="button" className="otpBtn" onClick={() => openForm("loginOtpForm")}>Login with OTP</button>
                            </div> */}
                        </div>
                    </div>
                    {/* <div className="split-sec"><p>OR</p></div>
                    <div className="social_btn_wrap">
                        <button type="button" className="socialBtn btn white shadow">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 48 48">
                                <path fill="#ffc107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917"></path>
                                <path fill="#ff3d00" d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691"></path>
                                <path fill="#4caf50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.9 11.9 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44"></path>
                                <path fill="#1976d2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917"></path>
                            </svg>
                            Google
                        </button>
                        <button type="button" className="socialBtn btn white shadow">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24">
                                <path fill="#3d5a98" d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4z"></path>
                            </svg>
                            Facebook
                        </button>
                    </div> */}
                    <div className="disclm">
                        <p>By continuing, you are indicating that you accept our <Link href="/terms-of-use" onClick={closeSignin}>Terms of Service</Link> and <Link href="/privacy-policy" onClick={closeSignin}>Privacy Policy.</Link></p>
                    </div>
                    {/* <p className="non_mem">
                        Not a member? <button type="button" className="signupBtn" onClick={() => openForm("signupForm")}>Sign up now</button>
                    </p> */}
                </div>
                <div className={`forgetuser_wrapper ${formOpen.forgetUserForm ? "open" : ""}`}>
                    <div className="title">
                        <h2>Don't Worry</h2>
                        <p>Just verify your details for us.</p>
                    </div>
                    <div className="form">
                        <div className="form-grid">
                            <div className="form-group border">
                                <label htmlFor="planID">Plan ID</label>
                                <input type="number" name="planID"  className="form-control" placeholder="Plan ID" />
                                <div className="error">Invalid</div>
                            </div>
                            <div className="form-group border">
                                <label htmlFor="phone">Phone Number</label>
                                <input type="number" name="phone"  className="form-control" placeholder="Phone Number" />
                                <div className="error">Invalid</div>
                            </div>
                            <div className="sbmt-btn-div">
                                <Button buttonText="Continue" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className={`forgetpass_wrapper ${formOpen.forgetPassForm ? "open" : ""}`}>
                    <div className="title">
                        <h2>Don't Worry</h2>
                        <p>Enter your contact details to request your One Time Password.</p>
                    </div>
                    <div className="form">
                        <div className="form-grid">
                            <div className="form-group border">
                                <label htmlFor="email">Email Address*</label>
                                <input type="email" name="email"  className="form-control" placeholder="Email Address*" />
                                <div className="error">Invalid</div>
                            </div>
                            <div className="sbmt-btn-div">
                                <Button buttonText="Request OTP" onClick={() => openForm("enterotpForm")} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className={`loginotp_wrapper ${formOpen.loginOtpForm ? "open" : ""}`}>
                    <div className="title">
                        <h2>Enter Mobile Number</h2>
                    </div>
                    <div className="form">
                        <div className="form-grid">
                            <div className="form-group border">
                                <label htmlFor="phone">Phone Number</label>
                                <input type="number" name="phone"  className="form-control" placeholder="Phone Number" />
                                <div className="error">Invalid</div>
                            </div>
                            <div className="sbmt-btn-div">
                                <Button buttonText="Get OTP" onClick={() => openForm("enterotpForm")} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className={`enterotp_wrapper ${formOpen.enterotpForm ? "open" : ""}`}>
                    <div className="title">
                        <h2>Enter OTP</h2>
                    </div>
                    <div className="form">
                        <div className="otp_verify" onPaste={handlePaste}>
                            {[...Array(length)].map((_, index) => (
                                <input
                                key={index}
                                type="text"
                                maxLength={1}
                                ref={(el) => (inputRefs.current[index] = el)}
                                onKeyUp={(e) => handleOtp(e, index)}
                                />
                            ))}
                        </div>
                        <div className="error static">Invalid</div>
                        <div className="sbmt-btn-div">
                            <Button buttonText="Verify" />
                            <Button buttonText="Resend OTP" classname="white" />
                        </div>
                    </div>
                </div>
                <div className={`signup_wrapper ${formOpen.signupForm ? "open" : ""}`}>
                    <div className="title">
                        <h2>Sign Up</h2>
                    </div>
                    <div className="form">
                        <div className="form-grid">
                            <div className="form-group border">
                                <label htmlFor="name">Name</label>
                                <input type="text" name="name"  className="form-control" placeholder="Enter Name Here" />
                                <div className="error">Invalid</div>
                            </div>
                            <div className="form-group border">
                                <label htmlFor="name">City</label>
                                <MySelect
                                    id="city"
                                    placeholder="Select City"
                                    options={optionsCity}
                                    selectedValue={city}
                                    onValueChange={setCity}
                                    styles={{
                                        control: (base, state) => ({
                                            ...base,
                                            width: "100%",
                                            height: "100%",
                                            maxHeight: "41px",
                                            backgroundColor: "#fff",
                                            color: "#818181",
                                            border: "1px solid #d2d2d2",
                                            padding: "0 10px",
                                            borderRadius: "5px",
                                            cursor: "pointer",
                                            boxShadow: state.isFocused ? "none" : "none",
                                            "&:hover": {
                                                borderColor: "#d2d2d2"
                                            }
                                        }),
                                        input: (base, state) => ({
                                            ...base,
                                            width: "100%",
                                            height: "41px",
                                            maxHeight: "41px",
                                            color: "#000",
                                            padding: 0,
                                            minHeight: "100%",
                                            minWidth: "100%"
                                        }),
                                    }}
                                />
                                <div className="error">Invalid</div>
                            </div>
                            <div className="form-group border">
                                <label htmlFor="phone">Phone Number</label>
                                <input type="number" name="phone"  className="form-control" placeholder="Enter Phone Number Here" />
                                <div className="error">Invalid</div>
                            </div>
                            <div className="form-group border">
                                <label htmlFor="email">Email Address</label>
                                <input type="email" name="email"  className="form-control" placeholder="Enter Email Address Here" />
                                <div className="error">Invalid</div>
                            </div>
                            <div className="form-group border full">
                                <label htmlFor="password">Password</label>
                                <input type="password" name="password"  className="form-control" placeholder="Enter Password" />
                                <div className="error">Invalid</div>
                            </div>
                            <div className="sbmt-btn-div full">
                                <Button buttonText="Sign Up" />
                            </div>
                        </div>
                    </div>
                </div>
                {formOpen.roleSelectionForm && (
                    <div className={`roleselection_wrapper ${formOpen.roleSelectionForm ? "open" : ""}`}>
                        <div className="title">
                            <h2>Welcome!</h2>
                        </div>
                        <div className="form" style={{ paddingBottom: "30px" }}>
                            <div className="form-grid">
                                <div className="form-group border">
                                    <MySelect
                                        id="role"
                                        placeholder="Please select a role"
                                        options={availableRoles.map(role => ({ 
                                            value: role.authority, 
                                            label: role.authority 
                                        }))}
                                        selectedValue={selectedRole}
                                        onValueChange={setSelectedRole}
                                        styles={{
                                            control: (base, state) => ({
                                                ...base,
                                                width: "100%",
                                                height: "100%",
                                                maxHeight: "41px",
                                                backgroundColor: "#fff",
                                                color: "#818181",
                                                border: "1px solid #d2d2d2",
                                                padding: "0 10px",
                                                borderRadius: "5px",
                                                cursor: "pointer",
                                                boxShadow: state.isFocused ? "none" : "none",
                                                "&:hover": {
                                                    borderColor: "#d2d2d2"
                                                }
                                            }),
                                            input: (base, state) => ({
                                                ...base,
                                                width: "100%",
                                                height: "41px",
                                                maxHeight: "41px",
                                                color: "#000",
                                                padding: 0,
                                                minHeight: "100%",
                                                minWidth: "100%"
                                            }),
                                        }}
                                    />
                                    <div className="error">Invalid</div>
                                </div>
                                <div className="sbmt-btn-div" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                    <Button 
                                        buttonText={isLoading ? "Please wait..." : "Submit"} 
                                        onClick={handleRoleSelection}
                                        disabled={isLoading}
                                    />
                                    <Button 
                                        buttonText="Back" 
                                        classname="white" 
                                        onClick={() => {
                                            // Go back to sign-in form
                                            openForm("signinForm");
                                            // Clear role selection state
                                            setAvailableRoles([]);
                                            setSelectedRole(null);
                                            setTokenResponse(null);
                                        }}
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
