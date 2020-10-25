const {Router} = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const {check, validationResult} = require("express-validator");
const jwt = require("jsonwebtoken");
const router = Router();
const config = require("config");

router.post(
    "/register",
    [
        check("email", "Invalid email!").isEmail(),
        check("password", "Minimum length of password is 6 symbols!")
            .isLength({min: 6})
    ],
    async (req, res) => {
    try{
        const errors = validationResult(req);
        console.log(errors);
        let messages = "";
        errors.array().forEach((item) => {
            messages += item.msg + '\n';
        })
        if (!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array(),
                message: messages
            })
        }

        const {email, password} = req.body;


        const candidate = await User.findOne({email});

        if(candidate){
            return res.status(400).json({message: "This user already exist!"});
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({email, password: hashedPassword});

        await user.save();

        res.status(201).json({message: "User created successfully!"});

    }catch(e){
        res.status(500).json({message: "Ошибка сервера! Обратитесь к админу "});
    }
})

router.post(
    "/login",
    [
        check("email", "Enter correct email!").normalizeEmail().isEmail(),
        check("password", "Enter your password").exists()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: "Authentication error!"
                })
            }

            const {email, password} = req.body;

            const user = await User.findOne({ email });

            if (!user){
                return res.status(400).json({message: "User not found!"})
            }

            const isMatch = await bcrypt.compare(password, user.password);
            
            if (!isMatch){
                return res.status(400).json({message: "Invalid data!"});
            }

            const token = jwt.sign(
                {userId: user.id},
                config.get("jwtSecret"),
                {expiresIn: "1h"}
            );

            res.json({ token: token, userId: user.id})
        } catch (e) {
            res.status(500).json({message: "Ошибка сервера! Обратитесь к админу"});
        }
})

module.exports = router;