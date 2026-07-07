const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 1000));
    
    await page.evaluate(() => {
        // Redefine realizarLogin to add logs
        const oldLogin = window.realizarLogin;
        window.realizarLogin = function() {
            console.log('realizarLogin called');
            const res = oldLogin.apply(this, arguments);
            console.log('realizarLogin finished');
            return res;
        };
        const oldToast = window.mostrarToast;
        window.mostrarToast = function(msg) {
            console.log('TOAST:', msg);
            return oldToast.apply(this, arguments);
        };
        
        document.getElementById('input-login-nome').value = 'Joao';
        document.getElementById('input-login-setor').value = '📦 Armazém';
        const btns = Array.from(document.querySelectorAll('button'));
        const loginBtn = btns.find(b => b.getAttribute('onclick') === 'realizarLogin()');
        loginBtn.click();
    });
    
    await new Promise(r => setTimeout(r, 1000));
    
    await browser.close();
})();
