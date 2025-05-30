import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import "../styles/SignUpLogin.css";

function SignUpLogin() {
    const [isSignUpActive, setIsSignUpActive] = useState(false);
    const [role, setRole] = useState("Thuong")

    const togglePanel = (action) => {
        if (action === "signUp") {
            setIsSignUpActive(true);
        } else if (action === "signIn") {
            setIsSignUpActive(false);
        }
    };

    const handleRoleChange = (event) => {
        setRole(event.target.value);
    };

    const handleSignUp = async (event) => {
        event.preventDefault();

        const form = event.target;
        const formData = new FormData(form);

        const data = {
            username: formData.get("username"),
            email: formData.get("email"),
            password: formData.get("password"),
            roles: [role]
        };

        try {
            const response = await fetch('/api/Auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                toast.success("Đăng ký tài khoản thành công !!! Vui lòng đăng nhập");
                setIsSignUpActive(false);
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || "Lỗi đăng ký!");
            }
        } catch (error) {
            toast.error(`Đã có lỗi xảy ra trong quá trình đăng ký: ${error.message}`);
        }
    };

    const handleLogin = async (event) => {
        event.preventDefault();

        const form = event.target;
        const formData = new FormData(form);
        const data = {
            email: formData.get("email"),
            password: formData.get("password"),
        };

        try {
            const response = await fetch('/api/Auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const responseData = await response.json();
                localStorage.setItem("jwt", responseData.token);

                window.location.href = "/home";
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || "Lỗi đăng nhập!");
            }
        } catch (error) {
            toast.error(`Đã có lỗi xảy ra trong quá trình đăng nhập: ${error.message}`);
        }
    };

    useEffect(() => {
        const signUpButton = document.getElementById('signUp');
        const signInButton = document.getElementById('signIn');
        const container = document.getElementById('container');

        const handleSignUpClick = () => {
            container.classList.add("right-panel-active");
            setIsSignUpActive(true);
        };

        const handleSignInClick = () => {
            container.classList.remove("right-panel-active");
            setIsSignUpActive(false);
        };

        signUpButton.addEventListener('click', handleSignUpClick);
        signInButton.addEventListener('click', handleSignInClick);

        return () => {
            signUpButton.removeEventListener('click', handleSignUpClick);
            signInButton.removeEventListener('click', handleSignInClick);
        };
    }, []);


    return (
        <div className="signuplogin-wrapper">
            <div className={`container ${isSignUpActive ? 'right-panel-active' : ''}`} id="container">
                <div className="form-container sign-up-container">
                    <form onSubmit={handleSignUp}>
                        <h1>Tạo tài khoản</h1>
                        <input className="signuplogin-input" name="username" type="text" placeholder="Tên đăng nhập" required />
                        <input className="signuplogin-input" name="email" type="email" placeholder="Email" required />
                        <input className="signuplogin-input" name="password" type="password" placeholder="Mật khẩu" required />

                        <div className="vai-tro-container">
                            <label className="vai-tro-label">Vai trò</label>
                            <div className="vai-tro-radio-container">
                                <div className="signuplogin-div">
                                    <input className="signuplogin-input-radio"
                                        type="radio"
                                        name="role"
                                        value="Thuong"
                                        checked={role === "Thuong"}
                                        onChange={handleRoleChange}
                                    />
                                    <label>Nhân viên thường</label>
                                </div>
                                <div className="signuplogin-div">
                                    <input className="signuplogin-input-radio"
                                        type="radio"
                                        name="role"
                                        value="QuanLy"
                                        checked={role === "QuanLy"}
                                        onChange={handleRoleChange}
                                    />
                                    <label>Nhân viên quản lý</label>
                                </div>
                            </div>
                        </div>

                        <button>Đăng ký</button>
                    </form>
                </div>

                <div className="form-container sign-in-container">
                    <form onSubmit={handleLogin}>
                        <h1>Đăng nhập</h1>
                        <input className="signuplogin-input" name="email" type="email" placeholder="Email" required />
                        <input className="signuplogin-input" name="password" type="password" placeholder="Mật khẩu" required />
                        <a href="#">Quên mật khẩu?</a>
                        <button>Đăng nhập</button>
                    </form>
                </div>

                <div className="overlay-container">
                    <div className="overlay">
                        <div className="overlay-panel overlay-left">
                            <h1>Đã có tài</h1>
                            <h1>khoản ?</h1>
                            <p>Đăng nhập ngay</p>
                            <button className="ghost" id="signIn" onClick={() => togglePanel('signIn')}>Đăng nhập</button>
                        </div>
                        <div className="overlay-panel overlay-right">
                            <h1>Chưa có tài khoản ?</h1>
                            <p>Đăng ký ngay</p>
                            <button className="ghost" id="signUp" onClick={() => togglePanel('signUp')}>Đăng ký</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignUpLogin;
