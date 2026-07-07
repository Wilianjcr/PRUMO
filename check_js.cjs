const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf-8');
const start = html.indexOf('<script>', 1000);
const end = html.lastIndexOf('</script>');
const js = html.substring(start + 8, end);
fs.writeFileSync('test2.js', js);
