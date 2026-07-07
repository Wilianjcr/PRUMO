with open("index.html", "r") as f:
    html = f.read()

with open("almox.html", "r") as f:
    almox_html = f.read()

with open("almox.js", "r") as f:
    almox_js = f.read()

# Insert almox_html before </main>
if '<div id="view-almox"' not in html:
    html = html.replace('        </main>', almox_html + '\n        </main>')

# Insert almox_js before </script> at the end
if 'function almoxParseNum' not in html:
    html = html.replace('</script>\n\n    <!-- MODAL: NOVA / EDITAR META -->', almox_js + '\n</script>\n\n    <!-- MODAL: NOVA / EDITAR META -->')

with open("index.html", "w") as f:
    f.write(html)
