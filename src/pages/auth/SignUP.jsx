import React, { useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Input from "../../components/Inputs/Input";
import { validateEmail } from "../../utils/helper";
import ProfilePhotoSelector from "../../components/Inputs/ProfilePhotoSelector";

const SignUP = () =>{
    const [profilePic, setProfilePic] = useState(null);
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error , setError] = useState(null);

    const navigate = useNavigate();

    //handle the sign up form submit.
    const handleSignUp = async (e) => {}
    return(
        <AuthLayout>
            <div className="lg:w-full h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center">
                <h3 className="text-xl font-semibold text-black" >Create an Account</h3>
                <p className="text-xs text-slate-700 mt-[5px] mb-6">Join us today by entering your details below </p>

                <form onSubmit={handleSignUp}>

                    <ProfilePhotoSelector image={profilePic} setImage={setProfilePic}/>

                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
                        <Input 
                        value={fullName}
                        onChange={({target}) => setFullName(target.value)}
                        label="Full Name"
                        placeholder="John"
                        type="text"
                        />

                        <Input
                        value={email}
                        onChange={({ target }) => setEmail(target.value)}
                        label="Email Address"
                        placeholder="somethingrandom@gmail.com"
                        type="text"
                        />
                        <div className="col-span-2">
                        <Input
                        value={password}
                        onChange={({ target }) => setPassword(target.value)}
                        label="Password"
                        placeholder="Minimum 8 Characters "
                        type="password"
                        />
                        </div>
                    </div>
                </form>
            </div>
        </AuthLayout>
    )
}
export default SignUP