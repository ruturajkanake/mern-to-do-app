const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'ruturajkanake1999@gmail.com',
        subject: 'Thanks for joining in!',
        text: `Welcome to the app, ${name}. Let me know how you get along with the app.`,
    })
}

const sendExitEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'ruturajkanake1999@gmail.com',
        subject: 'Sorry to see you go',
        text: `Goodbye ${name}. Is there anything we could have done to keep you on board. I hope to see you sometime soon.`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendExitEmail
}
