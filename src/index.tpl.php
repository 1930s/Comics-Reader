<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!--<meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no, minimal-ui">-->
    <!--<link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">-->
    <!--
      Notice the use of %PUBLIC_URL% in the tag above.
      It will be replaced with the URL of the `public` folder during the build.
      Only files inside the `public` folder can be referenced from the HTML.

      Unlike "/favicon.ico" or "favicon.ico", "%PUBLIC_URL%/favicon.ico" will
      work correctly both with client-side routing and a non-root public URL.
      Learn how to configure a non-root public URL by running `npm run build`.
    -->
    <title>Comics Reader</title>

    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
    <meta name="theme-color" content="#000000"/>

    <link rel="manifest" href="<?= BASE; ?>manifest.json">
    <link rel="apple-touch-icon" href="<?= BASE; ?>asset/images/apple-touch.png"/>
    <link rel="apple-touch-icon" sizes="72x72" href="<?= BASE; ?>asset/images/apple-touch-72.png"/>
    <link rel="apple-touch-icon" sizes="114x114" href="<?= BASE; ?>asset/images/apple-touch-114.png"/>
    <link rel="apple-touch-icon" sizes="144x144" href="<?= BASE; ?>asset/images/apple-touch-144.png"/>
    <link rel="apple-touch-icon" sizes="256x156" href="<?= BASE; ?>asset/images/apple-touch-256.png"/>
    <link rel="apple-touch-icon" sizes="512x512" href="<?= BASE; ?>asset/images/apple-touch-512.png"/>

    <!--<link rel="stylesheet" href="<?= BASE; ?>static/css/app.min.css"/>-->
    <style>
        <?php
            echo str_replace(
                "/*# sourceMappingURL=app.min.css.map */",
                "/*# sourceMappingURL=".BASE."static/css/app.min.css.map */",
                file_get_contents("static/css/app.min.css")
            );
        ?>
    </style>

    <script>
        window.baseURL = "<?= BASE; ?>";
    </script>
</head>
<body>
<div id="root"></div>

<script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=default,Array.prototype.includes,fetch"></script>
<script type="text/javascript" src="<?= BASE . "static/js/" . asset('default.js'); ?>"></script>

</body>
</html>
