import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from './SignUp.module.css'

function SignIn() {
    const user = {
        UserName: '',
        Password: ''
    }
    const navigate = useNavigate();
    const [inputs, setInputs] = useState(user);
    const [errors, setErrors] = useState(user);
    
    const handleChange = (e) => {
        const name = e.target.id;
        const value = e.target.value.trim();
        setInputs((values) => { return { ...values, [name]: value } });
        setErrors((values) => { return { ...values, [name]: value === '' ? `! Enter your ${name}` : '' } })  
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const input_fields = Object.keys(user);
        const canSubmit = input_fields.every((input) => inputs[input] !== '')
        if (canSubmit) {
            if(isNaN(Number(inputs.UserName))){
                const pattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
                const valid = pattern.test(inputs.UserName);
                if(valid){
                    fetch(`http://localhost:8084/amazonUser/login?email=${inputs.UserName}&contact=${''}&password=${inputs.Password}`)
                    .then((response) => {
                       return response.text() }).then((response) => {
                        if(response){navigate('/dashboard')}
                        else{setErrors((values) => {return {...values, Password:'Incorrect UserName or Password'}})}
                       })
                }
                else{
                    setErrors((values) => {return {...values,UserName:'Enter a valid Email or Mobile Number'}})
                }
            }
            else{
                if(inputs.UserName.length >= 12){
                    const encodedContact = encodeURIComponent(inputs.UserName);
                    fetch(`http://localhost:8084/amazonUser/login?email=${''}&contact=${encodedContact}&password=${inputs.Password}`)
                    .then((response) => {
                       return response.text() }).then((response) => {
                        if(response){navigate('/dashboard')}
                        else{setErrors((values) => {return {...values, Password:'Incorrect UserName or Password'}})}
                       })
                }
            }
        }
        else {
            input_fields.forEach((input) => {
                setErrors((value) => { return { ...value, [input]: inputs[input] === '' ? `! Enter your ${input}` : '' } });
            })
        }
    }

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <h2 style={{ textAlign: 'center' }}>Sign In</h2>
            <div className={styles.inputs}>
                <label htmlFor="UserName">Username</label>
                <input type="text" id="UserName" className={errors.UserName !== '' ? styles.inputsWarning : ''} value={inputs.UserName} onChange={handleChange} placeholder="Email or Mobile Number with country code" />
                <span className={styles.warning}>{errors.UserName}</span>
            </div>
            <div className={styles.inputs}>
                <label htmlFor="Password">Password</label>
                <input type="password" id="Password" className={errors.Password !== '' ? styles.inputsWarning : ''} value={inputs.Password} onChange={handleChange} placeholder="Password" />
                <span className={styles.warning}>{errors.Password}</span>
            </div>
            <button type="submit" className={styles.button}>Sign In</button>
            <p>New User? <Link to="/signUp">Sign Up</Link></p>
        </form>
    );
}

export default SignIn;