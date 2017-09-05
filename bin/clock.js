var CronJob = require('cron').CronJob;

new CronJob('* * * * * *', function() {
    //res.send('You will see this message every second');
    console.log("cha cha");
    
  }, null, true, 'America/Los_Angeles');