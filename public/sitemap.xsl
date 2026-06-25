<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/">
    <html lang="pt-BR">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <meta name="robots" content="noindex"/>
        <title>Andre Ambrósio — XML Sitemap</title>
        <style>
          :root{--bg:#151A1A;--panel:#0B0F0F;--border:rgba(201,169,97,.18);--text:#F0EBDF;--muted:rgba(192,196,196,.6);--champagne:#C9A961;--bronze:#A87248}
          *{box-sizing:border-box}
          body{margin:0;background:var(--bg);color:var(--text);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;line-height:1.5}
          .wrap{max-width:1080px;margin:0 auto;padding:40px 22px 72px}
          header{margin-bottom:6px}
          .eyebrow{font-family:ui-monospace,monospace;font-size:10px;letter-spacing:.3em;text-transform:uppercase;color:var(--champagne)}
          h1{font-size:26px;margin:8px 0 4px;letter-spacing:-.01em;font-weight:300}
          .sub{color:var(--muted);font-size:13.5px;margin-bottom:28px}
          .count{display:inline-block;font-family:ui-monospace,monospace;font-size:11px;color:var(--bronze);border:1px solid var(--border);border-radius:999px;padding:3px 10px;margin-bottom:24px}
          table{width:100%;border-collapse:collapse;font-size:13px}
          th{text-align:left;font-family:ui-monospace,monospace;font-size:9.5px;letter-spacing:.2em;text-transform:uppercase;color:var(--bronze);padding:10px 12px;border-bottom:1px solid var(--border)}
          td{padding:10px 12px;border-bottom:1px solid rgba(201,169,97,.08);vertical-align:top}
          tr:hover td{background:rgba(201,169,97,.04)}
          a{color:var(--champagne);text-decoration:none;word-break:break-all}
          a:hover{text-decoration:underline}
          .badge{font-family:ui-monospace,monospace;font-size:10px;color:var(--muted)}
          .card{display:block;border:1px solid var(--border);border-radius:14px;padding:18px 20px;margin-bottom:10px;background:var(--panel);transition:border-color .2s}
          .card:hover{border-color:var(--champagne)}
          .card .name{font-size:15px;color:var(--text)}
          footer{margin-top:36px;color:var(--muted);font-size:12px}
        </style>
      </head>
      <body>
        <div class="wrap">
          <header>
            <div class="eyebrow">Andre Ambrósio · andreambrosio.com</div>
            <h1>XML Sitemap</h1>
          </header>
          <xsl:apply-templates/>
          <footer>Gerado automaticamente · 8 idiomas · hreflang em cada URL · indexável por buscadores e IA.</footer>
        </div>
      </body>
    </html>
  </xsl:template>

  <!-- Índice de sitemaps -->
  <xsl:template match="s:sitemapindex">
    <p class="sub">Índice de sitemaps. Conteúdo organizado por categoria.</p>
    <div class="count"><xsl:value-of select="count(s:sitemap)"/> sub-sitemaps</div>
    <xsl:for-each select="s:sitemap">
      <a class="card" href="{s:loc}">
        <span class="name"><xsl:value-of select="s:loc"/></span>
      </a>
    </xsl:for-each>
  </xsl:template>

  <!-- Conjunto de URLs -->
  <xsl:template match="s:urlset">
    <p class="sub">URLs deste sitemap, cada uma com suas alternativas de idioma (hreflang).</p>
    <div class="count"><xsl:value-of select="count(s:url)"/> URLs</div>
    <table>
      <tr><th>URL</th><th>Idiomas</th></tr>
      <xsl:for-each select="s:url">
        <tr>
          <td><a href="{s:loc}"><xsl:value-of select="s:loc"/></a></td>
          <td><span class="badge"><xsl:value-of select="count(xhtml:link)"/> hreflang</span></td>
        </tr>
      </xsl:for-each>
    </table>
  </xsl:template>
</xsl:stylesheet>
