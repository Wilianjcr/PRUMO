const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', err => errors.push(err.toString()));
    
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 1000));
    
    await page.evaluate(() => {
        document.getElementById('input-login-nome').value = 'Joao';
        document.getElementById('input-login-setor').value = '📦 Armazém';
        const btns = Array.from(document.querySelectorAll('button'));
        const loginBtn = btns.find(b => b.getAttribute('onclick') === 'realizarLogin()');
        if (loginBtn) loginBtn.click();
    });
    
    await new Promise(r => setTimeout(r, 1000));
    
    const curr = await page.evaluate(() => window.currentViewId);
    console.log('Current View after login:', curr);
    
    await browser.close();
})();
