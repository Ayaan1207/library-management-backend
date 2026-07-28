const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

function isValidEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}
function isStrongPassword(password){
    const hasMinLength = password.length>=8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);

    return hasMinLength && hasUppercase && hasNumber && hasSpecial;
}

const signup = async(req, res, next) => {
    try {
        const {name, email, username, password, DOB} = req.body
        
        if (!isValidEmail(email)){
            return res.status(400).json({message: "Enter a valid email"})
        }
        if(!isStrongPassword(password)){
            return res.status(400).json({message: "Invalid password: Minimum 8 characters, must contain uppercase, special character and number"})
        }
        const existingUser = await User.findOne({$or: [{email}, {username}]})
        if(existingUser){
            return res.status(400).json({message: "User already exists"})
        }
        
        const hashedPassword = await bcrypt.hash(password, 10)
        
        const newUser = new User({
            name,
            email,
            username,
            DOB,
            password: hashedPassword
        })
        await newUser.save()
        
        const token = jwt.sign({userId: newUser._id, role: newUser.role}, process.env.JWT_SECRET, { expiresIn: '7d'})
        res.status(201).json({message: "Successfull", token})      
    } catch(error){
        next(error)
    }
}

const login = async (req, res, next)=>{
    try{
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({message:"User doesn't exist"});  
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch){
            return res.status(400).json({message: "Invalid password"})
        }
        const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
    )
    res.status(200).json({ message: "Login successful", token })
    }catch (error){
        next(error)
    }
}


module.exports = {signup, login};