// dependencies
const https = require('https');

// exports
module.exports.exec = exec;

function exec(channel, code)
{
    var payload = JSON.stringify({
        channel: 'nightly',
        edition: '2018',
        code: code,
        crateType: 'bin',
        mode: 'debug',
        tests: false
    });

    var options = {
        hostname: 'play.rust-lang.org',
        port: 443,
        path: '/execute',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': payload.length
        }
    };

    
    var req = https.request(options, res => {
        res.on('data', d => {
            d = JSON.parse(d.toString());

            if (d.success)
            {
                channel.send('```\n' + d.stdout + '\n```');
            }
            else
            {
                channel.send('Error:```' + d.stderr + '```')
            }
        });
    });

    req.on('error', e => {
        console.error(e);
    });

    req.write(payload);
    req.end();
}
