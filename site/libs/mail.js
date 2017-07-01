const nodemailer = require('nodemailer');

module.exports = (config) => {

    let mailTransport, adminMail;


    function initialize() {
        return Promise.all(config.get('mail:user'), config.get('mail:password'), config.get('admin:mail')).then(
            (user, password, mailAddress) => {
                mailTransport = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: user,
                        pass: password
                    }
                });
                adminMail = mailAddress;
            }
        )
    }

    function sendMail(from, topic, message) {
        mailTransport.sendMail({
            from: from,
            to: adminMail,
            subject: topic,
            text: message
        }, (err) => {
            console.log("Під час відправки листа до адміністрації, сталась помилка: ", err);
        });

    }


    return (from, topic, message) => {
            if(!mailTransport) return initialize().then(sendMail.bind(null, from, topic, message));
            sendMail(from, topic, message);
    };

};

