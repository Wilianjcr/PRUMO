const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', err => errors.push(err.toString()));
    page.on('console', msg => {
        if (msg.type() === 'error') errors.push(msg.text());
    });
    
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 1000));
    
    await page.evaluate(() => {
        document.getElementById('input-login-nome').value = 'wilianadm';
        const btns = Array.from(document.querySelectorAll('button'));
        const loginBtn = btns.find(b => b.getAttribute('onclick') === 'realizarLogin()');
        if (loginBtn) loginBtn.click();
    });
    
    await new Promise(r => setTimeout(r, 1000));
    
    await page.evaluate(() => {
        window.navigate('view-teste-02', 'Manutenção');
    });
    await new Promise(r => setTimeout(r, 1000));
    
    const visible = await page.evaluate(() => {
        const el = document.getElementById('view-teste-02');
        return el && !el.classList.contains('view-hidden');
    });
    console.log('view-teste-02 visible?', visible);
    
    // Check for errors when clicking inside view-teste-02
    await page.evaluate(() => {
        try { window.osSwitchTab('registros'); } catch(e) { console.error('Error in osSwitchTab registros', e); }
        try { window.osRenderRegistros(); } catch(e) { console.error('Error in osRenderRegistros', e); }
        try { window.osRenderDash(); } catch(e) { console.error('Error in osRenderDash', e); }
    });
    await new Promise(r => setTimeout(r, 1000));
    
    console.log('Errors found:', errors);
    await browser.close();
})();
