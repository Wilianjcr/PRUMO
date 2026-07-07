const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', err => errors.push(err.toString()));
    
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 1000));
    
    // Login as normal user (e.g. Joao)
    await page.evaluate(() => {
        document.getElementById('input-login-nome').value = 'Joao';
        document.getElementById('input-login-setor').value = '📥 Recebimento';
        const btns = Array.from(document.querySelectorAll('button'));
        const loginBtn = btns.find(b => b.getAttribute('onclick') === 'realizarLogin()');
        if (loginBtn) loginBtn.click();
    });
    
    await new Promise(r => setTimeout(r, 1000));
    
    // Check if we reached the submenu (since normal user goes there)
    const isSubmenu = await page.evaluate(() => {
        const menu = document.getElementById('view-submenu');
        return menu && !menu.classList.contains('view-hidden');
    });
    console.log('view-submenu visible?', isSubmenu);
    
    // Navigate to view-os (which gets redirected to view-teste-02)
    await page.evaluate(() => {
        window.navigate('view-os', '📥 Recebimento');
    });
    await new Promise(r => setTimeout(r, 1000));
    
    const visible = await page.evaluate(() => {
        const el = document.getElementById('view-teste-02');
        return el && !el.classList.contains('view-hidden');
    });
    console.log('view-teste-02 visible?', visible);
    
    console.log('Errors found:', errors);
    await browser.close();
})();
