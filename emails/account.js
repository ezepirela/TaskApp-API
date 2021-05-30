const sgMail    =   require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_TOKKEN);
const sendWelcomeEmail = async (email, name) => {
    try {
       await sgMail.send({
            to: email,
            from: 'ezepirela@gmail.com',
            subject: 'thanks for joining',
            text: `hello ${name}, welcome to the app`
        })
    }catch(e){
        console.log(e.message)
    }
}
const sendFarewellEmail = async (email, name) => {
    try {
       await sgMail.send({
            to: email,
            from: 'ezepirela@gmail.com',
            subject: 'GoodBye',
            text: `Hello ${name}, we are sad for your leave`
        })
    }catch(e){
        console.log(e.message)
    }
}
module.exports = {
    sendWelcomeEmail,
    sendFarewellEmail
};
