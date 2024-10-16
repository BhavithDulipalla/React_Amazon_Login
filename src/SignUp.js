import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from './SignUp.module.css';

function SignUp() {
    const user = {
        Email: '',
        countryCode: '+91',
        MobileNumber: '',
        FullName: '',
        Password: ''
    }
    const navigate = useNavigate();
    const [inputs, setInputs] = useState(user);
    const [errors, setErrors] = useState(user);

    const codes = {
        India: '+91',
        USA: '+1'
    }

    const countries = Object.keys(codes);

    const handleChange = (e) => {
        const name = e.target.id;
        const value = e.target.value;
        setInputs((values) => { return { ...values, [name]: value } });
        if (name === 'MobileNumber') {
            setErrors((values) => { return { ...values, [name]: value.trim().length !== 10 || value.trim()[0] === '0' ? 'Mobile Number must be exactly 10 digits and cannot start with 0' : '' } })
        }
        else if (name === 'Password') {
            setErrors((values) => { return { ...values, [name]: value.trim().length < 6 ? 'Password must be at least 6 characters' : '' } });
        }
        else {
            setErrors((values) => { return { ...values, [name]: value.trim() === '' ? `! Enter your ${name}` : '' } })
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const input_fields = Object.keys(user);
        const canSubmit = input_fields.every((input) => inputs[input].trim() !== '') && inputs['MobileNumber'].trim()[0] !== '0' && inputs['MobileNumber'].trim().length === 10 && inputs['Password'].trim().length >= 6;
        if (canSubmit) {
            const data = {
                email: inputs.Email.trim(),
                contact : inputs.countryCode + inputs.MobileNumber.trim(),
                fullName: inputs.FullName.trim(),
                password: inputs.Password.trim()
            }
            
            fetch('http://localhost:8084/amazonUser/addUser',{
                method : 'POST',
                headers : {'Content-Type' : 'application/json'},
                body : JSON.stringify(data)
            }).then(() => {
                alert('User added Successfully');
                navigate('/')
            }).catch((err) => {console.log(err)});
            
        }
        else {
            input_fields.forEach((input) => {
                setErrors((value) => { return { ...value, [input]: inputs[input].trim() === '' ? `! Enter your ${input}` : '' } });
            })
        }
    }

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <h2 style={{ textAlign: 'center' }}>Create Account</h2>
            <div className={styles.inputs}>
                <label htmlFor="Email">Email</label>
                <input type="email" id="Email" className={errors.Email !== '' ? styles.inputsWarning : ''} value={inputs.Email} onChange={handleChange} placeholder="Email id" />
                <span className={styles.warning}>{errors.Email}</span>
            </div>
            <div className={styles.inputs}>
                <label htmlFor="MobileNumber">Mobile Number</label>
                <div className={styles.contact}>
                    <select id="countryCode" onChange={handleChange} value={inputs.countryCode} >
                        {countries.map((country) => <option key={country} value={codes[country]}>{country + ' ' + codes[country]}</option>)}
                    </select>
                    <input type="number" id="MobileNumber" className={errors.MobileNumber !== '' ? styles.inputsWarning : ''} value={inputs.MobileNumber} onChange={handleChange} placeholder="Mobile number" />
                </div>
                <span className={styles.warning}>{errors.MobileNumber}</span>
            </div>
            <div className={styles.inputs}>
                <label htmlFor="FullName">Your Name</label>
                <input type="text" id="FullName" className={errors.FullName !== '' ? styles.inputsWarning : ''} value={inputs.FullName} onChange={handleChange} placeholder="firstname and lastname" />
                <span className={styles.warning}>{errors.FullName}</span>
            </div>
            <div className={styles.inputs}>
                <label htmlFor="Password">Password</label>
                <input type="password" id="Password" className={errors.Password !== '' ? styles.inputsWarning : ''} value={inputs.Password} onChange={handleChange} placeholder="At least 6 characters" />
                <span className={styles.warning}>{errors.Password}</span>
            </div>
            <button type="submit" className={styles.button}>Sign Up</button>
            <p>Already have an account? <Link to="/">Sign In</Link></p>
        </form>
    );
}

export default SignUp;