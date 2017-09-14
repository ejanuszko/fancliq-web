let express = require('express'),
    bodyParser = require('body-parser'),
    exphbs = require('express-handlebars'),
    path = require('path'),
    app = express(),
    sgMail = require('@sendgrid/mail'),
    configs = require('/etc/fancliq/config.json');

sgMail.setApiKey(configs.sendgrid.apikey);

app.engine('handlebars', exphbs({ defaultLayout: 'main', layoutsDir: path.join(__dirname, 'web/dist/views/layouts') }));

app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'web/dist/views'));

app.use('/dist', express.static(path.join(__dirname, 'web', 'dist')));
app.use(bodyParser.json({limit: '50mb'}));

app.get('/', (req, res) => res.render('home', { title: configs.pages.home.title, configs: configs }) );
app.get('/about', (req, res) => res.render('about', { title: configs.pages.about.title, configs: configs }) );
app.get('/contact', (req, res) => res.render('contact', { title: configs.pages.contact.title, configs: configs }) );
app.get('/privacy-policy', (req, res) => res.render('privacy-policy', { title: configs.pages.privacy_policy.title, configs: configs }) );
app.get('/terms-of-use', (req, res) => res.render('terms-of-use', { title: configs.pages.terms.title, configs: configs }) );

app.post('/contact', (req, res) => {
    let name = req.body.name,
        email = req.body.email,
        message = req.body.message;

    if (!name || !email || !message) {
        res.status(400).json({
            error: 'Name, email, and message are all required'
        });
        return;
    }
    sgMail.send({
        to: configs.contact_email,
        from: email,
        subject: 'New Fancliq Message',
        html: '<p><strong>Name:</strong> ' + name + '</p><p><strong>Email:</strong> <a href="mailto:' + email + '">' + email + '</a></p><p><strong>Message:</strong><br />' + message + '</p>'
    });
    res.status(200).json({
        success: 'Message has been sent'
    });
});

((port) => {
    app.listen(port, () => {
        console.log('Fancliq listening on port ' + port);
    });
})(process.env.PORT || 3000);